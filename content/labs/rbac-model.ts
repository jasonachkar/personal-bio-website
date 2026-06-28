import type { Permission, RbacUser, Role, Tenant } from '../types';

export const tenants: Tenant[] = [
  { id: 'org-a', name: 'Northstar Health', projectIds: ['northstar-api', 'northstar-web'] },
  { id: 'org-b', name: 'Harbor Finance', projectIds: ['harbor-risk', 'harbor-portal'] },
];

export const users: RbacUser[] = [
  { id: 'u1', name: 'Ari Owner', tenantId: 'org-a', role: 'Owner' },
  { id: 'u2', name: 'Nadia Admin', tenantId: 'org-a', role: 'Admin' },
  { id: 'u3', name: 'Sam Member', tenantId: 'org-a', role: 'Member' },
  { id: 'u4', name: 'Maya Owner', tenantId: 'org-b', role: 'Owner' },
  { id: 'u5', name: 'Theo Member', tenantId: 'org-b', role: 'Member' },
];

export const permissions: Permission[] = [
  'viewFindings',
  'manageApiKeys',
  'editPipelines',
  'approveReleases',
  'manageMembers',
];

export const rolePermissions: Record<Role, Permission[]> = {
  Owner: ['viewFindings', 'manageApiKeys', 'editPipelines', 'approveReleases', 'manageMembers'],
  Admin: ['viewFindings', 'manageApiKeys', 'editPipelines', 'approveReleases'],
  Member: ['viewFindings'],
};

export const permissionLabels: Record<Permission, string> = {
  viewFindings: 'View findings',
  manageApiKeys: 'Manage API keys',
  editPipelines: 'Edit pipelines',
  approveReleases: 'Approve releases',
  manageMembers: 'Manage members',
};

export const tenantFindings = [
  {
    id: 'fa1',
    tenantId: 'org-a',
    projectId: 'northstar-api',
    title: 'Public database firewall rule',
    severity: 'critical',
  },
  {
    id: 'fa2',
    tenantId: 'org-a',
    projectId: 'northstar-web',
    title: 'Hardcoded signing secret',
    severity: 'high',
  },
  {
    id: 'fb1',
    tenantId: 'org-b',
    projectId: 'harbor-risk',
    title: 'Public blob container',
    severity: 'high',
  },
] as const;
