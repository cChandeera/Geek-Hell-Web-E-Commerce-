import { create } from 'zustand';
import type { GarmentSize } from '../types';

export type CollectionFilter = 'all' | 'marvel' | 'dc';

export interface CustomizerState {
  // Shirt appearance
  shirtColor: string;
  selectedSize: GarmentSize;
  collection: CollectionFilter;

  // Uploaded/Selected design
  uploadedDesign: string | null; // data URL or loaded texture path
  designScale: number;
  designRotation: number; // degrees
  designPositionX: number;
  designPositionY: number;

  // Favorites list
  favorites: string[];

  // Actions
  setShirtColor: (color: string) => void;
  setSize: (size: GarmentSize) => void;
  setCollection: (collection: CollectionFilter) => void;
  setDesign: (dataUrl: string | null) => void;
  setDesignScale: (scale: number) => void;
  setDesignRotation: (rotation: number) => void;
  setDesignPosition: (x: number, y: number) => void;
  removeDesign: () => void;
  toggleFavorite: (designId: string) => void;
  resetAll: () => void;
}

const INITIAL_STATE = {
  shirtColor: '#111118',
  selectedSize: 'M' as GarmentSize,
  collection: 'all' as CollectionFilter,
  uploadedDesign: null,
  designScale: 0.15,
  designRotation: 0,
  designPositionX: 0,
  designPositionY: 0,
  favorites: [] as string[],
};

export const useCustomizerStore = create<CustomizerState>((set) => ({
  ...INITIAL_STATE,

  setShirtColor: (color) => set({ shirtColor: color }),
  setSize: (size) => set({ selectedSize: size }),
  setCollection: (collection) => set({ collection }),

  setDesign: (dataUrl) => set({ uploadedDesign: dataUrl }),
  setDesignScale: (scale) => set({ designScale: scale }),
  setDesignRotation: (rotation) => set({ designRotation: rotation }),
  setDesignPosition: (x, y) => set({ designPositionX: x, designPositionY: y }),

  removeDesign: () =>
    set({
      uploadedDesign: null,
      designScale: INITIAL_STATE.designScale,
      designRotation: INITIAL_STATE.designRotation,
      designPositionX: INITIAL_STATE.designPositionX,
      designPositionY: INITIAL_STATE.designPositionY,
    }),

  toggleFavorite: (designId) =>
    set((state) => {
      const isFav = state.favorites.includes(designId);
      const newFavs = isFav
        ? state.favorites.filter((id) => id !== designId)
        : [...state.favorites, designId];
      return { favorites: newFavs };
    }),

  resetAll: () => set((state) => ({ ...INITIAL_STATE, favorites: state.favorites })),
}));
