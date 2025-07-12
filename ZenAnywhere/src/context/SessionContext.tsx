import React, {createContext, useState, ReactNode} from 'react';

type SessionContextType = {
  sessions: number;
  addSession: () => void;
};

export const SessionContext = createContext<SessionContextType>({
  sessions: 0,
  addSession: () => {},
});

export const SessionProvider = ({children}: {children: ReactNode}) => {
  const [sessions, setSessions] = useState(0);
  const addSession = () => setSessions(s => s + 1);
  return (
    <SessionContext.Provider value={{sessions, addSession}}>
      {children}
    </SessionContext.Provider>
  );
};
