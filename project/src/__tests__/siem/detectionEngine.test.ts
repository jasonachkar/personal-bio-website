import { DetectionEngine } from '@/features/siem/lib/detectionEngine';
import type { SecurityEvent, DetectionRule } from '@/features/siem/types';

describe('DetectionEngine', () => {
  const mockEvents: SecurityEvent[] = [
    {
      id: 'evt-1',
      timestamp: '2025-01-15T10:00:00Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com', ip: '192.168.1.100' },
      details: { action: 'failed_login', result: 'failure' },
    },
    {
      id: 'evt-2',
      timestamp: '2025-01-15T10:00:30Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com', ip: '192.168.1.100' },
      details: { action: 'failed_login', result: 'failure' },
    },
    {
      id: 'evt-3',
      timestamp: '2025-01-15T10:01:00Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com', ip: '192.168.1.100' },
      details: { action: 'failed_login', result: 'failure' },
    },
    {
      id: 'evt-4',
      timestamp: '2025-01-15T10:02:00Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com', ip: '192.168.1.100' },
      details: { action: 'failed_login', result: 'failure' },
    },
    {
      id: 'evt-5',
      timestamp: '2025-01-15T10:03:00Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com', ip: '192.168.1.100' },
      details: { action: 'failed_login', result: 'failure' },
    },
    {
      id: 'evt-6',
      timestamp: '2025-01-15T10:10:00Z',
      eventType: 'process',
      severity: 'medium',
      source: { type: 'endpoint', name: 'ws-002' },
      actor: { username: 'user@example.com' },
      details: { action: 'execution', result: 'success', command: 'powershell.exe -enc' },
    },
    {
      id: 'evt-7',
      timestamp: '2025-01-15T10:15:00Z',
      eventType: 'network',
      severity: 'low',
      source: { type: 'firewall', name: 'fw-001' },
      actor: { ip: '10.0.0.50' },
      details: { action: 'blocked', result: 'denied' },
    },
  ];

  const mockRules: DetectionRule[] = [
    {
      id: 'rule-1',
      name: 'Simple Authentication Failure',
      description: 'Detects any authentication failure',
      severity: 'medium',
      enabled: true,
      query: 'eventType == "authentication" and details.action == "failed_login"',
      mitre: {
        tactics: ['Credential Access'],
        techniques: ['T1110'],
      },
    },
    {
      id: 'rule-2',
      name: 'Brute Force Detection',
      description: 'Detects 5+ failed logins within 5 minutes',
      severity: 'high',
      enabled: true,
      query: 'eventType == "authentication" and details.action == "failed_login"',
      timeWindow: {
        duration: 300, // 5 minutes
        threshold: 5,
        groupBy: ['actor.username'],
      },
      mitre: {
        tactics: ['Credential Access'],
        techniques: ['T1110.001'],
      },
      alertTemplate: {
        description: 'Potential brute force attack detected',
        recommendations: ['Lock the account', 'Review login attempts'],
      },
    },
    {
      id: 'rule-3',
      name: 'Encoded PowerShell',
      description: 'Detects encoded PowerShell commands',
      severity: 'high',
      enabled: true,
      query: 'eventType == "process" and details.command contains "-enc"',
      mitre: {
        tactics: ['Execution'],
        techniques: ['T1059.001'],
      },
    },
    {
      id: 'rule-4',
      name: 'Disabled Rule',
      description: 'This rule should not run',
      severity: 'critical',
      enabled: false,
      query: 'eventType == "network"',
      mitre: {
        tactics: ['Command and Control'],
        techniques: ['T1071'],
      },
    },
  ];

  let engine: DetectionEngine;

  beforeEach(() => {
    engine = new DetectionEngine(mockEvents, mockRules);
  });

  describe('initialization', () => {
    it('should initialize with events and rules', () => {
      expect(engine).toBeDefined();
    });

    it('should filter out disabled rules', () => {
      const results = engine.runDetections();
      // Should not include rule-4 (disabled)
      expect(results.every((r) => r.ruleId !== 'rule-4')).toBe(true);
    });
  });

  describe('runDetections', () => {
    it('should run all enabled rules', () => {
      const results = engine.runDetections();
      expect(results.length).toBeGreaterThan(0);
    });

    it('should detect simple query-based rules', () => {
      const results = engine.runDetections();
      const authFailureDetection = results.find((r) => r.ruleId === 'rule-1');
      expect(authFailureDetection).toBeDefined();
      expect(authFailureDetection?.matchedEvents.length).toBe(5);
    });

    it('should detect time-window based rules', () => {
      const results = engine.runDetections();
      const bruteForceDetection = results.find((r) => r.ruleId === 'rule-2');
      expect(bruteForceDetection).toBeDefined();
      expect(bruteForceDetection?.matchedEvents.length).toBeGreaterThanOrEqual(5);
    });

    it('should sort results by severity (critical first)', () => {
      const results = engine.runDetections();
      if (results.length >= 2) {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        for (let i = 0; i < results.length - 1; i++) {
          expect(severityOrder[results[i].severity]).toBeGreaterThanOrEqual(
            severityOrder[results[i + 1].severity]
          );
        }
      }
    });

    it('should not return detections with zero matches', () => {
      const results = engine.runDetections();
      expect(results.every((r) => r.matchedEvents.length > 0)).toBe(true);
    });

    it('should include MITRE ATT&CK mapping in results', () => {
      const results = engine.runDetections();
      results.forEach((result) => {
        expect(result.mitre).toBeDefined();
        expect(result.mitre.tactics).toBeDefined();
        expect(result.mitre.techniques).toBeDefined();
      });
    });

    it('should include alert template when specified', () => {
      const results = engine.runDetections();
      const bruteForceDetection = results.find((r) => r.ruleId === 'rule-2');
      expect(bruteForceDetection?.description).toBe('Potential brute force attack detected');
      expect(bruteForceDetection?.recommendations).toBeDefined();
    });
  });

  describe('runRule', () => {
    it('should run a simple rule and return results', () => {
      const rule = mockRules[0];
      const result = engine.runRule(rule);
      expect(result).not.toBeNull();
      expect(result?.matchedEvents.length).toBe(5);
    });

    it('should return null for rules with no matches', () => {
      const noMatchRule: DetectionRule = {
        id: 'rule-no-match',
        name: 'No Match Rule',
        description: 'Should not match any events',
        severity: 'low',
        enabled: true,
        query: 'eventType == "nonexistent"',
        mitre: { tactics: [], techniques: [] },
      };
      const result = engine.runRule(noMatchRule);
      expect(result).toBeNull();
    });

    it('should include rule metadata in result', () => {
      const rule = mockRules[0];
      const result = engine.runRule(rule);
      expect(result?.ruleId).toBe(rule.id);
      expect(result?.ruleName).toBe(rule.name);
      expect(result?.severity).toBe(rule.severity);
    });

    it('should include triggered timestamp', () => {
      const rule = mockRules[0];
      const result = engine.runRule(rule);
      expect(result?.triggeredAt).toBeDefined();
      expect(new Date(result!.triggeredAt).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('time window detection', () => {
    it('should detect events exceeding threshold within time window', () => {
      const rule = mockRules[1]; // Brute force rule: 5+ events in 5 minutes
      const result = engine.runRule(rule);
      expect(result).not.toBeNull();
      expect(result?.matchedEvents.length).toBeGreaterThanOrEqual(5);
    });

    it('should group events by specified fields', () => {
      const rule: DetectionRule = {
        id: 'rule-grouped',
        name: 'Grouped Detection',
        description: 'Test grouped detection',
        severity: 'medium',
        enabled: true,
        query: 'eventType == "authentication"',
        timeWindow: {
          duration: 600,
          threshold: 3,
          groupBy: ['actor.username', 'source.name'],
        },
        mitre: { tactics: [], techniques: [] },
      };

      const testEngine = new DetectionEngine(mockEvents, [rule]);
      const result = testEngine.runRule(rule);
      expect(result).not.toBeNull();
    });

    it('should use sliding window algorithm', () => {
      // Create events with specific timing to test sliding window
      const timedEvents: SecurityEvent[] = [
        {
          ...mockEvents[0],
          id: 'timed-1',
          timestamp: '2025-01-15T10:00:00Z',
        },
        {
          ...mockEvents[0],
          id: 'timed-2',
          timestamp: '2025-01-15T10:00:30Z',
        },
        {
          ...mockEvents[0],
          id: 'timed-3',
          timestamp: '2025-01-15T10:01:00Z',
        },
        {
          ...mockEvents[0],
          id: 'timed-4',
          timestamp: '2025-01-15T10:10:00Z', // Outside 5-minute window from first
        },
      ];

      const rule: DetectionRule = {
        id: 'rule-sliding',
        name: 'Sliding Window Test',
        description: 'Test sliding window',
        severity: 'high',
        enabled: true,
        query: 'eventType == "authentication"',
        timeWindow: {
          duration: 60, // 1 minute
          threshold: 2,
        },
        mitre: { tactics: [], techniques: [] },
      };

      const testEngine = new DetectionEngine(timedEvents, [rule]);
      const result = testEngine.runRule(rule);
      expect(result).not.toBeNull();
      expect(result?.matchedEvents.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle time window without grouping', () => {
      const rule: DetectionRule = {
        id: 'rule-no-group',
        name: 'No Grouping',
        description: 'Time window without grouping',
        severity: 'high',
        enabled: true,
        query: 'eventType == "authentication"',
        timeWindow: {
          duration: 600, // 10 minutes
          threshold: 4,
        },
        mitre: { tactics: [], techniques: [] },
      };

      const testEngine = new DetectionEngine(mockEvents, [rule]);
      const result = testEngine.runRule(rule);
      expect(result).not.toBeNull();
      expect(result?.matchedEvents.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('testRuleAgainstEvent', () => {
    it('should return true for matching event', () => {
      const rule = mockRules[0];
      const event = mockEvents[0];
      const matches = engine.testRuleAgainstEvent(rule, event);
      expect(matches).toBe(true);
    });

    it('should return false for non-matching event', () => {
      const rule = mockRules[0];
      const event = mockEvents[6]; // network event
      const matches = engine.testRuleAgainstEvent(rule, event);
      expect(matches).toBe(false);
    });

    it('should handle errors gracefully', () => {
      const badRule: DetectionRule = {
        id: 'bad-rule',
        name: 'Bad Rule',
        description: 'Invalid query',
        severity: 'low',
        enabled: true,
        query: 'invalid query syntax !!!',
        mitre: { tactics: [], techniques: [] },
      };
      const event = mockEvents[0];
      const matches = engine.testRuleAgainstEvent(badRule, event);
      expect(matches).toBe(false);
    });
  });

  describe('getDetectionStats', () => {
    it('should calculate total detections', () => {
      const results = engine.runDetections();
      const stats = engine.getDetectionStats(results);
      expect(stats.total).toBe(results.length);
    });

    it('should count detections by severity', () => {
      const results = engine.runDetections();
      const stats = engine.getDetectionStats(results);
      expect(stats.bySeverity.critical).toBeGreaterThanOrEqual(0);
      expect(stats.bySeverity.high).toBeGreaterThanOrEqual(0);
      expect(stats.bySeverity.medium).toBeGreaterThanOrEqual(0);
      expect(stats.bySeverity.low).toBeGreaterThanOrEqual(0);
    });

    it('should count total matched events', () => {
      const results = engine.runDetections();
      const stats = engine.getDetectionStats(results);
      const expectedTotal = results.reduce((sum, r) => sum + r.matchedEvents.length, 0);
      expect(stats.totalMatchedEvents).toBe(expectedTotal);
    });

    it('should count detections by MITRE tactic', () => {
      const results = engine.runDetections();
      const stats = engine.getDetectionStats(results);
      expect(stats.byTactic).toBeDefined();
      expect(Object.keys(stats.byTactic).length).toBeGreaterThan(0);
    });

    it('should handle empty results', () => {
      const emptyEngine = new DetectionEngine([], mockRules);
      const results = emptyEngine.runDetections();
      const stats = emptyEngine.getDetectionStats(results);
      expect(stats.total).toBe(0);
      expect(stats.totalMatchedEvents).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty event dataset', () => {
      const emptyEngine = new DetectionEngine([], mockRules);
      const results = emptyEngine.runDetections();
      expect(results).toHaveLength(0);
    });

    it('should handle empty rules dataset', () => {
      const noRulesEngine = new DetectionEngine(mockEvents, []);
      const results = noRulesEngine.runDetections();
      expect(results).toHaveLength(0);
    });

    it('should handle all disabled rules', () => {
      const disabledRules = mockRules.map((r) => ({ ...r, enabled: false }));
      const disabledEngine = new DetectionEngine(mockEvents, disabledRules);
      const results = disabledEngine.runDetections();
      expect(results).toHaveLength(0);
    });

    it('should handle rules with invalid queries', () => {
      const badRule: DetectionRule = {
        id: 'bad-query',
        name: 'Bad Query',
        description: 'Invalid query',
        severity: 'low',
        enabled: true,
        query: 'this is not a valid query %%%',
        mitre: { tactics: [], techniques: [] },
      };
      const testEngine = new DetectionEngine(mockEvents, [badRule]);
      const results = testEngine.runDetections();
      // Should not crash, should handle error gracefully
      expect(results).toBeDefined();
    });

    it('should handle time window with insufficient events', () => {
      const rule: DetectionRule = {
        id: 'insufficient',
        name: 'Insufficient Events',
        description: 'Requires more events than available',
        severity: 'high',
        enabled: true,
        query: 'eventType == "authentication"',
        timeWindow: {
          duration: 60,
          threshold: 100, // Requires 100 events in 1 minute
        },
        mitre: { tactics: [], techniques: [] },
      };
      const testEngine = new DetectionEngine(mockEvents, [rule]);
      const result = testEngine.runRule(rule);
      expect(result).toBeNull();
    });
  });

  describe('performance', () => {
    it('should handle large event datasets efficiently', () => {
      const largeEventSet: SecurityEvent[] = Array.from({ length: 10000 }, (_, i) => ({
        id: `evt-${i}`,
        timestamp: new Date(Date.now() + i * 1000).toISOString(),
        eventType: i % 2 === 0 ? 'authentication' : 'network',
        severity: i % 4 === 0 ? 'critical' : 'high',
        source: { type: 'endpoint', name: `ws-${i % 10}` },
        actor: { username: `user${i % 100}@example.com` },
        details: { action: 'test', result: i % 3 === 0 ? 'failure' : 'success' },
      }));

      const startTime = Date.now();
      const largeEngine = new DetectionEngine(largeEventSet, mockRules);
      const results = largeEngine.runDetections();
      const endTime = Date.now();

      expect(results).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in less than 5 seconds
    });

    it('should handle time window detection efficiently', () => {
      const timedEvents: SecurityEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `evt-${i}`,
        timestamp: new Date(Date.now() + i * 10000).toISOString(), // 10 seconds apart
        eventType: 'authentication',
        severity: 'high',
        source: { type: 'endpoint', name: 'ws-001' },
        actor: { username: 'user@example.com' },
        details: { action: 'failed_login', result: 'failure' },
      }));

      const rule: DetectionRule = {
        id: 'perf-test',
        name: 'Performance Test',
        description: 'Test time window performance',
        severity: 'high',
        enabled: true,
        query: 'eventType == "authentication"',
        timeWindow: {
          duration: 300, // 5 minutes
          threshold: 10,
          groupBy: ['actor.username'],
        },
        mitre: { tactics: [], techniques: [] },
      };

      const startTime = Date.now();
      const perfEngine = new DetectionEngine(timedEvents, [rule]);
      const result = perfEngine.runRule(rule);
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(2000); // Should complete in less than 2 seconds
    });
  });
});
