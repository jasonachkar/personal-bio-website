// Core entity types retained for legacy static content.

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  tech_stack: string[];
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  short_description: string;
  long_description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  category: 'cybersecurity' | 'software' | 'game' | 'other';
  featured?: boolean;
  created_at?: string;
}

export type LinkType =
  | 'github'
  | 'linkedin'
  | 'email'
  | 'resume_download'
  | 'resume_preview'
  | 'twitter'
  | 'discord';

export interface Link {
  id: string;
  type: LinkType;
  url: string;
  label: string;
  icon_name: string;
  order?: number;
}

export interface ProfileData {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  avatar_url?: string;
}

// UI-specific types

export interface SkillCategory {
  name: string;
  skills: string[];
  icon?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// ============================================
// Enhanced UI Component Types
// ============================================

/**
 * Card component variant types for different visual styles
 * @description Defines the visual appearance of card components
 */
export type CardVariant = 'default' | 'glass' | 'elevated' | 'gradient' | 'cyber';

/**
 * Card hover effect types for interactive behavior
 * @description Specifies the animation behavior on hover
 */
export type CardHoverEffect = 'none' | 'lift' | 'glow' | 'scale' | 'tilt';

/**
 * Enhanced Card component props interface
 * @interface CardProps
 * @description Props for the enhanced Card component with advanced styling options
 */
export interface CardProps {
  /** Child elements to render inside the card */
  children: React.ReactNode;
  /** Additional CSS classes for customization */
  className?: string;
  /** Visual style variant of the card */
  variant?: CardVariant;
  /** Hover effect type */
  hoverEffect?: CardHoverEffect;
  /** Whether to show the glow effect */
  glow?: boolean;
  /** Whether to show the gradient border */
  gradientBorder?: boolean;
  /** Whether the card is interactive (clickable) */
  interactive?: boolean;
  /** Padding size preset */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Badge component variant types
 * @description Defines the visual appearance of badge components
 */
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';

/**
 * Badge size options
 * @description Defines the size of badge components
 */
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Enhanced Badge component props interface
 * @interface BadgeProps
 * @description Props for the enhanced Badge component with advanced styling options
 */
export interface BadgeProps {
  /** Text content of the badge */
  label: string;
  /** Additional CSS classes for customization */
  className?: string;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  /** Whether the badge should pulse/animate */
  animated?: boolean;
}

/**
 * Button component variant types
 * @description Defines the visual appearance of button components
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'cyber';

/**
 * Button size options
 * @description Defines the size of button components
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Animation configuration interface
 * @interface AnimationConfig
 * @description Configuration for Framer Motion animations
 */
export interface AnimationConfig {
  /** Animation duration in seconds */
  duration: number;
  /** Easing function or cubic bezier values */
  ease: string | number[];
  /** Delay before animation starts */
  delay?: number;
}

/**
 * Responsive breakpoint values
 * @interface ResponsiveBreakpoints
 * @description Defines responsive breakpoint values for different screen sizes
 */
export interface ResponsiveBreakpoints {
  /** Extra small screens (mobile phones) */
  xs: number;
  /** Small screens (large phones) */
  sm: number;
  /** Medium screens (tablets) */
  md: number;
  /** Large screens (desktops) */
  lg: number;
  /** Extra large screens (large desktops) */
  xl: number;
  /** 2X large screens (ultra-wide) */
  '2xl': number;
}

/**
 * Spacing scale interface
 * @interface SpacingScale
 * @description Defines consistent spacing values for layout
 */
export interface SpacingScale {
  /** 0.25rem = 4px */
  1: string;
  /** 0.5rem = 8px */
  2: string;
  /** 0.75rem = 12px */
  3: string;
  /** 1rem = 16px */
  4: string;
  /** 1.5rem = 24px */
  6: string;
  /** 2rem = 32px */
  8: string;
  /** 2.5rem = 40px */
  10: string;
  /** 3rem = 48px */
  12: string;
  /** 4rem = 64px */
  16: string;
  /** 5rem = 80px */
  20: string;
  /** 6rem = 96px */
  24: string;
}

/**
 * Section padding configuration
 * @interface SectionPadding
 * @description Defines responsive padding for sections
 */
export interface SectionPadding {
  /** Mobile (default) padding */
  mobile: string;
  /** Tablet (md breakpoint) padding */
  tablet: string;
  /** Desktop (lg breakpoint) padding */
  desktop: string;
}

/**
 * Project card display data
 * @interface ProjectCardData
 * @description Data structure for displaying project information in cards
 */
export interface ProjectCardData {
  /** Unique project identifier */
  id: string;
  /** Project title */
  title: string;
  /** Short description for the card */
  description: string;
  /** Technology stack tags */
  tech: string[];
  /** Role in the project */
  role: string;
  /** GitHub repository URL */
  repoUrl: string;
  /** Live demo URL (optional) */
  demoUrl?: string;
  /** Whether the project is featured */
  featured?: boolean;
}
