'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { SecurityEvent } from '../types';

interface TimelineProps {
  events: SecurityEvent[];
  onEventClick: (event: SecurityEvent) => void;
  className?: string;
}

const severityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6',
};

export function Timeline({ events, onEventClick, className }: TimelineProps) {
  const { timelineData, minTime, maxTime, timeRange } = useMemo(() => {
    if (events.length === 0) {
      return { timelineData: [], minTime: 0, maxTime: 0, timeRange: 0 };
    }

    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const minTime = new Date(sortedEvents[0].timestamp).getTime();
    const maxTime = new Date(sortedEvents[sortedEvents.length - 1].timestamp).getTime();
    const timeRange = maxTime - minTime || 1; // Prevent division by zero

    return { timelineData: sortedEvents, minTime, maxTime, timeRange };
  }, [events]);

  if (events.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-background-card p-8 text-center', className)}>
        <p className="text-text-secondary">No events to display on timeline</p>
      </div>
    );
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPosition = (timestamp: string) => {
    const time = new Date(timestamp).getTime();
    return ((time - minTime) / timeRange) * 100;
  };

  // Group events by type for lanes
  const eventTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.eventType));
    return Array.from(types).sort();
  }, [events]);

  const getLaneIndex = (eventType: string) => {
    return eventTypes.indexOf(eventType);
  };

  const laneHeight = 60;
  const totalHeight = eventTypes.length * laneHeight;

  return (
    <div className={cn('rounded-lg border border-border bg-background-card p-6', className)}>
      <h3 className="text-lg font-semibold text-text-primary mb-6">Event Timeline</h3>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
        <span className="text-text-secondary">Severity:</span>
        {Object.entries(severityColors).map(([severity, color]) => (
          <div key={severity} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-text-secondary capitalize">{severity}</span>
          </div>
        ))}
      </div>

      {/* Timeline Container */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Time Labels */}
          <div className="flex justify-between mb-2 px-4 text-xs text-text-secondary">
            <span>{formatTime(timelineData[0].timestamp)}</span>
            <span>{formatTime(timelineData[timelineData.length - 1].timestamp)}</span>
          </div>

          {/* Timeline SVG */}
          <svg
            width="100%"
            height={totalHeight + 40}
            className="overflow-visible"
          >
            {/* Horizontal time axis */}
            <line
              x1="0"
              y1="20"
              x2="100%"
              y2="20"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
            />

            {/* Lane labels and separators */}
            {eventTypes.map((eventType, index) => {
              const y = 40 + index * laneHeight;
              return (
                <g key={eventType}>
                  {/* Lane separator */}
                  <line
                    x1="0"
                    y1={y - 10}
                    x2="100%"
                    y2={y - 10}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="text-border/50"
                  />
                  {/* Lane label */}
                  <text
                    x="10"
                    y={y + 5}
                    className="text-xs fill-current text-text-secondary"
                  >
                    {eventType.replace(/_/g, ' ')}
                  </text>
                </g>
              );
            })}

            {/* Event dots */}
            {timelineData.map((event, index) => {
              const x = `${getPosition(event.timestamp)}%`;
              const y = 40 + getLaneIndex(event.eventType) * laneHeight;
              const color = severityColors[event.severity];

              return (
                <motion.g
                  key={event.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01, duration: 0.2 }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onEventClick(event)}
                  >
                    <title>{`${event.eventType} - ${event.severity}\n${formatTime(event.timestamp)}`}</title>
                  </circle>
                  {/* Pulse animation for critical events */}
                  {event.severity === 'critical' && (
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill={color}
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Event type labels */}
          <div className="mt-4 flex flex-wrap gap-2">
            {eventTypes.map((eventType) => {
              const count = events.filter((e) => e.eventType === eventType).length;
              return (
                <span
                  key={eventType}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-background border border-border text-text-secondary"
                >
                  {eventType.replace(/_/g, ' ')} ({count})
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
