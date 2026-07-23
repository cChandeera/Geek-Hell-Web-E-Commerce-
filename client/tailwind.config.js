/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--color-black)',
          surface: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
          glass: 'rgba(14, 14, 17, 0.70)',
        },
        primary: {
          DEFAULT: 'var(--color-marvel-red)',
          hover: 'var(--color-marvel-hover)',
          glow: 'var(--color-marvel-glow)',
        },
        secondary: {
          DEFAULT: 'var(--color-dc-blue)',
          hover: 'var(--color-dc-hover)',
          glow: 'var(--color-dc-glow)',
        },
        accent: {
          marvel: 'var(--color-marvel-red)',
          dc: 'var(--color-dc-blue)',
          gold: 'var(--color-gold)',
        },
        surface: {
          100: '#121215',
          200: '#1c1c21',
          300: '#2b2b35',
          border: 'var(--color-border)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: 'var(--shadow-glass)',
        'marvel-glow': 'var(--shadow-marvel-glow)',
        'dc-glow': 'var(--shadow-dc-glow)',
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
