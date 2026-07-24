import React from 'react';
import { Zap, Shield } from 'lucide-react';
import { useCustomizerStore, type CollectionFilter } from '../../store/customizerStore';
import { cn } from '../../utils/cn';

const COLLECTIONS: { id: CollectionFilter; label: string; icon: React.ReactNode; accentClass: string; activeClass: string }[] = [
  {
    id: 'marvel',
    label: 'Marvel Collection',
    icon: <Zap className="w-4 h-4" />,
    accentClass: 'border-accent-marvel/30 text-accent-marvel hover:border-accent-marvel/60',
    activeClass: 'border-accent-marvel bg-accent-marvel/10 text-accent-marvel shadow-[0_0_15px_rgba(229,9,20,0.2)]',
  },
  {
    id: 'dc',
    label: 'DC Collection',
    icon: <Shield className="w-4 h-4" />,
    accentClass: 'border-accent-dc/30 text-accent-dc hover:border-accent-dc/60',
    activeClass: 'border-accent-dc bg-accent-dc/10 text-accent-dc shadow-[0_0_15px_rgba(4,118,242,0.2)]',
  },
];

export const CollectionPicker: React.FC = () => {
  const collection = useCustomizerStore((s) => s.collection);
  const setCollection = useCustomizerStore((s) => s.setCollection);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-text-muted mb-1">
        Collection
      </span>
      {COLLECTIONS.map((col) => {
        const isActive = collection === col.id;
        return (
          <button
            key={col.id}
            onClick={() => setCollection(isActive ? 'all' : col.id)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none',
              isActive ? col.activeClass : col.accentClass
            )}
          >
            {col.icon}
            {col.label}
          </button>
        );
      })}
    </div>
  );
};
