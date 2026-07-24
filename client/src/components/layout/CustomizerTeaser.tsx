import React, { useRef } from 'react';
import { Paintbrush } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '../common/Button';
import { ShirtViewer } from '../common/shirt/ShirtViewer';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export interface CustomizerTeaserProps {
  onLaunchCustomizer?: () => void;
}

export const CustomizerTeaser: React.FC<CustomizerTeaserProps> = ({
  onLaunchCustomizer,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // ScrollTrigger entrance slide and fade animations using useGSAP
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set(section, { opacity: 1 });
      gsap.set('.gsap-teaser-left', { x: 0, opacity: 1 });
      gsap.set('.gsap-teaser-right', { x: 0, opacity: 1 });
      return;
    }

    // Set initial hidden properties
    gsap.set(section, { opacity: 0 });
    gsap.set('.gsap-teaser-left', { x: -80, opacity: 0 });
    gsap.set('.gsap-teaser-right', { x: 80, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    tl.to(section, { opacity: 1, duration: 0.1 });

    tl.to('.gsap-teaser-left', {
      x: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'power3.out',
    });

    tl.to('.gsap-teaser-right', {
      x: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'power3.out',
    }, '-=0.8');

    // CTA button gentle scale pulse loop
    gsap.to('.gsap-teaser-btn', {
      scale: 1.03,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, { scope: sectionRef, dependencies: [reducedMotion] });

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#050507] border-b border-surface-border relative z-10 select-none px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Content Info */}
        <div className="gsap-teaser-left flex flex-col items-center lg:items-start text-center lg:text-left select-none">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary text-glow-marvel mb-3 block font-display">
            Interactive 3D Engine
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white font-display leading-[0.9] mb-6">
            Design Your
            <br />
            Own Legend
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed font-medium mb-10 max-w-lg">
            Step into the 3D Customizer Sandbox. Upload custom vector graphics, scale and position decals, adjust garment colors, and preview print layouts on a high-fidelity 3D model in real-time.
          </p>
          
          <Button
            variant="primary"
            size="lg"
            onClick={onLaunchCustomizer}
            className="gsap-teaser-btn flex items-center gap-2 select-none"
            leftIcon={<Paintbrush className="w-4 h-4" />}
          >
            Launch 3D Customizer
          </Button>
        </div>

        {/* Right: Interactive 3D Model Sandbox */}
        <div className="gsap-teaser-right flex items-center justify-center relative select-none w-full">
          <div className="w-full max-w-[500px] aspect-[4/3] sm:aspect-square lg:aspect-[4/3] glass-card border border-white/5 relative p-4 rounded-3xl overflow-hidden group shadow-glass">
            
            {/* Background Spotlights */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-80 pointer-events-none z-0" />
            <div className="absolute inset-0 bg-radial-gradient from-[rgba(229,9,20,0.08)] via-transparent to-transparent blur-[60px] opacity-70 pointer-events-none z-0" />
            
            {/* 3D Model Canvas Element */}
            <div className="w-full h-full relative z-10">
              <ShirtViewer fallbackColorTheme="default" />
            </div>

            {/* Sandbox overlay prompts */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-text-secondary/70">
                Click & Drag to Rotate
              </span>
            </div>
            <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-text-secondary/70">
                Scroll to Zoom
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
export default CustomizerTeaser;
