import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ScanResult } from '../types';

interface AppContextType {
  history: ScanResult[];
  addScan: (scan: ScanResult) => void;
  getScanById: (id: string) => ScanResult | undefined;
}

const AppContext = createContext<AppContextType>({
  history: [],
  addScan: () => {},
  getScanById: () => undefined,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<ScanResult[]>([]);

  const addScan = (scan: ScanResult) => {
    setHistory(prev => [scan, ...prev]);
  };

  const getScanById = (id: string) => history.find(s => s.id === id);

  return (
    <AppContext.Provider value={{ history, addScan, getScanById }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
