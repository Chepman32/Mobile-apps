// Type definitions for ZenBreathTimer

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number; // duration in seconds
    hold: number;   // duration in seconds
    exhale: number; // duration in seconds
    holdAfterExhale?: number; // optional hold
  };
}

export interface Session {
  id: string;
  exerciseId: string;
  duration: number; // total duration in seconds
  completedAt: string; // ISO date
}

export interface AppSettings {
  enableSound: boolean;
  theme: 'light' | 'dark';
  hapticFeedback: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  Timer: { exerciseId: string };
  Settings: undefined;
  History: undefined;
};
