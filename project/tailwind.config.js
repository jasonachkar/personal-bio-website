/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Azure-inspired cybersecurity professional theme
        background: {
          DEFAULT: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          accent: 'var(--border-accent)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        severity: {
          info: '#3b82f6',
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#dc2626',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        'prose': '65ch',
        '8xl': '88rem',
        '9xl': '96rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Enhanced glow shadows
        'glow': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)',
        'glow-sm': '0 0 10px rgba(0, 240, 255, 0.2), 0 0 20px rgba(0, 240, 255, 0.1)',
        'glow-lg': '0 0 30px rgba(0, 240, 255, 0.4), 0 0 60px rgba(0, 240, 255, 0.2)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)',
        // Card shadows
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 40px -12px rgba(0, 212, 255, 0.2), 0 10px 20px -8px rgba(0, 0, 0, 0.15)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        // Glass effect shadows
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-dark': '0 8px 32px 0 rgba(0, 212, 255, 0.05), inset 0 1px 0 0 rgba(0, 212, 255, 0.1)',
        // Soft elevation
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.12)',
        'soft-lg': '0 4px 12px -3px rgba(0, 0, 0, 0.1), 0 8px 24px -6px rgba(0, 0, 0, 0.15)',
        // Button shadows
        'button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'button-hover': '0 4px 12px -2px rgba(0, 212, 255, 0.3)',
      },
      backgroundImage: {
        'grid': 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        'grid-small': 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1), transparent 70%)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(0, 212, 255, 0.1) 100%)',
        'cyber-mesh': 'radial-gradient(circle at 20% 30%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        // Premium gradients
        'gradient-primary': 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        'gradient-accent': 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)',
        // Mesh gradients
        'mesh-1': 'radial-gradient(at 40% 20%, rgba(0, 212, 255, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(0, 212, 255, 0.08) 0px, transparent 50%)',
        'mesh-2': 'radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 0% 0%, rgba(0, 212, 255, 0.1) 0px, transparent 50%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
        'grid-small': '20px 20px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-bottom': 'slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scan': 'scan 2s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '0.5', 
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' 
          },
          '50%': { 
            opacity: '1', 
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)' 
          },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)' 
          },
        },
        'border-glow': {
          '0%, 100%': { 
            borderColor: 'rgba(0, 212, 255, 0.3)' 
          },
          '50%': { 
            borderColor: 'rgba(0, 212, 255, 0.6)' 
          },
        },
        'gradient-shift': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%' 
          },
          '50%': { 
            backgroundPosition: '100% 50%' 
          },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
};
