'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { cn } from '@/lib/cn';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const domains = [
  'Cloud Security (Azure)',
  'Detection Engineering',
  'AppSec / OWASP',
  'IAM & Zero Trust',
  'Threat Modeling',
  'DevSecOps / CI-CD',
  'Incident Response',
];

const scores = [88, 82, 85, 80, 78, 83, 70];

function cssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Radar chart of security domain coverage rendered with Chart.js.
 * Re-renders when the site theme toggles so colors track CSS variables.
 */
export function SecurityRadar({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [themeVersion, setThemeVersion] = useState(0);

  // Re-create the chart when the `dark` class flips on <html>.
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeVersion((v) => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isDark = document.documentElement.classList.contains('dark');
    const primary = cssVar('--primary', '#00d4ff');
    const textSecondary = cssVar('--text-secondary', isDark ? '#94a3b8' : '#475569');
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.14)' : 'rgba(71, 85, 105, 0.16)';

    const chart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: domains,
        datasets: [
          {
            label: 'Coverage',
            data: scores,
            fill: false,
            borderColor: primary,
            borderWidth: 2,
            pointBackgroundColor: primary,
            pointBorderColor: primary,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0d1117',
            borderColor: gridColor,
            borderWidth: 1,
            titleColor: textSecondary,
            bodyColor: primary,
            displayColors: false,
          },
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: {
              color: textSecondary,
              font: { size: 11, family: 'ui-monospace, monospace' },
            },
            ticks: {
              display: true,
              stepSize: 25,
              color: textSecondary,
              backdropColor: 'transparent',
              font: { size: 9 },
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [themeVersion]);

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-background-elevated/60 p-4 sm:p-6',
        className
      )}
    >
      <h3 className="mb-4 text-center text-lg font-semibold text-text-primary">
        Security Domain Coverage
      </h3>
      <div className="relative h-[320px] w-full sm:h-[380px]">
        <canvas ref={canvasRef} role="img" aria-label="Radar chart of security domain coverage" />
      </div>
    </div>
  );
}

export default SecurityRadar;
