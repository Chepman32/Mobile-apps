import { MMKV } from 'react-native-mmkv';
import {
  User,
  FitnessGoal,
  UserPreferences,
  Workout,
  Exercise,
  ExerciseSet,
  WorkoutTemplate,
  TemplateExercise,
  Progress,
  Achievement,
  WorkoutStats,
  ChartData,
  WorkoutType,
  ExerciseCategory,
  MuscleGroup,
  Equipment,
  AchievementType
} from '../types';

export class NomadFitService {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV();
    this.initializeData();
  }

  private initializeData() {
    if (!this.storage.contains('initialized')) {
      this.seedDefaultData();
      this.storage.set('initialized', true);
    }
  }

  private seedDefaultData() {
    // Seed default exercises
    const defaultExercises: Exercise[] = [
      {
        id: 'push-ups',
        name: 'Push-ups',
        category: 'strength',
        type: 'bodyweight',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        equipment: ['none'],
        difficulty: 'beginner',
        instructions: [
          'Start in a plank position with hands slightly wider than shoulders',
          'Lower your body until chest nearly touches the ground',
          'Push back up to starting position',
          'Keep your core tight throughout the movement'
        ],
        tips: [
          'Keep your body in a straight line',
          'Breathe steadily throughout the exercise',
          'Start with modified push-ups if needed'
        ],
        isCustom: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'squats',
        name: 'Bodyweight Squats',
        category: 'strength',
        type: 'bodyweight',
        muscleGroups: ['quads', 'glutes', 'hamstrings'],
        equipment: ['none'],
        difficulty: 'beginner',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body as if sitting back into a chair',
          'Keep your chest up and knees behind toes',
          'Return to standing position'
        ],
        tips: [
          'Keep your weight in your heels',
          'Go as low as you can while maintaining form',
          'Add arm movement for balance'
        ],
        isCustom: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'plank',
        name: 'Plank',
        category: 'strength',
        type: 'bodyweight',
        muscleGroups: ['core', 'abs', 'shoulders'],
        equipment: ['none'],
        difficulty: 'beginner',
        instructions: [
          'Start in a forearm plank position',
          'Keep your body in a straight line',
          'Engage your core muscles',
          'Hold the position'
        ],
        tips: [
          'Don\'t let your hips sag',
          'Breathe steadily',
          'Start with shorter holds and build up'
        ],
        isCustom: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'jumping-jacks',
        name: 'Jumping Jacks',
        category: 'cardio',
        type: 'cardio',
        muscleGroups: ['full_body'],
        equipment: ['none'],
        difficulty: 'beginner',
        instructions: [
          'Start standing with feet together',
          'Jump and spread legs while raising arms',
          'Jump back to starting position',
          'Repeat at a steady pace'
        ],
        tips: [
          'Land softly to protect joints',
          'Keep a steady rhythm',
          'Modify by stepping instead of jumping'
        ],
        isCustom: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'burpees',
        name: 'Burpees',
        category: 'cardio',
        type: 'bodyweight',
        muscleGroups: ['full_body'],
        equipment: ['none'],
        difficulty: 'intermediate',
        instructions: [
          'Start standing, then squat down',
          'Place hands on ground and jump feet back',
          'Perform a push-up',
          'Jump feet forward and jump up'
        ],
        tips: [
          'Maintain good form throughout',
          'Start slow and build speed',
          'Modify by removing the push-up if needed'
        ],
        isCustom: false,
        createdAt: new Date().toISOString()
      }
    ];

    // Seed default workout templates
    const defaultTemplates: WorkoutTemplate[] = [
      {
        id: 'full-body-beginner',
        name: 'Full Body Beginner',
        description: 'Complete full body workout for beginners',
        type: 'strength_training',
        exercises: [
          { exerciseId: 'push-ups', order: 1, sets: 3, reps: 10, restTime: 60 },
          { exerciseId: 'squats', order: 2, sets: 3, reps: 15, restTime: 60 },
          { exerciseId: 'plank', order: 3, sets: 3, duration: 30, restTime: 60 }
        ],
        estimatedDuration: 30,
        difficulty: 'beginner',
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cardio-blast',
        name: 'Cardio Blast',
        description: 'High-intensity cardio workout',
        type: 'hiit',
        exercises: [
          { exerciseId: 'jumping-jacks', order: 1, sets: 4, duration: 30, restTime: 30 },
          { exerciseId: 'burpees', order: 2, sets: 4, duration: 30, restTime: 30 },
          { exerciseId: 'push-ups', order: 3, sets: 3, reps: 10, restTime: 60 }
        ],
        estimatedDuration: 20,
        difficulty: 'intermediate',
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Seed default achievements
    const defaultAchievements: Achievement[] = [
      {
        id: 'first-workout',
        name: 'First Steps',
        description: 'Complete your first workout',
        type: 'total_workouts',
        icon: '🏃‍♂️',
        isUnlocked: false,
        progress: 0,
        target: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Complete 7 workouts in a week',
        type: 'workout_streak',
        icon: '🔥',
        isUnlocked: false,
        progress: 0,
        target: 7,
        createdAt: new Date().toISOString()
      },
      {
        id: 'strength-builder',
        name: 'Strength Builder',
        description: 'Complete 50 strength training workouts',
        type: 'total_workouts',
        icon: '💪',
        isUnlocked: false,
        progress: 0,
        target: 50,
        createdAt: new Date().toISOString()
      },
      {
        id: 'endurance-master',
        name: 'Endurance Master',
        description: 'Complete 100 cardio workouts',
        type: 'total_workouts',
        icon: '❤️',
        isUnlocked: false,
        progress: 0,
        target: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: 'consistency-king',
        name: 'Consistency King',
        description: 'Maintain a 30-day workout streak',
        type: 'workout_streak',
        icon: '👑',
        isUnlocked: false,
        progress: 0,
        target: 30,
        createdAt: new Date().toISOString()
      }
    ];

    this.storage.set('exercises', JSON.stringify(defaultExercises));
    this.storage.set('templates', JSON.stringify(defaultTemplates));
    this.storage.set('achievements', JSON.stringify(defaultAchievements));
    this.storage.set('workouts', JSON.stringify([]));
    this.storage.set('progress', JSON.stringify([]));
    this.storage.set('user', JSON.stringify(null));
  }

  // User Management
  async getUser(): Promise<User | null> {
    const userData = this.storage.getString('user');
    return userData ? JSON.parse(userData) : null;
  }

  async updateUser(updates: Partial<User>): Promise<void> {
    const user = await this.getUser();
    const updatedUser = user ? { ...user, ...updates, updatedAt: new Date().toISOString() } : null;
    this.storage.set('user', JSON.stringify(updatedUser));
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const user = await this.getUser();
    if (user) {
      const updatedPreferences = { ...user.preferences, ...preferences };
      await this.updateUser({ preferences: updatedPreferences });
    }
  }

  async addGoal(goal: Omit<FitnessGoal, 'id' | 'createdAt'>): Promise<void> {
    const user = await this.getUser();
    if (user) {
      const newGoal: FitnessGoal = {
        ...goal,
        id: this.generateId(),
        createdAt: new Date().toISOString()
      };
      const updatedGoals = [...user.goals, newGoal];
      await this.updateUser({ goals: updatedGoals });
    }
  }

  async updateGoal(goalId: string, updates: Partial<FitnessGoal>): Promise<void> {
    const user = await this.getUser();
    if (user) {
      const updatedGoals = user.goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      );
      await this.updateUser({ goals: updatedGoals });
    }
  }

  async completeGoal(goalId: string): Promise<void> {
    await this.updateGoal(goalId, { isCompleted: true });
  }

  // Workout Management
  async getWorkouts(limit?: number): Promise<Workout[]> {
    const workoutsData = this.storage.getString('workouts');
    const workouts: Workout[] = workoutsData ? JSON.parse(workoutsData) : [];
    return limit ? workouts.slice(0, limit) : workouts;
  }

  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    const newWorkout: Workout = {
      ...workout,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const workouts = await this.getWorkouts();
    workouts.unshift(newWorkout);
    this.storage.set('workouts', JSON.stringify(workouts));

    return newWorkout;
  }

  async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<void> {
    const workouts = await this.getWorkouts();
    const updatedWorkouts = workouts.map(workout =>
      workout.id === workoutId 
        ? { ...workout, ...updates, updatedAt: new Date().toISOString() }
        : workout
    );
    this.storage.set('workouts', JSON.stringify(updatedWorkouts));
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    const workouts = await this.getWorkouts();
    const filteredWorkouts = workouts.filter(workout => workout.id !== workoutId);
    this.storage.set('workouts', JSON.stringify(filteredWorkouts));
  }

  // Exercise Management
  async getExercises(): Promise<Exercise[]> {
    const exercisesData = this.storage.getString('exercises');
    return exercisesData ? JSON.parse(exercisesData) : [];
  }

  async addExercise(exercise: Omit<Exercise, 'id' | 'createdAt'>): Promise<void> {
    const newExercise: Exercise = {
      ...exercise,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    const exercises = await this.getExercises();
    exercises.push(newExercise);
    this.storage.set('exercises', JSON.stringify(exercises));
  }

  async updateExercise(exerciseId: string, updates: Partial<Exercise>): Promise<void> {
    const exercises = await this.getExercises();
    const updatedExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
    );
    this.storage.set('exercises', JSON.stringify(updatedExercises));
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    const exercises = await this.getExercises();
    const filteredExercises = exercises.filter(exercise => exercise.id !== exerciseId);
    this.storage.set('exercises', JSON.stringify(filteredExercises));
  }

  async getExercisesByCategory(category: ExerciseCategory): Promise<Exercise[]> {
    const exercises = await this.getExercises();
    return exercises.filter(exercise => exercise.category === category);
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    const exercises = await this.getExercises();
    const lowerQuery = query.toLowerCase();
    return exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(lowerQuery) ||
      exercise.muscleGroups.some(group => group.toLowerCase().includes(lowerQuery))
    );
  }

  // Template Management
  async getTemplates(): Promise<WorkoutTemplate[]> {
    const templatesData = this.storage.getString('templates');
    return templatesData ? JSON.parse(templatesData) : [];
  }

  async createTemplate(template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const newTemplate: WorkoutTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const templates = await this.getTemplates();
    templates.push(newTemplate);
    this.storage.set('templates', JSON.stringify(templates));
  }

  async updateTemplate(templateId: string, updates: Partial<WorkoutTemplate>): Promise<void> {
    const templates = await this.getTemplates();
    const updatedTemplates = templates.map(template =>
      template.id === templateId 
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    );
    this.storage.set('templates', JSON.stringify(updatedTemplates));
  }

  async deleteTemplate(templateId: string): Promise<void> {
    const templates = await this.getTemplates();
    const filteredTemplates = templates.filter(template => template.id !== templateId);
    this.storage.set('templates', JSON.stringify(filteredTemplates));
  }

  async getTemplatesByType(type: WorkoutType): Promise<WorkoutTemplate[]> {
    const templates = await this.getTemplates();
    return templates.filter(template => template.type === type);
  }

  // Progress Tracking
  async getProgress(): Promise<Progress[]> {
    const progressData = this.storage.getString('progress');
    return progressData ? JSON.parse(progressData) : [];
  }

  async addProgress(progress: Omit<Progress, 'id' | 'createdAt'>): Promise<void> {
    const newProgress: Progress = {
      ...progress,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    const progressList = await this.getProgress();
    progressList.push(newProgress);
    this.storage.set('progress', JSON.stringify(progressList));
  }

  async updateProgress(progressId: string, updates: Partial<Progress>): Promise<void> {
    const progressList = await this.getProgress();
    const updatedProgress = progressList.map(progress =>
      progress.id === progressId ? { ...progress, ...updates } : progress
    );
    this.storage.set('progress', JSON.stringify(updatedProgress));
  }

  async deleteProgress(progressId: string): Promise<void> {
    const progressList = await this.getProgress();
    const filteredProgress = progressList.filter(progress => progress.id !== progressId);
    this.storage.set('progress', JSON.stringify(filteredProgress));
  }

  async getProgressByType(type: Progress['type']): Promise<Progress[]> {
    const progressList = await this.getProgress();
    return progressList.filter(progress => progress.type === type);
  }

  // Achievement Management
  async getAchievements(): Promise<Achievement[]> {
    const achievementsData = this.storage.getString('achievements');
    return achievementsData ? JSON.parse(achievementsData) : [];
  }

  async unlockAchievement(achievementId: string): Promise<void> {
    const achievements = await this.getAchievements();
    const updatedAchievements = achievements.map(achievement =>
      achievement.id === achievementId
        ? { ...achievement, isUnlocked: true, unlockedAt: new Date().toISOString() }
        : achievement
    );
    this.storage.set('achievements', JSON.stringify(updatedAchievements));
  }

  // Statistics
  async getWorkoutStats(): Promise<WorkoutStats> {
    const workouts = await this.getWorkouts();
    const achievements = await this.getAchievements();
    const user = await this.getUser();

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
    const averageWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    // Calculate streaks
    const sortedWorkouts = workouts
      .filter(w => w.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      const prevDate = i > 0 ? new Date(sortedWorkouts[i - 1].date) : null;
      
      if (!prevDate || this.isConsecutiveDay(workoutDate, prevDate)) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate favorite workout type
    const workoutTypeCounts = workouts.reduce((counts, workout) => {
      counts[workout.type] = (counts[workout.type] || 0) + 1;
      return counts;
    }, {} as Record<WorkoutType, number>);

    const favoriteWorkoutType = Object.entries(workoutTypeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as WorkoutType || 'strength_training';

    // Calculate goal progress
    const weeklyGoalProgress = user?.preferences.workoutFrequency ? 
      Math.min((currentStreak / user.preferences.workoutFrequency) * 100, 100) : 0;
    
    const monthlyGoalProgress = user?.preferences.workoutFrequency ? 
      Math.min((totalWorkouts / (user.preferences.workoutFrequency * 4)) * 100, 100) : 0;

    return {
      totalWorkouts,
      totalDuration,
      totalCaloriesBurned,
      averageWorkoutDuration,
      currentStreak,
      longestStreak,
      favoriteWorkoutType,
      weeklyGoalProgress,
      monthlyGoalProgress,
      achievements: achievements.filter(a => a.isUnlocked)
    };
  }

  // Chart Data
  async getProgressChartData(type: Progress['type'], days: number = 30): ChartData {
    const progressList = await this.getProgressByType(type);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

    const filteredProgress = progressList.filter(progress => {
      const progressDate = new Date(progress.date);
      return progressDate >= startDate && progressDate <= endDate;
    });

    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(dateStr);

      const dayProgress = filteredProgress.find(p => {
        const progressDate = new Date(p.date);
        return progressDate.toDateString() === date.toDateString();
      });

      data.push(dayProgress?.value || 0);
    }

    return {
      labels,
      datasets: [{
        data,
        color: '#4a90e2',
        strokeWidth: 2
      }]
    };
  }

  // Data Management
  exportData(): string {
    const data = {
      user: this.storage.getString('user'),
      workouts: this.storage.getString('workouts'),
      exercises: this.storage.getString('exercises'),
      templates: this.storage.getString('templates'),
      progress: this.storage.getString('progress'),
      achievements: this.storage.getString('achievements'),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.user) this.storage.set('user', data.user);
      if (data.workouts) this.storage.set('workouts', data.workouts);
      if (data.exercises) this.storage.set('exercises', data.exercises);
      if (data.templates) this.storage.set('templates', data.templates);
      if (data.progress) this.storage.set('progress', data.progress);
      if (data.achievements) this.storage.set('achievements', data.achievements);
      
      return true;
    } catch (error) {
      console.error('Import data error:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    this.storage.clearAll();
    this.initializeData();
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private isConsecutiveDay(date1: Date, date2: Date): boolean {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }
}

export default new NomadFitService(); 