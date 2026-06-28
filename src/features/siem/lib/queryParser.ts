import type { SecurityEvent, QueryNode, EventPredicate } from '../types';

/**
 * Simplified KQL-like Query Parser
 * Supports: ==, !=, >, <, >=, <=, contains, and, or
 * Example: eventType == "authentication" and severity == "high"
 */

export class QueryParser {
  private tokens: string[] = [];
  private current = 0;

  parse(query: string): QueryNode | null {
    if (!query || query.trim() === '') return null;

    // Tokenize
    this.tokens = this.tokenize(query);
    this.current = 0;

    try {
      return this.parseExpression();
    } catch (error) {
      console.error('Query parse error:', error);
      return null;
    }
  }

  private tokenize(query: string): string[] {
    // Simple tokenization: split by whitespace, preserve quoted strings
    const tokens: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < query.length; i++) {
      const char = query[i];

      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) tokens.push(current);
    return tokens;
  }

  private parseExpression(): QueryNode {
    let left = this.parseComparison();

    while (this.current < this.tokens.length) {
      const token = this.tokens[this.current];

      if (token === 'and' || token === 'or') {
        this.current++;
        const right = this.parseComparison();
        left = {
          type: 'logical',
          operator: token,
          left,
          right,
        };
      } else {
        break;
      }
    }

    return left;
  }

  private parseComparison(): QueryNode {
    const field = this.tokens[this.current++];
    const operator = this.tokens[this.current++];
    let value = this.tokens[this.current++];

    // Remove quotes from value
    if (value && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    return {
      type: 'comparison',
      operator: operator as any,
      field,
      value,
    };
  }
}

/**
 * Query Compiler - Converts AST to executable predicate
 */
export class QueryCompiler {
  compile(node: QueryNode | null): EventPredicate {
    if (!node) {
      return () => true; // No filter
    }

    if (node.type === 'comparison') {
      return this.compileComparison(node);
    } else if (node.type === 'logical') {
      return this.compileLogical(node);
    }

    return () => true;
  }

  private compileComparison(node: QueryNode): EventPredicate {
    return (event: SecurityEvent) => {
      const fieldValue = this.getFieldValue(event, node.field!);
      const compareValue = node.value;

      switch (node.operator) {
        case '==':
          return fieldValue === compareValue;
        case '!=':
          return fieldValue !== compareValue;
        case '>':
          return fieldValue > compareValue;
        case '<':
          return fieldValue < compareValue;
        case '>=':
          return fieldValue >= compareValue;
        case '<=':
          return fieldValue <= compareValue;
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());
        case 'startswith':
          return String(fieldValue).toLowerCase().startsWith(String(compareValue).toLowerCase());
        case 'endswith':
          return String(fieldValue).toLowerCase().endsWith(String(compareValue).toLowerCase());
        default:
          return false;
      }
    };
  }

  private compileLogical(node: QueryNode): EventPredicate {
    const leftPredicate = this.compile(node.left!);
    const rightPredicate = this.compile(node.right!);

    if (node.operator === 'and') {
      return (event) => leftPredicate(event) && rightPredicate(event);
    } else if (node.operator === 'or') {
      return (event) => leftPredicate(event) || rightPredicate(event);
    }

    return () => false;
  }

  private getFieldValue(event: SecurityEvent, field: string): any {
    // Support dot notation: actor.username, details.result, etc.
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
}

// Export simplified API
export function parseAndCompileQuery(query: string): EventPredicate {
  const parser = new QueryParser();
  const compiler = new QueryCompiler();

  const ast = parser.parse(query);
  return compiler.compile(ast);
}
