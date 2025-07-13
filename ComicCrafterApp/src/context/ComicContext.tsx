import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Comic } from '../types';

interface ComicContextProps {
  comics: Comic[];
  addComic: (comic: Comic) => Promise<void>;
}

export const ComicContext = createContext<ComicContextProps>({
  comics: [],
  addComic: async () => {},
});

export const ComicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comics, setComics] = useState<Comic[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('comics');
      if (stored) {
        setComics(JSON.parse(stored));
      }
    })();
  }, []);

  const addComic = async (comic: Comic) => {
    const updated = [...comics, comic];
    setComics(updated);
    await AsyncStorage.setItem('comics', JSON.stringify(updated));
  };

  return (
    <ComicContext.Provider value={{ comics, addComic }}>
      {children}
    </ComicContext.Provider>
  );
};
