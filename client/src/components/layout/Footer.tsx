import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop Catalog', href: '/shop' },
    { label: '3D Customizer', href: '/customizer' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const collections = [
    { label: 'Marvel Collection', href: '/collections/marvel' },
    { label: 'DC Universe', href: '/collections/dc' },
    { label: 'Anime Custom', href: '/collections/anime' },
    { label: 'Geek Originals', href: '/collections/originals' },
  ];

  // ScrollTrigger fade upward on entrance
  useGSAP(() => {
    const footer = footerRef.current;
    if (!footer) return;

    if (reducedMotion) {
      gsap.set(footer, { y: 0, opacity: 1 });
      return;
    }

    gsap.fromTo(
      footer,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: footerRef, dependencies: [reducedMotion] });

  // Social icon scale triggers on hover using GSAP
  const handleSocialEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    gsap.to(e.currentTarget, {
      scale: 1.15,
      duration: 0.3,
      ease: 'back.out(1.5)',
    });
  };

  const handleSocialLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    gsap.to(e.currentTarget, {
      scale: 1.0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[#050507] border-t border-surface-border relative z-10 select-none px-6 pt-20 pb-8"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-surface-border/50">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-display font-black text-lg tracking-widest text-white group"
            >
              <img src="/geekhell.png" alt="Geek Hell Logo" className="w-8 h-8 object-contain group-hover:scale-105 transition-all duration-300" />
              <span className="tracking-[0.2em] font-extrabold uppercase">
                GEEK <span className="text-primary group-hover:text-primary/90 transition-colors duration-300">HELL</span>
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              Premium custom printed T-Shirts crafted for true legends. Marvel, DC, Comics, Gaming. Wear your allegiances.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={handleSocialEnter}
                onMouseLeave={handleSocialLeave}
                className="w-8 h-8 rounded-full border border-surface-border/50 flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-all duration-300 origin-center"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={handleSocialEnter}
                onMouseLeave={handleSocialLeave}
                className="w-8 h-8 rounded-full border border-surface-border/50 flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-all duration-300 origin-center"
                aria-label="Twitter/X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={handleSocialEnter}
                onMouseLeave={handleSocialLeave}
                className="w-8 h-8 rounded-full border border-surface-border/50 flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-all duration-300 origin-center"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-text-secondary hover:text-white hover:pl-1 transition-all duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5">
              {collections.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-text-secondary hover:text-white hover:pl-1 transition-all duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Join the Universe
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Subscribe to receive updates on new drops, exclusive designs, and customizer upgrades.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                focusTheme="marvel"
                required
                className="py-2.5 border-white/5"
              />
              <Button
                variant="primary"
                type="submit"
                className="w-full flex items-center justify-center gap-2 select-none"
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Subscribe
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-text-muted uppercase tracking-widest text-center md:text-left">
            &copy; 2026 GEEK HELL. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-[10px] text-text-muted hover:text-white uppercase tracking-widest transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] text-text-muted hover:text-white uppercase tracking-widest transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
