import { MMKV } from 'react-native-mmkv';
import {
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

const storage = new MMKV();

// Storage keys
const STORAGE_KEYS = {
  USER: 'plant_care_guide_user',
  PLANTS: 'plant_care_guide_plants',
  USER_PLANTS: 'plant_care_guide_user_plants',
  CARE_SCHEDULES: 'plant_care_guide_care_schedules',
  CARE_LOGS: 'plant_care_guide_care_logs',
  GROWTH_TRACKING: 'plant_care_guide_growth_tracking',
  REMINDERS: 'plant_care_guide_reminders',
  PLANT_CATEGORIES: 'plant_care_guide_plant_categories',
  LIGHT_REQUIREMENTS: 'plant_care_guide_light_requirements',
  WATER_NEEDS: 'plant_care_guide_water_needs',
  SOIL_TYPES: 'plant_care_guide_soil_types',
  FERTILIZER_TYPES: 'plant_care_guide_fertilizer_types',
  PROPAGATION_METHODS: 'plant_care_guide_propagation_methods',
  TROUBLESHOOTING_TIPS: 'plant_care_guide_troubleshooting_tips',
  WEATHER_DATA: 'plant_care_guide_weather_data',
  PLANT_CARE_TIPS: 'plant_care_guide_plant_care_tips',
  ACHIEVEMENTS: 'plant_care_guide_achievements',
  STATISTICS: 'plant_care_guide_statistics',
  NOTIFICATION_SETTINGS: 'plant_care_guide_notification_settings',
  CALENDAR_EVENTS: 'plant_care_guide_calendar_events',
};

class PlantCareGuideService {
  // Default data seeding
  static seedDefaultData() {
    if (!storage.contains(STORAGE_KEYS.PLANT_CATEGORIES)) {
      this.seedPlantCategories();
    }
    if (!storage.contains(STORAGE_KEYS.LIGHT_REQUIREMENTS)) {
      this.seedLightRequirements();
    }
    if (!storage.contains(STORAGE_KEYS.WATER_NEEDS)) {
      this.seedWaterNeeds();
    }
    if (!storage.contains(STORAGE_KEYS.SOIL_TYPES)) {
      this.seedSoilTypes();
    }
    if (!storage.contains(STORAGE_KEYS.FERTILIZER_TYPES)) {
      this.seedFertilizerTypes();
    }
    if (!storage.contains(STORAGE_KEYS.PROPAGATION_METHODS)) {
      this.seedPropagationMethods();
    }
    if (!storage.contains(STORAGE_KEYS.TROUBLESHOOTING_TIPS)) {
      this.seedTroubleshootingTips();
    }
    if (!storage.contains(STORAGE_KEYS.PLANT_CARE_TIPS)) {
      this.seedPlantCareTips();
    }
    if (!storage.contains(STORAGE_KEYS.ACHIEVEMENTS)) {
      this.seedAchievements();
    }
    if (!storage.contains(STORAGE_KEYS.NOTIFICATION_SETTINGS)) {
      this.seedNotificationSettings();
    }
  }

  private static seedPlantCategories() {
    const categories: PlantCategory[] = [
      {
        id: '1',
        name: 'Succulents',
        description: 'Drought-resistant plants that store water in their leaves',
        icon: '🌵',
        color: '#4CAF50',
      },
      {
        id: '2',
        name: 'Tropical Plants',
        description: 'Plants that thrive in warm, humid environments',
        icon: '🌴',
        color: '#2196F3',
      },
      {
        id: '3',
        name: 'Herbs',
        description: 'Aromatic plants used for culinary and medicinal purposes',
        icon: '🌿',
        color: '#8BC34A',
      },
      {
        id: '4',
        name: 'Flowering Plants',
        description: 'Plants that produce colorful blooms',
        icon: '🌸',
        color: '#E91E63',
      },
      {
        id: '5',
        name: 'Ferns',
        description: 'Non-flowering plants that reproduce via spores',
        icon: '🌿',
        color: '#795548',
      },
    ];
    storage.set(STORAGE_KEYS.PLANT_CATEGORIES, JSON.stringify(categories));
  }

  private static seedLightRequirements() {
    const requirements: LightRequirement[] = [
      {
        id: '1',
        name: 'Low Light',
        description: 'Indirect light, away from windows',
        hoursPerDay: 2,
        intensity: 'low',
      },
      {
        id: '2',
        name: 'Medium Light',
        description: 'Bright, indirect light near windows',
        hoursPerDay: 4,
        intensity: 'medium',
      },
      {
        id: '3',
        name: 'High Light',
        description: 'Direct sunlight for several hours',
        hoursPerDay: 6,
        intensity: 'high',
      },
    ];
    storage.set(STORAGE_KEYS.LIGHT_REQUIREMENTS, JSON.stringify(requirements));
  }

  private static seedWaterNeeds() {
    const waterNeeds: WaterNeed[] = [
      {
        id: '1',
        name: 'Low Water',
        description: 'Water only when soil is completely dry',
        frequency: 14,
        amount: 'Light watering',
      },
      {
        id: '2',
        name: 'Moderate Water',
        description: 'Water when top inch of soil is dry',
        frequency: 7,
        amount: 'Moderate watering',
      },
      {
        id: '3',
        name: 'High Water',
        description: 'Keep soil consistently moist',
        frequency: 3,
        amount: 'Heavy watering',
      },
    ];
    storage.set(STORAGE_KEYS.WATER_NEEDS, JSON.stringify(waterNeeds));
  }

  private static seedSoilTypes() {
    const soilTypes: SoilType[] = [
      {
        id: '1',
        name: 'Well-draining',
        description: 'Sandy or loamy soil that drains quickly',
        phRange: { min: 6.0, max: 7.5 },
        drainage: 'good',
      },
      {
        id: '2',
        name: 'Moisture-retaining',
        description: 'Soil that holds moisture well',
        phRange: { min: 5.5, max: 7.0 },
        drainage: 'moderate',
      },
      {
        id: '3',
        name: 'Acidic',
        description: 'Soil with low pH for acid-loving plants',
        phRange: { min: 4.5, max: 6.0 },
        drainage: 'good',
      },
    ];
    storage.set(STORAGE_KEYS.SOIL_TYPES, JSON.stringify(soilTypes));
  }

  private static seedFertilizerTypes() {
    const fertilizerTypes: FertilizerType[] = [
      {
        id: '1',
        name: 'Balanced',
        description: 'Equal parts nitrogen, phosphorus, and potassium',
        npkRatio: '10-10-10',
        applicationFrequency: 30,
      },
      {
        id: '2',
        name: 'High Nitrogen',
        description: 'Promotes leaf growth',
        npkRatio: '20-10-10',
        applicationFrequency: 21,
      },
      {
        id: '3',
        name: 'High Phosphorus',
        description: 'Promotes flowering and root development',
        npkRatio: '10-20-10',
        applicationFrequency: 30,
      },
    ];
    storage.set(STORAGE_KEYS.FERTILIZER_TYPES, JSON.stringify(fertilizerTypes));
  }

  private static seedPropagationMethods() {
    const methods: PropagationMethod[] = [
      {
        id: '1',
        name: 'Stem Cuttings',
        description: 'Cut a stem and root it in water or soil',
        difficulty: 'easy',
        successRate: 80,
      },
      {
        id: '2',
        name: 'Leaf Cuttings',
        description: 'Use individual leaves to grow new plants',
        difficulty: 'medium',
        successRate: 60,
      },
      {
        id: '3',
        name: 'Division',
        description: 'Separate plant clumps into smaller sections',
        difficulty: 'easy',
        successRate: 90,
      },
    ];
    storage.set(STORAGE_KEYS.PROPAGATION_METHODS, JSON.stringify(methods));
  }

  private static seedTroubleshootingTips() {
    const tips: TroubleshootingTip[] = [
      {
        id: '1',
        symptom: 'Yellow leaves',
        cause: 'Overwatering or nutrient deficiency',
        solution: 'Reduce watering frequency and check soil drainage',
        prevention: 'Water only when soil is dry and use well-draining soil',
      },
      {
        id: '2',
        symptom: 'Brown leaf tips',
        cause: 'Underwatering or low humidity',
        solution: 'Increase watering frequency and humidity',
        prevention: 'Maintain consistent watering schedule and use humidifier',
      },
      {
        id: '3',
        symptom: 'Wilting leaves',
        cause: 'Underwatering or root rot',
        solution: 'Check soil moisture and root health',
        prevention: 'Water appropriately and ensure good drainage',
      },
    ];
    storage.set(STORAGE_KEYS.TROUBLESHOOTING_TIPS, JSON.stringify(tips));
  }

  private static seedPlantCareTips() {
    const tips: PlantCareTips[] = [
      {
        id: '1',
        title: 'Watering Basics',
        content: 'Always check soil moisture before watering. Stick your finger 1-2 inches into the soil. If it feels dry, it\'s time to water.',
        category: 'Watering',
        difficulty: 'beginner',
        tags: ['watering', 'basics', 'soil'],
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Light Requirements',
        content: 'Most houseplants prefer bright, indirect light. Avoid direct sunlight which can scorch leaves.',
        category: 'Light',
        difficulty: 'beginner',
        tags: ['light', 'sunlight', 'placement'],
        createdAt: new Date(),
      },
      {
        id: '3',
        title: 'Repotting Guide',
        content: 'Repot when roots are visible at the bottom or when growth slows. Choose a pot only 1-2 inches larger.',
        category: 'Repotting',
        difficulty: 'intermediate',
        tags: ['repotting', 'roots', 'pot size'],
        createdAt: new Date(),
      },
    ];
    storage.set(STORAGE_KEYS.PLANT_CARE_TIPS, JSON.stringify(tips));
  }

  private static seedAchievements() {
    const achievements: Achievement[] = [
      {
        id: '1',
        title: 'Plant Parent',
        description: 'Add your first plant to your collection',
        icon: '🌱',
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
      },
      {
        id: '2',
        title: 'Care Taker',
        description: 'Log 10 care activities',
        icon: '💧',
        isUnlocked: false,
        progress: 0,
        maxProgress: 10,
      },
      {
        id: '3',
        title: 'Growth Tracker',
        description: 'Track growth for 5 different plants',
        icon: '📈',
        isUnlocked: false,
        progress: 0,
        maxProgress: 5,
      },
      {
        id: '4',
        title: 'Plant Expert',
        description: 'Care for 10 different plants',
        icon: '🌿',
        isUnlocked: false,
        progress: 0,
        maxProgress: 10,
      },
    ];
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  private static seedNotificationSettings() {
    const settings: NotificationSettings = {
      wateringReminders: true,
      fertilizingReminders: true,
      repottingReminders: true,
      pruningReminders: true,
      pestControlReminders: true,
      customReminders: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
    storage.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  }

  // User operations
  static getUser(): User | null {
    const userData = storage.getString(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  static saveUser(user: User): void {
    storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Plant operations
  static getPlants(): Plant[] {
    const plantsData = storage.getString(STORAGE_KEYS.PLANTS);
    return plantsData ? JSON.parse(plantsData) : [];
  }

  static savePlants(plants: Plant[]): void {
    storage.set(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
  }

  static addPlant(plant: Plant): void {
    const plants = this.getPlants();
    plants.push(plant);
    this.savePlants(plants);
  }

  static updatePlant(plant: Plant): void {
    const plants = this.getPlants();
    const index = plants.findIndex(p => p.id === plant.id);
    if (index !== -1) {
      plants[index] = plant;
      this.savePlants(plants);
    }
  }

  static deletePlant(plantId: string): void {
    const plants = this.getPlants();
    const filteredPlants = plants.filter(p => p.id !== plantId);
    this.savePlants(filteredPlants);
  }

  // UserPlant operations
  static getUserPlants(): UserPlant[] {
    const userPlantsData = storage.getString(STORAGE_KEYS.USER_PLANTS);
    return userPlantsData ? JSON.parse(userPlantsData) : [];
  }

  static saveUserPlants(userPlants: UserPlant[]): void {
    storage.set(STORAGE_KEYS.USER_PLANTS, JSON.stringify(userPlants));
  }

  static addUserPlant(userPlant: UserPlant): void {
    const userPlants = this.getUserPlants();
    userPlants.push(userPlant);
    this.saveUserPlants(userPlants);
  }

  static updateUserPlant(userPlant: UserPlant): void {
    const userPlants = this.getUserPlants();
    const index = userPlants.findIndex(up => up.id === userPlant.id);
    if (index !== -1) {
      userPlants[index] = userPlant;
      this.saveUserPlants(userPlants);
    }
  }

  static deleteUserPlant(userPlantId: string): void {
    const userPlants = this.getUserPlants();
    const filteredUserPlants = userPlants.filter(up => up.id !== userPlantId);
    this.saveUserPlants(filteredUserPlants);
  }

  // CareSchedule operations
  static getCareSchedules(): CareSchedule[] {
    const schedulesData = storage.getString(STORAGE_KEYS.CARE_SCHEDULES);
    return schedulesData ? JSON.parse(schedulesData) : [];
  }

  static saveCareSchedules(schedules: CareSchedule[]): void {
    storage.set(STORAGE_KEYS.CARE_SCHEDULES, JSON.stringify(schedules));
  }

  static addCareSchedule(schedule: CareSchedule): void {
    const schedules = this.getCareSchedules();
    schedules.push(schedule);
    this.saveCareSchedules(schedules);
  }

  static updateCareSchedule(schedule: CareSchedule): void {
    const schedules = this.getCareSchedules();
    const index = schedules.findIndex(s => s.id === schedule.id);
    if (index !== -1) {
      schedules[index] = schedule;
      this.saveCareSchedules(schedules);
    }
  }

  static deleteCareSchedule(scheduleId: string): void {
    const schedules = this.getCareSchedules();
    const filteredSchedules = schedules.filter(s => s.id !== scheduleId);
    this.saveCareSchedules(filteredSchedules);
  }

  // CareLog operations
  static getCareLogs(): CareLog[] {
    const logsData = storage.getString(STORAGE_KEYS.CARE_LOGS);
    return logsData ? JSON.parse(logsData) : [];
  }

  static saveCareLogs(logs: CareLog[]): void {
    storage.set(STORAGE_KEYS.CARE_LOGS, JSON.stringify(logs));
  }

  static addCareLog(log: CareLog): void {
    const logs = this.getCareLogs();
    logs.push(log);
    this.saveCareLogs(logs);
  }

  static updateCareLog(log: CareLog): void {
    const logs = this.getCareLogs();
    const index = logs.findIndex(l => l.id === log.id);
    if (index !== -1) {
      logs[index] = log;
      this.saveCareLogs(logs);
    }
  }

  static deleteCareLog(logId: string): void {
    const logs = this.getCareLogs();
    const filteredLogs = logs.filter(l => l.id !== logId);
    this.saveCareLogs(filteredLogs);
  }

  // GrowthTracking operations
  static getGrowthTracking(): GrowthTracking[] {
    const trackingData = storage.getString(STORAGE_KEYS.GROWTH_TRACKING);
    return trackingData ? JSON.parse(trackingData) : [];
  }

  static saveGrowthTracking(tracking: GrowthTracking[]): void {
    storage.set(STORAGE_KEYS.GROWTH_TRACKING, JSON.stringify(tracking));
  }

  static addGrowthTracking(tracking: GrowthTracking): void {
    const trackingData = this.getGrowthTracking();
    trackingData.push(tracking);
    this.saveGrowthTracking(trackingData);
  }

  static updateGrowthTracking(tracking: GrowthTracking): void {
    const trackingData = this.getGrowthTracking();
    const index = trackingData.findIndex(t => t.id === tracking.id);
    if (index !== -1) {
      trackingData[index] = tracking;
      this.saveGrowthTracking(trackingData);
    }
  }

  static deleteGrowthTracking(trackingId: string): void {
    const trackingData = this.getGrowthTracking();
    const filteredTracking = trackingData.filter(t => t.id !== trackingId);
    this.saveGrowthTracking(filteredTracking);
  }

  // Reminder operations
  static getReminders(): Reminder[] {
    const remindersData = storage.getString(STORAGE_KEYS.REMINDERS);
    return remindersData ? JSON.parse(remindersData) : [];
  }

  static saveReminders(reminders: Reminder[]): void {
    storage.set(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }

  static addReminder(reminder: Reminder): void {
    const reminders = this.getReminders();
    reminders.push(reminder);
    this.saveReminders(reminders);
  }

  static updateReminder(reminder: Reminder): void {
    const reminders = this.getReminders();
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index !== -1) {
      reminders[index] = reminder;
      this.saveReminders(reminders);
    }
  }

  static deleteReminder(reminderId: string): void {
    const reminders = this.getReminders();
    const filteredReminders = reminders.filter(r => r.id !== reminderId);
    this.saveReminders(filteredReminders);
  }

  // Reference data operations
  static getPlantCategories(): PlantCategory[] {
    const categoriesData = storage.getString(STORAGE_KEYS.PLANT_CATEGORIES);
    return categoriesData ? JSON.parse(categoriesData) : [];
  }

  static getLightRequirements(): LightRequirement[] {
    const requirementsData = storage.getString(STORAGE_KEYS.LIGHT_REQUIREMENTS);
    return requirementsData ? JSON.parse(requirementsData) : [];
  }

  static getWaterNeeds(): WaterNeed[] {
    const waterNeedsData = storage.getString(STORAGE_KEYS.WATER_NEEDS);
    return waterNeedsData ? JSON.parse(waterNeedsData) : [];
  }

  static getSoilTypes(): SoilType[] {
    const soilTypesData = storage.getString(STORAGE_KEYS.SOIL_TYPES);
    return soilTypesData ? JSON.parse(soilTypesData) : [];
  }

  static getFertilizerTypes(): FertilizerType[] {
    const fertilizerTypesData = storage.getString(STORAGE_KEYS.FERTILIZER_TYPES);
    return fertilizerTypesData ? JSON.parse(fertilizerTypesData) : [];
  }

  static getPropagationMethods(): PropagationMethod[] {
    const methodsData = storage.getString(STORAGE_KEYS.PROPAGATION_METHODS);
    return methodsData ? JSON.parse(methodsData) : [];
  }

  static getTroubleshootingTips(): TroubleshootingTip[] {
    const tipsData = storage.getString(STORAGE_KEYS.TROUBLESHOOTING_TIPS);
    return tipsData ? JSON.parse(tipsData) : [];
  }

  static getPlantCareTips(): PlantCareTips[] {
    const tipsData = storage.getString(STORAGE_KEYS.PLANT_CARE_TIPS);
    return tipsData ? JSON.parse(tipsData) : [];
  }

  // Weather data operations
  static getWeatherData(): WeatherData[] {
    const weatherData = storage.getString(STORAGE_KEYS.WEATHER_DATA);
    return weatherData ? JSON.parse(weatherData) : [];
  }

  static saveWeatherData(weatherData: WeatherData[]): void {
    storage.set(STORAGE_KEYS.WEATHER_DATA, JSON.stringify(weatherData));
  }

  // Achievement operations
  static getAchievements(): Achievement[] {
    const achievementsData = storage.getString(STORAGE_KEYS.ACHIEVEMENTS);
    return achievementsData ? JSON.parse(achievementsData) : [];
  }

  static saveAchievements(achievements: Achievement[]): void {
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  static updateAchievement(achievement: Achievement): void {
    const achievements = this.getAchievements();
    const index = achievements.findIndex(a => a.id === achievement.id);
    if (index !== -1) {
      achievements[index] = achievement;
      this.saveAchievements(achievements);
    }
  }

  // Statistics operations
  static getStatistics(): Statistics {
    const statisticsData = storage.getString(STORAGE_KEYS.STATISTICS);
    return statisticsData ? JSON.parse(statisticsData) : {
      totalPlants: 0,
      healthyPlants: 0,
      plantsNeedingCare: 0,
      totalCareLogs: 0,
      averageHealthScore: 0,
      longestPlantAge: 0,
      mostCaredForPlant: '',
      careStreak: 0,
      monthlyGrowth: [],
    };
  }

  static saveStatistics(statistics: Statistics): void {
    storage.set(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics));
  }

  // Notification settings operations
  static getNotificationSettings(): NotificationSettings {
    const settingsData = storage.getString(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    return settingsData ? JSON.parse(settingsData) : {
      wateringReminders: true,
      fertilizingReminders: true,
      repottingReminders: true,
      pruningReminders: true,
      pestControlReminders: true,
      customReminders: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
  }

  static saveNotificationSettings(settings: NotificationSettings): void {
    storage.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  }

  // Calendar events operations
  static getCalendarEvents(): CalendarEvent[] {
    const eventsData = storage.getString(STORAGE_KEYS.CALENDAR_EVENTS);
    return eventsData ? JSON.parse(eventsData) : [];
  }

  static saveCalendarEvents(events: CalendarEvent[]): void {
    storage.set(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
  }

  static addCalendarEvent(event: CalendarEvent): void {
    const events = this.getCalendarEvents();
    events.push(event);
    this.saveCalendarEvents(events);
  }

  static updateCalendarEvent(event: CalendarEvent): void {
    const events = this.getCalendarEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      events[index] = event;
      this.saveCalendarEvents(events);
    }
  }

  static deleteCalendarEvent(eventId: string): void {
    const events = this.getCalendarEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    this.saveCalendarEvents(filteredEvents);
  }

  // Utility methods
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static exportData(): string {
    const data = {
      user: this.getUser(),
      plants: this.getPlants(),
      userPlants: this.getUserPlants(),
      careSchedules: this.getCareSchedules(),
      careLogs: this.getCareLogs(),
      growthTracking: this.getGrowthTracking(),
      reminders: this.getReminders(),
      weatherData: this.getWeatherData(),
      achievements: this.getAchievements(),
      statistics: this.getStatistics(),
      notificationSettings: this.getNotificationSettings(),
      calendarEvents: this.getCalendarEvents(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(dataString: string): boolean {
    try {
      const data = JSON.parse(dataString);
      
      if (data.user) this.saveUser(data.user);
      if (data.plants) this.savePlants(data.plants);
      if (data.userPlants) this.saveUserPlants(data.userPlants);
      if (data.careSchedules) this.saveCareSchedules(data.careSchedules);
      if (data.careLogs) this.saveCareLogs(data.careLogs);
      if (data.growthTracking) this.saveGrowthTracking(data.growthTracking);
      if (data.reminders) this.saveReminders(data.reminders);
      if (data.weatherData) this.saveWeatherData(data.weatherData);
      if (data.achievements) this.saveAchievements(data.achievements);
      if (data.statistics) this.saveStatistics(data.statistics);
      if (data.notificationSettings) this.saveNotificationSettings(data.notificationSettings);
      if (data.calendarEvents) this.saveCalendarEvents(data.calendarEvents);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.delete(key);
    });
  }

  // Helper methods for plant care calculations
  static calculateNextWateringDate(lastWatered: Date, frequency: number): Date {
    const nextDate = new Date(lastWatered);
    nextDate.setDate(nextDate.getDate() + frequency);
    return nextDate;
  }

  static isPlantNeedingCare(userPlant: UserPlant, careSchedules: CareSchedule[]): boolean {
    const plantSchedules = careSchedules.filter(s => s.userPlantId === userPlant.id && s.isActive);
    const now = new Date();
    
    return plantSchedules.some(schedule => {
      const nextDue = new Date(schedule.nextDue);
      return nextDue <= now;
    });
  }

  static calculateHealthScore(userPlant: UserPlant, careLogs: CareLog[]): number {
    const recentLogs = careLogs
      .filter(log => log.userPlantId === userPlant.id)
      .filter(log => {
        const logDate = new Date(log.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return logDate >= thirtyDaysAgo;
      });

    if (recentLogs.length === 0) return 5; // Neutral score

    const healthScores = recentLogs
      .map(log => log.healthStatus)
      .filter(status => status !== undefined)
      .map(status => {
        switch (status) {
          case 'excellent': return 10;
          case 'good': return 8;
          case 'fair': return 5;
          case 'poor': return 2;
          default: return 5;
        }
      });

    if (healthScores.length === 0) return 5;

    const averageScore = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
    return Math.round(averageScore);
  }
}

export default PlantCareGuideService; 