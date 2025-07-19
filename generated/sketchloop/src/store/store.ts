import { create } from 'zustand';

export interface Stroke {
  id: string;
  points: number[];
  color: string;
  width: number;
  layer: number;
  timestamp: Date;
  isEasterEgg?: boolean;
  easterEggType?: 'hidden' | 'surprise' | 'treasure';
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  strokes: Stroke[];
  zoomLevel: number;
}

export interface EasterEgg {
  id: string;
  position: { x: number; y: number };
  type: 'hidden' | 'surprise' | 'treasure';
  discovered: boolean;
  createdBy: string;
  hint?: string;
  reward?: string;
}

interface SketchState {
  layers: Layer[];
  currentLayerId: string;
  activeStroke: Stroke | null;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  selectedBrush: {
    color: string;
    width: number;
    type: 'pen' | 'marker' | 'pencil' | 'eraser';
  };
  easterEggs: EasterEgg[];
  hasPremium: boolean;
  
  // Actions
  addLayer: (layer: Layer) => void;
  removeLayer: (layerId: string) => void;
  setCurrentLayer: (layerId: string) => void;
  addStroke: (stroke: Stroke) => void;
  setActiveStroke: (stroke: Stroke | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (offset: { x: number; y: number }) => void;
  setBrush: (brush: Partial<SketchState['selectedBrush']>) => void;
  addEasterEgg: (easterEgg: EasterEgg) => void;
  discoverEasterEgg: (easterEggId: string) => void;
  clearCanvas: () => void;
  setPremium: (premium: boolean) => void;
}

export const useSketchStore = create<SketchState>((set, get) => ({
  layers: [
    {
      id: 'default',
      name: 'Layer 1',
      visible: true,
      locked: false,
      opacity: 1,
      strokes: [],
      zoomLevel: 1,
    },
  ],
  currentLayerId: 'default',
  activeStroke: null,
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
  selectedBrush: {
    color: '#000000',
    width: 4,
    type: 'pen',
  },
  easterEggs: [],
  hasPremium: false,

  addLayer: (layer) => 
    set((state) => ({ 
      layers: [...state.layers, layer],
      currentLayerId: layer.id,
    })),

  removeLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.filter(l => l.id !== layerId),
      currentLayerId: state.currentLayerId === layerId 
        ? state.layers[0]?.id || 'default' 
        : state.currentLayerId,
    })),

  setCurrentLayer: (layerId) => set({ currentLayerId: layerId }),

  addStroke: (stroke) =>
    set((state) => ({
      layers: state.layers.map(layer =>
        layer.id === state.currentLayerId
          ? { ...layer, strokes: [...layer.strokes, stroke] }
          : layer
      ),
    })),

  setActiveStroke: (stroke) => set({ activeStroke: stroke }),

  setZoom: (zoom) => set({ zoomLevel: Math.max(0.1, Math.min(50, zoom)) }),

  setPan: (offset) => set({ panOffset: offset }),

  setBrush: (brush) =>
    set((state) => ({
      selectedBrush: { ...state.selectedBrush, ...brush },
    })),

  addEasterEgg: (easterEgg) =>
    set((state) => ({
      easterEggs: [...state.easterEggs, easterEgg],
    })),

  discoverEasterEgg: (easterEggId) =>
    set((state) => ({
      easterEggs: state.easterEggs.map(egg =>
        egg.id === easterEggId ? { ...egg, discovered: true } : egg
      ),
    })),

  clearCanvas: () =>
    set((state) => ({
      layers: state.layers.map(layer => ({ ...layer, strokes: [] })),
      activeStroke: null,
    })),

  setPremium: (premium) => set({ hasPremium: premium }),
}));