'use client';

import { useMemo, useState } from 'react';
import { mockAlerts, mockLogs } from './mockSiemData';
import type { FilterState, SiemAlert } from './types';
import { FilterBar } from './FilterBar';
import { AlertList } from './AlertList';
import { AlertDetails } from './AlertDetails';
import { LogStream } from './LogStream';

const defaultFilters: FilterState = {
  severity: [],
  category: [],
  searchQuery: '',
};

export function SiemDashboard() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | undefined>(mockAlerts[0]?.id);

  const filteredAlerts = useMemo(() => {
    return mockAlerts
      .filter((alert) =>
        filters.severity.length > 0 ? filters.severity.includes(alert.severity) : true
      )
      .filter((alert) =>
        filters.category.length > 0 ? filters.category.includes(alert.category) : true
      )
      .filter((alert) => {
        if (!filters.searchQuery) return true;
        const q = filters.searchQuery.toLowerCase();
        return (
          alert.title.toLowerCase().includes(q) ||
          alert.description.toLowerCase().includes(q) ||
          alert.rule_id.toLowerCase().includes(q)
        );
      });
  }, [filters]);

  const selectedAlert: SiemAlert | undefined =
    filteredAlerts.find((a) => a.id === selectedId) ?? filteredAlerts[0];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => {
          setFilters(defaultFilters);
          setSelectedId(mockAlerts[0]?.id);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <AlertList
            alerts={filteredAlerts}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
          />
          <LogStream initialLogs={mockLogs} />
        </div>

        <AlertDetails alert={selectedAlert} />
      </div>
    </div>
  );
}
