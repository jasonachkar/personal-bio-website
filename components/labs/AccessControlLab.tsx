'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Database, Lock, ShieldCheck, XCircle } from 'lucide-react';
import {
  permissionLabels,
  permissions,
  rolePermissions,
  tenantFindings,
  tenants,
  users,
} from '@/content/labs/rbac-model';
import type { Permission, RbacUser } from '@/content/types';
import { Card } from '@/components/ui/Card';
import { SeverityPill } from '@/components/ui/SeverityPill';
import { cn } from '@/lib/cn';

function getUser(id: string): RbacUser {
  return users.find((user) => user.id === id) ?? users[0];
}

export function AccessControlLab() {
  const [userId, setUserId] = useState(users[0].id);
  const [appLayerEnabled, setAppLayerEnabled] = useState(true);
  const user = getUser(userId);
  const userTenant = tenants.find((tenant) => tenant.id === user.tenantId) ?? tenants[0];
  const targetTenant = tenants.find((tenant) => tenant.id !== user.tenantId) ?? tenants[1];
  const userPermissions = rolePermissions[user.role];
  const visibleFindings = tenantFindings.filter((finding) => finding.tenantId === user.tenantId);

  const crossTenantResult = useMemo(() => {
    if (appLayerEnabled) {
      return {
        layer: 'Application authorization',
        allowed: false,
        message:
          'Denied before the query is built because the requested tenant does not match the acting user tenant.',
      };
    }

    return {
      layer: 'PostgreSQL row-level security',
      allowed: false,
      message:
        'The app-layer check is disabled for the simulation, but row-level security still prevents rows from another tenant from being returned.',
    };
  }, [appLayerEnabled]);

  function can(permission: Permission) {
    return userPermissions.includes(permission);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="space-y-5">
        <Card className="p-5">
          <label className="grid gap-2 text-sm font-semibold text-text-primary">
            Acting user
            <select
              value={user.id}
              onChange={(event) => setUserId(event.target.value)}
              className="min-h-11 rounded-md border border-border bg-background px-3 text-base text-text-primary"
            >
              {users.map((item) => {
                const tenant = tenants.find((candidate) => candidate.id === item.tenantId);
                return (
                  <option key={item.id} value={item.id}>
                    {item.name} - {tenant?.name} - {item.role}
                  </option>
                );
              })}
            </select>
          </label>
          <div className="mt-5 rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-text-muted">Tenant</p>
            <p className="mt-1 font-semibold text-text-primary">{userTenant.name}</p>
            <p className="mt-4 text-sm text-text-muted">Role</p>
            <p className="mt-1 font-semibold text-text-primary">{user.role}</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
                Isolation layers
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Toggle the app-layer check to see the database layer still deny cross-tenant reads.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAppLayerEnabled((value) => !value)}
              className={cn(
                'rounded-md border px-3 py-2 text-xs font-semibold',
                appLayerEnabled
                  ? 'border-accent bg-accent-subtle text-accent-strong'
                  : 'border-border bg-background text-text-secondary',
              )}
            >
              App check {appLayerEnabled ? 'on' : 'off'}
            </button>
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
            Effective permissions
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {permissions.map((permission) => (
              <div
                key={permission}
                className={cn(
                  'rounded-lg border p-4',
                  can(permission)
                    ? 'border-severity-low/30 bg-severity-low/10'
                    : 'border-border bg-background',
                )}
              >
                <div className="flex items-center gap-2">
                  {can(permission) ? (
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-severity-low" />
                  ) : (
                    <XCircle aria-hidden="true" className="h-4 w-4 text-text-muted" />
                  )}
                  <p className="text-sm font-semibold text-text-primary">{permissionLabels[permission]}</p>
                </div>
                {!can(permission) ? (
                  <p className="mt-2 text-xs leading-5 text-text-muted">
                    Denied for {user.role}; requires a broader role.
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
                Visible findings
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              {visibleFindings.map((finding) => (
                <div key={finding.id} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityPill severity={finding.severity} />
                    <span className="font-mono text-xs text-text-muted">{finding.projectId}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-text-primary">{finding.title}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              {appLayerEnabled ? (
                <Lock aria-hidden="true" className="h-4 w-4 text-accent" />
              ) : (
                <Database aria-hidden="true" className="h-4 w-4 text-accent" />
              )}
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
                Cross-tenant attempt
              </h2>
            </div>
            <div className="mt-4 rounded-lg border border-severity-high/30 bg-severity-high/10 p-4">
              <p className="text-sm font-semibold text-text-primary">
                {user.name} requests findings from {targetTenant.name}
              </p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{crossTenantResult.message}</p>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Enforcement layer
                </p>
                <p className="mt-2 font-semibold text-text-primary">{crossTenantResult.layer}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Decision
                </p>
                <p className="mt-2 font-semibold text-severity-high">
                  {crossTenantResult.allowed ? 'Allowed' : 'Denied'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
