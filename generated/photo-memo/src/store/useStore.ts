import { create } from 'zustand';

export type State = {
  photos: string[];
  addPhoto: (uri: string) => void;
};

export const useStore = create<State>(set => ({
  photos: [],
  addPhoto: uri => set(state => ({ photos: [...state.photos, uri] }))
}));
