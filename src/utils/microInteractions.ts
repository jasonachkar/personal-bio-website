/**
 * Micro-interaction utilities for enhanced UI feedback
 */

import { Variants } from 'framer-motion';

/**
 * Ripple effect animation for buttons
 */
export const rippleVariants: Variants = {
  rest: {
    scale: 0,
    opacity: 0,
  },
  tap: {
    scale: 4,
    opacity: [0.5, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Card lift animation on hover
 */
export const cardLiftVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/**
 * Button press animation
 */
export const buttonPressVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
};

/**
 * Success state animation
 */
export const successVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Error state animation
 */
export const errorVariants: Variants = {
  initial: {
    x: -20,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Progress indicator animation
 */
export const progressVariants: Variants = {
  initial: {
    width: '0%',
  },
  animate: {
    width: '100%',
    transition: {
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

/**
 * Fade in with slight scale
 */
export const fadeScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide in from direction
 */
export const slideInVariants = (direction: 'left' | 'right' | 'up' | 'down' = 'up'): Variants => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  };

  return {
    hidden: {
      ...directions[direction],
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };
};

/**
 * Pulse animation for attention
 */
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Rotate on hover
 */
export const rotateVariants: Variants = {
  rest: {
    rotate: 0,
  },
  hover: {
    rotate: 360,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/**
 * Creates a ripple effect at click position
 */
export function createRipple(event: React.MouseEvent<HTMLElement>): void {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add('ripple');

  const rippleStyles = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;

  // Add styles if not already added
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = rippleStyles;
    document.head.appendChild(style);
  }

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

