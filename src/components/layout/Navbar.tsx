'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { navItems } from '@/data/nav';
import ThemeToggle from '@/components/ui/ThemeToggle';

export function Navbar() {
  const [activeSection, setActiveSection] = useState(navItems[0]?.id ?? 'hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollTop > 32);
      setScrollProgress(scrollable > 0 ? Math.min(1, scrollTop / scrollable) : 0);

      const scrollPosition = scrollTop + 180;
      for (let index = navItems.length - 1; index >= 0; index -= 1) {
        const section = document.getElementById(navItems[index].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[index].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      const target = id === 'hero' ? '/' : id === 'demos' ? '/demos' : `/#${id}`;
      window.location.href = target;
      setIsMobileMenuOpen(false);
      return;
    }

    const headerOffset = isScrolled ? 64 : 84;
    const offsetPosition = element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="nav-liquid sticky inset-x-0 top-0 z-50 transition-all duration-300 ease-out">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              'flex items-center justify-between transition-[height] duration-300 ease-out',
              isScrolled ? 'h-14' : 'h-[4.5rem]',
            )}
          >
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="group flex items-center gap-2 rounded-full px-2 py-2 text-left"
              aria-label="Scroll to top"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="hidden font-mono text-xs font-bold uppercase text-text-primary sm:block">
                Jason Achkar
              </span>
            </button>

            <div className="hidden items-center gap-3 md:flex">
              <div className="liquid-glass flex items-center gap-1 rounded-full px-2 py-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                      activeSection === item.id
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary',
                    )}
                  >
                    {activeSection === item.id && (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-full border border-primary/25 bg-primary/10"
                        transition={{ type: 'spring', stiffness: 330, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((value) => !value)}
                className="liquid-glass grid h-10 w-10 place-items-center rounded-full text-text-primary"
                aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5">
          <motion.div
            className="h-px origin-left bg-gradient-to-r from-primary via-secondary to-accent"
            style={{ scaleX: scrollProgress }}
          />
        </div>
      </nav>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed inset-x-3 top-[4.75rem] z-40 rounded-3xl border border-white/10 bg-background/90 p-3 shadow-2xl backdrop-blur-2xl md:hidden"
        >
          <div className="grid gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors',
                  activeSection === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-background-elevated hover:text-text-primary',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
