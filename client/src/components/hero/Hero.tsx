import React, { useRef } from 'react';
import { Zap, Target, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ShirtViewer } from '../common/shirt/ShirtViewer';

export const Hero: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const floatRef = useRef<HTMLDivElement>(null);

  // useGSAP safe scope timelines
  useGSAP(() => {
    if (reducedMotion) {
      gsap.set('.gsap-hero-glow-marvel', { opacity: 0.15, scale: 1 });
      gsap.set('.gsap-hero-glow-dc', { opacity: 0.15, scale: 1 });
      gsap.set('.gsap-hero-badge', { y: 0, opacity: 1 });
      gsap.set('.gsap-hero-title-part', { y: 0, opacity: 1, scale: 1 });
      gsap.set('.gsap-hero-subtitle', { y: 0, opacity: 1 });
      gsap.set('.gsap-hero-btn', { scale: 1, opacity: 1 });
      gsap.set('.gsap-hero-customizer', { scale: 1, opacity: 1 });
      return;
    }

    const tl = gsap.timeline();

    // Initial state hide
    gsap.set('.gsap-hero-glow-marvel', { opacity: 0, scale: 0.8 });
    gsap.set('.gsap-hero-glow-dc', { opacity: 0, scale: 0.8 });

    // Spotlights reveals
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

    // Premium Badge fades in
    tl.fromTo(
      '.gsap-hero-badge',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=2.0'
    );

    // Title line-by-line reveal
    tl.fromTo(
      '.gsap-hero-title-part',
      { y: 65, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.15,
        ease: 'power4.out',
      },
      '-=1.6'
    );

    // "INNER" text scaling
    tl.fromTo(
      '.gsap-hero-title-inner',
      { scale: 0.9 },
      { scale: 1.03, duration: 1.2, ease: 'back.out(1.5)' },
      '-=1.2'
    );

    // Paragraph fades upward
    tl.fromTo(
      '.gsap-hero-subtitle',
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=1.0'
    );

    // Buttons reveal staggered
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

    // 3D Canvas Preview scales & fades in
    tl.fromTo(
      '.gsap-hero-customizer',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out' },
      '-=0.8'
    );

    // Infinite GSAP floating animation loop
    if (floatRef.current) {
      gsap.to(floatRef.current, {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, { dependencies: [reducedMotion] });

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
            <span className="gsap-hero-title-part gsap-hero-title-inner block text-accent-marvel text-glow-marvel my-1 origin-center">
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

        {/* 3D T-Shirt Floating Preview */}
        <div className="gsap-hero-customizer flex items-center justify-center relative select-none w-full">
          <div
            ref={floatRef}
            className="w-full max-w-[480px] aspect-[4/5] relative"
          >
            {/* Soft red radial glow behind the shirt */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-[rgba(229,9,20,0.08)] blur-[80px]" />
              <div className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-[rgba(4,118,242,0.06)] blur-[60px]" />
            </div>
            {/* 3D Canvas */}
            <div className="relative z-10 w-full h-full">
              <ShirtViewer fallbackColorTheme="default" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
export default Hero;
