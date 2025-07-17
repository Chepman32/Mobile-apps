import { create } from 'zustand';

export type State = {
  scans: string[];
  addScan: (data: string) => void;
};

export const useStore = create<State>(set => ({
  scans: [],
  addScan: data => set(state => ({ scans: [...state.scans, data] })),
}));
