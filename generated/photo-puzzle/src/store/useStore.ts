import { create } from 'zustand';

export type State = {
  images: string[];
  addImage: (uri: string) => void;
};

export const useStore = create<State>(set => ({
  images: [],
  addImage: uri => set(state => ({ images: [...state.images, uri] }))
}));
