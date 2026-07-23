import React, { useEffect } from 'react';
import { Zap, Target, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tl = gsap.timeline();

      // Initial state hide
      gsap.set('.gsap-hero-glow-marvel', { opacity: 0, scale: 0.8 });
      gsap.set('.gsap-hero-glow-dc', { opacity: 0, scale: 0.8 });

      // Staggered reveals
      tl.to('.gsap-hero-glow-marvel', {
        opacity: 0.15,
        scale: 1,
        duration: 2.5,
        ease: 'power3.out',
      });
      tl.to(
        '.gsap-hero-glow-dc',
        {
          opacity: 0.15,
          scale: 1,
          duration: 2.5,
          ease: 'power3.out',
        },
        '-=2.0'
      );

      tl.fromTo(
        '.gsap-hero-badge',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=2.0'
      );

      tl.fromTo(
        '.gsap-hero-title-part',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.15,
          ease: 'power4.out',
        },
        '-=1.6'
      );

      tl.fromTo(
        '.gsap-hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=1.0'
      );

      tl.fromTo(
        '.gsap-hero-btn',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.5)',
        },
        '-=0.8'
      );

      tl.fromTo(
        '.gsap-hero-customizer',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out' },
        '-=0.8'
      );
    }
  }, []);

  return (
    <section className="relative min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      
      {/* Cinematic Franchise Lighting Background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Left: Marvel Red Lighting */}
        <div className="gsap-hero-glow-marvel absolute top-1/2 left-[-20%] -translate-y-1/2 w-[70%] h-[80%] rounded-full bg-radial-gradient from-[rgba(229,9,20,0.3)] via-[rgba(229,9,20,0.05)] to-transparent blur-[80px]" />
        
        {/* Right: DC Blue Lighting */}
        <div className="gsap-hero-glow-dc absolute top-1/2 right-[-20%] -translate-y-1/2 w-[70%] h-[80%] rounded-full bg-radial-gradient from-[rgba(4,118,242,0.3)] via-[rgba(4,118,242,0.05)] to-transparent blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Content Layout */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left select-none">
          {/* Subheading Badge */}
          <div className="gsap-hero-badge inline-flex items-center px-4 py-1.5 glass-panel rounded-full text-xs font-semibold uppercase tracking-widest text-text-secondary mb-6 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
            Premium Superhero Apparel
          </div>

          {/* Large Typography Animated Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-6 flex flex-col font-display">
            <span className="gsap-hero-title-part block text-white">
              Unleash Your
            </span>
            <span className="gsap-hero-title-part block text-accent-marvel text-glow-marvel my-1">
              Inner
            </span>
            <span className="gsap-hero-title-part block text-white">
              Hero
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="gsap-hero-subtitle text-base sm:text-lg text-text-secondary max-w-xl font-medium mb-10 leading-relaxed">
            Premium custom printed T-Shirts crafted for true legends.
            <br className="hidden sm:inline" /> Marvel. DC. Comics. Gaming. All in one universe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start w-full">
            <Button
              variant="marvel"
              size="lg"
              className="gsap-hero-btn select-none"
              leftIcon={<Zap className="w-4 h-4 fill-white" />}
            >
              Explore Marvel
            </Button>
            
            <Button
              variant="dc"
              size="lg"
              className="gsap-hero-btn select-none"
              leftIcon={<Target className="w-4 h-4" />}
            >
              Explore DC
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gsap-hero-btn select-none glass-panel border-white/10 hover:border-white/20 text-white"
              leftIcon={<Play className="w-4 h-4 fill-white/10" />}
            >
              Watch Collection
            </Button>
          </div>
        </div>

        {/* 3D T-Shirt Interactive Placeholder */}
        <div className="gsap-hero-customizer flex items-center justify-center relative select-none w-full">
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full max-w-[420px]"
          >
            <div className="glass-card shadow-glass border-white/5 relative p-12 aspect-[4/5] rounded-3xl flex flex-col items-center justify-center overflow-hidden group">
              {/* Internal Subtle Spotlight lighting */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-secondary/10 opacity-60 pointer-events-none" />

              {/* T-Shirt Vector Layout */}
              <svg
                viewBox="0 0 100 100"
                className="w-48 h-48 text-text-secondary/20 group-hover:text-text-secondary/35 group-hover:scale-105 transition-all duration-700 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
              >
                <path
                  fill="currentColor"
                  d="M10,25 C15,22 25,23 30,28 C32,25 35,22 45,22 C55,22 58,25 60,28 C65,23 75,22 80,25 L90,40 L78,48 L75,42 L75,85 C75,90 70,92 65,92 L25,92 C20,92 15,90 15,85 L15,42 L12,48 L0,40 Z"
                />
              </svg>

              {/* Holographic custom target selectors */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="absolute w-8 h-8 rounded-full border border-primary/40 animate-ping" />
                <span className="absolute w-4 h-4 rounded-full border-2 border-primary shadow-marvel-glow flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
              </div>

              {/* Card Footer Tag */}
              <div className="absolute bottom-6 flex flex-col items-center gap-1.5 text-center">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary text-glow-marvel">
                  Interactive customizer
                </span>
                <span className="text-[11px] font-semibold text-text-secondary uppercase">
                  3D Render Engine Sandbox
                </span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
