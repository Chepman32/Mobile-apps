import { create } from 'zustand';

export type State = {
  score: number;
  increment: () => void;
};

export const useStore = create<State>(set => ({
  score: 0,
  increment: () => set(state => ({ score: state.score + 1 })),
}));
