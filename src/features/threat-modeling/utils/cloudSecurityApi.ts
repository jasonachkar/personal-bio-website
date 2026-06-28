import type { CloudProvider, CloudConfig, CloudFinding, ComplianceStatus, Threat } from '../types';

/**
 * Get cloud security findings for a provider
 * Note: This simulates cloud security APIs. In production, you would integrate with real APIs.
 */
export async function getCloudSecurityFindings(
  provider: CloudProvider,
  config: CloudConfig
): Promise<CloudFinding[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const findings: CloudFinding[] = [];

  switch (provider) {
    case 'aws':
      findings.push(...getAWSFindings(config));
      break;
    case 'azure':
      findings.push(...getAzureFindings(config));
      break;
    case 'gcp':
      findings.push(...getGCPFindings(config));
      break;
  }

  return findings;
}

/**
 * Get compliance status for a provider
 */
export async function getComplianceStatus(provider: CloudProvider): Promise<ComplianceStatus[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const frameworks = ['CIS', 'NIST', 'PCI-DSS', 'SOC 2'];
  
  return frameworks.map(framework => ({
    framework,
    score: Math.floor(Math.random() * 30) + 70, // 70-100
    passed: Math.floor(Math.random() * 50) + 50,
    failed: Math.floor(Math.random() * 20),
    total: 0,
    findings: [],
  })).map(status => ({
    ...status,
    total: status.passed + status.failed,
  }));
}

/**
 * Map cloud finding to threat
 */
export function mapCloudFindingToThreat(finding: CloudFinding): Threat {
  return {
    id: `cloud-${finding.id}`,
    category: finding.category === 'misconfiguration' ? 'tampering' : 
              finding.category === 'vulnerability' ? 'information-disclosure' :
              finding.category === 'compliance' ? 'repudiation' : 'elevation-of-privilege',
    title: finding.title,
    description: finding.description,
    affectedComponents: [],
    severity: finding.severity,
    likelihood: finding.severity === 'critical' ? 'high' : finding.severity === 'high' ? 'medium' : 'low',
    impact: finding.severity === 'critical' ? 'high' : finding.severity === 'high' ? 'medium' : 'low',
    mitreTactics: getMitreTacticsForFinding(finding),
    mitreTechniques: getMitreTechniquesForFinding(finding),
  };
}

/**
 * AWS-specific findings
 */
function getAWSFindings(config: CloudConfig): CloudFinding[] {
  return [
    {
      id: 'aws-s3-public-access',
      title: 'S3 Bucket Public Access Enabled',
      description: 'S3 bucket has public read/write access enabled, exposing data to unauthorized users',
      severity: 'critical',
      service: 'S3',
      complianceFramework: ['CIS', 'NIST', 'PCI-DSS'],
      recommendation: 'Disable public access and use IAM policies for access control',
      category: 'misconfiguration',
    },
    {
      id: 'aws-iam-overprivileged',
      title: 'IAM Role with Excessive Permissions',
      description: 'IAM role has permissions beyond what is required for its function',
      severity: 'high',
      service: 'IAM',
      complianceFramework: ['CIS', 'NIST'],
      recommendation: 'Apply principle of least privilege and review IAM policies',
      category: 'misconfiguration',
    },
    {
      id: 'aws-lambda-no-vpc',
      title: 'Lambda Function Not in VPC',
      description: 'Lambda function accessing RDS is not in a VPC, exposing database to internet',
      severity: 'high',
      service: 'Lambda',
      complianceFramework: ['CIS'],
      recommendation: 'Configure Lambda to run in VPC with proper security groups',
      category: 'misconfiguration',
    },
    {
      id: 'aws-rds-encryption',
      title: 'RDS Instance Not Encrypted at Rest',
      description: 'RDS database is not encrypted, exposing sensitive data at rest',
      severity: 'critical',
      service: 'RDS',
      complianceFramework: ['CIS', 'NIST', 'PCI-DSS', 'HIPAA'],
      recommendation: 'Enable encryption at rest for RDS instances',
      category: 'compliance',
    },
    {
      id: 'aws-cloudtrail-disabled',
      title: 'CloudTrail Logging Disabled',
      description: 'CloudTrail is not enabled or not logging all regions',
      severity: 'high',
      service: 'CloudTrail',
      complianceFramework: ['CIS', 'SOC 2'],
      recommendation: 'Enable CloudTrail logging for all regions and configure log file validation',
      category: 'compliance',
    },
  ];
}

/**
 * Azure-specific findings
 */
function getAzureFindings(config: CloudConfig): CloudFinding[] {
  return [
    {
      id: 'azure-storage-public',
      title: 'Storage Account Public Access Enabled',
      description: 'Azure Storage Account allows public blob access',
      severity: 'critical',
      service: 'Storage',
      complianceFramework: ['CIS', 'NIST'],
      recommendation: 'Disable public blob access and use SAS tokens or private endpoints',
      category: 'misconfiguration',
    },
    {
      id: 'azure-keyvault-access',
      title: 'Key Vault Access Policy Too Permissive',
      description: 'Key Vault access policy allows too many principals or operations',
      severity: 'high',
      service: 'Key Vault',
      complianceFramework: ['CIS', 'NIST', 'PCI-DSS'],
      recommendation: 'Restrict Key Vault access to minimum required permissions',
      category: 'misconfiguration',
    },
    {
      id: 'azure-appservice-https',
      title: 'App Service Not Enforcing HTTPS',
      description: 'App Service allows HTTP traffic without redirecting to HTTPS',
      severity: 'high',
      service: 'App Service',
      complianceFramework: ['CIS', 'NIST'],
      recommendation: 'Enable HTTPS-only and configure automatic redirect',
      category: 'misconfiguration',
    },
    {
      id: 'azure-sql-encryption',
      title: 'SQL Database Not Encrypted',
      description: 'Azure SQL Database does not have Transparent Data Encryption enabled',
      severity: 'critical',
      service: 'SQL Database',
      complianceFramework: ['CIS', 'NIST', 'PCI-DSS', 'HIPAA'],
      recommendation: 'Enable Transparent Data Encryption (TDE) for SQL databases',
      category: 'compliance',
    },
  ];
}

/**
 * GCP-specific findings
 */
function getGCPFindings(config: CloudConfig): CloudFinding[] {
  return [
    {
      id: 'gcp-storage-public',
      title: 'Cloud Storage Bucket Public Access',
      description: 'Cloud Storage bucket has public read/write access',
      severity: 'critical',
      service: 'Cloud Storage',
      complianceFramework: ['CIS', 'NIST'],
      recommendation: 'Remove public access and use IAM bindings for access control',
      category: 'misconfiguration',
    },
    {
      id: 'gcp-iam-binding',
      title: 'IAM Binding with Excessive Permissions',
      description: 'IAM binding grants more permissions than necessary',
      severity: 'high',
      service: 'IAM',
      complianceFramework: ['CIS', 'NIST'],
      recommendation: 'Apply principle of least privilege to IAM bindings',
      category: 'misconfiguration',
    },
    {
      id: 'gcp-cloudfunctions-vpc',
      title: 'Cloud Function Not in VPC',
      description: 'Cloud Function accessing private resources is not in a VPC',
      severity: 'high',
      service: 'Cloud Functions',
      complianceFramework: ['CIS'],
      recommendation: 'Configure Cloud Function to use VPC connector',
      category: 'misconfiguration',
    },
    {
      id: 'gcp-sql-encryption',
      title: 'Cloud SQL Not Encrypted',
      description: 'Cloud SQL instance does not have encryption at rest enabled',
      severity: 'critical',
      service: 'Cloud SQL',
      complianceFramework: ['CIS', 'NIST', 'PCI-DSS'],
      recommendation: 'Enable encryption at rest for Cloud SQL instances',
      category: 'compliance',
    },
  ];
}

/**
 * Get MITRE tactics for a finding
 */
function getMitreTacticsForFinding(finding: CloudFinding): string[] {
  const tactics: string[] = [];
  
  if (finding.category === 'misconfiguration') {
    tactics.push('Initial Access', 'Defense Evasion');
  }
  if (finding.category === 'vulnerability') {
    tactics.push('Initial Access', 'Execution');
  }
  if (finding.category === 'compliance') {
    tactics.push('Defense Evasion', 'Impact');
  }
  if (finding.service.includes('IAM') || finding.service.includes('Access')) {
    tactics.push('Privilege Escalation', 'Persistence');
  }
  
  return [...new Set(tactics)];
}

/**
 * Get MITRE techniques for a finding
 */
function getMitreTechniquesForFinding(finding: CloudFinding): string[] {
  const techniques: string[] = [];
  
  if (finding.title.toLowerCase().includes('public') || finding.title.toLowerCase().includes('access')) {
    techniques.push('T1078', 'T1133'); // Valid Accounts, External Remote Services
  }
  if (finding.title.toLowerCase().includes('encryption')) {
    techniques.push('T1040', 'T1530'); // Network Sniffing, Data from Cloud Storage
  }
  if (finding.title.toLowerCase().includes('iam') || finding.title.toLowerCase().includes('permission')) {
    techniques.push('T1078', 'T1134'); // Valid Accounts, Access Token Manipulation
  }
  
  return [...new Set(techniques)];
}

