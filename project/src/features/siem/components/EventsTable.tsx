'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { SecurityEvent } from '../types';

interface EventsTableProps {
  events: SecurityEvent[];
  onEventClick: (event: SecurityEvent) => void;
  className?: string;
}

type SortField = 'timestamp' | 'severity' | 'eventType' | 'source.type';
type SortOrder = 'asc' | 'desc';

const severityOrder = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const severityColors = {
  critical: 'text-severity-critical bg-severity-critical/10 border-severity-critical/20',
  high: 'text-severity-high bg-severity-high/10 border-severity-high/20',
  medium: 'text-severity-medium bg-severity-medium/10 border-severity-medium/20',
  low: 'text-severity-low bg-severity-low/10 border-severity-low/20',
};

export function EventsTable({ events, onEventClick, className }: EventsTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const sortedEvents = [...events].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    if (sortField === 'timestamp') {
      aVal = new Date(a.timestamp).getTime();
      bVal = new Date(b.timestamp).getTime();
    } else if (sortField === 'severity') {
      aVal = severityOrder[a.severity];
      bVal = severityOrder[b.severity];
    } else if (sortField === 'source.type') {
      aVal = a.source.type;
      bVal = b.source.type;
    } else {
      aVal = a[sortField];
      bVal = b[sortField];
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const paginatedEvents = sortedEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="overflow-x-auto rounded-lg border border-border bg-background-card">
        <table className="w-full">
          <thead className="border-b border-border bg-background/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors"
                >
                  Timestamp
                  <SortIcon field="timestamp" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('severity')}
                  className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors"
                >
                  Severity
                  <SortIcon field="severity" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('eventType')}
                  className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors"
                >
                  Event Type
                  <SortIcon field="eventType" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('source.type')}
                  className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors"
                >
                  Source
                  <SortIcon field="source.type" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-semibold text-text-primary">Actor</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-semibold text-text-primary">Action</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-semibold text-text-primary">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((event, index) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="border-b border-border/50 hover:bg-background/50 transition-colors cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                  {formatTimestamp(event.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
                      severityColors[event.severity]
                    )}
                  >
                    {event.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-primary font-medium">
                  {event.eventType.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {event.source.type}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  <div className="max-w-[150px] truncate">
                    {event.actor.username || event.actor.hostname || 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {event.details.action || 'N/A'}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    className="p-1 rounded hover:bg-background transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    aria-label="View event details"
                  >
                    <Eye className="h-4 w-4 text-text-secondary" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {paginatedEvents.length === 0 && (
          <div className="py-12 text-center text-text-secondary">
            <p>No events found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Showing {(page - 1) * itemsPerPage + 1} to{' '}
            {Math.min(page * itemsPerPage, sortedEvents.length)} of {sortedEvents.length} events
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                'px-3 py-1 rounded border border-border text-sm font-medium transition-colors',
                page === 1
                  ? 'text-text-secondary cursor-not-allowed'
                  : 'text-text-primary hover:bg-background-card'
              )}
            >
              Previous
            </button>
            <span className="text-sm text-text-secondary">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(
                'px-3 py-1 rounded border border-border text-sm font-medium transition-colors',
                page === totalPages
                  ? 'text-text-secondary cursor-not-allowed'
                  : 'text-text-primary hover:bg-background-card'
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
