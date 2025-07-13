import { create } from 'zustand';

interface JournalState {
  recordings: string[];
  addRecording: (uri: string) => void;
}

export const useJournalStore = create<JournalState>(set => ({
  recordings: [],
  addRecording: uri => set(state => ({ recordings: [...state.recordings, uri] })),
}));
