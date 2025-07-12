import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Capsule } from '../types';

interface AppContextType {
  capsules: Capsule[];
  addCapsule: (capsule: Capsule) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  capsules: [],
  addCapsule: async () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  const addCapsule = async (capsule: Capsule) => {
    setCapsules(prev => [capsule, ...prev]);
  };

  return (
    <AppContext.Provider value={{ capsules, addCapsule }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
