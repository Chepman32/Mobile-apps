import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  PlantCareGuideAppState,
  PlantCareGuideAction,
  User,
  Plant,
  UserPlant,
  CareSchedule,
  CareLog,
  GrowthTracking,
  Reminder,
  PlantCategory,
  LightRequirement,
  WaterNeed,
  SoilType,
  FertilizerType,
  PropagationMethod,
  TroubleshootingTip,
  WeatherData,
  PlantCareTips,
  Achievement,
  Statistics,
  NotificationSettings,
  CalendarEvent,
} from '../types';
import PlantCareGuideService from '../services/PlantCareGuideService';

// Initial state
const initialState: PlantCareGuideAppState = {
  user: null,
  plants: [],
  userPlants: [],
  careSchedules: [],
  careLogs: [],
  growthTracking: [],
  reminders: [],
  plantCategories: [],
  lightRequirements: [],
  waterNeeds: [],
  soilTypes: [],
  fertilizerTypes: [],
  propagationMethods: [],
  troubleshootingTips: [],
  weatherData: [],
  plantCareTips: [],
  achievements: [],
  statistics: {
    totalPlants: 0,
    healthyPlants: 0,
    plantsNeedingCare: 0,
    totalCareLogs: 0,
    averageHealthScore: 0,
    longestPlantAge: 0,
    mostCaredForPlant: '',
    careStreak: 0,
    monthlyGrowth: [],
  },
  notificationSettings: {
    wateringReminders: true,
    fertilizingReminders: true,
    repottingReminders: true,
    pruningReminders: true,
    pestControlReminders: true,
    customReminders: true,
    soundEnabled: true,
    vibrationEnabled: true,
  },
  calendarEvents: [],
  loading: false,
  error: null,
};

// Reducer function
function plantCareGuideReducer(state: PlantCareGuideAppState, action: PlantCareGuideAction): PlantCareGuideAppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_PLANTS':
      return { ...state, plants: action.payload };
    
    case 'ADD_PLANT':
      return { ...state, plants: [...state.plants, action.payload] };
    
    case 'UPDATE_PLANT':
      return {
        ...state,
        plants: state.plants.map(plant => 
          plant.id === action.payload.id ? action.payload : plant
        ),
      };
    
    case 'DELETE_PLANT':
      return {
        ...state,
        plants: state.plants.filter(plant => plant.id !== action.payload),
      };
    
    case 'SET_USER_PLANTS':
      return { ...state, userPlants: action.payload };
    
    case 'ADD_USER_PLANT':
      return { ...state, userPlants: [...state.userPlants, action.payload] };
    
    case 'UPDATE_USER_PLANT':
      return {
        ...state,
        userPlants: state.userPlants.map(userPlant => 
          userPlant.id === action.payload.id ? action.payload : userPlant
        ),
      };
    
    case 'DELETE_USER_PLANT':
      return {
        ...state,
        userPlants: state.userPlants.filter(userPlant => userPlant.id !== action.payload),
      };
    
    case 'SET_CARE_SCHEDULES':
      return { ...state, careSchedules: action.payload };
    
    case 'ADD_CARE_SCHEDULE':
      return { ...state, careSchedules: [...state.careSchedules, action.payload] };
    
    case 'UPDATE_CARE_SCHEDULE':
      return {
        ...state,
        careSchedules: state.careSchedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        ),
      };
    
    case 'DELETE_CARE_SCHEDULE':
      return {
        ...state,
        careSchedules: state.careSchedules.filter(schedule => schedule.id !== action.payload),
      };
    
    case 'SET_CARE_LOGS':
      return { ...state, careLogs: action.payload };
    
    case 'ADD_CARE_LOG':
      return { ...state, careLogs: [...state.careLogs, action.payload] };
    
    case 'UPDATE_CARE_LOG':
      return {
        ...state,
        careLogs: state.careLogs.map(log => 
          log.id === action.payload.id ? action.payload : log
        ),
      };
    
    case 'DELETE_CARE_LOG':
      return {
        ...state,
        careLogs: state.careLogs.filter(log => log.id !== action.payload),
      };
    
    case 'SET_GROWTH_TRACKING':
      return { ...state, growthTracking: action.payload };
    
    case 'ADD_GROWTH_TRACKING':
      return { ...state, growthTracking: [...state.growthTracking, action.payload] };
    
    case 'UPDATE_GROWTH_TRACKING':
      return {
        ...state,
        growthTracking: state.growthTracking.map(tracking => 
          tracking.id === action.payload.id ? action.payload : tracking
        ),
      };
    
    case 'DELETE_GROWTH_TRACKING':
      return {
        ...state,
        growthTracking: state.growthTracking.filter(tracking => tracking.id !== action.payload),
      };
    
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder => 
          reminder.id === action.payload.id ? action.payload : reminder
        ),
      };
    
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
    
    case 'SET_PLANT_CATEGORIES':
      return { ...state, plantCategories: action.payload };
    
    case 'SET_LIGHT_REQUIREMENTS':
      return { ...state, lightRequirements: action.payload };
    
    case 'SET_WATER_NEEDS':
      return { ...state, waterNeeds: action.payload };
    
    case 'SET_SOIL_TYPES':
      return { ...state, soilTypes: action.payload };
    
    case 'SET_FERTILIZER_TYPES':
      return { ...state, fertilizerTypes: action.payload };
    
    case 'SET_PROPAGATION_METHODS':
      return { ...state, propagationMethods: action.payload };
    
    case 'SET_TROUBLESHOOTING_TIPS':
      return { ...state, troubleshootingTips: action.payload };
    
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload };
    
    case 'SET_PLANT_CARE_TIPS':
      return { ...state, plantCareTips: action.payload };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement => 
          achievement.id === action.payload.id ? action.payload : achievement
        ),
      };
    
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    
    case 'SET_NOTIFICATION_SETTINGS':
      return { ...state, notificationSettings: action.payload };
    
    case 'SET_CALENDAR_EVENTS':
      return { ...state, calendarEvents: action.payload };
    
    case 'ADD_CALENDAR_EVENT':
      return { ...state, calendarEvents: [...state.calendarEvents, action.payload] };
    
    case 'UPDATE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.map(event => 
          event.id === action.payload.id ? action.payload : event
        ),
      };
    
    case 'DELETE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.filter(event => event.id !== action.payload),
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context interface
interface PlantCareGuideContextType {
  state: PlantCareGuideAppState;
  dispatch: React.Dispatch<PlantCareGuideAction>;
  // User actions
  loadUser: () => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  // Plant actions
  loadPlants: () => Promise<void>;
  addPlant: (plant: Plant) => Promise<void>;
  updatePlant: (plant: Plant) => Promise<void>;
  deletePlant: (plantId: string) => Promise<void>;
  // UserPlant actions
  loadUserPlants: () => Promise<void>;
  addUserPlant: (userPlant: UserPlant) => Promise<void>;
  updateUserPlant: (userPlant: UserPlant) => Promise<void>;
  deleteUserPlant: (userPlantId: string) => Promise<void>;
  // CareSchedule actions
  loadCareSchedules: () => Promise<void>;
  addCareSchedule: (schedule: CareSchedule) => Promise<void>;
  updateCareSchedule: (schedule: CareSchedule) => Promise<void>;
  deleteCareSchedule: (scheduleId: string) => Promise<void>;
  // CareLog actions
  loadCareLogs: () => Promise<void>;
  addCareLog: (log: CareLog) => Promise<void>;
  updateCareLog: (log: CareLog) => Promise<void>;
  deleteCareLog: (logId: string) => Promise<void>;
  // GrowthTracking actions
  loadGrowthTracking: () => Promise<void>;
  addGrowthTracking: (tracking: GrowthTracking) => Promise<void>;
  updateGrowthTracking: (tracking: GrowthTracking) => Promise<void>;
  deleteGrowthTracking: (trackingId: string) => Promise<void>;
  // Reminder actions
  loadReminders: () => Promise<void>;
  addReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
  // Reference data actions
  loadReferenceData: () => Promise<void>;
  // Weather data actions
  loadWeatherData: () => Promise<void>;
  saveWeatherData: (weatherData: WeatherData[]) => Promise<void>;
  // Achievement actions
  loadAchievements: () => Promise<void>;
  updateAchievement: (achievement: Achievement) => Promise<void>;
  // Statistics actions
  loadStatistics: () => Promise<void>;
  updateStatistics: (statistics: Statistics) => Promise<void>;
  // Notification settings actions
  loadNotificationSettings: () => Promise<void>;
  saveNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  // Calendar events actions
  loadCalendarEvents: () => Promise<void>;
  addCalendarEvent: (event: CalendarEvent) => Promise<void>;
  updateCalendarEvent: (event: CalendarEvent) => Promise<void>;
  deleteCalendarEvent: (eventId: string) => Promise<void>;
  // Utility actions
  exportData: () => string;
  importData: (dataString: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
}

// Create context
const PlantCareGuideContext = createContext<PlantCareGuideContextType | undefined>(undefined);

// Provider component
interface PlantCareGuideProviderProps {
  children: ReactNode;
}

export const PlantCareGuideProvider: React.FC<PlantCareGuideProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(plantCareGuideReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Seed default data
        PlantCareGuideService.seedDefaultData();
        
        // Load all data
        await Promise.all([
          loadUser(),
          loadPlants(),
          loadUserPlants(),
          loadCareSchedules(),
          loadCareLogs(),
          loadGrowthTracking(),
          loadReminders(),
          loadReferenceData(),
          loadWeatherData(),
          loadAchievements(),
          loadStatistics(),
          loadNotificationSettings(),
          loadCalendarEvents(),
        ]);
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeData();
  }, []);

  // User actions
  const loadUser = async () => {
    try {
      const user = PlantCareGuideService.getUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user' });
    }
  };

  const saveUser = async (user: User) => {
    try {
      PlantCareGuideService.saveUser(user);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save user' });
    }
  };

  // Plant actions
  const loadPlants = async () => {
    try {
      const plants = PlantCareGuideService.getPlants();
      dispatch({ type: 'SET_PLANTS', payload: plants });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load plants' });
    }
  };

  const addPlant = async (plant: Plant) => {
    try {
      PlantCareGuideService.addPlant(plant);
      dispatch({ type: 'ADD_PLANT', payload: plant });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add plant' });
    }
  };

  const updatePlant = async (plant: Plant) => {
    try {
      PlantCareGuideService.updatePlant(plant);
      dispatch({ type: 'UPDATE_PLANT', payload: plant });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update plant' });
    }
  };

  const deletePlant = async (plantId: string) => {
    try {
      PlantCareGuideService.deletePlant(plantId);
      dispatch({ type: 'DELETE_PLANT', payload: plantId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete plant' });
    }
  };

  // UserPlant actions
  const loadUserPlants = async () => {
    try {
      const userPlants = PlantCareGuideService.getUserPlants();
      dispatch({ type: 'SET_USER_PLANTS', payload: userPlants });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user plants' });
    }
  };

  const addUserPlant = async (userPlant: UserPlant) => {
    try {
      PlantCareGuideService.addUserPlant(userPlant);
      dispatch({ type: 'ADD_USER_PLANT', payload: userPlant });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add user plant' });
    }
  };

  const updateUserPlant = async (userPlant: UserPlant) => {
    try {
      PlantCareGuideService.updateUserPlant(userPlant);
      dispatch({ type: 'UPDATE_USER_PLANT', payload: userPlant });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update user plant' });
    }
  };

  const deleteUserPlant = async (userPlantId: string) => {
    try {
      PlantCareGuideService.deleteUserPlant(userPlantId);
      dispatch({ type: 'DELETE_USER_PLANT', payload: userPlantId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete user plant' });
    }
  };

  // CareSchedule actions
  const loadCareSchedules = async () => {
    try {
      const schedules = PlantCareGuideService.getCareSchedules();
      dispatch({ type: 'SET_CARE_SCHEDULES', payload: schedules });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load care schedules' });
    }
  };

  const addCareSchedule = async (schedule: CareSchedule) => {
    try {
      PlantCareGuideService.addCareSchedule(schedule);
      dispatch({ type: 'ADD_CARE_SCHEDULE', payload: schedule });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add care schedule' });
    }
  };

  const updateCareSchedule = async (schedule: CareSchedule) => {
    try {
      PlantCareGuideService.updateCareSchedule(schedule);
      dispatch({ type: 'UPDATE_CARE_SCHEDULE', payload: schedule });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update care schedule' });
    }
  };

  const deleteCareSchedule = async (scheduleId: string) => {
    try {
      PlantCareGuideService.deleteCareSchedule(scheduleId);
      dispatch({ type: 'DELETE_CARE_SCHEDULE', payload: scheduleId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete care schedule' });
    }
  };

  // CareLog actions
  const loadCareLogs = async () => {
    try {
      const logs = PlantCareGuideService.getCareLogs();
      dispatch({ type: 'SET_CARE_LOGS', payload: logs });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load care logs' });
    }
  };

  const addCareLog = async (log: CareLog) => {
    try {
      PlantCareGuideService.addCareLog(log);
      dispatch({ type: 'ADD_CARE_LOG', payload: log });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add care log' });
    }
  };

  const updateCareLog = async (log: CareLog) => {
    try {
      PlantCareGuideService.updateCareLog(log);
      dispatch({ type: 'UPDATE_CARE_LOG', payload: log });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update care log' });
    }
  };

  const deleteCareLog = async (logId: string) => {
    try {
      PlantCareGuideService.deleteCareLog(logId);
      dispatch({ type: 'DELETE_CARE_LOG', payload: logId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete care log' });
    }
  };

  // GrowthTracking actions
  const loadGrowthTracking = async () => {
    try {
      const tracking = PlantCareGuideService.getGrowthTracking();
      dispatch({ type: 'SET_GROWTH_TRACKING', payload: tracking });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load growth tracking' });
    }
  };

  const addGrowthTracking = async (tracking: GrowthTracking) => {
    try {
      PlantCareGuideService.addGrowthTracking(tracking);
      dispatch({ type: 'ADD_GROWTH_TRACKING', payload: tracking });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add growth tracking' });
    }
  };

  const updateGrowthTracking = async (tracking: GrowthTracking) => {
    try {
      PlantCareGuideService.updateGrowthTracking(tracking);
      dispatch({ type: 'UPDATE_GROWTH_TRACKING', payload: tracking });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update growth tracking' });
    }
  };

  const deleteGrowthTracking = async (trackingId: string) => {
    try {
      PlantCareGuideService.deleteGrowthTracking(trackingId);
      dispatch({ type: 'DELETE_GROWTH_TRACKING', payload: trackingId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete growth tracking' });
    }
  };

  // Reminder actions
  const loadReminders = async () => {
    try {
      const reminders = PlantCareGuideService.getReminders();
      dispatch({ type: 'SET_REMINDERS', payload: reminders });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load reminders' });
    }
  };

  const addReminder = async (reminder: Reminder) => {
    try {
      PlantCareGuideService.addReminder(reminder);
      dispatch({ type: 'ADD_REMINDER', payload: reminder });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add reminder' });
    }
  };

  const updateReminder = async (reminder: Reminder) => {
    try {
      PlantCareGuideService.updateReminder(reminder);
      dispatch({ type: 'UPDATE_REMINDER', payload: reminder });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update reminder' });
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      PlantCareGuideService.deleteReminder(reminderId);
      dispatch({ type: 'DELETE_REMINDER', payload: reminderId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete reminder' });
    }
  };

  // Reference data actions
  const loadReferenceData = async () => {
    try {
      const [
        plantCategories,
        lightRequirements,
        waterNeeds,
        soilTypes,
        fertilizerTypes,
        propagationMethods,
        troubleshootingTips,
        plantCareTips,
      ] = await Promise.all([
        PlantCareGuideService.getPlantCategories(),
        PlantCareGuideService.getLightRequirements(),
        PlantCareGuideService.getWaterNeeds(),
        PlantCareGuideService.getSoilTypes(),
        PlantCareGuideService.getFertilizerTypes(),
        PlantCareGuideService.getPropagationMethods(),
        PlantCareGuideService.getTroubleshootingTips(),
        PlantCareGuideService.getPlantCareTips(),
      ]);

      dispatch({ type: 'SET_PLANT_CATEGORIES', payload: plantCategories });
      dispatch({ type: 'SET_LIGHT_REQUIREMENTS', payload: lightRequirements });
      dispatch({ type: 'SET_WATER_NEEDS', payload: waterNeeds });
      dispatch({ type: 'SET_SOIL_TYPES', payload: soilTypes });
      dispatch({ type: 'SET_FERTILIZER_TYPES', payload: fertilizerTypes });
      dispatch({ type: 'SET_PROPAGATION_METHODS', payload: propagationMethods });
      dispatch({ type: 'SET_TROUBLESHOOTING_TIPS', payload: troubleshootingTips });
      dispatch({ type: 'SET_PLANT_CARE_TIPS', payload: plantCareTips });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load reference data' });
    }
  };

  // Weather data actions
  const loadWeatherData = async () => {
    try {
      const weatherData = PlantCareGuideService.getWeatherData();
      dispatch({ type: 'SET_WEATHER_DATA', payload: weatherData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load weather data' });
    }
  };

  const saveWeatherData = async (weatherData: WeatherData[]) => {
    try {
      PlantCareGuideService.saveWeatherData(weatherData);
      dispatch({ type: 'SET_WEATHER_DATA', payload: weatherData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save weather data' });
    }
  };

  // Achievement actions
  const loadAchievements = async () => {
    try {
      const achievements = PlantCareGuideService.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load achievements' });
    }
  };

  const updateAchievement = async (achievement: Achievement) => {
    try {
      PlantCareGuideService.updateAchievement(achievement);
      dispatch({ type: 'UPDATE_ACHIEVEMENT', payload: achievement });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update achievement' });
    }
  };

  // Statistics actions
  const loadStatistics = async () => {
    try {
      const statistics = PlantCareGuideService.getStatistics();
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load statistics' });
    }
  };

  const updateStatistics = async (statistics: Statistics) => {
    try {
      PlantCareGuideService.saveStatistics(statistics);
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update statistics' });
    }
  };

  // Notification settings actions
  const loadNotificationSettings = async () => {
    try {
      const settings = PlantCareGuideService.getNotificationSettings();
      dispatch({ type: 'SET_NOTIFICATION_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load notification settings' });
    }
  };

  const saveNotificationSettings = async (settings: NotificationSettings) => {
    try {
      PlantCareGuideService.saveNotificationSettings(settings);
      dispatch({ type: 'SET_NOTIFICATION_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save notification settings' });
    }
  };

  // Calendar events actions
  const loadCalendarEvents = async () => {
    try {
      const events = PlantCareGuideService.getCalendarEvents();
      dispatch({ type: 'SET_CALENDAR_EVENTS', payload: events });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load calendar events' });
    }
  };

  const addCalendarEvent = async (event: CalendarEvent) => {
    try {
      PlantCareGuideService.addCalendarEvent(event);
      dispatch({ type: 'ADD_CALENDAR_EVENT', payload: event });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add calendar event' });
    }
  };

  const updateCalendarEvent = async (event: CalendarEvent) => {
    try {
      PlantCareGuideService.updateCalendarEvent(event);
      dispatch({ type: 'UPDATE_CALENDAR_EVENT', payload: event });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update calendar event' });
    }
  };

  const deleteCalendarEvent = async (eventId: string) => {
    try {
      PlantCareGuideService.deleteCalendarEvent(eventId);
      dispatch({ type: 'DELETE_CALENDAR_EVENT', payload: eventId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete calendar event' });
    }
  };

  // Utility actions
  const exportData = (): string => {
    return PlantCareGuideService.exportData();
  };

  const importData = async (dataString: string): Promise<boolean> => {
    try {
      const success = PlantCareGuideService.importData(dataString);
      if (success) {
        // Reload all data after import
        await Promise.all([
          loadUser(),
          loadPlants(),
          loadUserPlants(),
          loadCareSchedules(),
          loadCareLogs(),
          loadGrowthTracking(),
          loadReminders(),
          loadReferenceData(),
          loadWeatherData(),
          loadAchievements(),
          loadStatistics(),
          loadNotificationSettings(),
          loadCalendarEvents(),
        ]);
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import data' });
      return false;
    }
  };

  const clearAllData = async () => {
    try {
      PlantCareGuideService.clearAllData();
      dispatch({ type: 'RESET_STATE' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear data' });
    }
  };

  const contextValue: PlantCareGuideContextType = {
    state,
    dispatch,
    loadUser,
    saveUser,
    loadPlants,
    addPlant,
    updatePlant,
    deletePlant,
    loadUserPlants,
    addUserPlant,
    updateUserPlant,
    deleteUserPlant,
    loadCareSchedules,
    addCareSchedule,
    updateCareSchedule,
    deleteCareSchedule,
    loadCareLogs,
    addCareLog,
    updateCareLog,
    deleteCareLog,
    loadGrowthTracking,
    addGrowthTracking,
    updateGrowthTracking,
    deleteGrowthTracking,
    loadReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    loadReferenceData,
    loadWeatherData,
    saveWeatherData,
    loadAchievements,
    updateAchievement,
    loadStatistics,
    updateStatistics,
    loadNotificationSettings,
    saveNotificationSettings,
    loadCalendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    exportData,
    importData,
    clearAllData,
  };

  return (
    <PlantCareGuideContext.Provider value={contextValue}>
      {children}
    </PlantCareGuideContext.Provider>
  );
};

// Custom hook to use the context
export const usePlantCareGuide = () => {
  const context = useContext(PlantCareGuideContext);
  if (context === undefined) {
    throw new Error('usePlantCareGuide must be used within a PlantCareGuideProvider');
  }
  return context;
}; 