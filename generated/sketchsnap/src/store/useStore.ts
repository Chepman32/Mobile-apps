import { create } from 'zustand';

type State = {
  sketches: string[];
  addSketch: (uri: string) => void;
};

export const useStore = create<State>(set => ({
  sketches: [],
  addSketch: uri => set(state => ({ sketches: [...state.sketches, uri] }))
}));
