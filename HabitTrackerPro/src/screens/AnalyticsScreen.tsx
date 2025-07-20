import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Chip,
  useTheme,
  SegmentedButtons,
  List,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';
import { Habit, HabitProgress } from '../types';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const theme = useTheme();
  const { state } = useHabitTrackerPro();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedChart, setSelectedChart] = useState<'completion' | 'mood' | 'category'>('completion');

  const activeHabits = state.habits.filter(habit => habit.isActive);
  const today = new Date().toISOString().split('T')[0];

  const getCompletionData = () => {
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const completions = state.progress.filter(
        p => p.date === dateStr && p.completed
      ).length;
      const total = activeHabits.length;
      
      data.push({
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        completed: completions,
        total: total,
        percentage: total > 0 ? completions / total : 0,
      });
    }
    
    return data;
  };

  const getMoodData = () => {
    const moodScores = {
      'terrible': 1,
      'bad': 2,
      'okay': 3,
      'good': 4,
      'excellent': 5,
    };

    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayProgress = state.progress.filter(p => p.date === dateStr);
      
      if (dayProgress.length > 0) {
        const averageMood = dayProgress.reduce((sum, p) => sum + moodScores[p.mood], 0) / dayProgress.length;
        data.push({
          date: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          mood: averageMood,
        });
      }
    }
    
    return data;
  };

  const getCategoryData = () => {
    const categories = {};
    activeHabits.forEach(habit => {
      if (!categories[habit.category]) {
        categories[habit.category] = {
          count: 0,
          completions: 0,
        };
      }
      categories[habit.category].count++;
    });

    // Calculate completions for each category
    state.progress.forEach(progress => {
      if (progress.completed) {
        const habit = activeHabits.find(h => h.id === progress.habitId);
        if (habit && categories[habit.category]) {
          categories[habit.category].completions++;
        }
      }
    });

    return Object.entries(categories).map(([category, data]: [string, any]) => ({
      name: category,
      count: data.count,
      completions: data.completions,
      completionRate: data.count > 0 ? data.completions / data.count : 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));
  };

  const getTopHabits = () => {
    const habitStats = activeHabits.map(habit => {
      const completions = state.progress.filter(
        p => p.habitId === habit.id && p.completed
      ).length;
      return {
        ...habit,
        completions,
        completionRate: habit.targetCount > 0 ? completions / habit.targetCount : 0,
      };
    });

    return habitStats
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 5);
  };

  const getStreakStats = () => {
    const streaks = state.streaks;
    const longestStreak = streaks.length > 0 
      ? Math.max(...streaks.map(s => s.longestStreak))
      : 0;
    const averageStreak = streaks.length > 0
      ? streaks.reduce((sum, s) => sum + s.currentStreak, 0) / streaks.length
      : 0;

    return { longestStreak, averageStreak };
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
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const completionData = getCompletionData();
  const moodData = getMoodData();
  const categoryData = getCategoryData();
  const topHabits = getTopHabits();
  const streakStats = getStreakStats();

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

        {/* Chart Selector */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <SegmentedButtons
              value={selectedChart}
              onValueChange={(value) => setSelectedChart(value as any)}
              buttons={[
                { value: 'completion', label: 'Completion' },
                { value: 'mood', label: 'Mood' },
                { value: 'category', label: 'Categories' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Selected Chart */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
              {selectedChart === 'completion' && 'Completion Rate'}
              {selectedChart === 'mood' && 'Mood Trend'}
              {selectedChart === 'category' && 'Category Breakdown'}
            </Title>

            {selectedChart === 'completion' && (
              <LineChart
                data={{
                  labels: completionData.map(d => d.date),
                  datasets: [
                    {
                      data: completionData.map(d => d.percentage * 100),
                    },
                  ],
                }}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix="%"
              />
            )}

            {selectedChart === 'mood' && moodData.length > 0 && (
              <LineChart
                data={{
                  labels: moodData.map(d => d.date),
                  datasets: [
                    {
                      data: moodData.map(d => d.mood),
                    },
                  ],
                }}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix=""
              />
            )}

            {selectedChart === 'category' && (
              <PieChart
                data={categoryData}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            )}
          </Card.Content>
        </Card>

        {/* Summary Stats */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Summary Statistics
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
                  {streakStats.longestStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Longest Streak
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="trending-up" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {Math.round(streakStats.averageStreak)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Avg Streak
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Top Performing Habits */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Top Performing Habits
            </Title>

            {topHabits.map((habit, index) => (
              <List.Item
                key={habit.id}
                title={habit.name}
                description={`${habit.completions} completions • ${Math.round(habit.completionRate * 100)}% success rate`}
                left={(props) => (
                  <View style={[styles.rankBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={[styles.rankText, { color: theme.colors.onPrimary }]}>
                      {index + 1}
                    </Text>
                  </View>
                )}
                right={(props) => (
                  <Icon name={habit.icon} size={24} color={habit.color} />
                )}
                style={styles.habitItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Category Performance */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Category Performance
            </Title>

            {categoryData.map(category => (
              <View key={category.name} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
                    {category.name}
                  </Text>
                  <Text style={[styles.categoryStats, { color: theme.colors.onSurfaceVariant }]}>
                    {category.completions}/{category.count} habits
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: theme.colors.outline }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: category.color,
                          width: `${category.completionRate * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                    {Math.round(category.completionRate * 100)}%
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Insights */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Insights
            </Title>

            <View style={styles.insightItem}>
              <Icon name="lightbulb" size={20} color={theme.colors.primary} />
              <Text style={[styles.insightText, { color: theme.colors.onSurface }]}>
                {topHabits.length > 0 && topHabits[0].name} is your most consistent habit
              </Text>
            </View>

            <View style={styles.insightItem}>
              <Icon name="calendar" size={20} color={theme.colors.primary} />
              <Text style={[styles.insightText, { color: theme.colors.onSurface }]}>
                You've maintained habits for {Math.round(streakStats.averageStreak)} days on average
              </Text>
            </View>

            <View style={styles.insightItem}>
              <Icon name="chart-line" size={20} color={theme.colors.primary} />
              <Text style={[styles.insightText, { color: theme.colors.onSurface }]}>
                {categoryData.length > 0 && categoryData[0].name} is your most active category
              </Text>
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  habitItem: {
    paddingVertical: 8,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryStats: {
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    minWidth: 30,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
}); 