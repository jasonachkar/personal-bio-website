import type { SecurityEvent, DetectionRule, DetectionResult } from './types';
import { parseAndCompileQuery } from './queryParser';

/**
 * Detection Engine - Matches security events against detection rules
 */
export class DetectionEngine {
  private events: SecurityEvent[];
  private rules: DetectionRule[];

  constructor(events: SecurityEvent[], rules: DetectionRule[]) {
    this.events = events;
    this.rules = rules.filter((r) => r.enabled);
  }

  /**
   * Run all enabled rules against the event dataset
   */
  runDetections(): DetectionResult[] {
    const results: DetectionResult[] = [];

    this.rules.forEach((rule) => {
      const result = this.runRule(rule);
      if (result && result.matchedEvents.length > 0) {
        results.push(result);
      }
    });

    // Sort by severity (critical first)
    return results.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Run a single rule
   */
  runRule(rule: DetectionRule): DetectionResult | null {
    try {
      let matchedEvents: SecurityEvent[] = [];

      if (rule.timeWindow) {
        // Time-based detection with aggregation
        matchedEvents = this.runTimeWindowDetection(rule);
      } else {
        // Simple query-based detection
        const predicate = parseAndCompileQuery(rule.query);
        matchedEvents = this.events.filter(predicate);
      }

      if (matchedEvents.length === 0) {
        return null;
      }

      return {
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        matchedEvents,
        triggeredAt: new Date().toISOString(),
        mitre: rule.mitre,
        description: rule.alertTemplate?.description || rule.description,
        recommendations: rule.alertTemplate?.recommendations,
      };
    } catch (error) {
      console.error(`Error running rule ${rule.id}:`, error);
      return null;
    }
  }

  /**
   * Run time-window based detection
   * Groups events by specified fields and checks if threshold is exceeded within time window
   */
  private runTimeWindowDetection(rule: DetectionRule): SecurityEvent[] {
    if (!rule.timeWindow) return [];

    const { duration, threshold, groupBy } = rule.timeWindow;

    // First, get all events matching the base query
    const predicate = parseAndCompileQuery(rule.query);
    const candidateEvents = this.events.filter(predicate);

    if (candidateEvents.length === 0) return [];

    // Sort by timestamp
    const sortedEvents = [...candidateEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Group events if groupBy is specified
    if (groupBy && groupBy.length > 0) {
      return this.detectWithGrouping(sortedEvents, duration, threshold, groupBy);
    } else {
      // Simple threshold check without grouping
      return this.detectWithoutGrouping(sortedEvents, duration, threshold);
    }
  }

  /**
   * Detect patterns with grouping by specific fields
   */
  private detectWithGrouping(
    events: SecurityEvent[],
    duration: number,
    threshold: number,
    groupBy: string[]
  ): SecurityEvent[] {
    const groups = new Map<string, SecurityEvent[]>();

    // Group events
    events.forEach((event) => {
      const key = this.getGroupKey(event, groupBy);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    });

    const matchedEvents: SecurityEvent[] = [];

    // Check each group for threshold violations
    groups.forEach((groupEvents) => {
      const violations = this.findTimeWindowViolations(groupEvents, duration, threshold);
      matchedEvents.push(...violations);
    });

    return matchedEvents;
  }

  /**
   * Detect patterns without grouping
   */
  private detectWithoutGrouping(
    events: SecurityEvent[],
    duration: number,
    threshold: number
  ): SecurityEvent[] {
    return this.findTimeWindowViolations(events, duration, threshold);
  }

  /**
   * Find events that exceed threshold within time window (sliding window algorithm)
   */
  private findTimeWindowViolations(
    events: SecurityEvent[],
    duration: number,
    threshold: number
  ): SecurityEvent[] {
    const matchedEvents: SecurityEvent[] = [];
    const durationMs = duration * 1000; // Convert to milliseconds

    for (let i = 0; i < events.length; i++) {
      const windowStart = new Date(events[i].timestamp).getTime();
      const windowEnd = windowStart + durationMs;

      const eventsInWindow: SecurityEvent[] = [];

      for (let j = i; j < events.length; j++) {
        const eventTime = new Date(events[j].timestamp).getTime();

        if (eventTime <= windowEnd) {
          eventsInWindow.push(events[j]);
        } else {
          break; // Events are sorted, no need to continue
        }
      }

      // Check if threshold exceeded
      if (eventsInWindow.length >= threshold) {
        // Add all events in this window to matches (avoid duplicates)
        eventsInWindow.forEach((event) => {
          if (!matchedEvents.find((e) => e.id === event.id)) {
            matchedEvents.push(event);
          }
        });
      }
    }

    return matchedEvents;
  }

  /**
   * Get group key from event based on specified fields
   */
  private getGroupKey(event: SecurityEvent, fields: string[]): string {
    const values = fields.map((field) => {
      const value = this.getFieldValue(event, field);
      return value !== undefined ? String(value) : 'null';
    });
    return values.join('|');
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
   * Test a rule against a single event
   */
  testRuleAgainstEvent(rule: DetectionRule, event: SecurityEvent): boolean {
    try {
      const predicate = parseAndCompileQuery(rule.query);
      return predicate(event);
    } catch (error) {
      console.error(`Error testing rule ${rule.id}:`, error);
      return false;
    }
  }

  /**
   * Get detection statistics
   */
  getDetectionStats(results: DetectionResult[]) {
    return {
      total: results.length,
      bySeverity: {
        critical: results.filter((r) => r.severity === 'critical').length,
        high: results.filter((r) => r.severity === 'high').length,
        medium: results.filter((r) => r.severity === 'medium').length,
        low: results.filter((r) => r.severity === 'low').length,
      },
      totalMatchedEvents: results.reduce((sum, r) => sum + r.matchedEvents.length, 0),
      byTactic: this.countByTactic(results),
    };
  }

  private countByTactic(results: DetectionResult[]): Record<string, number> {
    const counts: Record<string, number> = {};

    results.forEach((result) => {
      result.mitre.tactics.forEach((tactic) => {
        counts[tactic] = (counts[tactic] || 0) + 1;
      });
    });

    return counts;
  }
}
