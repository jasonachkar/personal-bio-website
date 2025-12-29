'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, X, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface DetectionRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  query: string;
  [key: string]: any;
}

interface DetectionRulesEditorProps {
  initialRules: DetectionRule[];
  onSave: (rules: DetectionRule[]) => Promise<void>;
}

export function DetectionRulesEditor({ initialRules, onSave }: DetectionRulesEditorProps) {
  const [rules, setRules] = useState<DetectionRule[]>(initialRules);
  const [selectedRule, setSelectedRule] = useState<DetectionRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleEdit = (rule: DetectionRule) => {
    setSelectedRule(rule);
    setEditData(JSON.stringify(rule, null, 2));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedRule) return;

    try {
      const updatedRule = JSON.parse(editData);
      const updatedRules = rules.map((r) =>
        r.id === selectedRule.id ? updatedRule : r
      );

      setSaving(true);
      await onSave(updatedRules);
      setRules(updatedRules);
      setIsEditing(false);
      setSelectedRule(null);
    } catch (error) {
      alert('Invalid JSON format');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    const updatedRules = rules.filter((r) => r.id !== ruleId);
    setSaving(true);
    await onSave(updatedRules);
    setRules(updatedRules);
    setSaving(false);
  };

  const handleToggleEnabled = async (ruleId: string) => {
    const updatedRules = rules.map((r) =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    );

    setSaving(true);
    await onSave(updatedRules);
    setRules(updatedRules);
    setSaving(false);
  };

  const handleAddNew = () => {
    const newRule: DetectionRule = {
      id: `rule-${Date.now()}`,
      name: 'New Detection Rule',
      description: 'Custom detection rule',
      severity: 'medium',
      enabled: true,
      mitre: {
        tactics: ['Discovery'],
        techniques: ['T1083'],
      },
      query: 'eventType == "custom"',
      author: 'Admin',
      createdAt: new Date().toISOString(),
      tags: ['custom'],
    };

    setSelectedRule(newRule);
    setEditData(JSON.stringify(newRule, null, 2));
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Detection Rules Management</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all',
                selectedRule?.id === rule.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                !rule.enabled && 'opacity-60'
              )}
              onClick={() => !isEditing && setSelectedRule(rule)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{rule.name}</h3>
                  <p className="text-xs text-text-secondary mt-1">{rule.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleEnabled(rule.id);
                    }}
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                      rule.enabled
                        ? 'bg-severity-low/20 text-severity-low'
                        : 'bg-text-secondary/20 text-text-secondary'
                    )}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(rule.id);
                    }}
                    className="p-1 rounded hover:bg-severity-critical/10 text-text-secondary hover:text-severity-critical transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-2 line-clamp-2">{rule.description}</p>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded font-medium',
                    rule.severity === 'critical'
                      ? 'bg-severity-critical/20 text-severity-critical'
                      : rule.severity === 'high'
                      ? 'bg-severity-high/20 text-severity-high'
                      : rule.severity === 'medium'
                      ? 'bg-severity-medium/20 text-severity-medium'
                      : 'bg-severity-low/20 text-severity-low'
                  )}
                >
                  {rule.severity}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Editor */}
        <div className="rounded-lg border border-border bg-background-card p-4">
          {selectedRule && isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">
                  Edit Rule: {selectedRule.name}
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedRule(null);
                  }}
                  className="p-1 rounded hover:bg-background transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
                className="w-full h-96 px-3 py-2 rounded-lg border border-border bg-background text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                spellCheck={false}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-background transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedRule ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">Rule Details</h3>
                <button
                  onClick={() => handleEdit(selectedRule)}
                  className="px-3 py-1 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Edit
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-background border border-border text-xs text-text-secondary overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(selectedRule, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-text-secondary">
              <p>Select a rule to view details</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-background-card border border-border">
        <p className="text-sm text-text-secondary">
          <strong>Note:</strong> Detection rules support KQL-like query syntax. Include MITRE ATT&CK
          tactics and techniques for proper threat categorization.
        </p>
      </div>
    </div>
  );
}
