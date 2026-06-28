# Unit Tests

This directory contains comprehensive unit tests for the cybersecurity portfolio application.

## Installation

Before running tests, install Jest dependencies:

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers the following modules with **80%+ code coverage targets**:

### SIEM Features

#### Query Parser (`queryParser.test.ts`)
- **Tokenization**: Parsing of KQL-like queries with proper quote handling
- **Operators**: All comparison operators (==, !=, >, <, >=, <=, contains, startswith, endswith)
- **Logical Operators**: AND, OR with proper precedence
- **Dot Notation**: Support for nested object properties (e.g., `actor.username`)
- **Edge Cases**: Empty queries, malformed syntax, null handling
- **Query Compilation**: AST to executable predicate function

**Test Scenarios**: 20+ test cases covering valid queries, invalid syntax, nested properties, and logical combinations.

#### Query Engine (`queryEngine.test.ts`)
- **Indexing**: Automatic index building for fast lookups (eventType, severity, source.type)
- **Query Execution**: Filter events using KQL-like queries
- **Multi-Filter Support**: Combine custom queries, search, severity, source type, event type, and date range
- **Statistics**: Calculate aggregate stats (counts by severity, event type, source type, date range)
- **Sorting**: Sort events by any field (timestamp, severity, etc.)
- **Performance**: Handles 1000+ events efficiently with indexing

**Test Scenarios**: 30+ test cases covering indexing, filtering, statistics, sorting, and performance.

#### Detection Engine (`detectionEngine.test.ts`)
- **Rule Execution**: Run detection rules against event datasets
- **Simple Rules**: Query-based detection (e.g., "detect all failed logins")
- **Time Window Rules**: Sliding window detection with thresholds (e.g., "5+ failed logins in 5 minutes")
- **Grouping**: Group events by fields (e.g., by username, by IP) for aggregated detection
- **MITRE ATT&CK Mapping**: Include tactics and techniques in detection results
- **Alert Templates**: Support for custom alert descriptions and recommendations
- **Severity Sorting**: Results sorted by severity (critical first)
- **Performance**: Handles 10,000+ events and time window detection efficiently

**Test Scenarios**: 35+ test cases covering simple rules, time windows, grouping, edge cases, and performance.

## Test Structure

```
src/__tests__/
├── README.md                          # This file
└── siem/
    ├── queryParser.test.ts           # Query parsing and compilation tests
    ├── queryEngine.test.ts           # Query engine and filtering tests
    └── detectionEngine.test.ts       # Detection rule execution tests
```

## Coverage Thresholds

The following coverage thresholds are enforced:

- **Branches**: 70%
- **Functions**: 75%
- **Lines**: 80%
- **Statements**: 80%

View detailed coverage report:

```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

## Writing Tests

### Best Practices

1. **Descriptive Test Names**: Use clear descriptions that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with setup, execution, and verification
3. **Mock Data**: Use realistic mock data that represents actual security events
4. **Edge Cases**: Test boundary conditions, empty inputs, and error scenarios
5. **Performance**: Include performance tests for computationally intensive operations

### Example Test

```typescript
describe('QueryEngine', () => {
  let engine: QueryEngine;
  const mockEvents: SecurityEvent[] = [
    // ... mock data
  ];

  beforeEach(() => {
    engine = new QueryEngine(mockEvents);
  });

  it('should filter events by severity', () => {
    // Arrange
    const query = 'severity == "high"';

    // Act
    const results = engine.executeQuery(query);

    // Assert
    expect(results.every(e => e.severity === 'high')).toBe(true);
  });
});
```

## CI/CD Integration

Tests are designed to run in CI/CD pipelines. Add to your GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Module not found errors**: Run `npm install` to ensure all dependencies are installed
2. **Type errors**: Ensure TypeScript is configured correctly (`tsconfig.json`)
3. **Mock errors**: Check that `jest.setup.js` is properly configured
4. **Timeout errors**: Increase Jest timeout for performance tests if needed

### Debug Mode

Run Jest with debugging:

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Future Test Additions

Planned test coverage for:

- [ ] Threat Modeling STRIDE engine
- [ ] Azure Blueprint security controls
- [ ] DevSecOps pipeline scan validation
- [ ] Admin panel CRUD operations
- [ ] Rate limiting and authentication
- [ ] Component integration tests
- [ ] E2E tests with Playwright

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
