import { create } from 'zustand';
import { DecalTransform } from '../types';

interface DesignerState {
  currentColor: string;
  activeSide: 'front' | 'back' | 'left_sleeve' | 'right_sleeve';
  decals: DecalTransform[];
  setCurrentColor: (color: string) => void;
  setActiveSide: (side: 'front' | 'back' | 'left_sleeve' | 'right_sleeve') => void;
  addDecal: (decal: DecalTransform) => void;
}

export const useDesignerStore = create<DesignerState>((set) => ({
  currentColor: '#09090b',
  activeSide: 'front',
  decals: [],
  setCurrentColor: (color) => set({ currentColor: color }),
  setActiveSide: (activeSide) => set({ activeSide }),
  addDecal: (decal) => set((state) => ({ decals: [...state.decals, decal] })),
}));
