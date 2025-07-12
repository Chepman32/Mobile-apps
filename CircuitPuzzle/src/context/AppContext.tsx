import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PlayerProgress } from '../types';

interface AppContextType {
  progress: PlayerProgress;
  completeLevel: (levelId: string) => void;
  unlockNextLevel: () => void;
}

const defaultProgress: PlayerProgress = {
  unlockedLevel: 1,
  completedLevels: [],
};

const AppContext = createContext<AppContextType>({
  progress: defaultProgress,
  completeLevel: () => {},
  unlockNextLevel: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<PlayerProgress>(defaultProgress);

  const completeLevel = (levelId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLevels: [...new Set([...prev.completedLevels, levelId])],
    }));
  };

  const unlockNextLevel = () => {
    setProgress(prev => ({
      ...prev,
      unlockedLevel: prev.unlockedLevel + 1,
    }));
  };

  return (
    <AppContext.Provider value={{ progress, completeLevel, unlockNextLevel }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
