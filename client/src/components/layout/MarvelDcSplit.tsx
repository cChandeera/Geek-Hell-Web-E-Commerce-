import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export interface SplitPaneData {
  id: string;
  franchise: 'marvel' | 'dc';
  subtitle: string;
  title: string;
  description: string;
  countText: string;
  buttonText: string;
  imageUrl: string;
  link: string;
}

export interface MarvelDcSplitProps {
  panes?: SplitPaneData[];
  onCtaClick?: (franchise: 'marvel' | 'dc', link: string) => void;
}

const DEFAULT_PANES: SplitPaneData[] = [
  {
    id: 'marvel-pane',
    franchise: 'marvel',
    subtitle: 'Marvel Universe',
    title: 'Marvel\nCollection',
    description: 'Iron Man. Spider-Man. Avengers. Every legend, every story. Wear your universe.',
    countText: '180+ Designs Available',
    buttonText: 'Explore Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1974&auto=format&fit=crop',
    link: '/collections/marvel',
  },
  {
    id: 'dc-pane',
    franchise: 'dc',
    subtitle: 'DC Universe',
    title: 'DC\nCollection',
    description: 'Batman. Wonder Woman. Superman. The greatest heroes demand premium gear.',
    countText: '160+ Designs Available',
    buttonText: 'Explore DC',
    imageUrl: '/batman_dc_banner.png',
    link: '/collections/dc',
  },
];

export const MarvelDcSplit: React.FC<MarvelDcSplitProps> = ({
  panes = DEFAULT_PANES,
  onCtaClick,
}) => {
  const [hoveredSide, setHoveredSide] = useState<'none' | 'marvel' | 'dc'>('none');
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // ScrollTrigger layout timelines in useGSAP
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      gsap.set(section, { opacity: 1 });
      gsap.set('.gsap-split-marvel', { x: 0, opacity: 1 });
      gsap.set('.gsap-split-dc', { x: 0, opacity: 1 });
      gsap.set('.gsap-split-marvel-inner', { y: 0, opacity: 1 });
      gsap.set('.gsap-split-dc-inner', { y: 0, opacity: 1 });
      gsap.set('.gsap-split-btn', { opacity: 1 });
      return;
    }

    // Set initial hidden properties
    gsap.set(section, { opacity: 0 });
    gsap.set('.gsap-split-marvel', { x: -160, opacity: 0 });
    gsap.set('.gsap-split-dc', { x: 160, opacity: 0 });
    gsap.set('.gsap-split-marvel-inner', { y: 30, opacity: 0 });
    gsap.set('.gsap-split-dc-inner', { y: 30, opacity: 0 });
    gsap.set('.gsap-split-btn', { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
      }
    });

    tl.to(section, { opacity: 1, duration: 0.1 });

    tl.to('.gsap-split-marvel', {
      x: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'power3.out'
    });

    tl.to('.gsap-split-dc', {
      x: 0,
      opacity: 1,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.8');

    tl.to(
      ['.gsap-split-marvel-inner', '.gsap-split-dc-inner'],
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      },
      '-=0.6'
    );

    tl.to('.gsap-split-btn', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.4');

    // Ken Burns scroll parallax zooming on background images
    gsap.to('.gsap-split-bg', {
      scale: 1.15,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  }, { dependencies: [reducedMotion] });

  return (
    <div
      ref={sectionRef}
      className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-[#050507] relative z-10 border-b border-surface-border select-none"
    >
      {panes.map((pane) => {
        const isMarvel = pane.franchise === 'marvel';
        const sideKey = pane.franchise;
        const isHovered = hoveredSide === sideKey;
        const isAnyHovered = hoveredSide !== 'none';
        
        return (
          <div
            key={pane.id}
            onMouseEnter={() => setHoveredSide(sideKey)}
            onMouseLeave={() => setHoveredSide('none')}
            className={cn(
              'relative h-[50vh] md:h-full flex-1 overflow-hidden transition-all duration-700 ease-out group',
              isMarvel 
                ? 'gsap-split-marvel border-b md:border-b-0 md:border-r border-surface-border/50' 
                : 'gsap-split-dc'
            )}
            style={{
              flexGrow: isHovered ? 1.85 : isAnyHovered ? 0.85 : 1,
            }}
          >
            {/* Background Image Placeholder with slow scale Ken Burns effect */}
            <div className="absolute inset-0 z-0">
              <div
                className="gsap-split-bg w-full h-full bg-cover bg-center transition-all duration-700 opacity-30 group-hover:opacity-40 filter grayscale contrast-125 scale-105 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${pane.imageUrl})`,
                }}
              />
              {/* Overlay shadow gradient to mask and cinematic dim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />
            </div>

            {/* Franchise Lighting (Ambient Spotlights) */}
            <div
              className={cn(
                'absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 blur-[80px]',
                isMarvel
                  ? 'bg-radial-gradient from-[rgba(229,9,20,0.18)] via-transparent to-transparent'
                  : 'bg-radial-gradient from-[rgba(4,118,242,0.18)] via-transparent to-transparent'
              )}
              style={{
                opacity: isHovered ? 1.0 : 0.6,
              }}
            />

            {/* Content Container */}
            <div
              className={cn(
                'absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 transition-transform duration-500',
                isMarvel ? 'gsap-split-marvel-inner' : 'gsap-split-dc-inner'
              )}
            >
              {/* Franchise Subtitle Tag */}
              <span
                className={cn(
                  'text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block font-display transition-all duration-500',
                  isMarvel ? 'text-accent-marvel text-glow-marvel' : 'text-accent-dc text-glow-dc',
                  isHovered && '-translate-y-1'
                )}
              >
                {pane.subtitle}
              </span>

              {/* Cinematic Heading Title */}
              <h2
                className={cn(
                  'text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-white font-display leading-[0.9] transition-transform duration-500 ease-out whitespace-pre-line',
                  isHovered && '-translate-y-2'
                )}
              >
                {pane.title}
              </h2>

              {/* Description */}
              <p
                className={cn(
                  'text-text-secondary text-xs md:text-sm font-medium max-w-sm mb-8 leading-relaxed transition-all duration-500',
                  isHovered ? '-translate-y-2 opacity-100' : 'opacity-85'
                )}
              >
                {pane.description}
              </p>

              {/* Action and Count */}
              <div
                className={cn(
                  'flex flex-col items-start gap-1 transition-transform duration-500',
                  isHovered && '-translate-y-1'
                )}
              >
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3 block">
                  {pane.countText}
                </span>

                <Button
                  variant={isMarvel ? 'marvel' : 'dc'}
                  onClick={() => onCtaClick?.(pane.franchise, pane.link)}
                  className="gsap-split-btn shadow-lg"
                  rightIcon={
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  }
                >
                  {pane.buttonText}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default MarvelDcSplit;
