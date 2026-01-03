import type { ComponentTemplate, CloudProvider } from '../types';

/**
 * Component library with pre-built templates for AWS, Azure, GCP, and generic components
 */
export const componentLibrary: ComponentTemplate[] = [
  // AWS Components
  {
    id: 'aws-s3',
    name: 'S3 Bucket',
    type: 'datastore',
    provider: 'aws',
    service: 'S3',
    description: 'Amazon Simple Storage Service (S3) for object storage',
    defaultMetadata: {
      technology: 'AWS S3',
      encrypted: false,
      publicAccess: false,
      versioning: false,
    },
    knownVulnerabilities: ['Public bucket access', 'Missing encryption', 'Insecure ACLs'],
    bestPractices: [
      'Enable versioning and MFA delete',
      'Use bucket policies instead of ACLs',
      'Enable server-side encryption',
      'Disable public access',
    ],
  },
  {
    id: 'aws-lambda',
    name: 'Lambda Function',
    type: 'process',
    provider: 'aws',
    service: 'Lambda',
    description: 'AWS Lambda serverless compute service',
    defaultMetadata: {
      technology: 'AWS Lambda',
      authentication: true,
      vpc: false,
      timeout: 30,
    },
    knownVulnerabilities: ['Overprivileged IAM roles', 'Not in VPC', 'Insecure environment variables'],
    bestPractices: [
      'Use least privilege IAM roles',
      'Enable VPC configuration for database access',
      'Set appropriate timeout and memory limits',
    ],
  },
  {
    id: 'aws-rds',
    name: 'RDS Database',
    type: 'datastore',
    provider: 'aws',
    service: 'RDS',
    description: 'Amazon Relational Database Service',
    defaultMetadata: {
      technology: 'AWS RDS',
      encrypted: false,
      multiAz: false,
      publicAccess: false,
    },
    knownVulnerabilities: ['Missing encryption', 'Public access', 'Weak authentication'],
    bestPractices: [
      'Enable encryption at rest',
      'Enable encryption in transit',
      'Use automated backups',
      'Enable Multi-AZ for high availability',
    ],
  },
  {
    id: 'aws-iam',
    name: 'IAM Role/Policy',
    type: 'process',
    provider: 'aws',
    service: 'IAM',
    description: 'AWS Identity and Access Management',
    defaultMetadata: {
      technology: 'AWS IAM',
      leastPrivilege: false,
      mfaEnabled: false,
    },
    knownVulnerabilities: ['Overprivileged policies', 'Missing MFA', 'Hardcoded credentials'],
    bestPractices: [
      'Enable MFA for root account',
      'Use IAM roles instead of access keys',
      'Implement least privilege',
    ],
  },
  {
    id: 'aws-api-gateway',
    name: 'API Gateway',
    type: 'process',
    provider: 'aws',
    service: 'API Gateway',
    description: 'AWS API Gateway for REST and HTTP APIs',
    defaultMetadata: {
      technology: 'AWS API Gateway',
      authentication: true,
      rateLimited: false,
      httpsOnly: true,
    },
    knownVulnerabilities: ['Missing rate limiting', 'Insecure CORS', 'Missing authentication'],
    bestPractices: [
      'Enable rate limiting',
      'Configure CORS properly',
      'Use API keys or IAM authentication',
    ],
  },
  // Azure Components
  {
    id: 'azure-storage',
    name: 'Storage Account',
    type: 'datastore',
    provider: 'azure',
    service: 'Storage',
    description: 'Azure Storage Account for blob, file, queue, and table storage',
    defaultMetadata: {
      technology: 'Azure Storage',
      encrypted: false,
      publicAccess: false,
      privateEndpoint: false,
    },
    knownVulnerabilities: ['Public blob access', 'Missing encryption', 'Insecure access keys'],
    bestPractices: [
      'Enable encryption at rest',
      'Use private endpoints',
      'Disable public blob access',
    ],
  },
  {
    id: 'azure-keyvault',
    name: 'Key Vault',
    type: 'datastore',
    provider: 'azure',
    service: 'Key Vault',
    description: 'Azure Key Vault for secrets, keys, and certificates',
    defaultMetadata: {
      technology: 'Azure Key Vault',
      accessControl: true,
      softDelete: false,
      purgeProtection: false,
    },
    knownVulnerabilities: ['Overprivileged access policies', 'Missing soft delete', 'Network exposure'],
    bestPractices: [
      'Use managed identities for access',
      'Enable soft delete',
      'Enable purge protection',
      'Use network ACLs',
    ],
  },
  {
    id: 'azure-appservice',
    name: 'App Service',
    type: 'process',
    provider: 'azure',
    service: 'App Service',
    description: 'Azure App Service for web applications',
    defaultMetadata: {
      technology: 'Azure App Service',
      httpsOnly: false,
      managedIdentity: false,
      privateEndpoint: false,
    },
    knownVulnerabilities: ['HTTP allowed', 'Missing authentication', 'Insecure CORS'],
    bestPractices: [
      'Enable HTTPS only',
      'Use managed identities',
      'Enable authentication',
      'Use private endpoints',
    ],
  },
  {
    id: 'azure-sql',
    name: 'SQL Database',
    type: 'datastore',
    provider: 'azure',
    service: 'SQL Database',
    description: 'Azure SQL Database',
    defaultMetadata: {
      technology: 'Azure SQL',
      encrypted: false,
      azureAdAuth: false,
      threatDetection: false,
    },
    knownVulnerabilities: ['Missing encryption', 'SQL injection', 'Weak authentication'],
    bestPractices: [
      'Enable Transparent Data Encryption',
      'Use Azure AD authentication',
      'Enable threat detection',
    ],
  },
  // GCP Components
  {
    id: 'gcp-cloud-storage',
    name: 'Cloud Storage',
    type: 'datastore',
    provider: 'gcp',
    service: 'Cloud Storage',
    description: 'Google Cloud Storage for object storage',
    defaultMetadata: {
      technology: 'GCP Cloud Storage',
      encrypted: false,
      publicAccess: false,
      uniformBucketAccess: false,
    },
    knownVulnerabilities: ['Public bucket access', 'Missing encryption', 'Insecure IAM bindings'],
    bestPractices: [
      'Use IAM bindings instead of ACLs',
      'Enable uniform bucket-level access',
      'Disable public access',
    ],
  },
  {
    id: 'gcp-cloud-functions',
    name: 'Cloud Functions',
    type: 'process',
    provider: 'gcp',
    service: 'Cloud Functions',
    description: 'Google Cloud Functions serverless compute',
    defaultMetadata: {
      technology: 'GCP Cloud Functions',
      authentication: true,
      vpc: false,
      serviceAccount: true,
    },
    knownVulnerabilities: ['Overprivileged service accounts', 'Not in VPC', 'Insecure environment variables'],
    bestPractices: [
      'Use least privilege service accounts',
      'Use VPC connector for private resources',
      'Set appropriate timeout and memory',
    ],
  },
  {
    id: 'gcp-cloud-sql',
    name: 'Cloud SQL',
    type: 'datastore',
    provider: 'gcp',
    service: 'Cloud SQL',
    description: 'Google Cloud SQL managed database',
    defaultMetadata: {
      technology: 'GCP Cloud SQL',
      encrypted: false,
      privateIp: false,
      auditLogging: false,
    },
    knownVulnerabilities: ['Missing encryption', 'Public IP', 'Weak authentication'],
    bestPractices: [
      'Enable encryption at rest',
      'Use private IP',
      'Enable automated backups',
    ],
  },
  {
    id: 'gcp-iam',
    name: 'IAM Binding',
    type: 'process',
    provider: 'gcp',
    service: 'IAM',
    description: 'Google Cloud IAM bindings and policies',
    defaultMetadata: {
      technology: 'GCP IAM',
      leastPrivilege: false,
      conditions: false,
    },
    knownVulnerabilities: ['Overprivileged bindings', 'Missing conditions', 'Insecure service accounts'],
    bestPractices: [
      'Use service accounts with least privilege',
      'Use IAM conditions',
      'Regularly audit IAM bindings',
    ],
  },
  // Generic Components
  {
    id: 'api-gateway',
    name: 'API Gateway',
    type: 'process',
    description: 'Generic API Gateway for routing and managing API requests',
    defaultMetadata: {
      technology: 'API Gateway',
      authentication: true,
      rateLimited: false,
      httpsOnly: true,
    },
    knownVulnerabilities: ['Missing rate limiting', 'Insecure CORS', 'Missing authentication'],
    bestPractices: [
      'Enable rate limiting',
      'Configure CORS properly',
      'Use API keys or OAuth',
    ],
  },
  {
    id: 'load-balancer',
    name: 'Load Balancer',
    type: 'process',
    description: 'Load balancer for distributing traffic',
    defaultMetadata: {
      technology: 'Load Balancer',
      httpsOnly: true,
      waf: false,
    },
    knownVulnerabilities: ['HTTP allowed', 'Missing WAF', 'DDoS exposure'],
    bestPractices: [
      'Enable HTTPS only',
      'Enable WAF',
      'Configure DDoS protection',
    ],
  },
  {
    id: 'database',
    name: 'Database',
    type: 'datastore',
    description: 'Generic database server',
    defaultMetadata: {
      technology: 'Database',
      encrypted: false,
      authentication: true,
      backup: false,
    },
    knownVulnerabilities: ['Missing encryption', 'SQL injection', 'Weak authentication'],
    bestPractices: [
      'Enable encryption at rest',
      'Use parameterized queries',
      'Enable automated backups',
    ],
  },
  {
    id: 'web-server',
    name: 'Web Server',
    type: 'process',
    description: 'Web server for hosting applications',
    defaultMetadata: {
      technology: 'Web Server',
      httpsOnly: false,
      authentication: false,
      waf: false,
    },
    knownVulnerabilities: ['HTTP allowed', 'Missing WAF', 'Insecure headers'],
    bestPractices: [
      'Enable HTTPS only',
      'Enable WAF',
      'Configure security headers',
    ],
  },
  {
    id: 'cache',
    name: 'Cache',
    type: 'datastore',
    description: 'Caching layer for improved performance',
    defaultMetadata: {
      technology: 'Cache',
      encrypted: false,
      authentication: false,
    },
    knownVulnerabilities: ['Missing encryption', 'No authentication', 'Cache poisoning'],
    bestPractices: [
      'Enable encryption',
      'Use authentication',
      'Validate cache keys',
    ],
  },
];

/**
 * Get components by provider
 */
export function getComponentsByProvider(provider: CloudProvider): ComponentTemplate[] {
  return componentLibrary.filter(comp => comp.provider === provider);
}

/**
 * Get components by type
 */
export function getComponentsByType(type: ComponentTemplate['type']): ComponentTemplate[] {
  return componentLibrary.filter(comp => comp.type === type);
}

/**
 * Get component template by ID
 */
export function getComponentTemplate(id: string): ComponentTemplate | undefined {
  return componentLibrary.find(comp => comp.id === id);
}

/**
 * Search components
 */
export function searchComponents(query: string): ComponentTemplate[] {
  const lowerQuery = query.toLowerCase();
  return componentLibrary.filter(comp =>
    comp.name.toLowerCase().includes(lowerQuery) ||
    comp.description.toLowerCase().includes(lowerQuery) ||
    comp.service?.toLowerCase().includes(lowerQuery) ||
    comp.provider?.toLowerCase().includes(lowerQuery)
  );
}

