'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { navItems as navigationItems } from '../../data/nav';
import ThemeToggle from '../ui/ThemeToggle';

const navItems = navigationItems;

export function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Height of fixed header + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-border bg-background/95 backdrop-blur-xl shadow-sm'
            : 'bg-background/70 backdrop-blur-md'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <div className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-text-primary">
                Portfolio
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-4 md:flex">
              <div className="flex items-center gap-1 rounded-full border border-border bg-background-card px-2 py-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-sm transition-colors',
                      activeSection === item.id
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {activeSection === item.id && (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}
              </div>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg border border-border bg-background-card p-2 text-text-primary"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background-card/95 backdrop-blur-lg md:hidden"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'rounded-lg px-4 py-3 text-left transition-colors',
                    activeSection === item.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-text-secondary hover:bg-background-elevated hover:text-text-primary'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
