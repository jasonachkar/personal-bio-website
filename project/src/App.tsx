import { useCallback } from 'react';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import SIEM from './components/sections/SIEM';
import GameHub from './components/sections/GameHub';
import Contact from './components/sections/Contact';
import Navbar from './components/layout/Navbar';
import { navItems } from './data/nav';
import type { SectionId } from './data/types';
import { useActiveSection } from './hooks/useActiveSection';

const App = () => {
  const activeId = useActiveSection(navItems.map((item) => item.id));

  const scrollTo = useCallback((id: SectionId) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-radial-fade opacity-70" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.08]" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 noise-bg opacity-40" aria-hidden="true" />

      <Navbar items={navItems} activeId={activeId} onNavigate={scrollTo} />

      <main className="relative">
        <Hero onNavigate={scrollTo} />
        <About />
        <Skills />
        <SIEM />
        <GameHub />
        <Projects />
        <Contact />
      </main>

      <footer className="border-t border-white/5 bg-black/40 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-slate-400">
          <span>Crafted with React, TypeScript, Tailwind, and Framer Motion.</span>
          <span className="text-primary">Security-first • Human-centered • Playful</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
