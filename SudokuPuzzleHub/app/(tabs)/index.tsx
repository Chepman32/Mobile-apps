import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface GameStats {
  totalGames: number;
  completedGames: number;
  bestTime: number;
  currentStreak: number;
  averageTime: number;
}

interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 42,
    completedGames: 35,
    bestTime: 245,
    currentStreak: 7,
    averageTime: 420,
  });

  const difficultyLevels: DifficultyLevel[] = [
    {
      id: 'easy',
      name: 'Easy',
      description: '30-35 clues provided',
      color: '#4CAF50',
      icon: 'happy-outline',
    },
    {
      id: 'medium',
      name: 'Medium',
      description: '25-29 clues provided',
      color: '#FF9800',
      icon: 'football-outline',
    },
    {
      id: 'hard',
      name: 'Hard',
      description: '20-24 clues provided',
      color: '#F44336',
      icon: 'flame-outline',
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Less than 20 clues',
      color: '#9C27B0',
      icon: 'star-outline',
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = (difficulty: string) => {
    router.push(`/game?difficulty=${difficulty}`);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sudoku Puzzle Hub</Text>
        <Text style={styles.subtitle}>Challenge your mind with classic Sudoku</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="trophy-outline" size={24} color="#1976D2" />
            <Text style={[styles.statNumber, { color: '#1976D2' }]}>
              {gameStats.completedGames}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="flash-outline" size={24} color="#7B1FA2" />
            <Text style={[styles.statNumber, { color: '#7B1FA2' }]}>
              {gameStats.currentStreak}
            </Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="time-outline" size={24} color="#388E3C" />
            <Text style={[styles.statNumber, { color: '#388E3C' }]}>
              {formatTime(gameStats.bestTime)}
            </Text>
            <Text style={styles.statLabel}>Best Time</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="speedometer-outline" size={24} color="#F57C00" />
            <Text style={[styles.statNumber, { color: '#F57C00' }]}>
              {formatTime(gameStats.averageTime)}
            </Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>
      </View>

      {/* Difficulty Levels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Difficulty</Text>
        <View style={styles.difficultyGrid}>
          {difficultyLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[styles.difficultyCard, { borderColor: level.color }]}
              onPress={() => startGame(level.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.difficultyIcon, { backgroundColor: level.color + '20' }]}>
                <Ionicons name={level.icon} size={32} color={level.color} />
              </View>
              <Text style={[styles.difficultyName, { color: level.color }]}>
                {level.name}
              </Text>
              <Text style={styles.difficultyDescription}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            onPress={() => router.push('/continue')}
          >
            <Ionicons name="play-outline" size={24} color="white" />
            <Text style={styles.actionButtonText}>Continue Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => startGame('daily')}
          >
            <Ionicons name="calendar-outline" size={24} color="white" />
            <Text style={styles.actionButtonText}>Daily Challenge</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="bulb-outline" size={20} color="#FF9800" />
            <Text style={styles.featureText}>Smart hints and tips</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>Auto-save progress</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics-outline" size={20} color="#2196F3" />
            <Text style={styles.featureText}>Detailed statistics</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="moon-outline" size={20} color="#9C27B0" />
            <Text style={styles.featureText}>Dark mode support</Text>
          </View>
        </View>
      </View>

      {/* Daily Puzzle Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Challenge</Text>
        <View style={styles.dailyPuzzle}>
          <View style={styles.puzzlePreview}>
            <Text style={styles.puzzleText}>Medium Puzzle #1247</Text>
            <Text style={styles.puzzleDate}>December 23, 2024</Text>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => startGame('daily')}
          >
            <Ionicons name="play" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  difficultyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  difficultyCard: {
    width: (width - 64) / 2,
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'white',
  },
  difficultyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  difficultyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  difficultyDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  dailyPuzzle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  puzzlePreview: {
    flex: 1,
  },
  puzzleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  puzzleDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
