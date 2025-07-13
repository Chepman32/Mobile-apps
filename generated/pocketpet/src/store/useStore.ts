import { create } from 'zustand';

export type State = {
  pets: string[];
  addPet: (name: string) => void;
};

export const useStore = create<State>(set => ({
  pets: [],
  addPet: name => set(state => ({ pets: [...state.pets, name] })),
}));
