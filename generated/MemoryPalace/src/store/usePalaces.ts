import { create } from 'zustand';
import * as palaceService from '../services/palaceService';
import { Palace } from '../types';

interface PalaceState {
  palaces: Palace[];
  load: () => void;
  addPalace: (name: string) => void;
}

export const usePalaces = create<PalaceState>(set => ({
  palaces: [],
  load: () => set({ palaces: palaceService.getAll() }),
  addPalace: name => {
    palaceService.create(name);
    set({ palaces: palaceService.getAll() });
  }
}));
