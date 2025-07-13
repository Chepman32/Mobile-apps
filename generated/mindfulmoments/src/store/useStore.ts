import { create } from 'zustand';

type State = {
  completed: number;
  addSession: () => void;
};

export const useStore = create<State>(set => ({
  completed: 0,
  addSession: () => set(state => ({ completed: state.completed + 1 })),
}));
