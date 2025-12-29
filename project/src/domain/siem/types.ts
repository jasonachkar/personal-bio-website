// SIEM Type Definitions

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EventResult = 'success' | 'failure' | 'blocked';
export type SourceType = 'endpoint' | 'network' | 'application' | 'cloud';

export interface EventSource {
  type: SourceType;
  name: string;
  agent?: string;
}

export interface Actor {
  username?: string;
  userId?: string;
  ipAddress?: string;
  hostname?: string;
  processName?: string;
  processId?: number;
}

export interface Target {
  resource?: string;
  hostname?: string;
  ipAddress?: string;
  port?: number;
  protocol?: string;
}

export interface EventDetails {
  action: string;
  result: EventResult;
  reason?: string;
  [key: string]: any; // Flexible for event-specific fields
}

export interface EventEnrichment {
  mitreTactics?: string[];
  mitreTechniques?: string[];
  riskScore?: number;
  tags?: string[];
}

export interface SecurityEvent {
  id: string;
  timestamp: string; // ISO 8601
  eventType: string;
  severity: EventSeverity;
  source: EventSource;
  actor: Actor;
  target?: Target;
  details: EventDetails;
  enrichment?: EventEnrichment;
  rawLog?: string;
}

// Detection Rule Types

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  severity: EventSeverity;
  enabled: boolean;

  // MITRE ATT&CK mapping
  mitre: {
    tactics: string[];
    techniques: string[];
  };

  // Detection logic
  query: string; // KQL-like query

  // Time-based conditions
  timeWindow?: {
    duration: number; // in seconds
    threshold: number; // minimum event count
    groupBy?: string[]; // fields to group by
  };

  // Metadata
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];

  // Alert configuration
  alertTemplate?: {
    title: string;
    description: string;
    recommendations: string[];
  };
}

// Detection Result Types

export interface DetectionResult {
  ruleId: string;
  ruleName: string;
  severity: EventSeverity;
  matchedEvents: SecurityEvent[];
  triggeredAt: string;
  mitre: {
    tactics: string[];
    techniques: string[];
  };
  description?: string;
  recommendations?: string[];
}

// Filter Types

export interface EventFilters {
  searchQuery?: string;
  severities?: EventSeverity[];
  sourceTypes?: SourceType[];
  eventTypes?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  customQuery?: string;
}

// Query AST Types (for query parser)

export type QueryOperator =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'contains'
  | 'startswith'
  | 'endswith'
  | 'in'
  | '!in'
  | 'matches';

export type LogicalOperator = 'and' | 'or' | 'not';

export interface QueryNode {
  type: 'comparison' | 'logical';
  operator?: QueryOperator | LogicalOperator;
  field?: string;
  value?: any;
  left?: QueryNode;
  right?: QueryNode;
}

export type EventPredicate = (event: SecurityEvent) => boolean;

// Export types for CSV/JSON

export interface ExportOptions {
  format: 'csv' | 'json';
  type: 'events' | 'detections';
  data: SecurityEvent[] | DetectionResult[];
}
