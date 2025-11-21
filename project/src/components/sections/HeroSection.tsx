'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Shield, Code2, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid bg-grid opacity-40"></div>
      <div className="absolute inset-0 bg-radial-glow"></div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute h-px w-full animate-scan bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block rounded-full border border-primary bg-primary/10 px-4 py-1.5 text-sm font-mono text-primary shadow-glow">
            &gt; System Online
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-6xl font-bold text-text-primary md:text-7xl lg:text-8xl"
        >
          <span className="bg-gradient-to-r from-primary via-primary-purple to-primary bg-clip-text text-transparent">
            Security
          </span>{' '}
          Engineer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 text-xl text-text-secondary md:text-2xl"
        >
          Full-Stack Developer " Cybersecurity Analyst " Game Developer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background-card px-4 py-2">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="text-sm text-text-secondary">Software Dev</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background-card px-4 py-2">
            <Shield className="h-5 w-5 text-primary-purple" />
            <span className="text-sm text-text-secondary">Security Research</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background-card px-4 py-2">
            <Gamepad2 className="h-5 w-5 text-primary-green" />
            <span className="text-sm text-text-secondary">Game Development</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button variant="primary" onClick={() => scrollToSection('projects')}>
            View Projects
          </Button>
          <Button variant="secondary" onClick={() => scrollToSection('siem')}>
            Explore SIEM Lab
          </Button>
          <Button variant="ghost" onClick={() => scrollToSection('contact')}>
            Contact Me
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="h-6 w-6 animate-bounce text-primary" />
        </motion.div>
      </div>
    </div>
  );
}
