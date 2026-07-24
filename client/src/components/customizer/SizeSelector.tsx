import React from 'react';
import { useCustomizerStore } from '../../store/customizerStore';
import type { GarmentSize } from '../../types';
import { cn } from '../../utils/cn';

const SIZES: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

export const SizeSelector: React.FC = () => {
  const selectedSize = useCustomizerStore((s) => s.selectedSize);
  const setSize = useCustomizerStore((s) => s.setSize);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-text-muted">
        Size
      </span>
      <div className="flex flex-wrap gap-2">
        {SIZES.map((size) => {
          const isActive = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => setSize(size)}
              className={cn(
                'px-3.5 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none',
                isActive
                  ? 'border-primary bg-primary/15 text-primary shadow-[0_0_10px_rgba(229,9,20,0.15)]'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-white'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};
