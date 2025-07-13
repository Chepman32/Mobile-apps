import { create } from 'zustand';

export type State = {
  avatar: string;
  setAvatar: (a: string) => void;
};

export const useStore = create<State>(set => ({
  avatar: 'default',
  setAvatar: a => set({ avatar: a }),
}));
