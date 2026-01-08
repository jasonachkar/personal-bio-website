'use client';

import type { Variants, Transition } from 'framer-motion';


// Easing functions for smooth animations
export const easings = {
  easeOutCubic: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
  easeOutExpo: [0.19, 1, 0.22, 1] as [number, number, number, number],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
};

// Base transition settings - use default values (mobile optimization happens in variants)
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

// Mobile-optimized transitions (faster for better performance)
export const mobileTransitions = {
  smooth: {
    duration: 0.25,
    ease: easings.easeOutCubic,
  } as Transition,
  fast: {
    duration: 0.2,
    ease: easings.easeOutCubic,
  } as Transition,
  slow: {
    duration: 0.3,
    ease: easings.easeOutCubic,
  } as Transition,
};

// Get transform values based on device type (reduced on mobile for performance)
// These are called at runtime when variants are used, not at module load
const getTransformY = (isMobile: boolean) => isMobile ? 10 : 30;
const getTransformX = (isMobile: boolean) => isMobile ? 10 : 30;
const getScale = (isMobile: boolean) => isMobile ? 0.98 : 0.95;

// Animation variants for scroll-triggered animations
// Mobile-optimized: smaller transforms, faster transitions, no willChange issues
export const scrollVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: { 
      opacity: 0.01, // Use 0.01 instead of 0 for better fallback (nearly invisible but still renders)
      y: 30, // Default desktop value, mobile optimization happens via getScrollVariants
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.smooth,
    },
  },
  fadeDown: {
    hidden: { 
      opacity: 0.01,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.smooth,
    },
  },
  scaleFade: {
    hidden: { 
      opacity: 0.01,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: transitions.smooth,
    },
  },
  slideLeft: {
    hidden: { 
      opacity: 0.01,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.smooth,
    },
  },
  slideRight: {
    hidden: { 
      opacity: 0.01,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.smooth,
    },
  },
  fadeIn: {
    hidden: { 
      opacity: 0.01,
    },
    visible: {
      opacity: 1,
      transition: transitions.smooth,
    },
  },
  fade: {
    hidden: { 
      opacity: 0.01,
    },
    visible: {
      opacity: 1,
      transition: transitions.smooth,
    },
  },
  cardReveal: {
    hidden: { 
      opacity: 0.01,
      scale: 0.92,
      rotate: -1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: transitions.slow,
    },
  },
  cardSlideUp: {
    hidden: { 
      opacity: 0.01,
      scale: 0.95,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: transitions.smooth,
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

// Card hover animation variants - Mobile optimization happens at component level
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

// Viewport settings for scroll animations - Desktop (aggressive)
const desktopViewportSettings = {
  once: true,
  margin: '-50px',
  amount: 0.3,
};

// Viewport settings for scroll animations - Mobile (safer, triggers earlier)
const mobileViewportSettings = {
  once: true,
  margin: '-10px', // Smaller negative margin for mobile
  amount: 0.1, // Lower threshold - triggers earlier
};

// Get viewport settings based on device type
export const getViewportSettings = (isMobile?: boolean) => {
  if (typeof window === 'undefined') return mobileViewportSettings; // SSR default to safe mobile
  // If isMobile is provided, use it; otherwise default to mobile (safer)
  const mobile = isMobile !== undefined ? isMobile : true;
  return mobile ? mobileViewportSettings : desktopViewportSettings;
};

// Default viewport settings (will be determined client-side)
export const viewportSettings = desktopViewportSettings;

