export interface Challenge {
  id: string;
  durationMinutes: number;
  name: string;
}

export interface Session {
  id: string;
  challengeId: string;
  startedAt: string;
  completed: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark';
}

export type RootStackParamList = {
  Home: undefined;
  Challenge: { challengeId: string };
  Settings: undefined;
  History: undefined;
  Achievements: undefined;
};
