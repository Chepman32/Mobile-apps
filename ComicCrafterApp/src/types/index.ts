// ComicCrafterApp Types

export interface Comic {
  id: string;
  title: string;
  description: string;
  genre: 'action' | 'adventure' | 'comedy' | 'drama' | 'fantasy' | 'horror' | 'mystery' | 'romance' | 'sci-fi' | 'slice-of-life' | 'superhero' | 'thriller' | 'other';
  targetAudience: 'all-ages' | 'children' | 'teen' | 'young-adult' | 'adult';
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  panels: Panel[];
  characters: Character[];
  story: Story;
  coverImage?: string;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  comments: Comment[];
  rating: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Panel {
  id: string;
  order: number;
  title?: string;
  description?: string;
  background: Background;
  characters: PanelCharacter[];
  speechBubbles: SpeechBubble[];
  thoughtBubbles: ThoughtBubble[];
  soundEffects: SoundEffect[];
  narration: NarrationBox[];
  duration: number; // in seconds for animation
  transitions: Transition[];
  isAnimated: boolean;
  animationSettings?: AnimationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Background {
  type: 'color' | 'image' | 'gradient' | 'pattern';
  color?: string;
  imageUrl?: string;
  gradient?: {
    colors: string[];
    direction: 'horizontal' | 'vertical' | 'diagonal';
  };
  pattern?: {
    type: 'dots' | 'lines' | 'grid' | 'custom';
    color: string;
    size: number;
  };
  opacity: number;
  blur?: number;
  brightness?: number;
  contrast?: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  appearance: CharacterAppearance;
  personality: CharacterPersonality;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  isMainCharacter: boolean;
  backstory?: string;
  relationships: CharacterRelationship[];
  images: CharacterImage[];
  voiceSettings?: VoiceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterAppearance {
  bodyType: 'slim' | 'average' | 'athletic' | 'curvy' | 'large';
  height: 'short' | 'average' | 'tall';
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  skinTone: string;
  clothing: ClothingItem[];
  accessories: string[];
  distinguishingFeatures: string[];
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
}

export interface CharacterPersonality {
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  fears: string[];
  goals: string[];
  motivations: string[];
  quirks: string[];
  catchphrase?: string;
}

export interface CharacterRelationship {
  targetCharacterId: string;
  relationshipType: 'friend' | 'family' | 'romantic' | 'enemy' | 'mentor' | 'student' | 'colleague' | 'other';
  description: string;
  strength: number; // 1-10
}

export interface CharacterImage {
  id: string;
  type: 'portrait' | 'full-body' | 'expression' | 'action' | 'reference';
  url: string;
  description: string;
  tags: string[];
}

export interface PanelCharacter {
  characterId: string;
  character: Character;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number };
  rotation: number;
  expression: string;
  pose: string;
  isVisible: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  animation?: CharacterAnimation;
}

export interface CharacterAnimation {
  type: 'idle' | 'walking' | 'running' | 'jumping' | 'talking' | 'gesturing' | 'custom';
  duration: number;
  loop: boolean;
  keyframes: AnimationKeyframe[];
}

export interface AnimationKeyframe {
  time: number;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number };
  rotation: number;
  opacity: number;
}

export interface SpeechBubble {
  id: string;
  text: string;
  speakerId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: 'normal' | 'shout' | 'whisper' | 'thought' | 'narrator';
  color: string;
  fontSize: number;
  fontFamily: string;
  isVisible: boolean;
  animation?: TextAnimation;
}

export interface ThoughtBubble {
  id: string;
  text: string;
  speakerId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: 'normal' | 'dream' | 'memory' | 'fantasy';
  color: string;
  fontSize: number;
  fontFamily: string;
  isVisible: boolean;
  animation?: TextAnimation;
}

export interface SoundEffect {
  id: string;
  text: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: 'normal' | 'bold' | 'italic' | 'outlined' | '3d';
  color: string;
  fontSize: number;
  fontFamily: string;
  isVisible: boolean;
  animation?: TextAnimation;
}

export interface NarrationBox {
  id: string;
  text: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: 'normal' | 'title' | 'subtitle' | 'caption';
  color: string;
  fontSize: number;
  fontFamily: string;
  isVisible: boolean;
  animation?: TextAnimation;
}

export interface TextAnimation {
  type: 'fade-in' | 'slide-in' | 'typewriter' | 'bounce' | 'shake' | 'custom';
  duration: number;
  delay: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface Transition {
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'none';
  duration: number;
  direction: 'left' | 'right' | 'up' | 'down' | 'in' | 'out';
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface AnimationSettings {
  frameRate: number;
  duration: number;
  loop: boolean;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  keyframes: AnimationKeyframe[];
}

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  genre: Comic['genre'];
  targetAudience: Comic['targetAudience'];
  themes: string[];
  plotPoints: PlotPoint[];
  chapters: Chapter[];
  worldBuilding: WorldBuilding;
  tone: 'serious' | 'humorous' | 'dark' | 'light' | 'dramatic' | 'whimsical';
  mood: 'upbeat' | 'melancholic' | 'tense' | 'peaceful' | 'energetic' | 'contemplative';
  createdAt: string;
  updatedAt: string;
}

export interface PlotPoint {
  id: string;
  title: string;
  description: string;
  order: number;
  importance: 'minor' | 'major' | 'critical';
  characters: string[];
  location?: string;
  isCompleted: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  panels: string[]; // panel IDs
  isCompleted: boolean;
  wordCount: number;
  estimatedReadingTime: number;
}

export interface WorldBuilding {
  setting: string;
  timePeriod: string;
  locations: Location[];
  rules: string[];
  history: string[];
  cultures: Culture[];
  technology: string[];
  magic?: MagicSystem;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'town' | 'village' | 'forest' | 'mountain' | 'ocean' | 'space' | 'other';
  importance: 'minor' | 'major' | 'critical';
  connections: string[]; // other location IDs
}

export interface Culture {
  id: string;
  name: string;
  description: string;
  values: string[];
  customs: string[];
  language: string[];
  clothing: string[];
  food: string[];
}

export interface MagicSystem {
  name: string;
  description: string;
  rules: string[];
  limitations: string[];
  sources: string[];
  users: string[];
}

export interface VoiceSettings {
  pitch: number; // 0-100
  speed: number; // 0-100
  volume: number; // 0-100
  accent?: string;
  voiceType: 'natural' | 'synthetic' | 'custom';
  voiceId?: string;
}

export interface ClothingItem {
  type: 'shirt' | 'pants' | 'dress' | 'jacket' | 'shoes' | 'hat' | 'accessory';
  name: string;
  color: string;
  style: string;
  isVisible: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  rating?: number;
  isEdited: boolean;
  editedAt?: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  username: string;
  isVerified: boolean;
  joinDate: string;
  totalComics: number;
  totalViews: number;
  totalLikes: number;
  followers: number;
  following: number;
  achievements: Achievement[];
  preferences: UserPreferences;
  statistics: UserStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    comments: boolean;
    likes: boolean;
    follows: boolean;
    mentions: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showStats: boolean;
  };
  editor: {
    autoSave: boolean;
    saveInterval: number;
    defaultTemplate: string;
    shortcuts: { [key: string]: string };
  };
}

export interface UserStatistics {
  totalComicsCreated: number;
  totalPanelsCreated: number;
  totalCharactersCreated: number;
  averageComicLength: number;
  favoriteGenre: string;
  mostUsedCharacters: string[];
  totalTimeSpent: number;
  completionRate: number;
  monthlyProgress: { month: string; comics: number }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'creation' | 'social' | 'skill' | 'milestone' | 'special';
  requirement: {
    type: 'comics' | 'panels' | 'characters' | 'views' | 'likes' | 'followers' | 'custom';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: Comic['genre'];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  panels: Panel[];
  characters: Character[];
  story: Partial<Story>;
  isPublic: boolean;
  isOfficial: boolean;
  downloads: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PublishingSettings {
  isPublic: boolean;
  allowComments: boolean;
  allowRatings: boolean;
  allowSharing: boolean;
  monetization: {
    isMonetized: boolean;
    price?: number;
    currency?: string;
  };
  distribution: {
    platforms: string[];
    regions: string[];
    ageRestriction?: number;
  };
  metadata: {
    keywords: string[];
    description: string;
    language: string;
    pageCount: number;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  editor: {
    autoSave: boolean;
    saveInterval: number;
    defaultTemplate: string;
    shortcuts: { [key: string]: string };
    gridSnap: boolean;
    showGuides: boolean;
    showRulers: boolean;
  };
  performance: {
    quality: 'low' | 'medium' | 'high';
    cacheSize: number;
    autoOptimize: boolean;
  };
  notifications: {
    comments: boolean;
    likes: boolean;
    follows: boolean;
    mentions: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showStats: boolean;
  };
  dataExport: {
    lastExport: string;
    autoBackup: boolean;
  };
}

export interface SearchFilters {
  genre?: Comic['genre'];
  targetAudience?: Comic['targetAudience'];
  status?: Comic['status'];
  isPublic?: boolean;
  isFeatured?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  rating?: number;
}

export interface SortOptions {
  field: 'title' | 'genre' | 'status' | 'createdAt' | 'updatedAt' | 'rating' | 'views' | 'likes';
  direction: 'asc' | 'desc';
}

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Editor: { comicId?: string };
  Library: undefined;
  Community: undefined;
  Profile: undefined;
  ComicDetails: { comicId: string };
  CharacterEditor: { characterId?: string };
  StoryEditor: { storyId?: string };
  TemplateGallery: undefined;
  Publishing: { comicId: string };
  Settings: undefined;
  Statistics: undefined;
  Achievements: undefined;
  Search: undefined;
  CategoryView: { category: Comic['genre'] };
  UserProfile: { userId: string };
  Help: undefined;
  About: undefined;
};

export type TabParamList = {
  Home: undefined;
  Editor: undefined;
  Library: undefined;
  Community: undefined;
  Profile: undefined;
};
