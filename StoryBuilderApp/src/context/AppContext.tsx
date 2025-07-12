import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Phrase } from '../types';
import PhraseService from '../services/PhraseService';

type AppContextType = {
  categories: Category[];
  favorites: Phrase[];
  loading: boolean;
  toggleFavorite: (phraseId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  refreshCategories: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadCategories = async () => {
    try {
      const data = await PhraseService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await PhraseService.getFavoritePhrases();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const toggleFavorite = async (phraseId: string) => {
    try {
      await PhraseService.toggleFavorite(phraseId);
      await loadFavorites();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const refreshCategories = async () => {
    await loadCategories();
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([loadCategories(), loadFavorites()]);
      setLoading(false);
    };

    initialize();
  }, []);

  return (
    <AppContext.Provider
      value={{
        categories,
        favorites,
        loading,
        toggleFavorite,
        refreshFavorites,
        refreshCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
