import React, { createContext, useContext, ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface SettingsContextType {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  autoAnalyze: boolean;
  setAutoAnalyze: (value: boolean) => void;
  dailyReminder: boolean;
  setDailyReminder: (value: boolean) => void;
  reminderTime: string;
  setReminderTime: (value: string) => void;
  enableHapticFeedback: boolean;
  setEnableHapticFeedback: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const isDarkMode = storage.getBoolean('isDarkMode') ?? false;
  const autoAnalyze = storage.getBoolean('autoAnalyze') ?? true;
  const dailyReminder = storage.getBoolean('dailyReminder') ?? true;
  const reminderTime = storage.getString('reminderTime') ?? '20:00';
  const enableHapticFeedback = storage.getBoolean('enableHapticFeedback') ?? true;

  const setDarkMode = (value: boolean) => {
    storage.set('isDarkMode', value);
  };

  const setAutoAnalyze = (value: boolean) => {
    storage.set('autoAnalyze', value);
  };

  const setDailyReminder = (value: boolean) => {
    storage.set('dailyReminder', value);
  };

  const setReminderTime = (value: string) => {
    storage.set('reminderTime', value);
  };

  const setEnableHapticFeedback = (value: boolean) => {
    storage.set('enableHapticFeedback', value);
  };

  return (
    <SettingsContext.Provider
      value={{
        isDarkMode,
        setDarkMode,
        autoAnalyze,
        setAutoAnalyze,
        dailyReminder,
        setDailyReminder,
        reminderTime,
        setReminderTime,
        enableHapticFeedback,
        setEnableHapticFeedback,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};