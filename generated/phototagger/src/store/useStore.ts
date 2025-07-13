import { create } from 'zustand';

type State = {
  tags: string[];
  addTag: (tag: string) => void;
};

export const useStore = create<State>(set => ({
  tags: [],
  addTag: tag => set(state => ({ tags: [...state.tags, tag] }))
}));
