'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Loader2, Search, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { SiemProvider, useSiem } from '../context';
import { StatsOverview } from './StatsOverview';
import { EventsTable } from './EventsTable';
import { EventDetailModal } from './EventDetailModal';
import { DetectionsPanel } from './DetectionsPanel';
import { Timeline } from './Timeline';
import { AdvancedFilterBuilder } from './AdvancedFilterBuilder';
import { Tabs } from '@/components/ui/Tabs';
import { QueryEngine } from '../lib/queryEngine';
import type { SecurityEvent, DetectionResult } from '../types';

type TabId = 'events' | 'detections' | 'timeline' | 'query-builder';

function SiemConsoleContent() {
  const { state, dispatch } = useSiem();
  const [activeTab, setActiveTab] = useState<TabId>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [customQuery, setCustomQuery] = useState('');

  // Load events and run detections on mount
  useEffect(() => {
    async function loadData() {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        // Load events
        const eventsResponse = await fetch('/api/siem/events');
        if (!eventsResponse.ok) throw new Error('Failed to load events');
        const eventsData = await eventsResponse.json();
        dispatch({ type: 'SET_EVENTS', payload: eventsData.data.events });

        // Load rules
        const rulesResponse = await fetch('/api/siem/rules');
        if (!rulesResponse.ok) throw new Error('Failed to load rules');
        const rulesData = await rulesResponse.json();
        dispatch({ type: 'SET_RULES', payload: rulesData.data.rules });

        // Run detections
        const detectResponse = await fetch('/api/siem/detect', { method: 'POST' });
        if (!detectResponse.ok) throw new Error('Failed to run detections');
        const detectData = await detectResponse.json();
        dispatch({ type: 'SET_DETECTIONS', payload: detectData.detections });
      } catch (error) {
        console.error('Error loading SIEM data:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to load data',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    loadData();
  }, [dispatch]);

  // Filter events based on search query and custom query
  useEffect(() => {
    let results = state.events;

    // Apply custom KQL query if present
    if (customQuery.trim()) {
      try {
        const queryEngine = new QueryEngine(state.events);
        results = queryEngine.executeQuery(customQuery);
      } catch (error) {
        console.error('Query execution error:', error);
        // Fall back to showing all events if query fails
      }
    }

    // Apply text search on top of query results
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((event) => {
        const searchableText = JSON.stringify(event).toLowerCase();
        return searchableText.includes(query);
      });
    }

    setFilteredEvents(results);
  }, [searchQuery, customQuery, state.events]);

  const handleCustomQuery = (query: string) => {
    setCustomQuery(query);
    setActiveTab('events'); // Switch to events tab to see results
  };

  const handleEventClick = (event: SecurityEvent) => {
    dispatch({ type: 'SELECT_EVENT', payload: event });
  };

  const handleEventClickById = (eventId: string) => {
    const event = state.events.find((e) => e.id === eventId);
    if (event) {
      dispatch({ type: 'SELECT_EVENT', payload: event });
      setActiveTab('events');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(
      {
        events: filteredEvents,
        detections: state.detections,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siem-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-text-primary">Loading SIEM Data...</p>
          <p className="text-sm text-text-secondary mt-2">
            Analyzing security events and running detections
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="rounded-lg border border-severity-critical/30 bg-severity-critical/5 p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-severity-critical mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Error Loading Data</h3>
        <p className="text-sm text-text-secondary">{state.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">SIEM Detection Console</h1>
          </div>
          <p className="text-text-secondary">
            Real-time security event monitoring and threat detection powered by custom detection rules
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          aria-label="Export data"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Stats Overview */}
      <StatsOverview events={state.events} detections={state.detections} />

      {/* Main Content */}
      <div className="rounded-lg border border-border bg-background-card p-6">
        {/* Tabs */}
        <Tabs
          tabs={[
            { id: 'events', label: 'Security Events' },
            { id: 'detections', label: 'Active Detections' },
            { id: 'timeline', label: 'Timeline View' },
            { id: 'query-builder', label: 'Query Builder' },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TabId)}
          variant="underline"
          className="mb-6"
        />

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by any field (event type, username, IP, etc.)..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>
                {filteredEvents.length === state.events.length
                  ? `Showing all ${state.events.length} events`
                  : `Found ${filteredEvents.length} of ${state.events.length} events`}
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Events Table */}
            <EventsTable events={filteredEvents} onEventClick={handleEventClick} />
          </div>
        )}

        {/* Detections Tab */}
        {activeTab === 'detections' && (
          <DetectionsPanel detections={state.detections} onEventClick={handleEventClickById} />
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <Timeline events={filteredEvents} onEventClick={handleEventClick} />
        )}

        {/* Query Builder Tab */}
        {activeTab === 'query-builder' && (
          <AdvancedFilterBuilder onQueryChange={handleCustomQuery} />
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={state.selectedEvent}
        onClose={() => dispatch({ type: 'SELECT_EVENT', payload: null })}
      />
    </div>
  );
}

export function SiemDetectionConsole({ className }: { className?: string }) {
  return (
    <SiemProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn('container mx-auto px-4 py-8', className)}
      >
        <SiemConsoleContent />
      </motion.div>
    </SiemProvider>
  );
}
