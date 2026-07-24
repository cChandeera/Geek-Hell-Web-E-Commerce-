import React, { useRef } from 'react';
import { Sparkles, ShieldCheck, Zap, Truck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Card, CardContent } from '../common/Card';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconGlowClass: string;
}

export const WhyChooseUs: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const features: FeatureItem[] = [
    {
      id: 'feature-customizer',
      title: '3D WebGL Sandbox',
      description: 'Design and personalize premium superhero apparel in real-time inside our interactive 3D studio.',
      icon: <Sparkles className="w-5 h-5 text-accent-marvel" />,
      iconGlowClass: 'bg-accent-marvel/10 text-accent-marvel border-accent-marvel/20 shadow-marvel-glow',
    },
    {
      id: 'feature-quality',
      title: 'Premium Craftsmanship',
      description: 'Crafted from heavy-duty organic combed cotton with high-durability screen prints built for legends.',
      icon: <ShieldCheck className="w-5 h-5 text-accent-gold" />,
      iconGlowClass: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20 shadow-gold-glow',
    },
    {
      id: 'feature-franchises',
      title: 'Official Franchise Gear',
      description: 'Unleash your allegiances with verified licensed designs spanning Marvel, DC, and Anime universes.',
      icon: <Zap className="w-5 h-5 text-accent-dc" />,
      iconGlowClass: 'bg-accent-dc/10 text-accent-dc border-accent-dc/20 shadow-dc-glow',
    },
    {
      id: 'feature-shipping',
      title: 'Express Delivery',
      description: 'Secure multi-step payments, rapid order printing, and premium collector-box packaging delivered straight to your sector.',
      icon: <Truck className="w-5 h-5 text-success" />,
      iconGlowClass: 'bg-success/10 text-success border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    },
  ];

  // ScrollTrigger entrance animation for why cards
  useGSAP(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (reducedMotion) {
      gsap.set('.gsap-why-card', { y: 0, opacity: 1 });
      return;
    }

    gsap.fromTo(
      grid.querySelectorAll('.gsap-why-card'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: gridRef, dependencies: [reducedMotion] });

  // Hover animations using GSAP
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const card = e.currentTarget;
    const icon = card.querySelector('.gsap-why-icon');
    
    gsap.killTweensOf([card, icon]);

    // Lift card and apply deep shadow
    gsap.to(card, {
      y: -6,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
      duration: 0.3,
      ease: 'power2.out',
    });

    // Slightly rotate the icon wrapper
    if (icon) {
      gsap.to(icon, {
        rotation: 12,
        scale: 1.05,
        duration: 0.4,
        ease: 'back.out(1.5)',
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const card = e.currentTarget;
    const icon = card.querySelector('.gsap-why-icon');

    gsap.killTweensOf([card, icon]);

    // Reset card translation and borders
    gsap.to(card, {
      y: 0,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: 'none',
      duration: 0.3,
      ease: 'power2.out',
    });

    if (icon) {
      gsap.to(icon, {
        rotation: 0,
        scale: 1.0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section className="py-24 bg-[#050507] border-b border-surface-border relative z-10 select-none px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary text-glow-marvel">
            Uncompromising Standards
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-display">
            Why Geek Hell?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed font-medium mt-1">
            We merge cutting-edge WebGL interactive configuration with heavy-cotton street style to craft premium superhero custom apparel.
          </p>
        </div>

        {/* 4-Column Responsive Features Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="gsap-why-card h-full"
            >
              <Card
                variant="glass-card"
                className="select-none flex flex-col h-full border border-white/5"
              >
                <CardContent className="p-8 flex flex-col gap-5 items-center text-center lg:items-start lg:text-left h-full justify-between">
                  
                  {/* Icon Wrapper with Custom Glow */}
                  <div className={`gsap-why-icon w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.iconGlowClass} origin-center`}>
                    {feature.icon}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2.5 flex-grow">
                    <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-display">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                </CardContent>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default WhyChooseUs;
