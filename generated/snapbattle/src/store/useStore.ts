import { create } from 'zustand';

export type State = {
  snaps: number;
  addSnap: () => void;
};

export const useStore = create<State>(set => ({
  snaps: 0,
  addSnap: () => set(state => ({ snaps: state.snaps + 1 })),
}));
