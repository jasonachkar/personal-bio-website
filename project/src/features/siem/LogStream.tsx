'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SiemLog } from './types';
import { getRandomLog } from './mockSiemData';

interface LogStreamProps {
  initialLogs: SiemLog[];
}

export function LogStream({ initialLogs }: LogStreamProps) {
  const [logs, setLogs] = useState<SiemLog[]>(initialLogs);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [getRandomLog(), ...prev].slice(0, 15));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [logs.length]);

  return (
    <div
      ref={containerRef}
      className="h-[320px] overflow-hidden rounded-xl border border-border bg-background-card"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_0_5px_rgba(124,255,228,0.15)]" />
          Live log stream
        </div>
        <span className="text-[10px] text-text-secondary">Refresh 2s</span>
      </div>
      <div className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-[auto,1fr,auto] gap-3 px-4 py-3"
            >
              <span className="text-[11px] font-mono text-primary">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div className="space-y-1">
                <p className="text-sm text-text-primary">{log.message}</p>
                <p className="text-[11px] text-text-secondary">
                  {log.source} • {log.ip ?? 'n/a'} {log.user ? `• ${log.user}` : ''}
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted">{log.level}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
