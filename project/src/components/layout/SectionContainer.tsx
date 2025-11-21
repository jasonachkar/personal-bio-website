import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionContainerProps {
  id?: string;
  children: ReactNode;
  className?: string;
  background?: 'default' | 'grid' | 'elevated';
}

export function SectionContainer({
  id,
  children,
  className,
  background = 'default',
}: SectionContainerProps) {
  const backgrounds = {
    default: 'bg-background',
    grid: 'bg-background bg-grid bg-grid',
    elevated: 'bg-background-elevated',
  };

  return (
    <section
      id={id}
      className={cn(
        'relative min-h-screen w-full py-20',
        backgrounds[background],
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
