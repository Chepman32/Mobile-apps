// Type definitions for CircuitPuzzle

export type ComponentType = 'source' | 'wire' | 'node' | 'empty';

export interface GridComponent {
  id: string;
  type: ComponentType;
  rotation: 0 | 90 | 180 | 270; // Degrees
  connections: ('top' | 'right' | 'bottom' | 'left')[];
  isPowered?: boolean;
}

export interface Level {
  id: string;
  name: string;
  gridSize: { rows: number; cols: number };
  grid: GridComponent[][];
}

export interface PlayerProgress {
  unlockedLevel: number;
  completedLevels: string[];
}

export type RootStackParamList = {
  Home: undefined;
  LevelSelect: undefined;
  Game: { levelId: string };
  Guide: undefined;
};
