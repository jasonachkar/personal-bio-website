import { motion } from 'framer-motion';
import { heroCopy, heroCtas, heroStats } from '../../data/hero';
import type { SectionId } from '../../data/types';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

type HeroProps = {
  onNavigate: (id: SectionId) => void;
};

const codeLines = [
  { key: 'stack', label: 'stack', value: 'react + typescript + vite + tailwind + framer-motion' },
  { key: 'security', label: 'security', value: 'owasp + sigma + mitre att&ck + detections' },
  { key: 'lab', label: 'lab', value: 'playcanvas + r3f + siem widgets + chaos drills' },
];

const Hero = ({ onNavigate }: HeroProps) => {
  const handleCta = (href: string) => {
    if (href.startsWith('#')) {
      onNavigate(href.replace('#', '') as SectionId);
      return;
    }
    window.open(href, '_blank', 'noreferrer');
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(124,255,228,0.08),_rgba(5,6,11,0)),radial-gradient(circle_at_70%_20%,_rgba(161,102,255,0.12),_rgba(5,6,11,0)_35%)] pb-20 pt-36 md:pb-28 md:pt-40"
    >
      <div className="absolute inset-0 bg-grid bg-[size:120px_120px] opacity-20" aria-hidden="true" />
      <div className="absolute inset-x-0 top-16 flex justify-center" aria-hidden="true">
        <div className="h-28 w-28 rounded-full bg-primary/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {heroCopy.title}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
                {heroCopy.name}
                <span className="mt-2 block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {heroCopy.tagline}
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">{heroCopy.blurb}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {heroCtas.map((cta) => (
                <Button
                  key={cta.label}
                  variant={cta.kind === 'primary' ? 'primary' : 'ghost'}
                  onClick={() => handleCta(cta.href)}
                >
                  {cta.label}
                </Button>
              ))}
              <Button variant="secondary" onClick={() => onNavigate('contact')}>
                Let&apos;s collaborate
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-slate-300">
              <Badge label="OWASP" />
              <Badge label="Elastic & Sigma" />
              <Badge label="React" />
              <Badge label="PlayCanvas" />
              <Badge label="Framer Motion" />
            </div>
          </div>

          <Card className="glass-panel gradient-border relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,255,228,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(161,102,255,0.12),transparent_32%)]" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="font-mono">~/soc/init.sh</span>
                <span className="flex items-center gap-2 text-primary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  live
                </span>
              </div>
              <div className="rounded-xl bg-black/70 p-4 font-mono text-sm text-primary/80">
                {codeLines.map((line) => (
                  <div key={line.key} className="flex gap-2 py-1">
                    <span className="text-slate-500">const</span>
                    <span className="text-white">{line.label}</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-accent">"{line.value}"</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-primary/60" />
                  audited dependencies • telemetry-first pipelines • chaos drills
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="text-xs uppercase tracking-wide text-primary">{stat.label}</div>
                    <p className="mt-1 text-[11px] text-slate-400">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
