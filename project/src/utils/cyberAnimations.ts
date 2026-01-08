/**
 * Cybersecurity-themed animation utilities
 */

import { Variants } from 'framer-motion';

/**
 * Terminal typing effect animation
 */
export const terminalTypingVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

export const terminalCharVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
};

/**
 * Scanning line animation
 */
export const scanLineVariants: Variants = {
  initial: {
    y: '-100%',
    opacity: 0,
  },
  animate: {
    y: '100%',
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Hex pattern pulse animation
 */
export const hexPulseVariants: Variants = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Glitch effect on hover
 */
export const glitchVariants: Variants = {
  rest: {
    x: 0,
    filter: 'hue-rotate(0deg)',
  },
  hover: {
    x: [0, -2, 2, -2, 2, 0],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(0deg)',
      'hue-rotate(-90deg)',
      'hue-rotate(0deg)',
    ],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Particle effect animation
 */
export const particleVariants = (delay: number = 0): Variants => ({
  initial: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
  },
  animate: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    x: [0, Math.random() * 100 - 50],
    y: [0, Math.random() * 100 - 50],
    transition: {
      duration: 2,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
});

/**
 * Terminal cursor blink
 */
export const cursorBlinkVariants: Variants = {
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Security scan progress animation
 */
export const scanProgressVariants: Variants = {
  initial: {
    width: '0%',
  },
  animate: {
    width: '100%',
    transition: {
      duration: 3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Vulnerability card reveal animation
 */
export const vulnerabilityRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Code snippet typing effect
 */
export function createTypingEffect(
  text: string,
  speed: number = 50
): { displayText: string; isComplete: boolean } {
  // This would be used with useState in a component
  // For now, return a placeholder
  return { displayText: text, isComplete: true };
}

/**
 * Terminal command execution animation
 */
export const terminalCommandVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

