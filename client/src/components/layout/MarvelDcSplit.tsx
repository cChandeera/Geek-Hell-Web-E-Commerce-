import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

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
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1974&auto=format&fit=crop', // High-res cinematic Spider-Man suit theme placeholder
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
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop', // High-res dark ambient neon theme placeholder
    link: '/collections/dc',
  },
];

export const MarvelDcSplit: React.FC<MarvelDcSplitProps> = ({
  panes = DEFAULT_PANES,
  onCtaClick,
}) => {
  const [hoveredSide, setHoveredSide] = useState<'none' | 'marvel' | 'dc'>('none');
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance reveal animations on scroll / intersection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    if (!section) return;

    const leftPane = section.querySelector('.gsap-split-marvel');
    const rightPane = section.querySelector('.gsap-split-dc');
    const leftInner = section.querySelector('.gsap-split-marvel-inner');
    const rightInner = section.querySelector('.gsap-split-dc-inner');

    // Setup initial hidden states
    gsap.set(section, { opacity: 0 });
    if (leftInner && rightInner) {
      gsap.set(leftInner, { y: 40, opacity: 0 });
      gsap.set(rightInner, { y: 40, opacity: 0 });
    }

    // Simple Observer implementation for fade-in on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline();
            
            tl.to(section, {
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            });

            if (leftPane && rightPane && leftInner && rightInner) {
              tl.fromTo(
                [leftPane, rightPane],
                { scaleY: 0 },
                {
                  scaleY: 1,
                  duration: 1.0,
                  stagger: 0.15,
                  ease: 'power3.inOut',
                  transformOrigin: 'top',
                },
                '-=0.4'
              );

              tl.to(
                [leftInner, rightInner],
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: 'power2.out',
                },
                '-=0.4'
              );
            }

            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
          <motion.div
            key={pane.id}
            layout
            onMouseEnter={() => setHoveredSide(sideKey)}
            onMouseLeave={() => setHoveredSide('none')}
            className={cn(
              'relative h-[50vh] md:h-full flex-1 overflow-hidden transition-all duration-700 ease-out group',
              isMarvel ? 'gsap-split-marvel border-b md:border-b-0 md:border-r border-surface-border/50' : 'gsap-split-dc'
            )}
            style={{
              flexGrow: isHovered ? 1.85 : isAnyHovered ? 0.85 : 1, // Translates to roughly 65% / 35% on hover
            }}
          >
            {/* Background Image Placeholder with slow scale Ken Burns effect */}
            <div className="absolute inset-0 z-0">
              <div
                className={cn(
                  'w-full h-full bg-cover bg-center transition-transform duration-[12s] ease-out scale-105 group-hover:scale-115 opacity-30 group-hover:opacity-40 filter grayscale contrast-125'
                )}
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
                  className="group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                  rightIcon={
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  }
                >
                  {pane.buttonText}
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
