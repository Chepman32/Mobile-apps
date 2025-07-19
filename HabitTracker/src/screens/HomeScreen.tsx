import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Button,
  FAB,
  Chip,
  Avatar,
  ProgressBar,
  useTheme,
  Badge,
} from 'react-native-paper';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useHabit } from '../context/HabitContext';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#6366f1',
  },
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const {
    habits,
    entries,
    achievements,
    dailyGoal,
    todaysQuote,
    insights,
    selectedDate,
    getOverallStats,
    getTodaysEntries,
    getUnreadInsights,
    markHabitComplete,
    markInsightAsRead,
  } = useHabit();

  const overallStats = useMemo(() => getOverallStats(), [getOverallStats]);
  const todaysEntries = useMemo(() => getTodaysEntries(), [getTodaysEntries]);
  const unreadInsights = useMemo(() => getUnreadInsights(), [getUnreadInsights]);

  // Today's habit completion data
  const todaysHabits = useMemo(() => {
    const activeHabits = habits.filter(habit => habit.isActive && habit.frequency === 'daily');
    const completedHabitIds = new Set(todaysEntries.filter(entry => entry.completed).map(entry => entry.habitId));
    
    return activeHabits.map(habit => ({
      ...habit,
      isCompletedToday: completedHabitIds.has(habit.id),
    }));
  }, [habits, todaysEntries]);

  // Weekly progress data for chart
  const weeklyProgressData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const progressData = last7Days.map(date => {
      const dayEntries = entries.filter(entry => entry.date === date && entry.completed);
      const activeHabitsCount = habits.filter(habit => habit.isActive && habit.frequency === 'daily').length;
      return activeHabitsCount > 0 ? (dayEntries.length / activeHabitsCount) * 100 : 0;
    });

    return {
      labels: last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en', { weekday: 'short' });
      }),
      datasets: [{
        data: progressData,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  }, [habits, entries]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const categoryStats = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'];
    
    return Object.entries(categoryStats).map(([category, count], index) => ({
      name: category,
      population: count,
      color: colors[index % colors.length],
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12,
    }));
  }, [habits, theme.colors.onSurface]);

  // Streak data for top habits
  const topStreakHabits = useMemo(() => {
    return [...habits]
      .filter(habit => habit.isActive)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [habits]);

  const handleHabitToggle = async (habitId: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        // Mark as incomplete (this is a toggle action)
        // For now, we'll just show a toast or implement undo functionality
      } else {
        await markHabitComplete(habitId, selectedDate);
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return theme.colors.primary;
    }
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 100) return 'fire';
    if (streak >= 30) return 'star';
    if (streak >= 7) return 'trending-up';
    return 'circle-outline';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Motivational Quote */}
      {todaysQuote && (
        <Card style={[styles.card, styles.quoteCard]} mode="elevated">
          <Card.Content>
            <Icon name="format-quote-open" size={24} color={theme.colors.primary} />
            <Text style={[styles.quoteText, { color: theme.colors.onSurface }]}>
              "{todaysQuote.text}"
            </Text>
            <Text style={[styles.quoteAuthor, { color: theme.colors.onSurfaceVariant }]}>
              — {todaysQuote.author}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Daily Goal Progress */}
      {dailyGoal && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <Title style={{ color: theme.colors.onSurface }}>Today's Goal</Title>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                  {dailyGoal.completedHabits} of {dailyGoal.targetHabits} habits completed
                </Paragraph>
              </View>
              {dailyGoal.isAchieved && (
                <Icon name="check-circle" size={40} color="#10b981" />
              )}
            </View>
            <ProgressBar
              progress={dailyGoal.targetHabits > 0 ? dailyGoal.completedHabits / dailyGoal.targetHabits : 0}
              color={dailyGoal.isAchieved ? '#10b981' : theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
              {Math.round((dailyGoal.targetHabits > 0 ? dailyGoal.completedHabits / dailyGoal.targetHabits : 0) * 100)}% Complete
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Overall Stats */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>Your Progress</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="target" size={32} color={theme.colors.primary} />
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                {overallStats.totalHabits}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Total Habits
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="fire" size={32} color="#ef4444" />
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                {overallStats.longestStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Best Streak
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="check-circle" size={32} color="#10b981" />
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                {overallStats.totalCompletions}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Completions
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="trophy" size={32} color="#f59e0b" />
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                {overallStats.unlockedAchievements}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Achievements
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Weekly Progress Chart */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Weekly Progress
          </Title>
          <LineChart
            data={weeklyProgressData}
            width={width - 64}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Habits by Category
            </Title>
            <PieChart
              data={categoryData}
              width={width - 64}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </Card.Content>
        </Card>
      )}

      {/* Today's Habits */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={{ color: theme.colors.onSurface }}>Today's Habits</Title>
            <Button
              mode="text"
              onPress={() => navigation.navigate('AddHabit', {})}
              compact
            >
              Add Habit
            </Button>
          </View>
          {todaysHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="clipboard-outline" size={48} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                No daily habits yet
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AddHabit', {})}
                style={styles.emptyButton}
              >
                Create Your First Habit
              </Button>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {todaysHabits.slice(0, 5).map(habit => (
                <TouchableOpacity
                  key={habit.id}
                  style={[styles.habitItem, { borderColor: theme.colors.outline }]}
                  onPress={() => handleHabitToggle(habit.id, habit.isCompletedToday)}
                >
                  <View style={styles.habitLeft}>
                    <Icon
                      name={habit.isCompletedToday ? 'check-circle' : 'circle-outline'}
                      size={24}
                      color={habit.isCompletedToday ? '#10b981' : theme.colors.onSurfaceVariant}
                    />
                    <View style={styles.habitInfo}>
                      <Text style={[styles.habitName, { color: theme.colors.onSurface }]}>
                        {habit.name}
                      </Text>
                      <View style={styles.habitMeta}>
                        <Chip
                          mode="outlined"
                          compact
                          style={[styles.difficultyChip, { borderColor: getDifficultyColor(habit.difficulty) }]}
                          textStyle={{ color: getDifficultyColor(habit.difficulty), fontSize: 10 }}
                        >
                          {habit.difficulty}
                        </Chip>
                        {habit.streak > 0 && (
                          <View style={styles.streakInfo}>
                            <Icon name={getStreakIcon(habit.streak)} size={14} color="#ef4444" />
                            <Text style={[styles.streakText, { color: theme.colors.onSurfaceVariant }]}>
                              {habit.streak}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
              ))}
              {todaysHabits.length > 5 && (
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Main')}
                  style={styles.viewMoreButton}
                >
                  View All Habits
                </Button>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Top Streaks */}
      {topStreakHabits.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Top Streaks 🔥
            </Title>
            {topStreakHabits.map((habit, index) => (
              <View key={habit.id} style={[styles.streakItem, { borderColor: theme.colors.outline }]}>
                <View style={styles.streakRank}>
                  <Text style={[styles.rankNumber, { color: theme.colors.primary }]}>
                    #{index + 1}
                  </Text>
                </View>
                <View style={styles.streakHabitInfo}>
                  <Text style={[styles.streakHabitName, { color: theme.colors.onSurface }]}>
                    {habit.name}
                  </Text>
                  <Text style={[styles.streakCategory, { color: theme.colors.onSurfaceVariant }]}>
                    {habit.category}
                  </Text>
                </View>
                <View style={styles.streakValue}>
                  <Icon name="fire" size={20} color="#ef4444" />
                  <Text style={[styles.streakDays, { color: theme.colors.onSurface }]}>
                    {habit.streak} days
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Insights */}
      {unreadInsights.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={{ color: theme.colors.onSurface }}>Insights</Title>
              <Badge visible={unreadInsights.length > 0} size={20}>
                {unreadInsights.length}
              </Badge>
            </View>
            {unreadInsights.slice(0, 3).map(insight => (
              <TouchableOpacity
                key={insight.id}
                style={[styles.insightItem, { borderColor: theme.colors.outline }]}
                onPress={() => markInsightAsRead(insight.id)}
              >
                <Icon
                  name={
                    insight.type === 'celebration' ? 'party-popper' :
                    insight.type === 'warning' ? 'alert' :
                    insight.type === 'tip' ? 'lightbulb' : 'information'
                  }
                  size={24}
                  color={
                    insight.type === 'celebration' ? '#10b981' :
                    insight.type === 'warning' ? '#ef4444' :
                    insight.type === 'tip' ? '#f59e0b' : theme.colors.primary
                  }
                />
                <View style={styles.insightContent}>
                  <Text style={[styles.insightTitle, { color: theme.colors.onSurface }]}>
                    {insight.title}
                  </Text>
                  <Text style={[styles.insightMessage, { color: theme.colors.onSurfaceVariant }]}>
                    {insight.message}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Recent Achievements */}
      {achievements.filter(a => a.unlockedAt).length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={{ color: theme.colors.onSurface }}>Recent Achievements</Title>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Achievements')}
                compact
              >
                View All
              </Button>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {achievements
                .filter(a => a.unlockedAt)
                .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
                .slice(0, 5)
                .map(achievement => (
                  <View key={achievement.id} style={styles.achievementCard}>
                    <Avatar.Icon
                      size={48}
                      icon={achievement.icon}
                      style={{ backgroundColor: '#f59e0b' }}
                    />
                    <Text style={[styles.achievementTitle, { color: theme.colors.onSurface }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDesc, { color: theme.colors.onSurfaceVariant }]}>
                      {achievement.description}
                    </Text>
                  </View>
                ))}
            </ScrollView>
          </Card.Content>
        </Card>
      )}

      <View style={styles.spacer} />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddHabit', {})}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  quoteCard: {
    backgroundColor: '#f8fafc',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 8,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginVertical: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  habitsList: {
    gap: 8,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitInfo: {
    marginLeft: 12,
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyChip: {
    height: 24,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  streakText: {
    fontSize: 12,
  },
  viewMoreButton: {
    marginTop: 8,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  streakRank: {
    width: 32,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakHabitInfo: {
    flex: 1,
    marginLeft: 12,
  },
  streakHabitName: {
    fontSize: 14,
    fontWeight: '500',
  },
  streakCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  streakValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakDays: {
    fontSize: 14,
    fontWeight: '500',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  achievementCard: {
    alignItems: 'center',
    width: 120,
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  spacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 