export const DESIGN_TOKENS = {
  colors: {
    primary: {
      default: '#e50914',
      hover: '#b80710',
      glow: 'rgba(229, 9, 20, 0.4)',
    },
    secondary: {
      default: '#00d2ff',
      hover: '#0099bc',
      glow: 'rgba(0, 210, 255, 0.4)',
    },
    accent: {
      marvel: '#ed1d24',
      dc: '#0476f2',
      gold: '#f5c518',
    },
    background: {
      default: '#09090b',
      surface: '#121215',
      glass: 'rgba(18, 18, 21, 0.65)',
    },
    border: 'rgba(255, 255, 255, 0.08)',
    text: {
      primary: '#f4f4f5',
      secondary: '#a1a1aa',
      muted: '#71717a',
    },
    status: {
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
    },
  },
  typography: {
    fontFamily: {
      sans: "'Inter', sans-serif",
      display: "'Outfit', sans-serif",
    },
  },
  animation: {
    duration: {
      fast: '0.2s',
      normal: '0.4s',
      cinematic: '0.8s',
    },
    easing: {
      easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      smoothScroll: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  },
} as const;
