export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    units: 'metric' | 'imperial';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  commonName: string;
  scientificName: string;
  description: string;
  imageUrl?: string;
  category: PlantCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  lightRequirements: LightRequirement;
  waterNeeds: WaterNeed;
  temperatureRange: {
    min: number;
    max: number;
  };
  humidityRange: {
    min: number;
    max: number;
  };
  soilType: SoilType[];
  fertilizerType: FertilizerType;
  repottingFrequency: number; // months
  pruningFrequency: number; // months
  propagationMethods: PropagationMethod[];
  toxicToPets: boolean;
  toxicToHumans: boolean;
  maxHeight: number;
  maxSpread: number;
  growthRate: 'slow' | 'moderate' | 'fast';
  lifespan: number; // years
  careInstructions: string;
  troubleshooting: TroubleshootingTip[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPlant {
  id: string;
  plantId: string;
  plant: Plant;
  nickname: string;
  location: string;
  potSize: number; // inches
  soilType: SoilType;
  plantingDate: Date;
  lastWatered: Date;
  lastFertilized: Date;
  lastRepotted: Date;
  lastPruned: Date;
  currentHeight: number;
  currentSpread: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  photos: PlantPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CareSchedule {
  id: string;
  userPlantId: string;
  userPlant: UserPlant;
  type: 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'pest-control';
  frequency: number; // days
  lastPerformed: Date;
  nextDue: Date;
  isActive: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareLog {
  id: string;
  userPlantId: string;
  userPlant: UserPlant;
  type: 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'pest-control' | 'observation';
  date: Date;
  notes: string;
  photos: PlantPhoto[];
  measurements?: {
    height?: number;
    spread?: number;
    leafCount?: number;
  };
  healthStatus?: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: Date;
}

export interface PlantPhoto {
  id: string;
  url: string;
  caption: string;
  date: Date;
  createdAt: Date;
}

export interface GrowthTracking {
  id: string;
  userPlantId: string;
  userPlant: UserPlant;
  date: Date;
  height: number;
  spread: number;
  leafCount: number;
  healthScore: number; // 1-10
  notes: string;
  photos: PlantPhoto[];
  createdAt: Date;
}

export interface Reminder {
  id: string;
  userPlantId: string;
  userPlant: UserPlant;
  type: 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'pest-control' | 'custom';
  title: string;
  message: string;
  scheduledDate: Date;
  isCompleted: boolean;
  isRepeating: boolean;
  repeatInterval?: number; // days
  notificationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlantCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface LightRequirement {
  id: string;
  name: string;
  description: string;
  hoursPerDay: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface WaterNeed {
  id: string;
  name: string;
  description: string;
  frequency: number; // days
  amount: string;
}

export interface SoilType {
  id: string;
  name: string;
  description: string;
  phRange: {
    min: number;
    max: number;
  };
  drainage: 'poor' | 'moderate' | 'good';
}

export interface FertilizerType {
  id: string;
  name: string;
  description: string;
  npkRatio: string;
  applicationFrequency: number; // days
}

export interface PropagationMethod {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number; // percentage
}

export interface TroubleshootingTip {
  id: string;
  symptom: string;
  cause: string;
  solution: string;
  prevention: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  lightIntensity: number;
  date: Date;
}

export interface PlantCareTips {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedDate?: Date;
  progress: number;
  maxProgress: number;
}

export interface Statistics {
  totalPlants: number;
  healthyPlants: number;
  plantsNeedingCare: number;
  totalCareLogs: number;
  averageHealthScore: number;
  longestPlantAge: number; // days
  mostCaredForPlant: string;
  careStreak: number; // days
  monthlyGrowth: {
    month: string;
    averageGrowth: number;
  }[];
}

export interface NotificationSettings {
  wateringReminders: boolean;
  fertilizingReminders: boolean;
  repottingReminders: boolean;
  pruningReminders: boolean;
  pestControlReminders: boolean;
  customReminders: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'pest-control' | 'custom';
  userPlantId?: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface PlantCareGuideAppState {
  user: User | null;
  plants: Plant[];
  userPlants: UserPlant[];
  careSchedules: CareSchedule[];
  careLogs: CareLog[];
  growthTracking: GrowthTracking[];
  reminders: Reminder[];
  plantCategories: PlantCategory[];
  lightRequirements: LightRequirement[];
  waterNeeds: WaterNeed[];
  soilTypes: SoilType[];
  fertilizerTypes: FertilizerType[];
  propagationMethods: PropagationMethod[];
  troubleshootingTips: TroubleshootingTip[];
  weatherData: WeatherData[];
  plantCareTips: PlantCareTips[];
  achievements: Achievement[];
  statistics: Statistics;
  notificationSettings: NotificationSettings;
  calendarEvents: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

export type PlantCareGuideAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_PLANTS'; payload: Plant[] }
  | { type: 'ADD_PLANT'; payload: Plant }
  | { type: 'UPDATE_PLANT'; payload: Plant }
  | { type: 'DELETE_PLANT'; payload: string }
  | { type: 'SET_USER_PLANTS'; payload: UserPlant[] }
  | { type: 'ADD_USER_PLANT'; payload: UserPlant }
  | { type: 'UPDATE_USER_PLANT'; payload: UserPlant }
  | { type: 'DELETE_USER_PLANT'; payload: string }
  | { type: 'SET_CARE_SCHEDULES'; payload: CareSchedule[] }
  | { type: 'ADD_CARE_SCHEDULE'; payload: CareSchedule }
  | { type: 'UPDATE_CARE_SCHEDULE'; payload: CareSchedule }
  | { type: 'DELETE_CARE_SCHEDULE'; payload: string }
  | { type: 'SET_CARE_LOGS'; payload: CareLog[] }
  | { type: 'ADD_CARE_LOG'; payload: CareLog }
  | { type: 'UPDATE_CARE_LOG'; payload: CareLog }
  | { type: 'DELETE_CARE_LOG'; payload: string }
  | { type: 'SET_GROWTH_TRACKING'; payload: GrowthTracking[] }
  | { type: 'ADD_GROWTH_TRACKING'; payload: GrowthTracking }
  | { type: 'UPDATE_GROWTH_TRACKING'; payload: GrowthTracking }
  | { type: 'DELETE_GROWTH_TRACKING'; payload: string }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'SET_PLANT_CATEGORIES'; payload: PlantCategory[] }
  | { type: 'SET_LIGHT_REQUIREMENTS'; payload: LightRequirement[] }
  | { type: 'SET_WATER_NEEDS'; payload: WaterNeed[] }
  | { type: 'SET_SOIL_TYPES'; payload: SoilType[] }
  | { type: 'SET_FERTILIZER_TYPES'; payload: FertilizerType[] }
  | { type: 'SET_PROPAGATION_METHODS'; payload: PropagationMethod[] }
  | { type: 'SET_TROUBLESHOOTING_TIPS'; payload: TroubleshootingTip[] }
  | { type: 'SET_WEATHER_DATA'; payload: WeatherData[] }
  | { type: 'SET_PLANT_CARE_TIPS'; payload: PlantCareTips[] }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_STATISTICS'; payload: Statistics }
  | { type: 'SET_NOTIFICATION_SETTINGS'; payload: NotificationSettings }
  | { type: 'SET_CALENDAR_EVENTS'; payload: CalendarEvent[] }
  | { type: 'ADD_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_CALENDAR_EVENT'; payload: string }
  | { type: 'RESET_STATE' }; 