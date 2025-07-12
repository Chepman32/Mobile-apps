// Type definitions for InstantScanAndSolve

export interface ScanResult {
  id: string;
  imageUri: string;
  problemText: string;
  solution: string;
  scannedAt: string; // ISO date
}

export interface HistoryItem extends ScanResult {}

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Result: { scanId: string };
  History: undefined;
};
