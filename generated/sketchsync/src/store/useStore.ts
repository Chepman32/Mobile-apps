import { create } from 'zustand';

type State = {
  drawings: number;
  addDrawing: () => void;
};

export const useStore = create<State>(set => ({
  drawings: 0,
  addDrawing: () => set(state => ({ drawings: state.drawings + 1 })),
}));
