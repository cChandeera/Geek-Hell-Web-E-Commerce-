import React, { useState, useMemo } from 'react';
import { Search, Heart, Shield, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomizerStore } from '../../store/customizerStore';
import designsData from '../../constants/designs.json';
import { cn } from '../../utils/cn';

interface Design {
  id: string;
  name: string;
  category: string;
  character: string;
  thumbnailUrl: string;
  textureUrl: string;
}

const DESIGNS = designsData as Design[];

type GalleryCategory = 'all' | 'marvel' | 'dc' | 'favorites';

export const DesignGallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');

  // Zustand Store values
  const uploadedDesign = useCustomizerStore((s) => s.uploadedDesign);
  const setDesign = useCustomizerStore((s) => s.setDesign);
  const favorites = useCustomizerStore((s) => s.favorites);
  const toggleFavorite = useCustomizerStore((s) => s.toggleFavorite);
  const currentView = useCustomizerStore((s) => s.currentView);
  const setCurrentView = useCustomizerStore((s) => s.setCurrentView);

  // Filtered designs logic
  const filteredDesigns = useMemo(() => {
    return DESIGNS.filter((design) => {
      // 1. Category Filter
      if (selectedCategory === 'marvel' && design.category !== 'Marvel') return false;
      if (selectedCategory === 'dc' && design.category !== 'DC') return false;
      if (selectedCategory === 'favorites' && !favorites.includes(design.id)) return false;

      // 2. Character Filter
      if (selectedCharacter !== 'all' && design.character !== selectedCharacter) return false;

      // 3. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = design.name.toLowerCase().includes(query);
        const matchesChar = design.character.toLowerCase().includes(query);
        return matchesName || matchesChar;
      }

      return true;
    });
  }, [selectedCategory, selectedCharacter, searchQuery, favorites]);

  // Dynamically extract characters based on selected category
  const dynamicCharacters = useMemo(() => {
    const charactersSet = new Set<string>();
    DESIGNS.forEach((design) => {
      if (selectedCategory === 'marvel' && design.category !== 'Marvel') return;
      if (selectedCategory === 'dc' && design.category !== 'DC') return;
      if (selectedCategory === 'favorites' && !favorites.includes(design.id)) return;
      charactersSet.add(design.character);
    });
    return Array.from(charactersSet);
  }, [selectedCategory, favorites]);

  // Reset selected character if it's not in the dynamic list
  React.useEffect(() => {
    if (selectedCharacter !== 'all' && !dynamicCharacters.includes(selectedCharacter)) {
      setSelectedCharacter('all');
    }
  }, [selectedCategory, dynamicCharacters, selectedCharacter]);

  const handleSelectDesign = (design: Design) => {
    setDesign(design.textureUrl);
  };

  return (
    <div className="flex flex-col gap-5 h-full">
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
          placeholder="Search designs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background-surface/50 border border-white/5 rounded-xl text-text-primary text-xs focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
        />
      </div>

      {/* Categories Switcher Tabs */}
      <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl gap-1">
        {(['all', 'marvel', 'dc', 'favorites'] as GalleryCategory[]).map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer select-none text-center',
                isActive
                  ? cat === 'marvel'
                    ? 'bg-accent-marvel/10 text-accent-marvel shadow-[0_0_10px_rgba(229,9,20,0.15)]'
                    : cat === 'dc'
                    ? 'bg-accent-dc/10 text-accent-dc shadow-[0_0_10px_rgba(4,118,242,0.15)]'
                    : cat === 'favorites'
                    ? 'bg-danger/10 text-danger shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                    : 'bg-primary/10 text-primary shadow-[0_0_10px_rgba(245,197,24,0.15)]'
                  : 'text-text-muted hover:text-white'
              )}
            >
              {cat === 'all' && 'All'}
              {cat === 'marvel' && 'Marvel'}
              {cat === 'dc' && 'DC'}
              {cat === 'favorites' && 'Favs'}
            </button>
          );
        })}
      </div>

      {/* Characters Horizontal Filter Scroll list */}
      {dynamicCharacters.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted select-none">
            Characters
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 cursor-grab select-none">
            <button
              onClick={() => setSelectedCharacter('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 cursor-pointer',
                selectedCharacter === 'all'
                  ? 'border-white/20 bg-white/5 text-white'
                  : 'border-white/5 text-text-muted hover:border-white/10 hover:text-white'
              )}
            >
              All
            </button>
            {dynamicCharacters.map((char) => (
              <button
                key={char}
                onClick={() => setSelectedCharacter(char)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 flex-shrink-0 cursor-pointer',
                  selectedCharacter === char
                    ? 'border-white/20 bg-white/5 text-white'
                    : 'border-white/5 text-text-muted hover:border-white/10 hover:text-white'
                )}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Designs Grid section */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
        <AnimatePresence mode="popLayout">
          {filteredDesigns.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 gap-3"
            >
              {filteredDesigns.map((design) => {
                const isActive = uploadedDesign === design.textureUrl;
                const isFav = favorites.includes(design.id);

                return (
                  <motion.div
                    layout
                    key={design.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'relative group rounded-xl border overflow-hidden bg-white/[0.01] p-1.5 cursor-pointer transition-all duration-300',
                      isActive
                        ? design.category === 'Marvel'
                          ? 'border-accent-marvel/60 bg-accent-marvel/[0.04] shadow-[0_0_12px_rgba(229,9,20,0.1)]'
                          : 'border-accent-dc/60 bg-accent-dc/[0.04] shadow-[0_0_12px_rgba(4,118,242,0.1)]'
                        : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                    )}
                    onClick={() => handleSelectDesign(design)}
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-[#0a0a0f]">
                      <img
                        src={design.thumbnailUrl}
                        alt={design.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(design.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6.5 h-6.5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer transition-colors duration-200"
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart
                          className={cn(
                            'w-3.5 h-3.5 transition-colors duration-300',
                            isFav ? 'text-danger fill-danger' : 'text-white/60 hover:text-white'
                          )}
                        />
                      </button>

                      {/* Collection indicator icon */}
                      <div className="absolute bottom-1.5 left-1.5 text-[8px] font-bold bg-black/50 px-1.5 py-0.5 rounded flex items-center gap-1 text-white">
                        {design.category === 'Marvel' ? (
                          <Zap className="w-2 h-2 text-accent-marvel fill-accent-marvel" />
                        ) : (
                          <Shield className="w-2 h-2 text-accent-dc fill-accent-dc" />
                        )}
                        {design.character}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-2 px-1 text-left">
                      <span className="text-[10px] font-semibold text-text-secondary line-clamp-1">
                        {design.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-16 text-center text-text-muted select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-text-muted/60" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary">
                  No designs found
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Try adjusting your filters or search query
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default DesignGallery;
