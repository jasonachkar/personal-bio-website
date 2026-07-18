'use client';

import { motion } from 'framer-motion';
import {
  Layers,
  Network,
  ShieldCheck,
  Boxes,
  KeyRound,
  GitBranch,
  ExternalLink,
  Star,
  type LucideIcon,
} from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { secureObs } from '@/data/secureobs';
import { cn } from '@/lib/cn';

const pillarIcons: Record<string, LucideIcon> = {
  Layers,
  Network,
  ShieldCheck,
  Boxes,
  KeyRound,
  GitBranch,
};

/**
 * Full-width featured spotlight for SecureObs, rendered at the top of the
 * Projects section ahead of the standard project grid.
 */
export function SecureObsSpotlight() {
  return (
    <Card
      variant="elevated"
      hoverEffect="none"
      interactive={false}
      padding="none"
      className="bg-background-elevated/70"
    >
      <div className="p-5 sm:p-7 md:p-9">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={cn(
              'inline-flex items-center gap-1.5',
              'rounded-full border border-primary/30 bg-primary/10',
              'px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary'
            )}
          >
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Featured Project
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5',
              'rounded-full border border-severity-low/30 bg-severity-low/10',
              'px-3 py-1 text-xs font-semibold text-severity-low'
            )}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-severity-low opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-severity-low" />
            </span>
            {secureObs.status}
          </span>
        </div>

        {/* Title + summary */}
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-text-primary sm:text-3xl">
              {secureObs.name}
              <span className="ml-3 text-base font-medium text-primary sm:text-lg">
                {secureObs.tagline}
              </span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {secureObs.summary}
            </p>
          </div>

          <motion.a
            href={secureObs.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'inline-flex flex-shrink-0 items-center gap-2',
              'rounded-xl bg-primary px-5 py-3',
              'text-sm font-semibold text-background',
              'shadow-button transition-all duration-200',
              'hover:bg-primary-hover hover:shadow-button-hover'
            )}
          >
            Visit SecureObs
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </motion.a>
        </div>

        {/* Stats */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {secureObs.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-background-card p-3.5 sm:p-4"
            >
              <div className="text-2xl font-black text-primary sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted sm:text-[11px]">
                {stat.label}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary sm:text-xs">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {secureObs.pillars.map((pillar) => {
            const Icon = pillarIcons[pillar.icon] ?? ShieldCheck;
            return (
              <div
                key={pillar.title}
                className={cn(
                  'rounded-xl border border-border bg-background-card p-4',
                  'transition-colors duration-200 hover:border-primary/30'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary">{pillar.title}</h4>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-text-secondary">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tech stack */}
        <div className="mt-7 space-y-3">
          {secureObs.techStack.map((group) => (
            <div key={group.group} className="flex flex-wrap items-center gap-2">
              <span className="w-24 flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                {group.group}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Badge key={item} label={item} variant="default" size="xs" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default SecureObsSpotlight;
