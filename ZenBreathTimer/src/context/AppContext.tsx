import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AppSettings, Session } from '../types';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  sessions: Session[];
  addSession: (session: Session) => void;
}

const defaultSettings: AppSettings = {
  enableSound: true,
  theme: 'light',
  hapticFeedback: true,
};

const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  sessions: [],
  addSession: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [sessions, setSessions] = useState<Session[]>([]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addSession = (session: Session) => {
    setSessions(prev => [session, ...prev]);
  };

  return (
    <AppContext.Provider value={{ settings, updateSettings, sessions, addSession }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
