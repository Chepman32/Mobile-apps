import { create } from 'zustand';

export type State = {
  style: string;
  setStyle: (s: string) => void;
};

export const useStore = create<State>(set => ({
  style: 'pencil',
  setStyle: s => set({ style: s }),
}));
