'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';
import Card from '@/components/ui/Card';
import type { Threat, ThreatModelComponent } from '../types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scrollVariants } from '@/utils/animations';

interface ThreatMatrixProps {
  threats: Threat[];
  components: ThreatModelComponent[];
  className?: string;
}

export function ThreatMatrix({ threats, components, className }: ThreatMatrixProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = useMemo(
    () => (prefersReducedMotion ? {} : scrollVariants.fadeUp),
    [prefersReducedMotion]
  );

  const strideCategories = [
    'spoofing',
    'tampering',
    'repudiation',
    'information-disclosure',
    'denial-of-service',
    'elevation-of-privilege',
  ];

  const matrix = useMemo(() => {
    const matrixData: Record<string, Record<string, number>> = {};
    
    strideCategories.forEach(category => {
      matrixData[category] = {};
      components.forEach(comp => {
        const count = threats.filter(
          t => t.category === category && t.affectedComponents.includes(comp.id)
        ).length;
        matrixData[category][comp.id] = count;
      });
    });

    return matrixData;
  }, [threats, components, strideCategories]);

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-background-card';
    if (count === 1) return 'bg-severity-low/30';
    if (count === 2) return 'bg-severity-medium/40';
    if (count >= 3) return 'bg-severity-high/50';
    return 'bg-background-card';
  };

  return (
    <Card className={cn('p-6', className)}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Grid className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">STRIDE Threat Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-text-secondary p-2 border border-border">
                  STRIDE Category
                </th>
                {components.map(comp => (
                  <th
                    key={comp.id}
                    className="text-center text-xs font-semibold text-text-secondary p-2 border border-border min-w-[100px]"
                    title={comp.name}
                  >
                    <div className="truncate">{comp.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {strideCategories.map(category => (
                <tr key={category}>
                  <td className="text-xs font-medium text-text-primary p-2 border border-border bg-background-elevated capitalize">
                    {category.replace(/-/g, ' ')}
                  </td>
                  {components.map(comp => {
                    const count = matrix[category]?.[comp.id] || 0;
                    return (
                      <td
                        key={comp.id}
                        className={cn(
                          'text-center text-xs font-bold p-2 border border-border transition-colors',
                          getIntensity(count)
                        )}
                      >
                        {count > 0 ? count : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Card>
  );
}

