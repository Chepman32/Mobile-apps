import { create } from 'zustand';

export type State = {
  words: string[];
  addWord: (w: string) => void;
};

export const useStore = create<State>(set => ({
  words: [],
  addWord: w => set(state => ({ words: [...state.words, w] }))
}));
