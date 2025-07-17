import { create } from 'zustand';

type State = {
  capsules: { id: number; message: string; openDate: string }[];
  addCapsule: (message: string, openDate: string) => void;
};

export const useStore = create<State>((set, get) => ({
  capsules: [],
  addCapsule: (message, openDate) => {
    const id = get().capsules.length + 1;
    set(state => ({ capsules: [...state.capsules, { id, message, openDate }] }));
  },
}));
