import { QueryEngine } from '@/features/siem/lib/queryEngine';
import type { SecurityEvent, EventFilters } from '@/features/siem/types';

describe('QueryEngine', () => {
  const mockEvents: SecurityEvent[] = [
    {
      id: 'evt-1',
      timestamp: '2025-01-15T10:00:00Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com', ip: '192.168.1.100' },
      details: { action: 'failed_login', result: 'failure', description: 'Failed login attempt' },
    },
    {
      id: 'evt-2',
      timestamp: '2025-01-15T10:05:00Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com', ip: '192.168.1.100' },
      details: { action: 'failed_login', result: 'failure', description: 'Failed login attempt' },
    },
    {
      id: 'evt-3',
      timestamp: '2025-01-15T10:10:00Z',
      eventType: 'network',
      severity: 'medium',
      source: { type: 'firewall', name: 'fw-001' },
      actor: { ip: '10.0.0.50' },
      details: { action: 'blocked', result: 'denied', description: 'Blocked malicious traffic' },
    },
    {
      id: 'evt-4',
      timestamp: '2025-01-15T10:15:00Z',
      eventType: 'authentication',
      severity: 'critical',
      source: { type: 'endpoint', name: 'ws-002' },
      actor: { username: 'user@example.com', ip: '10.0.1.50' },
      details: { action: 'successful_login', result: 'success', description: 'Successful login' },
    },
    {
      id: 'evt-5',
      timestamp: '2025-01-15T10:20:00Z',
      eventType: 'process',
      severity: 'low',
      source: { type: 'endpoint', name: 'ws-003' },
      actor: { username: 'test@example.com' },
      details: { action: 'execution', result: 'success', description: 'Process executed' },
    },
  ];

  let engine: QueryEngine;

  beforeEach(() => {
    engine = new QueryEngine(mockEvents);
  });

  describe('initialization and indexing', () => {
    it('should initialize with events', () => {
      expect(engine).toBeDefined();
    });

    it('should build indexes on initialization', () => {
      const eventsByType = engine.getEventsByField('eventType', 'authentication');
      expect(eventsByType).toHaveLength(3);
    });

    it('should index by severity', () => {
      const highEvents = engine.getEventsByField('severity', 'high');
      expect(highEvents).toHaveLength(2);
    });

    it('should index by source.type', () => {
      const endpointEvents = engine.getEventsByField('source.type', 'endpoint');
      expect(endpointEvents).toHaveLength(4);
    });
  });

  describe('executeQuery', () => {
    it('should return all events for empty query', () => {
      const results = engine.executeQuery('');
      expect(results).toHaveLength(5);
    });

    it('should filter by eventType', () => {
      const results = engine.executeQuery('eventType == "authentication"');
      expect(results).toHaveLength(3);
      expect(results.every((e) => e.eventType === 'authentication')).toBe(true);
    });

    it('should filter by severity', () => {
      const results = engine.executeQuery('severity == "high"');
      expect(results).toHaveLength(2);
    });

    it('should handle complex AND queries', () => {
      const results = engine.executeQuery('eventType == "authentication" and severity == "high"');
      expect(results).toHaveLength(2);
    });

    it('should handle complex OR queries', () => {
      const results = engine.executeQuery('severity == "critical" or severity == "low"');
      expect(results).toHaveLength(2);
    });

    it('should filter by nested properties', () => {
      const results = engine.executeQuery('source.type == "endpoint"');
      expect(results).toHaveLength(4);
    });

    it('should handle contains operator', () => {
      const results = engine.executeQuery('details.description contains "login"');
      expect(results).toHaveLength(3);
    });
  });

  describe('applyFilters', () => {
    it('should apply severity filter', () => {
      const filters: EventFilters = {
        severities: ['high', 'critical'],
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(3);
      expect(results.every((e) => ['high', 'critical'].includes(e.severity))).toBe(true);
    });

    it('should apply source type filter', () => {
      const filters: EventFilters = {
        sourceTypes: ['endpoint'],
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(4);
    });

    it('should apply event type filter', () => {
      const filters: EventFilters = {
        eventTypes: ['authentication', 'network'],
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(4);
    });

    it('should apply search query (full-text search)', () => {
      const filters: EventFilters = {
        searchQuery: 'malicious',
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('evt-3');
    });

    it('should apply custom query', () => {
      const filters: EventFilters = {
        customQuery: 'severity == "high"',
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(2);
    });

    it('should apply date range filter', () => {
      const filters: EventFilters = {
        dateRange: {
          start: new Date('2025-01-15T10:00:00Z'),
          end: new Date('2025-01-15T10:10:00Z'),
        },
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(3);
    });

    it('should combine multiple filters', () => {
      const filters: EventFilters = {
        severities: ['high', 'critical'],
        sourceTypes: ['endpoint'],
        searchQuery: 'login',
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(3);
      expect(
        results.every(
          (e) =>
            ['high', 'critical'].includes(e.severity) &&
            e.source.type === 'endpoint' &&
            JSON.stringify(e).toLowerCase().includes('login')
        )
      ).toBe(true);
    });

    it('should apply custom query before search query', () => {
      const filters: EventFilters = {
        customQuery: 'eventType == "authentication"',
        searchQuery: 'failed',
      };
      const results = engine.applyFilters(filters);
      expect(results).toHaveLength(2);
      expect(results.every((e) => e.eventType === 'authentication')).toBe(true);
    });
  });

  describe('getEventsByField', () => {
    it('should use index for indexed fields', () => {
      const results = engine.getEventsByField('eventType', 'authentication');
      expect(results).toHaveLength(3);
    });

    it('should fallback to linear search for non-indexed fields', () => {
      const results = engine.getEventsByField('actor.username', 'admin@example.com');
      expect(results).toHaveLength(2);
    });

    it('should return empty array for non-existent values', () => {
      const results = engine.getEventsByField('eventType', 'nonexistent');
      expect(results).toHaveLength(0);
    });
  });

  describe('getUniqueValues', () => {
    it('should return unique event types', () => {
      const values = engine.getUniqueValues('eventType');
      expect(values).toContain('authentication');
      expect(values).toContain('network');
      expect(values).toContain('process');
      expect(values).toHaveLength(3);
    });

    it('should return unique severities', () => {
      const values = engine.getUniqueValues('severity');
      expect(values).toContain('high');
      expect(values).toContain('medium');
      expect(values).toContain('critical');
      expect(values).toContain('low');
      expect(values).toHaveLength(4);
    });

    it('should handle nested fields', () => {
      const values = engine.getUniqueValues('source.type');
      expect(values).toContain('endpoint');
      expect(values).toContain('firewall');
      expect(values).toHaveLength(2);
    });

    it('should return sorted values', () => {
      const values = engine.getUniqueValues('severity');
      const sorted = [...values].sort();
      expect(values).toEqual(sorted);
    });

    it('should filter out null/undefined values', () => {
      const values = engine.getUniqueValues('nonexistent.field');
      expect(values).toHaveLength(0);
    });
  });

  describe('getStatistics', () => {
    it('should return total count', () => {
      const stats = engine.getStatistics();
      expect(stats.total).toBe(5);
    });

    it('should count events by severity', () => {
      const stats = engine.getStatistics();
      expect(stats.bySeverity.high).toBe(2);
      expect(stats.bySeverity.critical).toBe(1);
      expect(stats.bySeverity.medium).toBe(1);
      expect(stats.bySeverity.low).toBe(1);
    });

    it('should count events by event type', () => {
      const stats = engine.getStatistics();
      expect(stats.byEventType.authentication).toBe(3);
      expect(stats.byEventType.network).toBe(1);
      expect(stats.byEventType.process).toBe(1);
    });

    it('should count events by source type', () => {
      const stats = engine.getStatistics();
      expect(stats.bySourceType.endpoint).toBe(4);
      expect(stats.bySourceType.firewall).toBe(1);
    });

    it('should calculate date range', () => {
      const stats = engine.getStatistics();
      expect(stats.dateRange.earliest).toBe('2025-01-15T10:00:00Z');
      expect(stats.dateRange.latest).toBe('2025-01-15T10:20:00Z');
    });

    it('should handle empty dataset', () => {
      const emptyEngine = new QueryEngine([]);
      const stats = emptyEngine.getStatistics();
      expect(stats.total).toBe(0);
      expect(stats.dateRange.earliest).toBe('');
      expect(stats.dateRange.latest).toBe('');
    });
  });

  describe('sortEvents', () => {
    it('should sort by timestamp ascending', () => {
      const sorted = engine.sortEvents(mockEvents, 'timestamp', 'asc');
      expect(sorted[0].id).toBe('evt-1');
      expect(sorted[4].id).toBe('evt-5');
    });

    it('should sort by timestamp descending', () => {
      const sorted = engine.sortEvents(mockEvents, 'timestamp', 'desc');
      expect(sorted[0].id).toBe('evt-5');
      expect(sorted[4].id).toBe('evt-1');
    });

    it('should sort by severity', () => {
      const sorted = engine.sortEvents(mockEvents, 'severity', 'asc');
      expect(sorted[0].severity).toBe('critical');
    });

    it('should not mutate original array', () => {
      const original = [...mockEvents];
      engine.sortEvents(mockEvents, 'timestamp', 'asc');
      expect(mockEvents).toEqual(original);
    });

    it('should handle undefined values', () => {
      const eventsWithUndefined = [
        { ...mockEvents[0], eventType: undefined as any },
        ...mockEvents.slice(1),
      ];
      const sorted = engine.sortEvents(eventsWithUndefined, 'eventType', 'asc');
      expect(sorted).toHaveLength(5);
    });
  });

  describe('performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset: SecurityEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `evt-${i}`,
        timestamp: new Date(Date.now() + i * 1000).toISOString(),
        eventType: i % 3 === 0 ? 'authentication' : i % 3 === 1 ? 'network' : 'process',
        severity: i % 4 === 0 ? 'critical' : i % 4 === 1 ? 'high' : i % 4 === 2 ? 'medium' : 'low',
        source: { type: 'endpoint', name: `ws-${i % 10}` },
        actor: { username: `user${i}@example.com` },
        details: { action: 'test', result: 'success' },
      }));

      const startTime = Date.now();
      const largeEngine = new QueryEngine(largeDataset);
      const results = largeEngine.executeQuery('eventType == "authentication" and severity == "critical"');
      const endTime = Date.now();

      expect(results.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });
});
