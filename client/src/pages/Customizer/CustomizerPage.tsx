import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ShoppingCart } from 'lucide-react';
import { CustomizerCanvas } from '../../components/customizer/CustomizerCanvas';
import { CollectionPicker } from '../../components/customizer/CollectionPicker';
import { ColorPicker } from '../../components/customizer/ColorPicker';
import { SizeSelector } from '../../components/customizer/SizeSelector';
import { DesignGallery } from '../../components/customizer/DesignGallery';
import { DesignControls } from '../../components/customizer/DesignControls';
import { Button } from '../../components/common/Button';
import { useCustomizerStore } from '../../store/customizerStore';

export const CustomizerPage: React.FC = () => {
  const resetAll = useCustomizerStore((s) => s.resetAll);
  const shirtColor = useCustomizerStore((s) => s.shirtColor);
  const selectedSize = useCustomizerStore((s) => s.selectedSize);

  const handleAddToCart = () => {
    console.log('[Customizer] Add to cart:', {
      shirtColor,
      selectedSize,
      // In production, this would dispatch to a cart store
    });
  };

  return (
    <div className="h-screen w-full bg-[#050507] flex flex-col overflow-hidden select-none">

      {/* ── Top Bar ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 h-14 border-b border-white/5 bg-[#050507]/90 backdrop-blur-md z-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Back</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <img src="/geekhell.png" alt="Geek Hell Logo" className="w-7 h-7 object-contain" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-white font-display">
            3D <span className="text-primary">Customizer</span>
          </span>
        </div>

        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[280px_1fr_280px] overflow-hidden">

        {/* ── Left Sidebar ── */}
        <aside className="order-2 lg:order-1 flex-shrink-0 lg:h-full overflow-y-auto border-r border-white/5 bg-[#080810]/60 p-5 flex flex-col gap-6">
          <CollectionPicker />

          <div className="w-full h-px bg-white/5" />

          <ColorPicker />

          <div className="w-full h-px bg-white/5" />

          <SizeSelector />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            className="w-full border-white/10 text-text-secondary hover:text-white hover:border-white/20"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset All
          </Button>
        </aside>

        {/* ── Center Canvas ── */}
        <main className="order-1 lg:order-2 flex-1 min-h-[50vh] lg:min-h-0 relative bg-[#050507]">
          {/* Ambient glow behind shirt */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-[rgba(229,9,20,0.06)] blur-[100px]" />
            <div className="absolute top-[55%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-[rgba(4,118,242,0.04)] blur-[80px]" />
          </div>

          <div className="relative z-10 w-full h-full">
            <CustomizerCanvas />
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="order-3 flex-shrink-0 lg:h-full overflow-y-auto border-l border-white/5 bg-[#080810]/60 p-5 flex flex-col gap-6">
          <DesignGallery />

          <DesignControls />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Add To Cart */}
          <Button
            variant="marvel"
            size="lg"
            onClick={handleAddToCart}
            className="w-full shadow-lg"
            leftIcon={<ShoppingCart className="w-4 h-4" />}
          >
            Add To Cart
          </Button>
        </aside>

      </div>
    </div>
  );
};
export default CustomizerPage;
