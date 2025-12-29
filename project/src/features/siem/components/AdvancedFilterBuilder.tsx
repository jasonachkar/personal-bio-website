'use client';

import { useState } from 'react';
import { Plus, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFilterBuilderProps {
  onQueryChange: (query: string) => void;
  className?: string;
}

const FIELDS = [
  { value: 'eventType', label: 'Event Type' },
  { value: 'severity', label: 'Severity' },
  { value: 'source.type', label: 'Source Type' },
  { value: 'actor.username', label: 'Username' },
  { value: 'actor.ipAddress', label: 'IP Address' },
  { value: 'actor.hostname', label: 'Hostname' },
  { value: 'target.resource', label: 'Target Resource' },
  { value: 'details.action', label: 'Action' },
  { value: 'details.result', label: 'Result' },
];

const OPERATORS = [
  { value: '==', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startswith', label: 'Starts With' },
  { value: 'endswith', label: 'Ends With' },
];

const SEVERITY_VALUES = ['critical', 'high', 'medium', 'low'];
const SOURCE_TYPES = ['endpoint', 'network', 'application', 'cloud'];
const RESULTS = ['success', 'failure', 'blocked'];

export function AdvancedFilterBuilder({ onQueryChange, className }: AdvancedFilterBuilderProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { id: '1', field: 'eventType', operator: '==', value: '' },
  ]);
  const [logicalOperator, setLogicalOperator] = useState<'and' | 'or'>('and');

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now().toString(),
        field: 'eventType',
        operator: '==',
        value: '',
      },
    ]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((c) => c.id !== id));
    }
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const buildQuery = () => {
    const parts = conditions
      .filter((c) => c.value.trim() !== '')
      .map((c) => {
        const needsQuotes = c.operator === '==' || c.operator === '!=' || c.operator.includes('with');
        const value = needsQuotes ? `"${c.value}"` : c.value;
        return `${c.field} ${c.operator} ${value}`;
      });

    return parts.join(` ${logicalOperator} `);
  };

  const handleExecute = () => {
    const query = buildQuery();
    onQueryChange(query);
  };

  const getSuggestions = (field: string): string[] => {
    if (field === 'severity') return SEVERITY_VALUES;
    if (field === 'source.type') return SOURCE_TYPES;
    if (field === 'details.result') return RESULTS;
    return [];
  };

  return (
    <div className={cn('rounded-lg border border-border bg-background-card p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Advanced Query Builder</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Combine with:</span>
          <button
            onClick={() => setLogicalOperator('and')}
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              logicalOperator === 'and'
                ? 'bg-primary text-white'
                : 'bg-background text-text-secondary hover:bg-background/80'
            )}
          >
            AND
          </button>
          <button
            onClick={() => setLogicalOperator('or')}
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              logicalOperator === 'or'
                ? 'bg-primary text-white'
                : 'bg-background text-text-secondary hover:bg-background/80'
            )}
          >
            OR
          </button>
        </div>
      </div>

      {/* Conditions */}
      <div className="space-y-3 mb-6">
        <AnimatePresence mode="popLayout">
          {conditions.map((condition, index) => (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2"
            >
              {/* Condition Number */}
              {index > 0 && (
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary pt-3">
                  <span className="uppercase">{logicalOperator}</span>
                </div>
              )}

              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                {/* Field */}
                <select
                  value={condition.field}
                  onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                  className="md:col-span-4 px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {FIELDS.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>

                {/* Operator */}
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                  className="md:col-span-3 px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>

                {/* Value */}
                {getSuggestions(condition.field).length > 0 ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    className="md:col-span-4 px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select value...</option>
                    {getSuggestions(condition.field).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    placeholder="Enter value..."
                    className="md:col-span-4 px-3 py-2 rounded-lg border border-border bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeCondition(condition.id)}
                  disabled={conditions.length === 1}
                  className={cn(
                    'md:col-span-1 p-2 rounded-lg transition-colors',
                    conditions.length === 1
                      ? 'text-text-secondary/30 cursor-not-allowed'
                      : 'text-text-secondary hover:bg-severity-critical/10 hover:text-severity-critical'
                  )}
                  aria-label="Remove condition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={addCondition}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-text-primary hover:bg-background/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Condition
        </button>

        <button
          onClick={handleExecute}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          <Play className="h-4 w-4" />
          Execute Query
        </button>
      </div>

      {/* Generated Query Preview */}
      {buildQuery() && (
        <div className="mt-6 p-4 rounded-lg bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Generated Query:</span>
            <button
              onClick={() => navigator.clipboard.writeText(buildQuery())}
              className="text-sm text-primary hover:underline"
            >
              Copy
            </button>
          </div>
          <code className="text-sm text-text-primary font-mono break-all">
            {buildQuery()}
          </code>
        </div>
      )}
    </div>
  );
}
