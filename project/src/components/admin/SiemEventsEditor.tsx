'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

interface SiemEvent {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  [key: string]: any;
}

interface SiemEventsEditorProps {
  initialEvents: SiemEvent[];
  onSave: (events: SiemEvent[]) => Promise<void>;
}

export function SiemEventsEditor({ initialEvents, onSave }: SiemEventsEditorProps) {
  const [events, setEvents] = useState<SiemEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<SiemEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleEdit = (event: SiemEvent) => {
    setSelectedEvent(event);
    setEditData(JSON.stringify(event, null, 2));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedEvent) return;

    try {
      const updatedEvent = JSON.parse(editData);
      const updatedEvents = events.map((e) =>
        e.id === selectedEvent.id ? updatedEvent : e
      );

      setSaving(true);
      await onSave(updatedEvents);
      setEvents(updatedEvents);
      setIsEditing(false);
      setSelectedEvent(null);
    } catch (error) {
      alert('Invalid JSON format');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const updatedEvents = events.filter((e) => e.id !== eventId);
    setSaving(true);
    await onSave(updatedEvents);
    setEvents(updatedEvents);
    setSaving(false);
  };

  const handleAddNew = () => {
    const newEvent: SiemEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'custom',
      severity: 'medium',
      source: { type: 'custom', name: 'Custom Event', agent: 'manual' },
      actor: { username: 'user@example.com' },
      details: { action: 'custom_action', result: 'success' },
    };

    setSelectedEvent(newEvent);
    setEditData(JSON.stringify(newEvent, null, 2));
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">SIEM Events Management</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all',
                selectedEvent?.id === event.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
              onClick={() => !isEditing && setSelectedEvent(event)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-text-primary">{event.eventType}</h3>
                  <p className="text-xs text-text-secondary">{event.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded font-medium',
                      event.severity === 'critical'
                        ? 'bg-severity-critical/20 text-severity-critical'
                        : event.severity === 'high'
                        ? 'bg-severity-high/20 text-severity-high'
                        : event.severity === 'medium'
                        ? 'bg-severity-medium/20 text-severity-medium'
                        : 'bg-severity-low/20 text-severity-low'
                    )}
                  >
                    {event.severity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(event.id);
                    }}
                    className="p-1 rounded hover:bg-severity-critical/10 text-text-secondary hover:text-severity-critical transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Editor */}
        <div className="rounded-lg border border-border bg-background-card p-4">
          {selectedEvent && isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">
                  Edit Event: {selectedEvent.id}
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEvent(null);
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
          ) : selectedEvent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">Event Details</h3>
                <button
                  onClick={() => handleEdit(selectedEvent)}
                  className="px-3 py-1 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Edit
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-background border border-border text-xs text-text-secondary overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-text-secondary">
              <p>Select an event to view details</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-background-card border border-border">
        <p className="text-sm text-text-secondary">
          <strong>Note:</strong> Changes are saved to the content file. Ensure the JSON structure
          matches the schema for events to be properly validated.
        </p>
      </div>
    </div>
  );
}
