import { create } from 'zustand';

export type State = {
  goals: number;
  addGoal: () => void;
};

export const useStore = create<State>(set => ({
  goals: 0,
  addGoal: () => set(state => ({ goals: state.goals + 1 })),
}));
