import { MMKV } from 'react-native-mmkv';
import {
  Level,
  PlayerProgress,
  Achievement,
  GameSettings,
  GameState,
  CircuitSimulation,
  LevelPack,
  Hint,
  LeaderboardEntry,
  GridComponent,
  ComponentType,
} from '../types';

class CircuitPuzzleService {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV();
    this.seedDefaultData();
  }

  // Storage Keys
  private readonly KEYS = {
    LEVELS: 'circuit_puzzle_levels',
    PLAYER_PROGRESS: 'circuit_puzzle_player_progress',
    ACHIEVEMENTS: 'circuit_puzzle_achievements',
    SETTINGS: 'circuit_puzzle_settings',
    GAME_STATE: 'circuit_puzzle_game_state',
    LEVEL_PACKS: 'circuit_puzzle_level_packs',
    HINTS: 'circuit_puzzle_hints',
    LEADERBOARD: 'circuit_puzzle_leaderboard',
  };

  private seedDefaultData() {
    // Seed default levels if none exist
    if (!this.storage.contains(this.KEYS.LEVELS)) {
      const defaultLevels: Level[] = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Connect the battery to the light bulb',
          gridSize: { rows: 3, cols: 3 },
          grid: this.createDefaultGrid(3, 3),
          targetConnections: [{ from: 'battery-1', to: 'light-1' }],
          maxMoves: 5,
          difficulty: 'easy',
          hints: [
            'Place the battery in the top-left corner',
            'Connect it to the light bulb with wires',
          ],
          stars: { one: 5, two: 3, three: 2 },
          category: 'basic',
          isUnlocked: true,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Simple Circuit',
          description: 'Create a basic circuit with multiple components',
          gridSize: { rows: 4, cols: 4 },
          grid: this.createDefaultGrid(4, 4),
          targetConnections: [
            { from: 'battery-1', to: 'light-1' },
            { from: 'battery-1', to: 'light-2' },
          ],
          maxMoves: 8,
          difficulty: 'easy',
          hints: [
            'You can connect multiple lights to one battery',
            'Use nodes to split the connection',
          ],
          stars: { one: 8, two: 6, three: 4 },
          category: 'basic',
          isUnlocked: true,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Switch Control',
          description: 'Add a switch to control the circuit',
          gridSize: { rows: 4, cols: 5 },
          grid: this.createDefaultGrid(4, 5),
          targetConnections: [
            { from: 'battery-1', to: 'switch-1' },
            { from: 'switch-1', to: 'light-1' },
          ],
          maxMoves: 10,
          difficulty: 'medium',
          hints: [
            'The switch must be in the ON position for current to flow',
            'Place the switch between the battery and light',
          ],
          stars: { one: 10, two: 7, three: 5 },
          category: 'basic',
          isUnlocked: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Parallel Circuit',
          description: 'Create a parallel circuit with multiple paths',
          gridSize: { rows: 5, cols: 5 },
          grid: this.createDefaultGrid(5, 5),
          targetConnections: [
            { from: 'battery-1', to: 'light-1' },
            { from: 'battery-1', to: 'light-2' },
            { from: 'battery-1', to: 'light-3' },
          ],
          maxMoves: 12,
          difficulty: 'medium',
          hints: [
            'In parallel circuits, each light has its own path',
            'Use multiple nodes to create parallel branches',
          ],
          stars: { one: 12, two: 9, three: 6 },
          category: 'advanced',
          isUnlocked: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Resistor Challenge',
          description: 'Add resistors to control current flow',
          gridSize: { rows: 5, cols: 6 },
          grid: this.createDefaultGrid(5, 6),
          targetConnections: [
            { from: 'battery-1', to: 'resistor-1' },
            { from: 'resistor-1', to: 'light-1' },
          ],
          maxMoves: 15,
          difficulty: 'hard',
          hints: [
            'Resistors reduce current flow',
            'Place the resistor between the battery and light',
          ],
          stars: { one: 15, two: 11, three: 8 },
          category: 'advanced',
          isUnlocked: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.storage.set(this.KEYS.LEVELS, JSON.stringify(defaultLevels));
    }

    // Seed default achievements
    if (!this.storage.contains(this.KEYS.ACHIEVEMENTS)) {
      const defaultAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first level',
          icon: '🌟',
          category: 'completion',
          requirement: { type: 'levels', value: 1 },
          unlocked: false,
          progress: 0,
          rarity: 'common',
        },
        {
          id: '2',
          title: 'Star Collector',
          description: 'Earn 10 stars',
          icon: '⭐',
          category: 'completion',
          requirement: { type: 'stars', value: 10 },
          unlocked: false,
          progress: 0,
          rarity: 'uncommon',
        },
        {
          id: '3',
          title: 'Efficient Engineer',
          description: 'Complete 5 levels with minimum moves',
          icon: '⚡',
          category: 'efficiency',
          requirement: { type: 'levels', value: 5 },
          unlocked: false,
          progress: 0,
          rarity: 'rare',
        },
        {
          id: '4',
          title: 'Speed Demon',
          description: 'Complete 3 levels in under 2 minutes each',
          icon: '🏃',
          category: 'speed',
          requirement: { type: 'time', value: 120 },
          unlocked: false,
          progress: 0,
          rarity: 'epic',
        },
        {
          id: '5',
          title: 'Circuit Master',
          description: 'Complete all basic levels with 3 stars',
          icon: '👑',
          category: 'mastery',
          requirement: { type: 'levels', value: 10 },
          unlocked: false,
          progress: 0,
          rarity: 'legendary',
        },
      ];
      this.storage.set(this.KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
    }

    // Seed default settings
    if (!this.storage.contains(this.KEYS.SETTINGS)) {
      const defaultSettings: GameSettings = {
        theme: 'auto',
        sound: {
          enabled: true,
          volume: 0.7,
          effects: true,
          music: true,
        },
        graphics: {
          quality: 'medium',
          animations: true,
          particles: true,
        },
        gameplay: {
          showHints: true,
          autoSave: true,
          confirmMoves: false,
          showTimer: true,
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          colorBlindSupport: false,
        },
      };
      this.storage.set(this.KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }

    // Initialize player progress if not exists
    if (!this.storage.contains(this.KEYS.PLAYER_PROGRESS)) {
      const defaultProgress: PlayerProgress = {
        id: '1',
        unlockedLevel: 1,
        completedLevels: [],
        totalStars: 0,
        totalMoves: 0,
        totalTime: 0,
        achievements: [],
        statistics: {
          totalLevelsCompleted: 0,
          totalStarsEarned: 0,
          totalMovesUsed: 0,
          totalTimePlayed: 0,
          averageMovesPerLevel: 0,
          averageTimePerLevel: 0,
          perfectLevels: 0,
          currentStreak: 0,
          longestStreak: 0,
          favoriteCategory: 'basic',
          leastFavoriteCategory: 'expert',
        },
        settings: {
          theme: 'auto',
          sound: {
            enabled: true,
            volume: 0.7,
            effects: true,
            music: true,
          },
          graphics: {
            quality: 'medium',
            animations: true,
            particles: true,
          },
          gameplay: {
            showHints: true,
            autoSave: true,
            confirmMoves: false,
            showTimer: true,
          },
          accessibility: {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            colorBlindSupport: false,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.storage.set(this.KEYS.PLAYER_PROGRESS, JSON.stringify(defaultProgress));
    }
  }

  private createDefaultGrid(rows: number, cols: number): GridComponent[][] {
    const grid: GridComponent[][] = [];
    for (let row = 0; row < rows; row++) {
      grid[row] = [];
      for (let col = 0; col < cols; col++) {
        grid[row][col] = {
          id: `empty-${row}-${col}`,
          type: 'empty',
          rotation: 0,
          connections: [],
        };
      }
    }
    return grid;
  }

  // Level Management
  async getLevels(): Promise<Level[]> {
    try {
      const data = this.storage.getString(this.KEYS.LEVELS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting levels:', error);
      return [];
    }
  }

  async getLevel(id: string): Promise<Level | null> {
    try {
      const levels = await this.getLevels();
      return levels.find(l => l.id === id) || null;
    } catch (error) {
      console.error('Error getting level:', error);
      return null;
    }
  }

  async updateLevel(id: string, updates: Partial<Level>): Promise<Level | null> {
    try {
      const levels = await this.getLevels();
      const index = levels.findIndex(l => l.id === id);
      
      if (index === -1) return null;
      
      levels[index] = {
        ...levels[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.LEVELS, JSON.stringify(levels));
      return levels[index];
    } catch (error) {
      console.error('Error updating level:', error);
      throw error;
    }
  }

  // Player Progress Management
  async getPlayerProgress(): Promise<PlayerProgress | null> {
    try {
      const data = this.storage.getString(this.KEYS.PLAYER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting player progress:', error);
      return null;
    }
  }

  async updatePlayerProgress(updates: Partial<PlayerProgress>): Promise<PlayerProgress | null> {
    try {
      const progress = await this.getPlayerProgress();
      if (!progress) return null;
      
      const updatedProgress: PlayerProgress = {
        ...progress,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.PLAYER_PROGRESS, JSON.stringify(updatedProgress));
      return updatedProgress;
    } catch (error) {
      console.error('Error updating player progress:', error);
      throw error;
    }
  }

  async completeLevel(levelId: string, stars: number, moves: number, time: number): Promise<void> {
    try {
      const progress = await this.getPlayerProgress();
      if (!progress) return;

      // Update level completion
      const levels = await this.getLevels();
      const level = levels.find(l => l.id === levelId);
      if (level) {
        level.isCompleted = true;
        level.starsEarned = Math.max(level.starsEarned || 0, stars);
        level.bestScore = Math.min(level.bestScore || Infinity, moves);
        await this.updateLevel(levelId, level);
      }

      // Update player progress
      const updatedProgress: Partial<PlayerProgress> = {
        completedLevels: [...new Set([...progress.completedLevels, levelId])],
        totalStars: progress.totalStars + stars,
        totalMoves: progress.totalMoves + moves,
        totalTime: progress.totalTime + time,
        statistics: {
          ...progress.statistics,
          totalLevelsCompleted: progress.statistics.totalLevelsCompleted + 1,
          totalStarsEarned: progress.statistics.totalStarsEarned + stars,
          totalMovesUsed: progress.statistics.totalMovesUsed + moves,
          totalTimePlayed: progress.statistics.totalTimePlayed + time,
          averageMovesPerLevel: (progress.statistics.totalMovesUsed + moves) / (progress.statistics.totalLevelsCompleted + 1),
          averageTimePerLevel: (progress.statistics.totalTimePlayed + time) / (progress.statistics.totalLevelsCompleted + 1),
          perfectLevels: stars === 3 ? progress.statistics.perfectLevels + 1 : progress.statistics.perfectLevels,
          currentStreak: progress.statistics.currentStreak + 1,
          longestStreak: Math.max(progress.statistics.longestStreak, progress.statistics.currentStreak + 1),
          lastPlayedDate: new Date().toISOString(),
        },
      };

      await this.updatePlayerProgress(updatedProgress);
    } catch (error) {
      console.error('Error completing level:', error);
      throw error;
    }
  }

  // Achievement Management
  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = this.storage.getString(this.KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | null> {
    try {
      const achievements = await this.getAchievements();
      const index = achievements.findIndex(a => a.id === id);
      
      if (index === -1) return null;
      
      achievements[index] = {
        ...achievements[index],
        ...updates,
      };
      
      this.storage.set(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return achievements[index];
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  }

  // Settings Management
  async getSettings(): Promise<GameSettings> {
    try {
      const data = this.storage.getString(this.KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        theme: 'auto',
        sound: {
          enabled: true,
          volume: 0.7,
          effects: true,
          music: true,
        },
        graphics: {
          quality: 'medium',
          animations: true,
          particles: true,
        },
        gameplay: {
          showHints: true,
          autoSave: true,
          confirmMoves: false,
          showTimer: true,
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          colorBlindSupport: false,
        },
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  async updateSettings(updates: Partial<GameSettings>): Promise<GameSettings> {
    try {
      const settings = await this.getSettings();
      const updatedSettings: GameSettings = {
        ...settings,
        ...updates,
      };
      
      this.storage.set(this.KEYS.SETTINGS, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Game State Management
  async getGameState(): Promise<GameState | null> {
    try {
      const data = this.storage.getString(this.KEYS.GAME_STATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting game state:', error);
      return null;
    }
  }

  async updateGameState(state: Partial<GameState>): Promise<GameState> {
    try {
      const currentState = await this.getGameState();
      const updatedState: GameState = {
        currentLevel: null,
        currentGrid: [],
        moves: 0,
        time: 0,
        isPlaying: false,
        isPaused: false,
        isCompleted: false,
        starsEarned: 0,
        hintsUsed: 0,
        undoStack: [],
        redoStack: [],
        ...currentState,
        ...state,
      };
      
      this.storage.set(this.KEYS.GAME_STATE, JSON.stringify(updatedState));
      return updatedState;
    } catch (error) {
      console.error('Error updating game state:', error);
      throw error;
    }
  }

  // Circuit Simulation
  simulateCircuit(grid: GridComponent[][]): CircuitSimulation {
    const poweredComponents: string[] = [];
    const currentFlow: { from: string; to: string; strength: number }[] = [];
    const voltageMap: { [componentId: string]: number } = {};
    const resistanceMap: { [componentId: string]: number } = {};

    // Find all batteries (power sources)
    const batteries: GridComponent[] = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const component = grid[row][col];
        if (component.type === 'battery') {
          batteries.push(component);
          poweredComponents.push(component.id);
          voltageMap[component.id] = 12; // 12V battery
        }
      }
    }

    // Simulate current flow from each battery
    batteries.forEach(battery => {
      this.simulateFromSource(grid, battery, poweredComponents, currentFlow, voltageMap, resistanceMap);
    });

    // Check if all target connections are powered
    const isValid = this.validateCircuit(grid, poweredComponents);
    const isComplete = this.checkCircuitCompletion(grid, poweredComponents);

    return {
      poweredComponents,
      currentFlow,
      voltageMap,
      resistanceMap,
      isValid,
      isComplete,
    };
  }

  private simulateFromSource(
    grid: GridComponent[][],
    source: GridComponent,
    poweredComponents: string[],
    currentFlow: { from: string; to: string; strength: number }[],
    voltageMap: { [componentId: string]: number },
    resistanceMap: { [componentId: string]: number }
  ) {
    const visited = new Set<string>();
    const queue: { component: GridComponent; voltage: number }[] = [
      { component: source, voltage: voltageMap[source.id] || 12 }
    ];

    while (queue.length > 0) {
      const { component, voltage } = queue.shift()!;
      
      if (visited.has(component.id)) continue;
      visited.add(component.id);
      
      poweredComponents.push(component.id);
      voltageMap[component.id] = voltage;

      // Find connected components
      const connected = this.getConnectedComponents(grid, component);
      
      connected.forEach(connectedComponent => {
        if (!visited.has(connectedComponent.id)) {
          let newVoltage = voltage;
          
          // Apply component-specific effects
          switch (connectedComponent.type) {
            case 'resistor':
              newVoltage *= 0.8; // 20% voltage drop
              resistanceMap[connectedComponent.id] = 100;
              break;
            case 'light':
              newVoltage *= 0.9; // 10% voltage drop
              break;
            case 'switch':
              if (!connectedComponent.isActive) {
                newVoltage = 0; // Switch is off
              }
              break;
          }
          
          if (newVoltage > 0) {
            queue.push({ component: connectedComponent, voltage: newVoltage });
            currentFlow.push({
              from: component.id,
              to: connectedComponent.id,
              strength: newVoltage / 12, // Normalize to 0-1
            });
          }
        }
      });
    }
  }

  private getConnectedComponents(grid: GridComponent[][], component: GridComponent): GridComponent[] {
    const connected: GridComponent[] = [];
    const { row, col } = this.getComponentPosition(grid, component);
    
    if (row === -1 || col === -1) return connected;

    // Check all four directions
    const directions = [
      { row: row - 1, col, connection: 'bottom' }, // top
      { row, col: col + 1, connection: 'left' },   // right
      { row: row + 1, col, connection: 'top' },    // bottom
      { row, col: col - 1, connection: 'right' },  // left
    ];

    directions.forEach(({ row: newRow, col: newCol, connection }) => {
      if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[newRow].length) {
        const neighbor = grid[newRow][newCol];
        if (neighbor.type !== 'empty' && 
            component.connections.includes(connection) &&
            neighbor.connections.includes(this.getOppositeConnection(connection))) {
          connected.push(neighbor);
        }
      }
    });

    return connected;
  }

  private getComponentPosition(grid: GridComponent[][], component: GridComponent): { row: number; col: number } {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].id === component.id) {
          return { row, col };
        }
      }
    }
    return { row: -1, col: -1 };
  }

  private getOppositeConnection(connection: string): string {
    const opposites: { [key: string]: string } = {
      'top': 'bottom',
      'bottom': 'top',
      'left': 'right',
      'right': 'left',
    };
    return opposites[connection] || connection;
  }

  private validateCircuit(grid: GridComponent[][], poweredComponents: string[]): boolean {
    // Check if all non-empty components are properly connected
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const component = grid[row][col];
        if (component.type !== 'empty' && !poweredComponents.includes(component.id)) {
          // Check if component should be powered (e.g., lights, switches)
          if (component.type === 'light' || component.type === 'switch') {
            return false;
          }
        }
      }
    }
    return true;
  }

  private checkCircuitCompletion(grid: GridComponent[][], poweredComponents: string[]): boolean {
    // Check if all target components are powered
    // This would be based on the level's target connections
    return true; // Simplified for now
  }

  // Utility Methods
  async checkAchievements(): Promise<Achievement[]> {
    try {
      const achievements = await this.getAchievements();
      const progress = await this.getPlayerProgress();
      
      if (!progress) return [];
      
      const unlockedAchievements: Achievement[] = [];
      
      for (const achievement of achievements) {
        if (achievement.unlocked) continue;
        
        let progress = 0;
        let shouldUnlock = false;
        
        switch (achievement.requirement.type) {
          case 'levels':
            progress = achievement.statistics.totalLevelsCompleted;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'stars':
            progress = achievement.statistics.totalStarsEarned;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'moves':
            progress = achievement.statistics.totalMovesUsed;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'time':
            progress = achievement.statistics.totalTimePlayed;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
        }
        
        if (shouldUnlock) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          achievement.progress = progress;
          unlockedAchievements.push(achievement);
          
          await this.updateAchievement(achievement.id, {
            unlocked: true,
            unlockedAt: achievement.unlockedAt,
            progress: achievement.progress,
          });
        } else {
          achievement.progress = progress;
          await this.updateAchievement(achievement.id, { progress: achievement.progress });
        }
      }
      
      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  async exportData(): Promise<string> {
    try {
      const data = {
        levels: await this.getLevels(),
        playerProgress: await this.getPlayerProgress(),
        achievements: await this.getAchievements(),
        settings: await this.getSettings(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importData(dataString: string): Promise<boolean> {
    try {
      const data = JSON.parse(dataString);
      
      if (data.levels) this.storage.set(this.KEYS.LEVELS, JSON.stringify(data.levels));
      if (data.playerProgress) this.storage.set(this.KEYS.PLAYER_PROGRESS, JSON.stringify(data.playerProgress));
      if (data.achievements) this.storage.set(this.KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      if (data.settings) this.storage.set(this.KEYS.SETTINGS, JSON.stringify(data.settings));
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      this.storage.delete(this.KEYS.LEVELS);
      this.storage.delete(this.KEYS.PLAYER_PROGRESS);
      this.storage.delete(this.KEYS.ACHIEVEMENTS);
      this.storage.delete(this.KEYS.SETTINGS);
      this.storage.delete(this.KEYS.GAME_STATE);
      this.storage.delete(this.KEYS.LEVEL_PACKS);
      this.storage.delete(this.KEYS.HINTS);
      this.storage.delete(this.KEYS.LEADERBOARD);
      
      // Re-seed default data
      this.seedDefaultData();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export default new CircuitPuzzleService(); 