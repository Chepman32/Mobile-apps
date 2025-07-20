import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const theme = useTheme();
  const { state } = useHabitTrackerPro();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const activeHabits = state.habits.filter(habit => habit.isActive);
  const today = new Date().toISOString().split('T')[0];

  const getProgressData = () => {
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const completions = state.progress.filter(
        p => p.date === dateStr && p.completed
      ).length;
      
      data.push({
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        completions,
      });
    }
    
    return data;
  };

  const getStreakData = () => {
    return state.streaks.map(streak => {
      const habit = activeHabits.find(h => h.id === streak.habitId);
      return {
        name: habit?.name || 'Unknown',
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      };
    }).sort((a, b) => b.currentStreak - a.currentStreak);
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const progressData = getProgressData();
  const streakData = getStreakData();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Period Selector */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <SegmentedButtons
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as any)}
              buttons={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Progress Chart */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Completion Progress
            </Title>
            <LineChart
              data={{
                labels: progressData.map(d => d.date),
                datasets: [
                  {
                    data: progressData.map(d => d.completions),
                  },
                ],
              }}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Streak Overview */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Current Streaks
            </Title>
            {streakData.length > 0 ? (
              streakData.map((streak, index) => (
                <View key={index} style={styles.streakItem}>
                  <View style={styles.streakInfo}>
                    <Text style={[styles.streakName, { color: theme.colors.onSurface }]}>
                      {streak.name}
                    </Text>
                    <Text style={[styles.streakStats, { color: theme.colors.onSurfaceVariant }]}>
                      {streak.currentStreak} days • Longest: {streak.longestStreak} days
                    </Text>
                  </View>
                  <Icon name="fire" size={24} color={theme.colors.primary} />
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No streaks yet. Start completing your habits to build streaks!
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Statistics
            </Title>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Icon name="target" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {activeHabits.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Active Habits
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="check-circle" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.progress.filter(p => p.completed).length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Completions
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="fire" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.longestStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Longest Streak
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="calendar" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.perfectWeeks}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Perfect Weeks
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  streakItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  streakInfo: {
    flex: 1,
  },
  streakName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakStats: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 32,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
}); 