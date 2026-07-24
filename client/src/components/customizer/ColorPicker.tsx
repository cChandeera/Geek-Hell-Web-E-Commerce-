import React from 'react';
import { useCustomizerStore } from '../../store/customizerStore';
import { cn } from '../../utils/cn';

const PRESET_COLORS = [
  { name: 'Obsidian', hex: '#111118' },
  { name: 'Charcoal', hex: '#2a2a35' },
  { name: 'Slate', hex: '#3d3d4a' },
  { name: 'Arctic', hex: '#e8e8f0' },
  { name: 'Marvel Red', hex: '#c41018' },
  { name: 'DC Blue', hex: '#0a5ec2' },
  { name: 'Gold', hex: '#c4960a' },
  { name: 'Forest', hex: '#1a5c3a' },
  { name: 'Violet', hex: '#6b21a8' },
  { name: 'Midnight', hex: '#0f172a' },
];

export const ColorPicker: React.FC = () => {
  const shirtColor = useCustomizerStore((s) => s.shirtColor);
  const setShirtColor = useCustomizerStore((s) => s.setShirtColor);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-text-muted">
        Shirt Color
      </span>
      <div className="grid grid-cols-5 gap-2.5">
        {PRESET_COLORS.map((color) => {
          const isActive = shirtColor === color.hex;
          return (
            <button
              key={color.hex}
              onClick={() => setShirtColor(color.hex)}
              title={color.name}
              className={cn(
                'w-9 h-9 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95',
                isActive
                  ? 'border-white ring-2 ring-white/20 scale-110'
                  : 'border-white/10 hover:border-white/30'
              )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>

      {/* Custom color input */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="color"
          value={shirtColor}
          onChange={(e) => setShirtColor(e.target.value)}
          className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
        />
        <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
          Custom
        </span>
      </div>
    </div>
  );
};
