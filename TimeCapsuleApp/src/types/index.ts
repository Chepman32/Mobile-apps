// Type definitions for InstantScanAndSolve

export interface Capsule {
  id: string;
  text: string;
  unlockDate: string;
}

export type HistoryItem = Capsule;

export type RootStackParamList = {
  Home: undefined;
  CreateCapsule: undefined;
  History: undefined;
};
