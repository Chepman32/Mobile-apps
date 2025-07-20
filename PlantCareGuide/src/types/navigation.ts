import { NavigatorScreenParams } from '@react-navigation/native';
import { UserPlant, Plant, CareLog, GrowthTracking, Reminder } from './index';

export type TabParamList = {
  Home: undefined;
  Plants: undefined;
  Care: undefined;
  Growth: undefined;
  Tips: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  PlantDetail: { userPlant: UserPlant };
  AddPlant: undefined;
  EditPlant: { userPlant: UserPlant };
  CareLogs: { userPlant: UserPlant };
  AddCareLog: { userPlant: UserPlant };
  AddGrowthTracking: { userPlant: UserPlant };
  Reminders: undefined;
  AddReminder: { userPlant?: UserPlant };
  PlantDatabase: undefined;
  Troubleshooting: undefined;
  Achievements: undefined;
  Settings: undefined;
}; 