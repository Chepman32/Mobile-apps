// Stack Navigator Types
export type RootStackParamList = {
  MainTabs: undefined;
  Category: { categoryId: string; categoryName: string };
  Phrase: { phraseId: string };
  CreateStory: undefined;
};

// Tab Navigator Types
export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Create: undefined;
};

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Phrase {
  id: string;
  original: string;
  translation: string;
  pronunciation: string;
  categoryId: string;
  isFavorite: boolean;
  examples?: Array<{
    original: string;
    translation: string;
  }>;
}
