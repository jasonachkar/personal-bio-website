/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          subtle: 'var(--accent-subtle)',
          strong: 'var(--accent-strong)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        severity: {
          critical: '#dc2626',
          high: '#ea580c',
          medium: '#b45309',
          low: '#15803d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '70ch',
        page: '1120px',
      },
      boxShadow: {
        focus: '0 0 0 3px rgb(13 148 136 / 0.25)',
      },
    },
  },
  plugins: [],
};
