'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Shield,
  Users,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

// ============================================
// Management Group Hierarchy Component
// ============================================

/**
 * Management group node interface
 */
interface ManagementGroup {
  id: string;
  name: string;
  displayName: string;
  type: 'tenant-root' | 'platform' | 'landing-zone' | 'sandbox' | 'decommissioned';
  children?: ManagementGroup[];
  subscriptions?: Array<{
    id: string;
    name: string;
    environment: 'production' | 'staging' | 'development' | 'sandbox';
  }>;
  policies?: Array<{
    id: string;
    name: string;
    effect: 'Audit' | 'Deny' | 'DeployIfNotExists' | 'Disabled';
    compliance: number;
  }>;
  rbacAssignments?: Array<{
    principal: string;
    role: string;
  }>;
}

interface ManagementGroupHierarchyProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Azure CAF-aligned management group hierarchy
 */
const managementGroups: ManagementGroup = {
  id: 'tenant-root',
  name: 'Tenant Root Group',
  displayName: 'Contoso Corporation',
  type: 'tenant-root',
  policies: [
    { id: 'allowed-locations', name: 'Allowed Locations', effect: 'Deny', compliance: 100 },
    { id: 'require-tags', name: 'Require Tags on Resources', effect: 'Audit', compliance: 87 },
  ],
  rbacAssignments: [
    { principal: 'Security Team', role: 'Security Reader' },
    { principal: 'Platform Team', role: 'Owner' },
  ],
  children: [
    {
      id: 'platform',
      name: 'Platform',
      displayName: 'Platform Management Group',
      type: 'platform',
      policies: [
        { id: 'enable-defender', name: 'Enable Microsoft Defender', effect: 'DeployIfNotExists', compliance: 100 },
        { id: 'enable-diagnostics', name: 'Enable Diagnostic Settings', effect: 'DeployIfNotExists', compliance: 95 },
      ],
      children: [
        {
          id: 'identity',
          name: 'Identity',
          displayName: 'Identity & Access',
          type: 'platform',
          subscriptions: [
            { id: 'sub-identity-prod', name: 'Identity-Prod', environment: 'production' },
          ],
          policies: [
            { id: 'mfa-required', name: 'MFA Required', effect: 'Deny', compliance: 100 },
          ],
        },
        {
          id: 'connectivity',
          name: 'Connectivity',
          displayName: 'Network Connectivity',
          type: 'platform',
          subscriptions: [
            { id: 'sub-hub-prod', name: 'Hub-Network-Prod', environment: 'production' },
          ],
          policies: [
            { id: 'nsg-required', name: 'NSG Required on Subnets', effect: 'Deny', compliance: 100 },
            { id: 'no-public-ip', name: 'Deny Public IP', effect: 'Deny', compliance: 92 },
          ],
        },
        {
          id: 'management',
          name: 'Management',
          displayName: 'Management & Monitoring',
          type: 'platform',
          subscriptions: [
            { id: 'sub-mgmt-prod', name: 'Management-Prod', environment: 'production' },
          ],
          policies: [
            { id: 'log-analytics', name: 'Log Analytics Workspace', effect: 'DeployIfNotExists', compliance: 100 },
          ],
        },
      ],
    },
    {
      id: 'landing-zones',
      name: 'Landing Zones',
      displayName: 'Landing Zones',
      type: 'landing-zone',
      policies: [
        { id: 'approved-vms', name: 'Approved VM SKUs', effect: 'Deny', compliance: 100 },
        { id: 'encryption-transit', name: 'Encryption in Transit', effect: 'Deny', compliance: 98 },
        { id: 'private-endpoints', name: 'Private Endpoints Required', effect: 'Audit', compliance: 76 },
      ],
      children: [
        {
          id: 'corp',
          name: 'Corp',
          displayName: 'Corporate Landing Zones',
          type: 'landing-zone',
          subscriptions: [
            { id: 'sub-corp-prod-1', name: 'Corp-Workload-Prod-1', environment: 'production' },
            { id: 'sub-corp-prod-2', name: 'Corp-Workload-Prod-2', environment: 'production' },
            { id: 'sub-corp-staging', name: 'Corp-Workload-Staging', environment: 'staging' },
          ],
        },
        {
          id: 'online',
          name: 'Online',
          displayName: 'Online Landing Zones',
          type: 'landing-zone',
          subscriptions: [
            { id: 'sub-online-prod', name: 'Online-App-Prod', environment: 'production' },
            { id: 'sub-online-dev', name: 'Online-App-Dev', environment: 'development' },
          ],
        },
      ],
    },
    {
      id: 'sandbox',
      name: 'Sandbox',
      displayName: 'Sandbox',
      type: 'sandbox',
      policies: [
        { id: 'cost-limit', name: 'Cost Spending Limit', effect: 'Deny', compliance: 100 },
        { id: 'no-production', name: 'No Production Data', effect: 'Audit', compliance: 100 },
      ],
      subscriptions: [
        { id: 'sub-sandbox-1', name: 'Developer-Sandbox-1', environment: 'sandbox' },
        { id: 'sub-sandbox-2', name: 'Developer-Sandbox-2', environment: 'sandbox' },
      ],
    },
    {
      id: 'decommissioned',
      name: 'Decommissioned',
      displayName: 'Decommissioned',
      type: 'decommissioned',
      policies: [
        { id: 'deny-all', name: 'Deny All Resources', effect: 'Deny', compliance: 100 },
      ],
    },
  ],
};

/**
 * Type colors
 */
const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  'tenant-root': { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary' },
  'platform': { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent' },
  'landing-zone': { bg: 'bg-secondary/10', border: 'border-secondary/30', text: 'text-secondary' },
  'sandbox': { bg: 'bg-severity-medium/10', border: 'border-severity-medium/30', text: 'text-severity-medium' },
  'decommissioned': { bg: 'bg-text-muted/10', border: 'border-text-muted/30', text: 'text-text-muted' },
};

/**
 * Environment badge colors
 */
const envColors: Record<string, string> = {
  'production': 'bg-severity-high/10 text-severity-high border-severity-high/30',
  'staging': 'bg-severity-medium/10 text-severity-medium border-severity-medium/30',
  'development': 'bg-severity-low/10 text-severity-low border-severity-low/30',
  'sandbox': 'bg-accent/10 text-accent border-accent/30',
};

/**
 * Management Group Node Component
 */
function ManagementGroupNode({
  group,
  level = 0,
  onSelect,
  selectedId,
}: {
  group: ManagementGroup;
  level?: number;
  onSelect: (group: ManagementGroup) => void;
  selectedId: string | null;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = group.children && group.children.length > 0;
  const hasSubscriptions = group.subscriptions && group.subscriptions.length > 0;
  const isSelected = selectedId === group.id;
  const colors = typeColors[group.type];

  return (
    <div className={cn('select-none', level > 0 && 'ml-6')}>
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all',
          isSelected
            ? `${colors.bg} ${colors.border} border`
            : 'hover:bg-background-elevated'
        )}
        onClick={() => onSelect(group)}
      >
        {/* Expand/Collapse */}
        {(hasChildren || hasSubscriptions) ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 rounded hover:bg-background-elevated"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-text-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-text-muted" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Icon */}
        <FolderTree className={cn('h-4 w-4', colors.text)} />

        {/* Name */}
        <span className={cn(
          'text-sm font-medium flex-1',
          isSelected ? 'text-text-primary' : 'text-text-secondary'
        )}>
          {group.displayName}
        </span>

        {/* Badges */}
        <div className="flex items-center gap-1.5">
          {group.policies && group.policies.length > 0 && (
            <Badge
              label={`${group.policies.length} policies`}
              size="xs"
              variant="default"
            />
          )}
          {hasSubscriptions && (
            <Badge
              label={`${group.subscriptions!.length} subs`}
              size="xs"
              variant="default"
            />
          )}
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Child Groups */}
            {group.children?.map(child => (
              <ManagementGroupNode
                key={child.id}
                group={child}
                level={level + 1}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}

            {/* Subscriptions */}
            {group.subscriptions?.map(sub => (
              <div
                key={sub.id}
                className={cn(
                  'ml-6 flex items-center gap-2 p-2 pl-7',
                  'text-sm text-text-secondary'
                )}
              >
                <Building2 className="h-3.5 w-3.5 text-text-muted" />
                <span className="flex-1">{sub.name}</span>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full border font-medium uppercase',
                  envColors[sub.environment]
                )}>
                  {sub.environment}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * ManagementGroupHierarchy Component
 * @description Interactive Azure management group hierarchy visualization
 */
export function ManagementGroupHierarchy({ className }: ManagementGroupHierarchyProps) {
  const [selectedGroup, setSelectedGroup] = useState<ManagementGroup | null>(managementGroups);

  // Calculate stats
  const stats = useMemo(() => {
    const countAll = (group: ManagementGroup): { groups: number; subs: number; policies: number } => {
      let groups = 1;
      let subs = group.subscriptions?.length || 0;
      let policies = group.policies?.length || 0;

      group.children?.forEach(child => {
        const childStats = countAll(child);
        groups += childStats.groups;
        subs += childStats.subs;
        policies += childStats.policies;
      });

      return { groups, subs, policies };
    };

    return countAll(managementGroups);
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-background-elevated text-center">
          <p className="text-2xl font-bold text-primary">{stats.groups}</p>
          <p className="text-xs text-text-secondary">Management Groups</p>
        </div>
        <div className="p-3 rounded-lg bg-background-elevated text-center">
          <p className="text-2xl font-bold text-secondary">{stats.subs}</p>
          <p className="text-xs text-text-secondary">Subscriptions</p>
        </div>
        <div className="p-3 rounded-lg bg-background-elevated text-center">
          <p className="text-2xl font-bold text-accent">{stats.policies}</p>
          <p className="text-xs text-text-secondary">Policy Assignments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hierarchy Tree */}
        <Card variant="default" padding="md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <FolderTree className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-text-primary">Hierarchy</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <ManagementGroupNode
              group={managementGroups}
              onSelect={setSelectedGroup}
              selectedId={selectedGroup?.id || null}
            />
          </div>
        </Card>

        {/* Details Panel */}
        <Card variant="default" padding="md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Settings className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold text-text-primary">Details</h3>
          </div>

          {selectedGroup ? (
            <div className="space-y-4">
              {/* Group Info */}
              <div>
                <p className="text-lg font-semibold text-text-primary">{selectedGroup.displayName}</p>
                <p className="text-sm text-text-muted font-mono">{selectedGroup.id}</p>
                <Badge
                  label={selectedGroup.type.replace('-', ' ')}
                  size="xs"
                  variant="primary"
                  className="mt-2"
                />
              </div>

              {/* Policies */}
              {selectedGroup.policies && selectedGroup.policies.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-accent" />
                    <p className="text-sm font-medium text-text-primary">Policy Assignments</p>
                  </div>
                  <div className="space-y-2">
                    {selectedGroup.policies.map(policy => (
                      <div
                        key={policy.id}
                        className="p-2.5 rounded-lg bg-background-elevated flex items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {policy.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge label={policy.effect} size="xs" variant="default" />
                            <div className="flex items-center gap-1">
                              {policy.compliance >= 95 ? (
                                <CheckCircle2 className="h-3 w-3 text-severity-low" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-severity-medium" />
                              )}
                              <span className="text-xs text-text-secondary">
                                {policy.compliance}% compliant
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RBAC */}
              {selectedGroup.rbacAssignments && selectedGroup.rbacAssignments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-secondary" />
                    <p className="text-sm font-medium text-text-primary">RBAC Assignments</p>
                  </div>
                  <div className="space-y-1.5">
                    {selectedGroup.rbacAssignments.map((rbac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-background-elevated"
                      >
                        <span className="text-sm text-text-secondary">{rbac.principal}</span>
                        <Badge label={rbac.role} size="xs" variant="default" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policy Inheritance Note */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-2">
                  <FileCode className="h-4 w-4 text-primary mt-0.5" />
                  <div className="text-xs text-text-secondary">
                    <p className="font-medium text-primary mb-1">Policy Inheritance</p>
                    <p>Policies assigned at parent management groups are inherited by all child groups and subscriptions.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-text-muted">
              Select a management group to view details
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ManagementGroupHierarchy;
