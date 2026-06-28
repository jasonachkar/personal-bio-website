import { QueryParser, QueryCompiler, parseAndCompileQuery } from '@/features/siem/lib/queryParser';
import type { SecurityEvent } from '@/features/siem/types';

describe('QueryParser', () => {
  let parser: QueryParser;

  beforeEach(() => {
    parser = new QueryParser();
  });

  describe('tokenization', () => {
    it('should tokenize simple queries', () => {
      const ast = parser.parse('eventType == "authentication"');
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('comparison');
      expect(ast?.field).toBe('eventType');
      expect(ast?.operator).toBe('==');
      expect(ast?.value).toBe('authentication');
    });

    it('should handle quoted strings with spaces', () => {
      const ast = parser.parse('description contains "failed login attempt"');
      expect(ast).not.toBeNull();
      expect(ast?.value).toBe('failed login attempt');
    });

    it('should handle dot notation fields', () => {
      const ast = parser.parse('actor.username == "admin"');
      expect(ast?.field).toBe('actor.username');
      expect(ast?.value).toBe('admin');
    });
  });

  describe('comparison operators', () => {
    it('should parse equality operator', () => {
      const ast = parser.parse('severity == "high"');
      expect(ast?.operator).toBe('==');
    });

    it('should parse inequality operator', () => {
      const ast = parser.parse('severity != "low"');
      expect(ast?.operator).toBe('!=');
    });

    it('should parse greater than operator', () => {
      const ast = parser.parse('count > "5"');
      expect(ast?.operator).toBe('>');
    });

    it('should parse less than operator', () => {
      const ast = parser.parse('count < "10"');
      expect(ast?.operator).toBe('<');
    });

    it('should parse contains operator', () => {
      const ast = parser.parse('description contains "malware"');
      expect(ast?.operator).toBe('contains');
    });

    it('should parse startswith operator', () => {
      const ast = parser.parse('filename startswith "malicious"');
      expect(ast?.operator).toBe('startswith');
    });
  });

  describe('logical operators', () => {
    it('should parse AND operator', () => {
      const ast = parser.parse('eventType == "authentication" and severity == "high"');
      expect(ast?.type).toBe('logical');
      expect(ast?.operator).toBe('and');
      expect(ast?.left).toBeDefined();
      expect(ast?.right).toBeDefined();
    });

    it('should parse OR operator', () => {
      const ast = parser.parse('severity == "high" or severity == "critical"');
      expect(ast?.type).toBe('logical');
      expect(ast?.operator).toBe('or');
    });

    it('should handle multiple logical operators', () => {
      const ast = parser.parse('eventType == "login" and severity == "high" or eventType == "admin"');
      expect(ast?.type).toBe('logical');
      // Should parse left to right: (eventType == "login" and severity == "high") or eventType == "admin"
    });
  });

  describe('edge cases', () => {
    it('should return null for empty query', () => {
      expect(parser.parse('')).toBeNull();
      expect(parser.parse('   ')).toBeNull();
    });

    it('should handle queries without quotes', () => {
      const ast = parser.parse('eventType == authentication');
      expect(ast?.value).toBe('authentication');
    });
  });
});

describe('QueryCompiler', () => {
  let compiler: QueryCompiler;
  let parser: QueryParser;

  const mockEvent: SecurityEvent = {
    id: 'evt-1',
    timestamp: '2025-01-15T10:00:00Z',
    eventType: 'authentication',
    severity: 'high',
    source: {
      type: 'endpoint',
      name: 'workstation-001',
    },
    actor: {
      username: 'admin@example.com',
      ip: '192.168.1.100',
    },
    details: {
      action: 'failed_login',
      result: 'failure',
      description: 'Multiple failed login attempts detected',
    },
  };

  beforeEach(() => {
    compiler = new QueryCompiler();
    parser = new QueryParser();
  });

  describe('comparison compilation', () => {
    it('should compile equality comparison', () => {
      const ast = parser.parse('eventType == "authentication"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should compile inequality comparison', () => {
      const ast = parser.parse('eventType != "network"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should compile contains operator', () => {
      const ast = parser.parse('details.description contains "failed"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should compile startswith operator', () => {
      const ast = parser.parse('actor.username startswith "admin"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should handle case-insensitive contains', () => {
      const ast = parser.parse('details.description contains "FAILED"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });
  });

  describe('dot notation support', () => {
    it('should access nested object properties', () => {
      const ast = parser.parse('actor.username == "admin@example.com"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should access deeply nested properties', () => {
      const ast = parser.parse('details.action == "failed_login"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should return undefined for non-existent paths', () => {
      const ast = parser.parse('nonexistent.field == "value"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(false);
    });
  });

  describe('logical compilation', () => {
    it('should compile AND operator', () => {
      const ast = parser.parse('eventType == "authentication" and severity == "high"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should compile OR operator', () => {
      const ast = parser.parse('severity == "critical" or severity == "high"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should evaluate AND correctly when one condition fails', () => {
      const ast = parser.parse('eventType == "authentication" and severity == "low"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(false);
    });

    it('should evaluate OR correctly when both conditions fail', () => {
      const ast = parser.parse('severity == "critical" or severity == "medium"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(false);
    });
  });

  describe('null/undefined handling', () => {
    it('should handle null AST', () => {
      const predicate = compiler.compile(null);
      expect(predicate(mockEvent)).toBe(true);
    });

    it('should handle missing fields gracefully', () => {
      const ast = parser.parse('nonexistent == "value"');
      const predicate = compiler.compile(ast);
      expect(predicate(mockEvent)).toBe(false);
    });
  });
});

describe('parseAndCompileQuery', () => {
  const mockEvents: SecurityEvent[] = [
    {
      id: 'evt-1',
      timestamp: '2025-01-15T10:00:00Z',
      eventType: 'authentication',
      severity: 'high',
      source: { type: 'endpoint', name: 'ws-001' },
      actor: { username: 'admin@example.com' },
      details: { action: 'failed_login', result: 'failure' },
    },
    {
      id: 'evt-2',
      timestamp: '2025-01-15T10:05:00Z',
      eventType: 'network',
      severity: 'medium',
      source: { type: 'firewall', name: 'fw-001' },
      actor: { ip: '10.0.0.50' },
      details: { action: 'blocked', result: 'denied' },
    },
    {
      id: 'evt-3',
      timestamp: '2025-01-15T10:10:00Z',
      eventType: 'authentication',
      severity: 'critical',
      source: { type: 'endpoint', name: 'ws-002' },
      actor: { username: 'user@example.com' },
      details: { action: 'successful_login', result: 'success' },
    },
  ];

  it('should filter events by simple query', () => {
    const predicate = parseAndCompileQuery('eventType == "authentication"');
    const results = mockEvents.filter(predicate);
    expect(results).toHaveLength(2);
    expect(results.every((e) => e.eventType === 'authentication')).toBe(true);
  });

  it('should filter events by complex query with AND', () => {
    const predicate = parseAndCompileQuery('eventType == "authentication" and severity == "high"');
    const results = mockEvents.filter(predicate);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('evt-1');
  });

  it('should filter events by complex query with OR', () => {
    const predicate = parseAndCompileQuery('severity == "high" or severity == "critical"');
    const results = mockEvents.filter(predicate);
    expect(results).toHaveLength(2);
  });

  it('should handle queries with contains operator', () => {
    const predicate = parseAndCompileQuery('details.action contains "login"');
    const results = mockEvents.filter(predicate);
    expect(results).toHaveLength(2);
  });

  it('should return all events for empty query', () => {
    const predicate = parseAndCompileQuery('');
    const results = mockEvents.filter(predicate);
    expect(results).toHaveLength(3);
  });

  it('should filter by nested properties', () => {
    const predicate = parseAndCompileQuery('source.type == "endpoint"');
    const results = mockEvents.filter(predicate);
    expect(results).toHaveLength(2);
  });

  it('should handle combination of multiple conditions', () => {
    const predicate = parseAndCompileQuery(
      'eventType == "authentication" and severity == "critical" or details.action contains "blocked"'
    );
    const results = mockEvents.filter(predicate);
    expect(results.length).toBeGreaterThan(0);
  });
});
