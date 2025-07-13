export type RootStackParamList = {
  Home: undefined;
  Editor: { comicId?: string } | undefined;
};

export interface Comic {
  id: string;
  title: string;
  panels: string[]; // file paths to local images
}
