import { create } from 'zustand';

export type State = {
  melody: string;
  setMelody: (m: string) => void;
};

export const useStore = create<State>(set => ({
  melody: '',
  setMelody: melody => set({ melody }),
}));
