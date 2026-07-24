import React, { useRef } from 'react';
import { Star, Paintbrush } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ProductItem } from '../../types';
import { Card, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ProductCardProps {
  product: ProductItem & { imageUrl?: string };
  onCustomize?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomize }) => {
  const isMarvel = product.franchiseTag === 'Marvel';
  const isDC = product.franchiseTag === 'DC';
  
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Resolve glow theme and button variant matching franchise
  const glowTheme = isMarvel ? 'marvel' : isDC ? 'dc' : 'none';
  const buttonVariant = isMarvel ? 'marvel' : isDC ? 'dc' : 'primary';

  // Set initial button transform state on mount
  useGSAP(() => {
    if (reducedMotion) return;
    gsap.set('.gsap-card-btn', { y: 6 });
  }, { scope: cardRef, dependencies: [reducedMotion] });

  // Hover handlers using GSAP timelines
  const handleMouseEnter = () => {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const img = card.querySelector('.gsap-card-img');
    const btn = card.querySelector('.gsap-card-btn');

    gsap.killTweensOf([card, img, btn]);

    // Lift card and glow border
    gsap.to(card, {
      y: -8,
      borderColor: isMarvel 
        ? 'rgba(229, 9, 20, 0.4)' 
        : isDC 
        ? 'rgba(4, 118, 242, 0.4)' 
        : 'rgba(245, 197, 24, 0.4)',
      boxShadow: isMarvel 
        ? '0 10px 25px rgba(229, 9, 20, 0.25)' 
        : isDC 
        ? '0 10px 25px rgba(4, 118, 242, 0.25)' 
        : '0 10px 20px rgba(245, 197, 24, 0.15)',
      duration: 0.3,
      ease: 'power2.out',
    });

    // Image Zoom
    if (img) {
      gsap.to(img, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    // Button slide upward
    if (btn) {
      gsap.to(btn, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const img = card.querySelector('.gsap-card-img');
    const btn = card.querySelector('.gsap-card-btn');

    gsap.killTweensOf([card, img, btn]);

    // Reset card translation & borders
    gsap.to(card, {
      y: 0,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: 'none',
      duration: 0.3,
      ease: 'power2.out',
    });

    if (img) {
      gsap.to(img, {
        scale: 1.0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    if (btn) {
      gsap.to(btn, {
        y: 6,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  // Render Star Ratings up to 5 stars
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= floorRating
              ? 'text-accent-gold fill-accent-gold'
              : 'text-text-muted fill-transparent'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <Card
        variant="glass-card"
        hoverGlow={glowTheme}
        className="gsap-product-card relative flex flex-col justify-between transition-all duration-300 select-none h-full border border-white/5"
      >
        {/* Top Media Section */}
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
          {/* Franchise Tag Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant={isMarvel ? 'marvel' : isDC ? 'dc' : 'primary'}
              glow={isMarvel || isDC}
            >
              {product.franchiseTag}
            </Badge>
          </div>

          {/* Product Image */}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              loading="lazy"
              className="gsap-card-img w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background-surface/40 text-text-muted">
              <svg
                className="w-12 h-12 opacity-30"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M10,25 C15,22 25,23 30,28 C32,25 35,22 45,22 C55,22 58,25 60,28 C65,23 75,22 80,25 L90,40 L78,48 L75,42 L75,85 C75,90 70,92 65,92 L25,92 C20,92 15,90 15,85 L15,42 L12,48 L0,40 Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info Section */}
        <CardContent className="flex flex-col flex-grow p-5 justify-between">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">{renderStars(product.ratingsAverage)}</div>
              <span className="text-[10px] font-bold text-text-secondary ml-1 mt-0.5">
                ({product.ratingsAverage.toFixed(1)})
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-display line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {product.title}
            </h3>

            {/* Short description */}
            <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Action Row */}
          <div className="mt-5 pt-4 border-t border-surface-border/50 flex items-center justify-between">
            <div className="flex flex-col">
              {product.discountPrice ? (
                <>
                  <span className="text-xs text-text-muted line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-black text-white font-display">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-black text-white font-display">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              variant={buttonVariant}
              size="sm"
              onClick={() => onCustomize?.(product)}
              className="gsap-card-btn flex items-center gap-1 px-3 py-2 shadow-md"
              leftIcon={<Paintbrush className="w-3.5 h-3.5" />}
            >
              Customize
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ProductCard;
