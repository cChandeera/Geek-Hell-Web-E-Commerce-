import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavLinkItem {
  label: string;
  href: string;
  franchise?: 'marvel' | 'dc';
}

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileBackdropRef = useRef<HTMLDivElement>(null);

  const navLinks: NavLinkItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Marvel', href: '/collections/marvel', franchise: 'marvel' },
    { label: 'DC Universe', href: '/collections/dc', franchise: 'dc' },
    { label: 'Collections', href: '/collections' },
    { label: '3D Customizer', href: '/customizer' },
    { label: 'About', href: '/about' },
  ];

  // Scroll listener for sticky glassmorphism transformation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP entrance animations
  useGSAP(() => {
    if (reducedMotion) {
      gsap.set('.gsap-nav-bar', { y: 0, opacity: 1 });
      gsap.set('.gsap-nav-logo', { scale: 1, opacity: 1 });
      gsap.set('.gsap-nav-link', { y: 0, opacity: 1 });
      gsap.set('.gsap-nav-action', { scale: 1, opacity: 1 });
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(
      '.gsap-nav-bar',
      { y: -80, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out'
      }
    );

    tl.fromTo(
      '.gsap-nav-logo',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    tl.fromTo(
      '.gsap-nav-link',
      { y: -15, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    tl.fromTo(
      '.gsap-nav-action',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }, { dependencies: [reducedMotion] });

  // Search slide and fade toggle animation using GSAP
  useGSAP(() => {
    if (!searchRef.current) return;

    if (isSearchOpen) {
      gsap.fromTo(
        searchRef.current,
        { opacity: 0, y: -20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: reducedMotion ? 0.01 : 0.4, 
          ease: 'power3.out' 
        }
      );
    }
  }, { dependencies: [isSearchOpen, reducedMotion] });

  // Mobile drawer slide and fade overlay animations using GSAP
  useGSAP(() => {
    if (isMobileMenuOpen) {
      if (mobileBackdropRef.current) {
        gsap.fromTo(
          mobileBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: reducedMotion ? 0.01 : 0.3 }
        );
      }
      if (mobileMenuRef.current) {
        gsap.fromTo(
          mobileMenuRef.current,
          { x: '100%' },
          { 
            x: 0, 
            duration: reducedMotion ? 0.01 : 0.4, 
            ease: 'power3.out' 
          }
        );
      }
    }
  }, { dependencies: [isMobileMenuOpen, reducedMotion] });

  // Close menus on page transitions
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          'gsap-nav-bar fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b',
          isScrolled
            ? 'glass-panel bg-background/70 shadow-glass py-3'
            : 'bg-transparent border-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="gsap-nav-logo flex items-center gap-2.5 font-display font-black text-lg tracking-widest text-white select-none hover:opacity-90 group"
          >
            <img src="/geekhell.png" alt="Geek Hell Logo" className="w-8 h-8 object-contain group-hover:scale-105 transition-all duration-300" />
            <span className="hidden sm:inline-block tracking-[0.2em] font-extrabold uppercase">
              GEEK <span className="text-primary group-hover:text-primary/90 transition-colors duration-300">HELL</span>
            </span>
          </Link>

          {/* Desktop Navigation Links with active/hover underlines */}
          <nav className="hidden md:flex items-center gap-8 select-none">
            {navLinks.map((link) => {
              const isActiveLink = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    'gsap-nav-link text-xs font-semibold uppercase tracking-wider transition-all duration-300 relative py-2 group hover:text-white',
                    isActiveLink ? 'text-white' : 'text-text-secondary',
                    link.franchise === 'marvel' && 'hover:text-accent-marvel hover:text-glow-marvel',
                    link.franchise === 'dc' && 'hover:text-accent-dc hover:text-glow-dc'
                  )}
                >
                  {link.label}
                  {/* Underline indicators */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100',
                      isActiveLink && 'scale-x-100',
                      link.franchise === 'marvel'
                        ? 'bg-accent-marvel'
                        : link.franchise === 'dc'
                        ? 'bg-accent-dc'
                        : 'bg-primary'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-5 select-none">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="gsap-nav-action p-2 text-text-secondary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
              aria-label="Toggle Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="gsap-nav-action p-2 text-text-secondary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* Cart Link with Indicator Badge */}
            <Link
              to="/cart"
              className="gsap-nav-action p-2 text-text-secondary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-marvel-glow">
                0
              </span>
            </Link>

            {/* Login / Profile */}
            <Link
              to="/login"
              className="gsap-nav-action hidden sm:inline-flex items-center gap-1 px-4 py-2 glass-panel hover:bg-surface-hover/50 hover:scale-105 active:scale-95 rounded-full text-xs font-semibold text-white transition-all duration-300"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Login</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-white transition-all duration-300 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Expandable Search Overlay */}
      {isSearchOpen && (
        <div
          ref={searchRef}
          className="fixed top-[73px] left-0 w-full glass-panel bg-background/95 border-t border-b border-surface-border/50 py-4 px-6 z-40 shadow-glass"
        >
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search premium apparel, collections, characters..."
              autoFocus
              className="w-full bg-transparent border-none text-text-primary text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-text-muted"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs uppercase font-semibold text-text-secondary hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Dark Backdrop */}
          <div
            ref={mobileBackdropRef}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Navigation Drawer */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-[280px] bg-background border-l border-surface-border z-40 md:hidden shadow-glass flex flex-col p-6 pt-24"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActiveLink = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={cn(
                      'text-sm font-semibold uppercase tracking-wider transition-all duration-300 py-1.5 border-b border-surface-border/30 hover:pl-2',
                      isActiveLink ? 'text-white pl-2' : 'text-text-secondary',
                      link.franchise === 'marvel' && 'hover:text-accent-marvel hover:text-glow-marvel',
                      link.franchise === 'dc' && 'hover:text-accent-dc hover:text-glow-dc'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-hover font-semibold text-sm text-white rounded-lg transition-all duration-300 mt-4 shadow-marvel-glow"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Navbar;
