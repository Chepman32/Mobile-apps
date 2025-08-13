import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  proUnlocked: boolean;
  togglePro: () => void;
}

const AppContext = createContext<AppContextType>({
  proUnlocked: false,
  togglePro: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [proUnlocked, setProUnlocked] = useState(false);

  const togglePro = () => setProUnlocked((prev) => !prev);

  return (
    <AppContext.Provider value={{ proUnlocked, togglePro }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
