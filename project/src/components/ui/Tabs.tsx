'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, variant = 'default', className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex gap-1',
        variant === 'pills' && 'p-1 rounded-lg bg-background-card/50',
        variant === 'underline' && 'border-b border-border',
        className
      )}
      role="tablist"
      aria-label="Content tabs"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'relative px-4 py-2 text-sm font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Default variant
              variant === 'default' && [
                'rounded-md',
                isActive ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-background-card',
              ],

              // Pills variant
              variant === 'pills' && [
                'rounded-md',
                isActive ? 'text-primary bg-background-elevated shadow-sm' : 'text-text-secondary hover:text-text-primary',
              ],

              // Underline variant
              variant === 'underline' && [
                'border-b-2 -mb-px',
                isActive ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-accent/50',
              ]
            )}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
          >
            <span className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
            </span>

            {/* Active indicator for pills variant */}
            {variant === 'pills' && isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary/5 rounded-md -z-10"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Tab panel component for content
interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ tabId, activeTab, children, className }: TabPanelProps) {
  if (activeTab !== tabId) return null;

  return (
    <motion.div
      id={`tabpanel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
