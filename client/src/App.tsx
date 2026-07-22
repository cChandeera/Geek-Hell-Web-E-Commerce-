import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-8">
      <div className="glass-panel p-8 rounded-2xl max-w-xl text-center space-y-4 shadow-marvel-glow">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white">
          GEEK <span className="text-primary text-glow-red">HELL</span>
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Phase 02 Architecture Foundation initialized successfully. Ready for feature implementation.
        </p>
        <div className="inline-block px-4 py-2 rounded-full glass-card text-xs font-mono text-secondary border border-secondary/30">
          React 19 • Vite • Three.js • GSAP • Tailwind
        </div>
      </div>
    </div>
  );
};

export default App;
