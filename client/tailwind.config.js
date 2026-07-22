/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#09090b', // Ultra dark obsidian background
          surface: '#121215',    // Card & surface elevation
          glass: 'rgba(18, 18, 21, 0.65)',
        },
        primary: {
          DEFAULT: '#e50914', // Core Geek Hell Red
          hover: '#b80710',
          glow: 'rgba(229, 9, 20, 0.4)',
        },
        secondary: {
          DEFAULT: '#00d2ff', // Cyber DC Blue
          hover: '#0099bc',
          glow: 'rgba(0, 210, 255, 0.4)',
        },
        accent: {
          marvel: '#ed1d24', // Marvel Vibrant Red
          dc: '#0476f2',     // DC Royal Blue
          gold: '#f5c518',   // Collector's Gold
        },
        surface: {
          100: '#18181b',
          200: '#27272a',
          300: '#3f3f46',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        text: {
          primary: '#f4f4f5',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'marvel-glow': '0 0 25px rgba(237, 29, 36, 0.35)',
        'dc-glow': '0 0 25px rgba(4, 118, 242, 0.35)',
        'gold-glow': '0 0 20px rgba(245, 197, 24, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
