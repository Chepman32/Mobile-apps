import { create } from 'zustand';

export type State = {
  recordings: string[];
  addRecording: (uri: string) => void;
};

export const useStore = create<State>(set => ({
  recordings: [],
  addRecording: uri => set(state => ({ recordings: [...state.recordings, uri] })),
}));
