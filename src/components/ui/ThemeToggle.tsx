'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { transitions } from '@/utils/animations';

const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-border bg-background-card" />
    );
  }

  const buttonClasses =
    'rounded-lg border border-border bg-background-card p-2 text-text-primary transition-all hover:border-primary/50 hover:bg-background-elevated focus:outline-none focus:ring-2 focus:ring-primary/50';

  if (prefersReducedMotion) {
    return (
      <button
        onClick={toggleTheme}
        className={buttonClasses}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={buttonClasses}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={transitions.fast}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={transitions.fast}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
