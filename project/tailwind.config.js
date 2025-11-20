/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00ff00', // Neon Green
        secondary: '#00ffff', // Neon Cyan
        background: '#0a0a0a', // Near Black
        text: '#e0e0e0', // Light Gray
        accent: '#ff00ff', // Neon Magenta
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}