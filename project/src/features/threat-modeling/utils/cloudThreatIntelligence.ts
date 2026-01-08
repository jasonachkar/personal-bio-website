import type { ThreatModelComponent, Threat, CloudProvider } from '../types';

/**
 * Get cloud-specific threats for a component
 */
export function getCloudThreatsForComponent(
  component: ThreatModelComponent,
  provider: CloudProvider
): Threat[] {
  const threats: Threat[] = [];
  const componentName = component.name.toLowerCase();
  const description = component.description.toLowerCase();

  switch (provider) {
    case 'aws':
      threats.push(...getAWSThreats(component, componentName, description));
      break;
    case 'azure':
      threats.push(...getAzureThreats(component, componentName, description));
      break;
    case 'gcp':
      threats.push(...getGCPThreats(component, componentName, description));
      break;
  }

  return threats;
}

/**
 * Get cloud best practices for a service
 */
export function getCloudBestPractices(provider: CloudProvider, service: string): string[] {
  const practices: Record<string, Record<string, string[]>> = {
    aws: {
      s3: [
        'Enable versioning and MFA delete',
        'Use bucket policies instead of ACLs',
        'Enable server-side encryption',
        'Disable public access',
        'Enable access logging',
        'Use lifecycle policies',
      ],
      lambda: [
        'Use least privilege IAM roles',
        'Enable VPC configuration for database access',
        'Set appropriate timeout and memory limits',
        'Enable X-Ray tracing',
        'Use environment variables for configuration',
        'Enable dead letter queues',
      ],
      rds: [
        'Enable encryption at rest',
        'Enable encryption in transit',
        'Use automated backups',
        'Enable Multi-AZ for high availability',
        'Use parameter groups for security settings',
        'Enable CloudWatch monitoring',
      ],
      iam: [
        'Enable MFA for root account',
        'Use IAM roles instead of access keys',
        'Implement least privilege',
        'Enable CloudTrail logging',
        'Regularly rotate credentials',
        'Use IAM policy conditions',
      ],
    },
    azure: {
      storage: [
        'Enable encryption at rest',
        'Use private endpoints',
        'Disable public blob access',
        'Enable soft delete',
        'Use managed identities',
        'Enable access logging',
      ],
      'key vault': [
        'Use managed identities for access',
        'Enable soft delete',
        'Enable purge protection',
        'Use network ACLs',
        'Enable diagnostic logging',
        'Regularly rotate secrets',
      ],
      'app service': [
        'Enable HTTPS only',
        'Use managed identities',
        'Enable authentication',
        'Use private endpoints',
        'Enable diagnostic logging',
        'Configure CORS properly',
      ],
      'sql database': [
        'Enable Transparent Data Encryption',
        'Use Azure AD authentication',
        'Enable threat detection',
        'Use private endpoints',
        'Enable auditing',
        'Use firewall rules',
      ],
    },
    gcp: {
      'cloud storage': [
        'Use IAM bindings instead of ACLs',
        'Enable uniform bucket-level access',
        'Disable public access',
        'Enable object versioning',
        'Use lifecycle policies',
        'Enable access logging',
      ],
      'cloud functions': [
        'Use least privilege IAM roles',
        'Use VPC connector for private resources',
        'Set appropriate timeout and memory',
        'Use environment variables securely',
        'Enable Cloud Logging',
        'Use service accounts properly',
      ],
      'cloud sql': [
        'Enable encryption at rest',
        'Use private IP',
        'Enable automated backups',
        'Use Cloud SQL Proxy',
        'Enable audit logging',
        'Use IAM database authentication',
      ],
      iam: [
        'Use service accounts with least privilege',
        'Enable organization policies',
        'Use IAM conditions',
        'Regularly audit IAM bindings',
        'Use Cloud Asset Inventory',
        'Enable audit logs',
      ],
    },
  };

  return practices[provider]?.[service.toLowerCase()] || [];
}

/**
 * Validate cloud configuration
 */
export function validateCloudConfiguration(component: ThreatModelComponent): Array<{
  check: string;
  passed: boolean;
  recommendation: string;
}> {
  const checks: Array<{ check: string; passed: boolean; recommendation: string }> = [];
  const name = component.name.toLowerCase();
  const metadata = component.metadata || {};

  // Encryption checks
  if (component.type === 'datastore') {
    checks.push({
      check: 'Encryption at rest enabled',
      passed: metadata.encrypted === true,
      recommendation: 'Enable encryption at rest for all datastores',
    });
  }

  // Authentication checks
  if (component.type === 'process' || component.type === 'external-entity') {
    checks.push({
      check: 'Authentication required',
      passed: metadata.authentication === true,
      recommendation: 'Require authentication for all external access',
    });
  }

  // Cloud-specific checks
  if (name.includes('s3') || name.includes('storage')) {
    checks.push({
      check: 'Public access disabled',
      passed: metadata.publicAccess === false,
      recommendation: 'Disable public access to storage buckets',
    });
  }

  if (name.includes('iam') || name.includes('access')) {
    checks.push({
      check: 'Least privilege applied',
      passed: metadata.leastPrivilege === true,
      recommendation: 'Apply principle of least privilege to IAM policies',
    });
  }

  return checks;
}

/**
 * AWS-specific threats
 */
function getAWSThreats(
  component: ThreatModelComponent,
  name: string,
  description: string
): Threat[] {
  const threats: Threat[] = [];

  if (name.includes('s3') || description.includes('s3')) {
    if (!component.metadata?.publicAccess === false) {
      threats.push({
        id: `aws-s3-public-${component.id}`,
        category: 'information-disclosure',
        title: 'S3 Bucket Public Access',
        description: 'S3 bucket allows public access, exposing data to unauthorized users',
        affectedComponents: [component.id],
        severity: 'critical',
        likelihood: 'high',
        impact: 'high',
        mitreTactics: ['Initial Access', 'Collection'],
        mitreTechniques: ['T1530'],
      });
    }
    if (!component.metadata?.encrypted) {
      threats.push({
        id: `aws-s3-encryption-${component.id}`,
        category: 'information-disclosure',
        title: 'S3 Bucket Not Encrypted',
        description: 'S3 bucket does not have encryption enabled, exposing data at rest',
        affectedComponents: [component.id],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
        mitreTactics: ['Collection'],
        mitreTechniques: ['T1530'],
      });
    }
  }

  if (name.includes('lambda') || description.includes('lambda')) {
    if (!component.metadata?.vpc) {
      threats.push({
        id: `aws-lambda-vpc-${component.id}`,
        category: 'information-disclosure',
        title: 'Lambda Not in VPC',
        description: 'Lambda function accessing private resources is not in a VPC',
        affectedComponents: [component.id],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
        mitreTactics: ['Initial Access'],
        mitreTechniques: ['T1078'],
      });
    }
  }

  if (name.includes('rds') || description.includes('rds')) {
    if (!component.metadata?.encrypted) {
      threats.push({
        id: `aws-rds-encryption-${component.id}`,
        category: 'information-disclosure',
        title: 'RDS Not Encrypted',
        description: 'RDS instance does not have encryption at rest enabled',
        affectedComponents: [component.id],
        severity: 'critical',
        likelihood: 'low',
        impact: 'high',
        mitreTactics: ['Collection'],
        mitreTechniques: ['T1530'],
      });
    }
  }

  if (name.includes('iam') || description.includes('iam')) {
    if (!component.metadata?.leastPrivilege) {
      threats.push({
        id: `aws-iam-privilege-${component.id}`,
        category: 'elevation-of-privilege',
        title: 'IAM Overprivileged',
        description: 'IAM role or policy grants excessive permissions',
        affectedComponents: [component.id],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
        mitreTactics: ['Privilege Escalation', 'Persistence'],
        mitreTechniques: ['T1078', 'T1134'],
      });
    }
  }

  return threats;
}

/**
 * Azure-specific threats
 */
function getAzureThreats(
  component: ThreatModelComponent,
  name: string,
  description: string
): Threat[] {
  const threats: Threat[] = [];

  if (name.includes('storage') || description.includes('storage')) {
    if (component.metadata?.publicAccess !== false) {
      threats.push({
        id: `azure-storage-public-${component.id}`,
        category: 'information-disclosure',
        title: 'Storage Account Public Access',
        description: 'Azure Storage Account allows public blob access',
        affectedComponents: [component.id],
        severity: 'critical',
        likelihood: 'high',
        impact: 'high',
        mitreTactics: ['Initial Access', 'Collection'],
        mitreTechniques: ['T1530'],
      });
    }
  }

  if (name.includes('key vault') || description.includes('key vault')) {
    if (!component.metadata?.accessControl) {
      threats.push({
        id: `azure-keyvault-access-${component.id}`,
        category: 'elevation-of-privilege',
        title: 'Key Vault Access Policy Too Permissive',
        description: 'Key Vault access policy allows too many principals',
        affectedComponents: [component.id],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
        mitreTactics: ['Credential Access'],
        mitreTechniques: ['T1078'],
      });
    }
  }

  if (name.includes('app service') || description.includes('app service')) {
    if (!component.metadata?.httpsOnly) {
      threats.push({
        id: `azure-appservice-https-${component.id}`,
        category: 'information-disclosure',
        title: 'App Service Not Enforcing HTTPS',
        description: 'App Service allows HTTP traffic without redirect',
        affectedComponents: [component.id],
        severity: 'high',
        likelihood: 'high',
        impact: 'medium',
        mitreTactics: ['Initial Access'],
        mitreTechniques: ['T1071'],
      });
    }
  }

  return threats;
}

/**
 * GCP-specific threats
 */
function getGCPThreats(
  component: ThreatModelComponent,
  name: string,
  description: string
): Threat[] {
  const threats: Threat[] = [];

  if (name.includes('cloud storage') || description.includes('cloud storage')) {
    if (component.metadata?.publicAccess !== false) {
      threats.push({
        id: `gcp-storage-public-${component.id}`,
        category: 'information-disclosure',
        title: 'Cloud Storage Bucket Public Access',
        description: 'Cloud Storage bucket has public read/write access',
        affectedComponents: [component.id],
        severity: 'critical',
        likelihood: 'high',
        impact: 'high',
        mitreTactics: ['Initial Access', 'Collection'],
        mitreTechniques: ['T1530'],
      });
    }
  }

  if (name.includes('cloud functions') || description.includes('cloud functions')) {
    if (!component.metadata?.vpc) {
      threats.push({
        id: `gcp-functions-vpc-${component.id}`,
        category: 'information-disclosure',
        title: 'Cloud Function Not in VPC',
        description: 'Cloud Function accessing private resources is not in a VPC',
        affectedComponents: [component.id],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
        mitreTactics: ['Initial Access'],
        mitreTechniques: ['T1078'],
      });
    }
  }

  if (name.includes('iam') || description.includes('iam')) {
    if (!component.metadata?.leastPrivilege) {
      threats.push({
        id: `gcp-iam-binding-${component.id}`,
        category: 'elevation-of-privilege',
        title: 'IAM Binding with Excessive Permissions',
        description: 'IAM binding grants more permissions than necessary',
        affectedComponents: [component.id],
        severity: 'high',
        likelihood: 'medium',
        impact: 'high',
        mitreTactics: ['Privilege Escalation', 'Persistence'],
        mitreTechniques: ['T1078', 'T1134'],
      });
    }
  }

  return threats;
}

