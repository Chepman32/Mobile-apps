// Main stack param list
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  Quiz: { categoryId: string; categoryName: string };
  Results: { score: number; totalQuestions: number; categoryId: string };
  Profile: undefined;
  Settings: undefined;
};

// Tab navigator param list
export type MainTabParamList = {
  Home: undefined;
  Learn: undefined;
  Practice: undefined;
  Profile: undefined;
};

// Navigation props
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: {
    navigate: (screen: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]) => void;
    goBack: () => void;
    reset: (params: {
      index: number;
      routes: Array<{ name: keyof RootStackParamList }>;
    }) => void;
  };
  route: {
    params: RootStackParamList[T];
    name: string;
    key: string;
  };
};
