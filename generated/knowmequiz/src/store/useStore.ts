import { create } from 'zustand';

export type State = {
  quizzes: number;
  increment: () => void;
};

export const useStore = create<State>(set => ({
  quizzes: 0,
  increment: () => set(state => ({ quizzes: state.quizzes + 1 })),
}));
