'use client';

import type { Variants, Transition } from 'framer-motion';

// Easing functions for smooth animations
export const easings = {
  easeOutCubic: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
  easeOutExpo: [0.19, 1, 0.22, 1] as [number, number, number, number],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
};

// Base transition settings
export const transitions = {
  smooth: {
    duration: 0.35,
    ease: easings.easeOutCubic,
  } as Transition,
  fast: {
    duration: 0.3,
    ease: easings.easeOutCubic,
  } as Transition,
  slow: {
    duration: 0.4,
    ease: easings.easeOutCubic,
  } as Transition,
  spring: easings.spring,
};

// Animation variants for scroll-triggered animations
export const scrollVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: { 
      opacity: 0, 
      y: 30,
      willChange: 'transform, opacity',
    },
    visible: {
      opacity: 1,
      y: 0,
      willChange: 'auto',
      transition: transitions.smooth,
    },
  },
  fadeDown: {
    hidden: { 
      opacity: 0, 
      y: -30,
      willChange: 'transform, opacity',
    },
    visible: {
      opacity: 1,
      y: 0,
      willChange: 'auto',
      transition: transitions.smooth,
    },
  },
  scaleFade: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      willChange: 'transform, opacity',
    },
    visible: {
      opacity: 1,
      scale: 1,
      willChange: 'auto',
      transition: transitions.smooth,
    },
  },
  slideLeft: {
    hidden: { 
      opacity: 0, 
      x: -30,
      willChange: 'transform, opacity',
    },
    visible: {
      opacity: 1,
      x: 0,
      willChange: 'auto',
      transition: transitions.smooth,
    },
  },
  slideRight: {
    hidden: { 
      opacity: 0, 
      x: 30,
      willChange: 'transform, opacity',
    },
    visible: {
      opacity: 1,
      x: 0,
      willChange: 'auto',
      transition: transitions.smooth,
    },
  },
  fadeIn: {
    hidden: { 
      opacity: 0,
      willChange: 'opacity',
    },
    visible: {
      opacity: 1,
      willChange: 'auto',
      transition: transitions.smooth,
    },
  },
  fade: {
    hidden: { 
      opacity: 0,
      willChange: 'opacity',
    },
    visible: {
      opacity: 1,
      willChange: 'auto',
      transition: transitions.smooth,
    },
  },
  cardReveal: {
    hidden: { 
      opacity: 0, 
      scale: 0.92, 
      rotate: -1,
      willChange: 'transform, opacity',
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      willChange: 'auto',
      transition: {
        duration: 0.4,
        ease: easings.easeOutCubic,
      },
    },
  },
  cardSlideUp: {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: 30,
      willChange: 'transform, opacity',
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      willChange: 'auto',
      transition: {
        duration: 0.35,
        ease: easings.easeOutCubic,
      },
    },
  },
};

// Stagger container variants for grid/list animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// Card hover animation variants
export const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
    transition: transitions.fast,
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: transitions.fast,
  },
};

// Button animation variants
export const buttonVariants = {
  rest: {
    scale: 1,
    transition: transitions.fast,
  },
  hover: {
    scale: 1.05,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Badge animation variants
export const badgeVariants = {
  rest: {
    scale: 1,
    transition: transitions.fast,
  },
  hover: {
    scale: 1.1,
    transition: transitions.fast,
  },
};

// Viewport settings for scroll animations
export const viewportSettings = {
  once: true,
  margin: '-50px',
  amount: 0.3,
};

