import React, { useState, useMemo } from 'react';
import { Search, Shield, Zap, Sparkles, Gamepad2, Type } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCustomizerStore } from '../../store/customizerStore';
import designsData from '../../constants/designs.json';
import { cn } from '../../utils/cn';
import { TextLayerPanel } from './TextLayerPanel';

interface Design {
  id: string;
  name: string;
  category: string;
  character: string;
  thumbnailUrl: string;
  textureUrl: string;
}

const DESIGNS = designsData as Design[];

const CATEGORIES = [
  {
    id: 'Marvel',
    label: 'Marvel',
    icon: <Zap className="w-4 h-4" />,
    activeClass: 'border-accent-marvel bg-accent-marvel/15 text-accent-marvel shadow-[0_0_12px_rgba(229,9,20,0.2)]',
  },
  {
    id: 'DC',
    label: 'DC',
    icon: <Shield className="w-4 h-4" />,
    activeClass: 'border-accent-dc bg-accent-dc/15 text-accent-dc shadow-[0_0_12px_rgba(4,118,242,0.2)]',
  },
  {
    id: 'Anime',
    label: 'Anime',
    icon: <Sparkles className="w-4 h-4" />,
    activeClass: 'border-amber-500/50 bg-amber-500/15 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
  },
  {
    id: 'Gaming',
    label: 'Gaming',
    icon: <Gamepad2 className="w-4 h-4" />,
    activeClass: 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  },
];

export const DesignGallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Marvel');
  const [showTextPanel, setShowTextPanel] = useState(false);

  // Zustand Store values
  const uploadedDesign = useCustomizerStore((s) => s.uploadedDesign);
  const setDesign = useCustomizerStore((s) => s.setDesign);
  const currentView = useCustomizerStore((s) => s.currentView);
  const setCurrentView = useCustomizerStore((s) => s.setCurrentView);

  // Filtered designs logic
  const filteredDesigns = useMemo(() => {
    return DESIGNS.filter((design) => {
      // 1. Category Filter
      if (design.category !== selectedCategory) return false;

      // 2. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          design.name.toLowerCase().includes(query) ||
          design.character.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectDesign = (design: Design) => {
    setDesign(design.textureUrl);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* View Selector (Front / Back) */}
      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted select-none">
          Print Placement
        </span>
        <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl gap-1">
          {(['front', 'back'] as const).map((view) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={cn(
                  'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer select-none text-center border',
                  isActive
                    ? 'border-primary/30 bg-primary/15 text-primary shadow-[0_0_12px_rgba(229,9,20,0.25)]'
                    : 'border-white/5 bg-white/[0.01] text-text-muted hover:text-white'
                )}
              >
                {view} Side
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search current category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background-surface/50 border border-white/5 rounded-xl text-text-primary text-xs focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 animate-fade-in"
        />
      </div>

      {/* Split Panel: Left Category Sidebar & Right Grid */}
      <div className="flex gap-4 flex-1 overflow-hidden min-h-[340px]">
        {/* Left Categories Sidebar */}
        <div className="w-[64px] flex flex-col gap-2.5 border-r border-white/5 pr-2.5 flex-shrink-0">
          {/* Category buttons */}
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchQuery(''); // Clear search on category change
                }}
                className={cn(
                  'flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all duration-300 gap-1.5 cursor-pointer select-none text-center',
                  isActive
                    ? cat.activeClass
                    : 'border-white/5 bg-white/[0.01] text-text-muted hover:text-white hover:border-white/10'
                )}
              >
                {cat.icon}
                <span className="scale-90">{cat.label}</span>
              </button>
            );
          })}

          {/* Text Layer button — below Gaming */}
          <div className="pt-1.5 border-t border-white/8 mt-0.5">
            <button
              onClick={() => setShowTextPanel(true)}
              className="w-full flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all duration-300 gap-1.5 cursor-pointer select-none text-center border-blue-400/25 bg-blue-400/5 text-blue-400 hover:bg-blue-400/15 hover:border-blue-400/50 hover:shadow-[0_0_12px_rgba(96,165,250,0.2)]"
            >
              <Type className="w-4 h-4" />
              <span className="scale-90">Text</span>
            </button>
          </div>
        </div>

        {/* Right Scrollable Grid of Thumbnails */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar flex flex-col gap-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted select-none">
            {selectedCategory} Designs ({filteredDesigns.length})
          </span>
          {filteredDesigns.length === 0 ? (
            <div className="text-center py-10 text-[10px] text-text-muted select-none">
              No designs found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredDesigns.map((design) => {
                const isActive = uploadedDesign === design.textureUrl;
                return (
                  <motion.div
                    key={design.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectDesign(design)}
                    className={cn(
                      'relative aspect-square border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group',
                      isActive
                        ? 'border-primary bg-primary/5 shadow-[0_0_10px_rgba(229,9,20,0.25)]'
                        : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                    )}
                  >
                    <img
                      src={design.thumbnailUrl}
                      alt={design.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-1.5 flex flex-col justify-end">
                      <span className="text-[8px] font-extrabold text-white truncate">{design.name}</span>
                      <span className="text-[6px] font-semibold text-text-muted truncate">{design.character}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Text Layer Panel */}
      {showTextPanel && <TextLayerPanel onClose={() => setShowTextPanel(false)} />}
    </div>
  );
};
