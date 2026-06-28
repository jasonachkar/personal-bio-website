import type { IacScenario } from './types';

export const iacScenarios: IacScenario[] = [
  {
    id: 'public-vm-keyvault',
    title: 'Public VM with privileged managed identity',
    ruleId: 'SO_IAC_AZ_001',
    description:
      'A virtual machine is reachable from the Internet and has a managed identity with broad Key Vault read access.',
    terraformSnippet: `resource "azurerm_network_security_rule" "ssh_anywhere" {
  name                  = "Allow-SSH-Internet"
  access                = "Allow"
  direction             = "Inbound"
  protocol              = "Tcp"
  source_address_prefix = "*"
  destination_port_range = "22"
}

resource "azurerm_role_assignment" "vault_reader" {
  scope                = azurerm_key_vault.prod.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_virtual_machine.web.identity[0].principal_id
}`,
    graph: {
      nodes: [
        { id: 'internet', type: 'Internet', label: 'Internet' },
        {
          id: 'nsg',
          type: 'SecurityControl',
          label: 'NSG allows SSH from any source',
          misconfig: 'Inbound SSH is exposed to 0.0.0.0/0.',
          mitigation: 'Restrict SSH to trusted IPs or require a private bastion path.',
          benchmark: 'CIS Azure: restrict management ports',
        },
        {
          id: 'vm',
          type: 'Compute',
          label: 'Public Linux VM',
          misconfig: 'The VM is reachable through a public network path.',
          mitigation: 'Remove public exposure and place management access behind private connectivity.',
          benchmark: 'Azure Security Benchmark: network security',
        },
        {
          id: 'identity',
          type: 'Identity',
          label: 'Managed identity',
          misconfig: 'Identity has secret-read capability on production vault scope.',
          mitigation: 'Scope the identity to the minimum resource and remove vault secret read unless required.',
          benchmark: 'CIS Azure: least privilege access',
        },
        {
          id: 'vault',
          type: 'SecretStore',
          label: 'Production Key Vault',
          mitigation: 'Use least privilege, private endpoints, and monitored access policies.',
          benchmark: 'Azure Security Benchmark: secrets management',
        },
        { id: 'secrets', type: 'SensitiveTarget', label: 'Application secrets' },
      ],
      edges: [
        { id: 'e1', source: 'internet', target: 'nsg', type: 'PubliclyExposes' },
        { id: 'e2', source: 'nsg', target: 'vm', type: 'CanReach' },
        { id: 'e3', source: 'vm', target: 'identity', type: 'UsesIdentity' },
        { id: 'e4', source: 'identity', target: 'vault', type: 'AssignedRoleOn' },
        { id: 'e5', source: 'vault', target: 'secrets', type: 'CanReadSecrets' },
      ],
    },
    paths: [
      {
        id: 'path-vm-vault',
        severity: 'critical',
        nodeIds: ['internet', 'nsg', 'vm', 'identity', 'vault', 'secrets'],
        explanation:
          'External reachability combines with a privileged managed identity to create a path from Internet exposure to production secrets.',
        confidence: 'high',
      },
    ],
  },
  {
    id: 'public-storage-container',
    title: 'Public storage container exposing reports',
    ruleId: 'SO_IAC_AZ_002',
    description:
      'A storage account permits public child items and a blob container allows anonymous reads.',
    terraformSnippet: `resource "azurerm_storage_account" "reports" {
  name                            = "soreportsprod"
  allow_nested_items_to_be_public = true
}

resource "azurerm_storage_container" "exports" {
  name                  = "exports"
  storage_account_name  = azurerm_storage_account.reports.name
  container_access_type = "blob"
}`,
    graph: {
      nodes: [
        { id: 'internet', type: 'Internet', label: 'Internet' },
        {
          id: 'account',
          type: 'Storage',
          label: 'Storage permits public child items',
          misconfig: 'The account allows public child item exposure.',
          mitigation: 'Disable public nested item access at the storage account.',
          benchmark: 'CIS Azure: storage public access',
        },
        {
          id: 'container',
          type: 'Storage',
          label: 'Blob container: exports',
          misconfig: 'Container access allows anonymous blob reads.',
          mitigation: 'Set container access to private and use scoped SAS or managed identity access.',
          benchmark: 'Azure Security Benchmark: data protection',
        },
        { id: 'data', type: 'SensitiveTarget', label: 'Exported customer reports' },
      ],
      edges: [
        { id: 'e1', source: 'internet', target: 'account', type: 'PubliclyExposes' },
        { id: 'e2', source: 'account', target: 'container', type: 'CanReach' },
        { id: 'e3', source: 'container', target: 'data', type: 'CanReadData' },
      ],
    },
    paths: [
      {
        id: 'path-storage-data',
        severity: 'high',
        nodeIds: ['internet', 'account', 'container', 'data'],
        explanation:
          'Anonymous blob access creates a direct read path from the Internet to exported data.',
        confidence: 'high',
      },
    ],
  },
  {
    id: 'public-database-firewall',
    title: 'Public database with broad firewall',
    ruleId: 'SO_IAC_AZ_003',
    description:
      'A database server exposes a public endpoint and allows all IPv4 sources through its firewall.',
    terraformSnippet: `resource "azurerm_postgresql_flexible_server_firewall_rule" "anywhere" {
  name             = "AllowAll"
  server_id        = azurerm_postgresql_flexible_server.prod.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}`,
    graph: {
      nodes: [
        { id: 'internet', type: 'Internet', label: 'Internet' },
        {
          id: 'firewall',
          type: 'SecurityControl',
          label: 'Database firewall allows all IPv4',
          misconfig: 'The firewall range covers 0.0.0.0 through 255.255.255.255.',
          mitigation: 'Use private networking or restrict firewall rules to known egress IPs.',
          benchmark: 'CIS Azure: database firewall',
        },
        {
          id: 'database',
          type: 'Database',
          label: 'Production PostgreSQL',
          misconfig: 'The server is reachable through a public network path.',
          mitigation: 'Disable public access where possible and place the server behind a private endpoint.',
          benchmark: 'Azure Security Benchmark: network access',
        },
        { id: 'records', type: 'SensitiveTarget', label: 'Tenant records' },
      ],
      edges: [
        { id: 'e1', source: 'internet', target: 'firewall', type: 'PubliclyExposes' },
        { id: 'e2', source: 'firewall', target: 'database', type: 'CanReach' },
        { id: 'e3', source: 'database', target: 'records', type: 'CanReadData' },
      ],
    },
    paths: [
      {
        id: 'path-db',
        severity: 'critical',
        nodeIds: ['internet', 'firewall', 'database', 'records'],
        explanation:
          'The public endpoint and broad firewall rule expose the database network surface to the Internet.',
        confidence: 'high',
      },
    ],
  },
];
