import * as SQLite from 'expo-sqlite';
import {
  Exercise,
  ExerciseSet,
  ExerciseLog,
  Workout,
  WorkoutTemplate,
  TemplateExercise,
  ProgressEntry,
  UserProfile,
  WorkoutStats,
  ExerciseCategory,
  FitnessLevel,
  WeightUnit,
  ProgressChartData
} from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('workoutlog.db');
    await this.createTables();
    await this.seedDefaultData();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // User profile table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        weight REAL,
        height REAL,
        fitness_level TEXT NOT NULL,
        goals TEXT, -- JSON array
        preferred_units TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Exercises table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        target_muscles TEXT, -- JSON array
        instructions TEXT,
        is_custom INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Workouts table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT,
        end_time TEXT,
        duration INTEGER,
        notes TEXT,
        is_template INTEGER NOT NULL DEFAULT 0,
        template_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (template_id) REFERENCES workout_templates (id)
      );
    `);

    // Exercise logs table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_logs (
        id TEXT PRIMARY KEY,
        workout_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        notes TEXT,
        order_index INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      );
    `);

    // Exercise sets table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_sets (
        id TEXT PRIMARY KEY,
        exercise_log_id TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        duration INTEGER,
        distance REAL,
        rest_time INTEGER,
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (exercise_log_id) REFERENCES exercise_logs (id) ON DELETE CASCADE
      );
    `);

    // Workout templates table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        is_public INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Template exercises table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS template_exercises (
        id TEXT PRIMARY KEY,
        template_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        target_sets INTEGER NOT NULL,
        target_reps INTEGER,
        target_weight REAL,
        target_duration INTEGER,
        rest_time INTEGER,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (template_id) REFERENCES workout_templates (id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      );
    `);

    // Progress entries table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS progress_entries (
        id TEXT PRIMARY KEY,
        exercise_id TEXT NOT NULL,
        date TEXT NOT NULL,
        max_weight REAL NOT NULL,
        total_volume REAL NOT NULL,
        personal_record INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      );
    `);

    // Create indexes for better performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts (date);
      CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout ON exercise_logs (workout_id);
      CREATE INDEX IF NOT EXISTS idx_exercise_sets_log ON exercise_sets (exercise_log_id);
      CREATE INDEX IF NOT EXISTS idx_progress_exercise_date ON progress_entries (exercise_id, date);
    `);
  }

  private async seedDefaultData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if exercises already exist
    const existingExercises = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM exercises');
    if ((existingExercises as any)?.count > 0) return;

    // Seed default exercises
    const defaultExercises: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { name: 'Bench Press', category: ExerciseCategory.CHEST, targetMuscles: ['chest', 'triceps', 'shoulders'], instructions: 'Lie on bench, lower bar to chest, press up', isCustom: false },
      { name: 'Squat', category: ExerciseCategory.LEGS, targetMuscles: ['quadriceps', 'glutes', 'hamstrings'], instructions: 'Stand with feet shoulder-width apart, squat down, drive up', isCustom: false },
      { name: 'Deadlift', category: ExerciseCategory.BACK, targetMuscles: ['back', 'glutes', 'hamstrings'], instructions: 'Lift bar from ground to standing position', isCustom: false },
      { name: 'Pull-ups', category: ExerciseCategory.BACK, targetMuscles: ['back', 'biceps'], instructions: 'Hang from bar, pull body up until chin over bar', isCustom: false },
      { name: 'Overhead Press', category: ExerciseCategory.SHOULDERS, targetMuscles: ['shoulders', 'triceps'], instructions: 'Press weight overhead from shoulder level', isCustom: false },
      { name: 'Barbell Row', category: ExerciseCategory.BACK, targetMuscles: ['back', 'biceps'], instructions: 'Bend over, row bar to chest', isCustom: false },
      { name: 'Dips', category: ExerciseCategory.CHEST, targetMuscles: ['chest', 'triceps'], instructions: 'Lower body between parallel bars, push up', isCustom: false },
      { name: 'Lunges', category: ExerciseCategory.LEGS, targetMuscles: ['quadriceps', 'glutes'], instructions: 'Step forward, lower back knee, return to start', isCustom: false },
      { name: 'Push-ups', category: ExerciseCategory.CHEST, targetMuscles: ['chest', 'triceps', 'shoulders'], instructions: 'Lower chest to ground, push up', isCustom: false },
      { name: 'Plank', category: ExerciseCategory.CORE, targetMuscles: ['core', 'shoulders'], instructions: 'Hold body in straight line on forearms', isCustom: false }
    ];

    for (const exercise of defaultExercises) {
      const id = this.generateId();
      const now = new Date().toISOString();
      await this.db.runAsync(
        `INSERT INTO exercises (id, name, category, target_muscles, instructions, is_custom, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, exercise.name, exercise.category, JSON.stringify(exercise.targetMuscles), exercise.instructions, exercise.isCustom ? 1 : 0, now, now]
      );
    }

    // Create default user profile
    const profileId = this.generateId();
    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT INTO user_profiles (id, name, fitness_level, goals, preferred_units, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [profileId, 'User', FitnessLevel.BEGINNER, JSON.stringify(['Build muscle', 'Get stronger']), WeightUnit.KG, now, now]
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Exercise operations
  async createExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO exercises (id, name, category, target_muscles, instructions, is_custom, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, exercise.name, exercise.category, JSON.stringify(exercise.targetMuscles), exercise.instructions, exercise.isCustom ? 1 : 0, now, now]
    );

    return { ...exercise, id, createdAt: now, updatedAt: now };
  }

  async getExercises(): Promise<Exercise[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync('SELECT * FROM exercises ORDER BY name ASC');
    return rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      targetMuscles: JSON.parse(row.target_muscles || '[]'),
      instructions: row.instructions,
      isCustom: Boolean(row.is_custom),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync('SELECT * FROM exercises WHERE id = ?', [id]);
    if (!row) return null;

    return {
      id: (row as any).id,
      name: (row as any).name,
      category: (row as any).category,
      targetMuscles: JSON.parse((row as any).target_muscles || '[]'),
      instructions: (row as any).instructions,
      isCustom: Boolean((row as any).is_custom),
      createdAt: (row as any).created_at,
      updatedAt: (row as any).updated_at
    };
  }

  // Workout operations
  async createWorkout(workout: Omit<Workout, 'id' | 'exercises' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO workouts (id, name, date, start_time, end_time, duration, notes, is_template, template_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, workout.name, workout.date, workout.startTime, workout.endTime, workout.duration, workout.notes, workout.isTemplate ? 1 : 0, workout.templateId, now, now]
    );

    return {
      ...workout,
      id,
      exercises: [],
      createdAt: now,
      updatedAt: now
    };
  }

  async getWorkouts(limit?: number): Promise<Workout[]> {
    if (!this.db) throw new Error('Database not initialized');

    const limitClause = limit ? `LIMIT ${limit}` : '';
    const rows = await this.db.getAllAsync(`SELECT * FROM workouts WHERE is_template = 0 ORDER BY date DESC, created_at DESC ${limitClause}`);
    
    const workouts: Workout[] = [];
    for (const row of rows) {
      const workout = await this.getWorkoutById((row as any).id);
      if (workout) workouts.push(workout);
    }

    return workouts;
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync('SELECT * FROM workouts WHERE id = ?', [id]);
    if (!row) return null;

    const exerciseLogs = await this.getExerciseLogsByWorkoutId(id);

    return {
      id: (row as any).id,
      name: (row as any).name,
      date: (row as any).date,
      startTime: (row as any).start_time,
      endTime: (row as any).end_time,
      duration: (row as any).duration,
      notes: (row as any).notes,
      isTemplate: Boolean((row as any).is_template),
      templateId: (row as any).template_id,
      exercises: exerciseLogs,
      createdAt: (row as any).created_at,
      updatedAt: (row as any).updated_at
    };
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const fields = [];
    const values = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.date !== undefined) { fields.push('date = ?'); values.push(updates.date); }
    if (updates.startTime !== undefined) { fields.push('start_time = ?'); values.push(updates.startTime); }
    if (updates.endTime !== undefined) { fields.push('end_time = ?'); values.push(updates.endTime); }
    if (updates.duration !== undefined) { fields.push('duration = ?'); values.push(updates.duration); }
    if (updates.notes !== undefined) { fields.push('notes = ?'); values.push(updates.notes); }

    if (fields.length === 0) return;

    fields.push('updated_at = ?');
    values.push(now, id);

    await this.db.runAsync(
      `UPDATE workouts SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteWorkout(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
  }

  // Exercise log operations
  async createExerciseLog(log: Omit<ExerciseLog, 'id' | 'exercise' | 'sets' | 'createdAt' | 'updatedAt'>): Promise<ExerciseLog> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO exercise_logs (id, workout_id, exercise_id, notes, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, log.workoutId, log.exerciseId, log.notes, log.orderIndex, now, now]
    );

    const exercise = await this.getExerciseById(log.exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    return {
      ...log,
      id,
      exercise,
      sets: [],
      createdAt: now,
      updatedAt: now
    };
  }

  async getExerciseLogsByWorkoutId(workoutId: string): Promise<ExerciseLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync('SELECT * FROM exercise_logs WHERE workout_id = ? ORDER BY order_index ASC', [workoutId]);
    
    const exerciseLogs: ExerciseLog[] = [];
    for (const row of rows) {
      const exercise = await this.getExerciseById((row as any).exercise_id);
      const sets = await this.getSetsByExerciseLogId((row as any).id);
      
      if (exercise) {
        exerciseLogs.push({
          id: (row as any).id,
          workoutId: (row as any).workout_id,
          exerciseId: (row as any).exercise_id,
          exercise,
          sets,
          notes: (row as any).notes,
          orderIndex: (row as any).order_index,
          createdAt: (row as any).created_at,
          updatedAt: (row as any).updated_at
        });
      }
    }

    return exerciseLogs;
  }

  // Exercise set operations
  async createSet(set: Omit<ExerciseSet, 'id' | 'createdAt'>): Promise<ExerciseSet> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO exercise_sets (id, exercise_log_id, set_number, reps, weight, duration, distance, rest_time, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, set.exerciseLogId, set.setNumber, set.reps, set.weight, set.duration, set.distance, set.restTime, set.notes, now]
    );

    return { ...set, id, createdAt: now };
  }

  async getSetsByExerciseLogId(exerciseLogId: string): Promise<ExerciseSet[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync('SELECT * FROM exercise_sets WHERE exercise_log_id = ? ORDER BY set_number ASC', [exerciseLogId]);
    
    return rows.map((row: any) => ({
      id: row.id,
      exerciseLogId: row.exercise_log_id,
      setNumber: row.set_number,
      reps: row.reps,
      weight: row.weight,
      duration: row.duration,
      distance: row.distance,
      restTime: row.rest_time,
      notes: row.notes,
      createdAt: row.created_at
    }));
  }

  async updateSet(id: string, updates: Partial<ExerciseSet>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = [];
    const values = [];

    if (updates.reps !== undefined) { fields.push('reps = ?'); values.push(updates.reps); }
    if (updates.weight !== undefined) { fields.push('weight = ?'); values.push(updates.weight); }
    if (updates.duration !== undefined) { fields.push('duration = ?'); values.push(updates.duration); }
    if (updates.distance !== undefined) { fields.push('distance = ?'); values.push(updates.distance); }
    if (updates.restTime !== undefined) { fields.push('rest_time = ?'); values.push(updates.restTime); }
    if (updates.notes !== undefined) { fields.push('notes = ?'); values.push(updates.notes); }

    if (fields.length === 0) return;

    values.push(id);

    await this.db.runAsync(
      `UPDATE exercise_sets SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteSet(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM exercise_sets WHERE id = ?', [id]);
  }

  // User profile operations
  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync('SELECT * FROM user_profiles LIMIT 1');
    if (!row) return null;

    return {
      id: (row as any).id,
      name: (row as any).name,
      age: (row as any).age,
      weight: (row as any).weight,
      height: (row as any).height,
      fitnessLevel: (row as any).fitness_level,
      goals: JSON.parse((row as any).goals || '[]'),
      preferredUnits: (row as any).preferred_units,
      createdAt: (row as any).created_at,
      updatedAt: (row as any).updated_at
    };
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const fields = [];
    const values = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.age !== undefined) { fields.push('age = ?'); values.push(updates.age); }
    if (updates.weight !== undefined) { fields.push('weight = ?'); values.push(updates.weight); }
    if (updates.height !== undefined) { fields.push('height = ?'); values.push(updates.height); }
    if (updates.fitnessLevel !== undefined) { fields.push('fitness_level = ?'); values.push(updates.fitnessLevel); }
    if (updates.goals !== undefined) { fields.push('goals = ?'); values.push(JSON.stringify(updates.goals)); }
    if (updates.preferredUnits !== undefined) { fields.push('preferred_units = ?'); values.push(updates.preferredUnits); }

    if (fields.length === 0) return;

    fields.push('updated_at = ?');
    values.push(now);

    await this.db.runAsync(
      `UPDATE user_profiles SET ${fields.join(', ')} WHERE id = (SELECT id FROM user_profiles LIMIT 1)`,
      values
    );
  }

  // Statistics operations
  async getWorkoutStats(): Promise<WorkoutStats> {
    if (!this.db) throw new Error('Database not initialized');

    const workoutCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM workouts WHERE is_template = 0');
    const exerciseCount = await this.db.getFirstAsync('SELECT COUNT(DISTINCT exercise_id) as count FROM exercise_logs');
    const setCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM exercise_sets');
    
    const volumeQuery = await this.db.getFirstAsync(`
      SELECT SUM(reps * weight) as total_volume 
      FROM exercise_sets es
      JOIN exercise_logs el ON es.exercise_log_id = el.id
      JOIN workouts w ON el.workout_id = w.id
      WHERE w.is_template = 0
    `);

    const durationQuery = await this.db.getFirstAsync(`
      SELECT AVG(duration) as avg_duration 
      FROM workouts 
      WHERE is_template = 0 AND duration IS NOT NULL
    `);

    const lastWorkoutQuery = await this.db.getFirstAsync(`
      SELECT date 
      FROM workouts 
      WHERE is_template = 0 
      ORDER BY date DESC 
      LIMIT 1
    `);

    return {
      totalWorkouts: (workoutCount as any)?.count || 0,
      totalExercises: (exerciseCount as any)?.count || 0,
      totalSets: (setCount as any)?.count || 0,
      totalVolume: (volumeQuery as any)?.total_volume || 0,
      averageWorkoutDuration: (durationQuery as any)?.avg_duration || 0,
      currentStreak: 0, // TODO: Calculate streak
      longestStreak: 0, // TODO: Calculate streak
      personalRecords: 0, // TODO: Calculate PRs
      lastWorkoutDate: (lastWorkoutQuery as any)?.date
    };
  }

  // Progress data for charts
  async getProgressData(exerciseId: string, days: number = 30): Promise<ProgressChartData> {
    if (!this.db) throw new Error('Database not initialized');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const rows = await this.db.getAllAsync(`
      SELECT 
        w.date,
        MAX(es.weight) as max_weight,
        SUM(es.reps * es.weight) as total_volume,
        SUM(es.reps) as total_reps
      FROM exercise_sets es
      JOIN exercise_logs el ON es.exercise_log_id = el.id
      JOIN workouts w ON el.workout_id = w.id
      WHERE el.exercise_id = ? AND w.date >= ? AND w.is_template = 0
      GROUP BY w.date
      ORDER BY w.date ASC
    `, [exerciseId, cutoffDate.toISOString().split('T')[0]]);

    return {
      weight: rows.map((row: any) => ({
        label: new Date(row.date).toLocaleDateString(),
        value: row.max_weight,
        date: row.date
      })),
      volume: rows.map((row: any) => ({
        label: new Date(row.date).toLocaleDateString(),
        value: row.total_volume,
        date: row.date
      })),
      reps: rows.map((row: any) => ({
        label: new Date(row.date).toLocaleDateString(),
        value: row.total_reps,
        date: row.date
      }))
    };
  }
}

export default new DatabaseService();