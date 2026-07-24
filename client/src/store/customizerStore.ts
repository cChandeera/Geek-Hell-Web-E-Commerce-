import { create } from 'zustand';
import type { GarmentSize } from '../types';

export type CollectionFilter = 'all' | 'marvel' | 'dc';

export interface DesignLayer {
  id: string;
  url: string;
  scale: number;
  rotation: number; // degrees
  posX: number;
  posY: number;
  flipX: boolean;
  flipY: boolean;
  opacity: number;
  visible: boolean;
  name: string;
  // ── Text layer metadata (optional — undefined means image layer) ──
  type?: 'image' | 'text';
  textContent?: string;
  fontFamily?: string;
  textColor?: string;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
}

/** Generates a high-resolution canvas PNG data URL from text parameters.
 *  Renders at 4× super-sample so text stays sharp when mapped as a decal
 *  on the 3D shirt surface.
 */
export function generateTextDataUrl(
  text: string,
  fontFamily: string,
  fontSize: number,
  color: string,
  isBold: boolean,
  isItalic: boolean
): string {
  // ── 4× super-sample: render at 4x size so texture is crisp on the shirt ──
  const SCALE = 4;
  const padding = 48 * SCALE;
  const scaledFontSize = fontSize * SCALE;
  const lineHeight = scaledFontSize * 1.3;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true })!;

  // Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const fontStyle = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${scaledFontSize}px ${fontFamily}, sans-serif`;

  // Measure text at scaled size
  ctx.font = fontStyle;
  const lines = text.split('\n').filter((l) => l.length > 0);
  if (lines.length === 0) lines.push('');

  const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));

  canvas.width  = Math.ceil(maxWidth) + padding * 2;
  canvas.height = Math.ceil(lineHeight * lines.length) + padding * 2;

  // Canvas resize resets the context — re-apply all settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.font = fontStyle;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw each line
  lines.forEach((line, i) => {
    const x = canvas.width / 2;
    const y = padding + lineHeight * i + lineHeight / 2;
    ctx.fillText(line, x, y);
  });

  return canvas.toDataURL('image/png');
}

export interface SideDesign {
  layers: DesignLayer[];
  activeLayerId: string | null;
}

export interface CustomizerState {
  // Shirt appearance
  shirtColor: string;
  selectedSize: GarmentSize;
  collection: CollectionFilter;

  // View placement
  currentView: 'front' | 'back';
  frontDesign: SideDesign;
  backDesign: SideDesign;

  // Uploaded/Selected design (mirrors active view/layer for backward compatibility)
  uploadedDesign: string | null; 
  designScale: number;
  designRotation: number; // degrees
  designPositionX: number;
  designPositionY: number;
  designFlipX: boolean;
  designFlipY: boolean;
  designOpacity: number;
  designVisible: boolean;

  // Favorites list
  favorites: string[];
  isDragging: boolean;

  // Actions
  setShirtColor: (color: string) => void;
  setSize: (size: GarmentSize) => void;
  setCollection: (collection: CollectionFilter) => void;
  setCurrentView: (view: 'front' | 'back') => void;
  setIsDragging: (dragging: boolean) => void;

  // Design properties actions (operating on active layer)
  setDesign: (dataUrl: string | null) => void;
  setDesignScale: (scale: number) => void;
  setDesignRotation: (rotation: number) => void;
  setDesignPosition: (x: number, y: number) => void;
  setDesignFlipX: (flip: boolean) => void;
  setDesignFlipY: (flip: boolean) => void;
  setDesignOpacity: (opacity: number) => void;
  setDesignVisible: (visible: boolean) => void;
  resetDesign: () => void;
  removeDesign: () => void;

  // Layer management actions
  addLayer: (url: string, name?: string) => void;
  addTextLayer: (
    text: string,
    fontFamily: string,
    fontSize: number,
    color: string,
    isBold: boolean,
    isItalic: boolean
  ) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  selectLayer: (id: string) => void;

  toggleFavorite: (designId: string) => void;
  resetAll: () => void;
}

const INITIAL_STATE = {
  shirtColor: '#111118',
  selectedSize: 'M' as GarmentSize,
  collection: 'all' as CollectionFilter,
  currentView: 'front' as 'front' | 'back',
  frontDesign: { layers: [], activeLayerId: null } as SideDesign,
  backDesign: { layers: [], activeLayerId: null } as SideDesign,
  uploadedDesign: null,
  designScale: 0.15,
  designRotation: 0,
  designPositionX: 0,
  designPositionY: 0,
  designFlipX: false,
  designFlipY: false,
  designOpacity: 1.0,
  designVisible: true,
  favorites: [] as string[],
  isDragging: false,
};

// Helper function to update the active layer's properties
const updateActiveLayer = (state: CustomizerState, updates: Partial<DesignLayer>) => {
  const isFront = state.currentView === 'front';
  const side = isFront ? state.frontDesign : state.backDesign;
  const activeId = side.activeLayerId;
  if (!activeId) return {};

  const updatedLayers = side.layers.map((layer) => {
    if (layer.id === activeId) {
      return { ...layer, ...updates };
    }
    return layer;
  });

  return {
    frontDesign: isFront ? { ...side, layers: updatedLayers } : state.frontDesign,
    backDesign: !isFront ? { ...side, layers: updatedLayers } : state.backDesign,
  };
};

export const useCustomizerStore = create<CustomizerState>((set) => ({
  ...INITIAL_STATE,

  setShirtColor: (color) => set({ shirtColor: color }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  setSize: (size) => set({ selectedSize: size }),
  setCollection: (collection) => set({ collection }),

  setCurrentView: (view) =>
    set((state) => {
      const side = view === 'front' ? state.frontDesign : state.backDesign;
      const target = side.layers.find((l) => l.id === side.activeLayerId);
      return {
        currentView: view,
        uploadedDesign: target ? target.url : null,
        designScale: target ? target.scale : 0.15,
        designRotation: target ? target.rotation : 0,
        designPositionX: target ? target.posX : 0,
        designPositionY: target ? target.posY : 0,
        designFlipX: target ? target.flipX : false,
        designFlipY: target ? target.flipY : false,
        designOpacity: target ? target.opacity : 1.0,
        designVisible: target ? target.visible : true,
      };
    }),

  setDesign: (dataUrl) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;

      if (!dataUrl) {
        // If dataUrl is null, delete active layer
        if (side.activeLayerId) {
          const updatedLayers = side.layers.filter((l) => l.id !== side.activeLayerId);
          const newActiveId = updatedLayers.length > 0 ? updatedLayers[updatedLayers.length - 1].id : null;
          const target = updatedLayers.find((l) => l.id === newActiveId);

          return {
            uploadedDesign: target ? target.url : null,
            designScale: target ? target.scale : 0.15,
            designRotation: target ? target.rotation : 0,
            designPositionX: target ? target.posX : 0,
            designPositionY: target ? target.posY : 0,
            designFlipX: target ? target.flipX : false,
            designFlipY: target ? target.flipY : false,
            designOpacity: target ? target.opacity : 1.0,
            designVisible: target ? target.visible : true,
            frontDesign: isFront ? { layers: updatedLayers, activeLayerId: newActiveId } : state.frontDesign,
            backDesign: !isFront ? { layers: updatedLayers, activeLayerId: newActiveId } : state.backDesign,
          };
        }
        return {};
      }

      if (!side.activeLayerId) {
        // No active layer -> Add a new layer
        const newId = `layer-${Date.now()}`;
        const newLayer: DesignLayer = {
          id: newId,
          url: dataUrl,
          scale: 0.15,
          rotation: 0,
          posX: 0,
          posY: 0,
          flipX: false,
          flipY: false,
          opacity: 1.0,
          visible: true,
          name: `Layer ${side.layers.length + 1}`,
        };
        const updatedLayers = [...side.layers, newLayer];
        return {
          uploadedDesign: dataUrl,
          designScale: newLayer.scale,
          designRotation: newLayer.rotation,
          designPositionX: newLayer.posX,
          designPositionY: newLayer.posY,
          designFlipX: newLayer.flipX,
          designFlipY: newLayer.flipY,
          designOpacity: newLayer.opacity,
          designVisible: newLayer.visible,
          frontDesign: isFront ? { layers: updatedLayers, activeLayerId: newId } : state.frontDesign,
          backDesign: !isFront ? { layers: updatedLayers, activeLayerId: newId } : state.backDesign,
        };
      } else {
        // Active layer exists -> Update its URL
        const updatedLayers = side.layers.map((layer) => {
          if (layer.id === side.activeLayerId) {
            return { ...layer, url: dataUrl };
          }
          return layer;
        });
        return {
          uploadedDesign: dataUrl,
          frontDesign: isFront ? { ...side, layers: updatedLayers } : state.frontDesign,
          backDesign: !isFront ? { ...side, layers: updatedLayers } : state.backDesign,
        };
      }
    }),

  setDesignScale: (scale) =>
    set((state) => ({
      designScale: scale,
      ...updateActiveLayer(state, { scale }),
    })),

  setDesignRotation: (rotation) =>
    set((state) => ({
      designRotation: rotation,
      ...updateActiveLayer(state, { rotation }),
    })),

  setDesignPosition: (x, y) =>
    set((state) => ({
      designPositionX: x,
      designPositionY: y,
      ...updateActiveLayer(state, { posX: x, posY: y }),
    })),

  setDesignFlipX: (flip) =>
    set((state) => ({
      designFlipX: flip,
      ...updateActiveLayer(state, { flipX: flip }),
    })),

  setDesignFlipY: (flip) =>
    set((state) => ({
      designFlipY: flip,
      ...updateActiveLayer(state, { flipY: flip }),
    })),

  setDesignOpacity: (opacity) =>
    set((state) => ({
      designOpacity: opacity,
      ...updateActiveLayer(state, { opacity }),
    })),

  setDesignVisible: (visible) =>
    set((state) => ({
      designVisible: visible,
      ...updateActiveLayer(state, { visible }),
    })),

  addLayer: (url, name) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const newId = `layer-${Date.now()}`;
      const newLayer: DesignLayer = {
        id: newId,
        url,
        scale: 0.15,
        rotation: 0,
        posX: 0,
        posY: 0,
        flipX: false,
        flipY: false,
        opacity: 1.0,
        visible: true,
        name: name || `Layer ${side.layers.length + 1}`,
      };
      const updatedLayers = [...side.layers, newLayer];
      return {
        uploadedDesign: url,
        designScale: newLayer.scale,
        designRotation: newLayer.rotation,
        designPositionX: newLayer.posX,
        designPositionY: newLayer.posY,
        designFlipX: newLayer.flipX,
        designFlipY: newLayer.flipY,
        designOpacity: newLayer.opacity,
        designVisible: newLayer.visible,
        frontDesign: isFront ? { layers: updatedLayers, activeLayerId: newId } : state.frontDesign,
        backDesign: !isFront ? { layers: updatedLayers, activeLayerId: newId } : state.backDesign,
      };
    }),

  addTextLayer: (text, fontFamily, fontSize, color, isBold, isItalic) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const dataUrl = generateTextDataUrl(text, fontFamily, fontSize, color, isBold, isItalic);
      const newId = `text-layer-${Date.now()}`;
      const label = text.length > 12 ? `${text.slice(0, 12)}…` : text;
      const newLayer: DesignLayer = {
        id: newId,
        url: dataUrl,
        scale: 0.18,
        rotation: 0,
        posX: 0,
        posY: 0,
        flipX: false,
        flipY: false,
        opacity: 1.0,
        visible: true,
        name: `"${label}"`,
        type: 'text',
        textContent: text,
        fontFamily,
        textColor: color,
        fontSize,
        isBold,
        isItalic,
      };
      const updatedLayers = [...side.layers, newLayer];
      return {
        uploadedDesign: dataUrl,
        designScale: newLayer.scale,
        designRotation: newLayer.rotation,
        designPositionX: newLayer.posX,
        designPositionY: newLayer.posY,
        designFlipX: newLayer.flipX,
        designFlipY: newLayer.flipY,
        designOpacity: newLayer.opacity,
        designVisible: newLayer.visible,
        frontDesign: isFront ? { layers: updatedLayers, activeLayerId: newId } : state.frontDesign,
        backDesign: !isFront ? { layers: updatedLayers, activeLayerId: newId } : state.backDesign,
      };
    }),

  deleteLayer: (id) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const updatedLayers = side.layers.filter((l) => l.id !== id);
      let newActiveId = side.activeLayerId;
      if (side.activeLayerId === id) {
        newActiveId = updatedLayers.length > 0 ? updatedLayers[updatedLayers.length - 1].id : null;
      }
      const target = updatedLayers.find((l) => l.id === newActiveId);
      return {
        uploadedDesign: target ? target.url : null,
        designScale: target ? target.scale : 0.15,
        designRotation: target ? target.rotation : 0,
        designPositionX: target ? target.posX : 0,
        designPositionY: target ? target.posY : 0,
        designFlipX: target ? target.flipX : false,
        designFlipY: target ? target.flipY : false,
        designOpacity: target ? target.opacity : 1.0,
        designVisible: target ? target.visible : true,
        frontDesign: isFront ? { layers: updatedLayers, activeLayerId: newActiveId } : state.frontDesign,
        backDesign: !isFront ? { layers: updatedLayers, activeLayerId: newActiveId } : state.backDesign,
      };
    }),

  duplicateLayer: (id) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const target = side.layers.find((l) => l.id === id);
      if (!target) return {};

      const newId = `layer-${Date.now()}`;
      const duplicated: DesignLayer = {
        ...target,
        id: newId,
        posX: Math.min(0.2, target.posX + 0.02),
        posY: Math.min(0.2, target.posY - 0.02),
        name: `${target.name} Copy`,
      };

      const updatedLayers = [...side.layers, duplicated];
      return {
        uploadedDesign: duplicated.url,
        designScale: duplicated.scale,
        designRotation: duplicated.rotation,
        designPositionX: duplicated.posX,
        designPositionY: duplicated.posY,
        designFlipX: duplicated.flipX,
        designFlipY: duplicated.flipY,
        designOpacity: duplicated.opacity,
        designVisible: duplicated.visible,
        frontDesign: isFront ? { layers: updatedLayers, activeLayerId: newId } : state.frontDesign,
        backDesign: !isFront ? { layers: updatedLayers, activeLayerId: newId } : state.backDesign,
      };
    }),

  toggleLayerVisibility: (id) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const updatedLayers = side.layers.map((l) => {
        if (l.id === id) {
          return { ...l, visible: !l.visible };
        }
        return l;
      });
      const activeId = side.activeLayerId;
      const activeLayer = updatedLayers.find((l) => l.id === activeId);
      return {
        designVisible: activeLayer ? activeLayer.visible : true,
        frontDesign: isFront ? { ...side, layers: updatedLayers } : state.frontDesign,
        backDesign: !isFront ? { ...side, layers: updatedLayers } : state.backDesign,
      };
    }),

  moveLayerUp: (id) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const idx = side.layers.findIndex((l) => l.id === id);
      if (idx === -1 || idx === side.layers.length - 1) return {};

      const updatedLayers = [...side.layers];
      const temp = updatedLayers[idx];
      updatedLayers[idx] = updatedLayers[idx + 1];
      updatedLayers[idx + 1] = temp;

      return {
        frontDesign: isFront ? { ...side, layers: updatedLayers } : state.frontDesign,
        backDesign: !isFront ? { ...side, layers: updatedLayers } : state.backDesign,
      };
    }),

  moveLayerDown: (id) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const idx = side.layers.findIndex((l) => l.id === id);
      if (idx === -1 || idx === 0) return {};

      const updatedLayers = [...side.layers];
      const temp = updatedLayers[idx];
      updatedLayers[idx] = updatedLayers[idx - 1];
      updatedLayers[idx - 1] = temp;

      return {
        frontDesign: isFront ? { ...side, layers: updatedLayers } : state.frontDesign,
        backDesign: !isFront ? { ...side, layers: updatedLayers } : state.backDesign,
      };
    }),

  selectLayer: (id) =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      const target = side.layers.find((l) => l.id === id);
      if (!target) return {};
      return {
        uploadedDesign: target.url,
        designScale: target.scale,
        designRotation: target.rotation,
        designPositionX: target.posX,
        designPositionY: target.posY,
        designFlipX: target.flipX,
        designFlipY: target.flipY,
        designOpacity: target.opacity,
        designVisible: target.visible,
        frontDesign: isFront ? { ...side, activeLayerId: id } : state.frontDesign,
        backDesign: !isFront ? { ...side, activeLayerId: id } : state.backDesign,
      };
    }),

  resetDesign: () =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      if (!side.activeLayerId) return {};

      const updatedLayers = side.layers.map((l) => {
        if (l.id === side.activeLayerId) {
          return {
            ...l,
            scale: 0.15,
            rotation: 0,
            posX: 0,
            posY: 0,
            flipX: false,
            flipY: false,
            opacity: 1.0,
            visible: true,
          };
        }
        return l;
      });
      return {
        designScale: 0.15,
        designRotation: 0,
        designPositionX: 0,
        designPositionY: 0,
        designFlipX: false,
        designFlipY: false,
        designOpacity: 1.0,
        designVisible: true,
        frontDesign: isFront ? { ...side, layers: updatedLayers } : state.frontDesign,
        backDesign: !isFront ? { ...side, layers: updatedLayers } : state.backDesign,
      };
    }),

  removeDesign: () =>
    set((state) => {
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      if (!side.activeLayerId) return {};

      const updatedLayers = side.layers.filter((l) => l.id !== side.activeLayerId);
      const newActiveId = updatedLayers.length > 0 ? updatedLayers[updatedLayers.length - 1].id : null;
      const target = updatedLayers.find((l) => l.id === newActiveId);
      return {
        uploadedDesign: target ? target.url : null,
        designScale: target ? target.scale : 0.15,
        designRotation: target ? target.rotation : 0,
        designPositionX: target ? target.posX : 0,
        designPositionY: target ? target.posY : 0,
        designFlipX: target ? target.flipX : false,
        designFlipY: target ? target.flipY : false,
        designOpacity: target ? target.opacity : 1.0,
        designVisible: target ? target.visible : true,
        frontDesign: isFront ? { layers: updatedLayers, activeLayerId: newActiveId } : state.frontDesign,
        backDesign: !isFront ? { layers: updatedLayers, activeLayerId: newActiveId } : state.backDesign,
      };
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
