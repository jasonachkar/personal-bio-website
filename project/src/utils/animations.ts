'use client';

import type { Variants, Transition } from 'framer-motion';

// ============================================
// Enhanced Animation Utilities
// ============================================

/**
 * Premium easing functions for smooth, professional animations
 * @description Carefully crafted easing curves for a polished user experience
 */
export const easings = {
  // Smooth out cubic - great for entrances
  easeOutCubic: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Smooth in-out cubic - great for transitions
  easeInOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
  // Dramatic expo easing - great for hero elements
  easeOutExpo: [0.19, 1, 0.22, 1] as [number, number, number, number],
  // Smooth quint for elegant movements
  easeOutQuint: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // Anticipation easing - slight pullback before movement
  anticipate: [0.68, -0.6, 0.32, 1.6] as [number, number, number, number],
  // Bounce effect for playful interactions
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  // Ultra smooth for premium feel
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  // Spring-like physics settings
  spring: { type: 'spring', stiffness: 400, damping: 30, mass: 1 },
  // Gentle spring for cards
  gentleSpring: { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 },
  // Snappy spring for micro-interactions
  snappySpring: { type: 'spring', stiffness: 500, damping: 35, mass: 0.5 },
};

/**
 * Base transition settings optimized for desktop
 * @description Standard transitions with carefully tuned timings
 */
export const transitions = {
  smooth: {
    duration: 0.5,
    ease: easings.smooth,
  } as Transition,
  fast: {
    duration: 0.3,
    ease: easings.easeOutCubic,
  } as Transition,
  slow: {
    duration: 0.7,
    ease: easings.easeOutQuint,
  } as Transition,
  spring: easings.spring,
  gentleSpring: easings.gentleSpring,
  snappySpring: easings.snappySpring,
  // Premium entrance transition
  entrance: {
    duration: 0.6,
    ease: easings.easeOutExpo,
  } as Transition,
  // Elegant exit transition
  exit: {
    duration: 0.4,
    ease: easings.easeInOutCubic,
  } as Transition,
};

/**
 * Mobile-optimized transitions for better performance
 * @description Faster, simpler animations for mobile devices
 */
export const mobileTransitions = {
  smooth: {
    duration: 0.35,
    ease: easings.easeOutCubic,
  } as Transition,
  fast: {
    duration: 0.2,
    ease: easings.easeOutCubic,
  } as Transition,
  slow: {
    duration: 0.45,
    ease: easings.easeOutCubic,
  } as Transition,
  entrance: {
    duration: 0.4,
    ease: easings.easeOutCubic,
  } as Transition,
};

/**
 * Animation variants for scroll-triggered animations
 * @description Premium scroll animations with elegant transitions
 */
export const scrollVariants: Record<string, Variants> = {
  // Fade up with elegant easing
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easings.easeOutQuint,
      },
    },
  },
  // Fade down entrance
  fadeDown: {
    hidden: {
      opacity: 0,
      y: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easings.easeOutQuint,
      },
    },
  },
  // Scale with fade - great for cards
  scaleFade: {
    hidden: {
      opacity: 0,
      scale: 0.92,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easings.easeOutQuint,
      },
    },
  },
  // Slide from left
  slideLeft: {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easings.easeOutQuint,
      },
    },
  },
  // Slide from right
  slideRight: {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easings.easeOutQuint,
      },
    },
  },
  // Simple fade
  fade: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easings.smooth,
      },
    },
  },
  fadeIn: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easings.smooth,
      },
    },
  },
  // Premium card reveal with subtle rotation
  cardReveal: {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easings.easeOutQuint,
      },
    },
  },
  // Card slide up with scale
  cardSlideUp: {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easings.easeOutQuint,
      },
    },
  },
  // Blur fade in - premium effect
  blurIn: {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: easings.easeOutQuint,
      },
    },
  },
};

/**
 * Stagger container variants for grid/list animations
 * @description Controls timing of children animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      ease: easings.smooth,
    },
  },
};

/**
 * Fast stagger for dense lists
 */
export const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

/**
 * Enhanced card hover animation variants
 * @description Premium hover effects with 3D-like lift
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.02,
    y: -8,
    boxShadow: '0 20px 40px -12px rgba(0, 212, 255, 0.25), 0 10px 20px -8px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: 0.3,
      ease: easings.easeOutCubic,
    },
  },
};

/**
 * Subtle card hover for dense layouts
 */
export const cardHoverSubtle: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.01,
    y: -4,
    transition: {
      duration: 0.25,
      ease: easings.easeOutCubic,
    },
  },
};

/**
 * Glow card hover effect
 */
export const cardGlowHover: Variants = {
  rest: {
    boxShadow: '0 0 0 rgba(0, 212, 255, 0)',
    borderColor: 'rgba(0, 212, 255, 0.1)',
  },
  hover: {
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1)',
    borderColor: 'rgba(0, 212, 255, 0.5)',
    transition: {
      duration: 0.4,
      ease: easings.easeOutCubic,
    },
  },
};

/**
 * Button animation variants with press effect
 */
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
    transition: transitions.fast,
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: easings.easeOutCubic,
    },
  },
  tap: {
    scale: 0.97,
    transition: {
      duration: 0.1,
      ease: easings.easeOutCubic,
    },
  },
};

/**
 * Enhanced badge animation variants
 */
export const badgeVariants: Variants = {
  rest: {
    scale: 1,
    transition: transitions.fast,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: easings.easeOutCubic,
    },
  },
};

/**
 * Icon animation variants
 */
export const iconVariants: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: easings.easeOutCubic,
    },
  },
};

/**
 * Link underline animation
 */
export const linkUnderlineVariants: Variants = {
  rest: {
    width: '0%',
    transition: {
      duration: 0.3,
      ease: easings.easeOutCubic,
    },
  },
  hover: {
    width: '100%',
    transition: {
      duration: 0.3,
      ease: easings.easeOutCubic,
    },
  },
};

/**
 * Desktop viewport settings for scroll animations
 * @description Aggressive triggering for desktop
 */
const desktopViewportSettings = {
  once: true,
  margin: '-80px',
  amount: 0.2,
};

/**
 * Mobile viewport settings for scroll animations
 * @description Safer triggering for mobile devices
 */
const mobileViewportSettings = {
  once: true,
  margin: '-20px',
  amount: 0.1,
};

/**
 * Get viewport settings based on device type
 * @param isMobile - Whether the device is mobile
 * @returns Viewport settings object
 */
export const getViewportSettings = (isMobile?: boolean) => {
  if (typeof window === 'undefined') return mobileViewportSettings;
  const mobile = isMobile !== undefined ? isMobile : true;
  return mobile ? mobileViewportSettings : desktopViewportSettings;
};

/**
 * Default viewport settings
 */
export const viewportSettings = desktopViewportSettings;

/**
 * Pulse animation for status indicators
 */
export const pulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Shimmer loading animation
 */
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Float animation for decorative elements
 */
export const floatVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Get responsive transition based on device
 * @param isMobile - Whether the device is mobile
 * @param type - Type of transition
 * @returns Transition object
 */
export const getResponsiveTransition = (
  isMobile: boolean,
  type: 'smooth' | 'fast' | 'slow' | 'entrance' = 'smooth'
): Transition => {
  const transitionSet = isMobile ? mobileTransitions : transitions;
  return transitionSet[type] as Transition;
};
