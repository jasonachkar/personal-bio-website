import type { SecurityEvent, EventFilters } from './types';
import { parseAndCompileQuery } from './queryParser';

/**
 * Query Engine with Indexing and Filtering
 */
export class QueryEngine {
  private events: SecurityEvent[];
  private indexes: Map<string, Map<any, SecurityEvent[]>>;

  constructor(events: SecurityEvent[]) {
    this.events = events;
    this.indexes = new Map();
    this.buildIndexes();
  }

  /**
   * Build indexes for faster querying
   */
  private buildIndexes() {
    // Index by commonly queried fields
    const indexFields = ['eventType', 'severity', 'source.type'];

    indexFields.forEach((field) => {
      const index = new Map<any, SecurityEvent[]>();

      this.events.forEach((event) => {
        const value = this.getFieldValue(event, field);
        if (value !== undefined) {
          if (!index.has(value)) {
            index.set(value, []);
          }
          index.get(value)!.push(event);
        }
      });

      this.indexes.set(field, index);
    });
  }

  /**
   * Execute a KQL-like query
   */
  executeQuery(query: string): SecurityEvent[] {
    if (!query || query.trim() === '') {
      return this.events;
    }

    const predicate = parseAndCompileQuery(query);
    return this.events.filter(predicate);
  }

  /**
   * Apply multiple filters
   */
  applyFilters(filters: EventFilters): SecurityEvent[] {
    let results = this.events;

    // Apply custom query first (most specific)
    if (filters.customQuery) {
      results = this.executeQuery(filters.customQuery);
    }

    // Apply search query (full-text search)
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      results = results.filter((event) => {
        const searchableText = JSON.stringify(event).toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    // Apply severity filter
    if (filters.severities && filters.severities.length > 0) {
      results = results.filter((event) => filters.severities!.includes(event.severity));
    }

    // Apply source type filter
    if (filters.sourceTypes && filters.sourceTypes.length > 0) {
      results = results.filter((event) => filters.sourceTypes!.includes(event.source.type));
    }

    // Apply event type filter
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      results = results.filter((event) => filters.eventTypes!.includes(event.eventType));
    }

    // Apply date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      results = results.filter((event) => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= start && eventDate <= end;
      });
    }

    return results;
  }

  /**
   * Get events using index (optimized)
   */
  getEventsByField(field: string, value: any): SecurityEvent[] {
    const index = this.indexes.get(field);
    if (index) {
      return index.get(value) || [];
    }

    // Fallback to linear search
    return this.events.filter((event) => this.getFieldValue(event, field) === value);
  }

  /**
   * Get unique values for a field (for filter dropdowns)
   */
  getUniqueValues(field: string): any[] {
    const values = new Set<any>();

    this.events.forEach((event) => {
      const value = this.getFieldValue(event, field);
      if (value !== undefined && value !== null) {
        values.add(value);
      }
    });

    return Array.from(values).sort();
  }

  /**
   * Get field value with dot notation support
   */
  private getFieldValue(event: SecurityEvent, field: string): any {
    const parts = field.split('.');
    let value: any = event;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Get statistics about the dataset
   */
  getStatistics() {
    const stats = {
      total: this.events.length,
      bySeverity: {} as Record<string, number>,
      byEventType: {} as Record<string, number>,
      bySourceType: {} as Record<string, number>,
      dateRange: {
        earliest: '',
        latest: '',
      },
    };

    // Count by severity
    this.events.forEach((event) => {
      stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] || 0) + 1;
      stats.byEventType[event.eventType] = (stats.byEventType[event.eventType] || 0) + 1;
      stats.bySourceType[event.source.type] = (stats.bySourceType[event.source.type] || 0) + 1;
    });

    // Find date range
    if (this.events.length > 0) {
      const dates = this.events.map((e) => new Date(e.timestamp)).sort((a, b) => a.getTime() - b.getTime());
      stats.dateRange.earliest = dates[0].toISOString();
      stats.dateRange.latest = dates[dates.length - 1].toISOString();
    }

    return stats;
  }

  /**
   * Sort events
   */
  sortEvents(events: SecurityEvent[], field: keyof SecurityEvent, order: 'asc' | 'desc' = 'desc'): SecurityEvent[] {
    return [...events].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      // Handle undefined values
      if (aVal === undefined || bVal === undefined) return 0;

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
