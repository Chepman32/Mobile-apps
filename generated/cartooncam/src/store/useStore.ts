import { create } from 'zustand';

export type State = {
  filter: string;
  setFilter: (f: string) => void;
};

export const useStore = create<State>(set => ({
  filter: 'default',
  setFilter: f => set({ filter: f }),
}));
