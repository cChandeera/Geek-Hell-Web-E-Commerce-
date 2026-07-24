import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ProductItem } from '../../types';
import { ProductCard } from './ProductCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export interface FeaturedProductsProps {
  products?: ProductItem[];
  onCustomize?: (product: ProductItem) => void;
}

const MOCK_PRODUCTS: (ProductItem & { imageUrl: string })[] = [
  {
    id: 'prod-ironman',
    title: 'Iron Man Legacy',
    slug: 'iron-man-legacy',
    description: 'Tony Stark inspired heavy-cotton signature armor plate print tee.',
    price: 44.99,
    discountPrice: 39.99,
    franchiseTag: 'Marvel',
    baseModelUrl: '/models/shirt.glb',
    availableColors: [
      { name: 'Marvel Red', hex: '#e50914' },
      { name: 'Stark Gold', hex: '#f5c518' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockInventory: 45,
    ratingsAverage: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 'prod-batman',
    title: 'Dark Knight Rising',
    slug: 'dark-knight-rising',
    description: 'Gotham vigilante premium fitted graphic print chest logo tee.',
    price: 42.99,
    franchiseTag: 'DC',
    baseModelUrl: '/models/shirt.glb',
    availableColors: [
      { name: 'Obsidian Black', hex: '#050507' },
      { name: 'DC Blue', hex: '#0476f2' },
    ],
    availableSizes: ['M', 'L', 'XL', '2XL'],
    stockInventory: 28,
    ratingsAverage: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'prod-spiderman',
    title: 'Web Slinger Custom',
    slug: 'web-slinger-custom',
    description: 'Active fit stretch knit spider web pattern custom street apparel.',
    price: 38.99,
    franchiseTag: 'Marvel',
    baseModelUrl: '/models/shirt.glb',
    availableColors: [
      { name: 'Classic Red', hex: '#e50914' },
      { name: 'Midnight Blue', hex: '#002fbe' },
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockInventory: 60,
    ratingsAverage: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop',
  },
  {
    id: 'prod-wonderwoman',
    title: 'Wonder Woman Crest',
    slug: 'wonder-woman-crest',
    description: 'Amazonian warrior metallic gold screen printed crewneck tee.',
    price: 40.99,
    franchiseTag: 'DC',
    baseModelUrl: '/models/shirt.glb',
    availableColors: [
      { name: 'Royal Blue', hex: '#0476f2' },
      { name: 'Crimson Red', hex: '#e50914' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockInventory: 12,
    ratingsAverage: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2000&auto=format&fit=crop',
  },
];

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products = MOCK_PRODUCTS,
  onCustomize,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // ScrollTrigger stagger reveal of product cards
  useGSAP(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (reducedMotion) {
      gsap.set('.gsap-product-card-wrap', { y: 0, opacity: 1 });
      return;
    }

    gsap.fromTo(
      grid.querySelectorAll('.gsap-product-card-wrap'),
      { y: 60, opacity: 0 },
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

  return (
    <section className="py-24 bg-[#050507] border-b border-surface-border relative z-10 select-none px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary text-glow-marvel">
              Trending Now
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-display">
              Fan Favorites
            </h2>
          </div>
          <p className="text-text-secondary text-sm max-w-md leading-relaxed font-medium">
            Premium custom printed T-Shirts crafted for true legends. Marvel, DC, Comics, Gaming. All in one universe.
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="gsap-product-card-wrap">
              <ProductCard
                product={product}
                onCustomize={onCustomize}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default FeaturedProducts;
