import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  FAB,
  Chip,
  ProgressBar,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';
import { RootStackParamList, Habit, HabitProgress } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { state, completeHabit, uncompleteHabit, calculateStats } = useHabitTrackerPro();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('personal');

  const today = new Date().toISOString().split('T')[0];
  const activeHabits = state.habits.filter(habit => habit.isActive);
  const completedToday = state.progress.filter(
    p => p.date === today && p.completed
  ).length;

  useEffect(() => {
    calculateStats();
  }, [state.progress]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCompleteHabit = (habitId: string) => {
    completeHabit(habitId, today);
    Alert.alert('Success', 'Habit completed for today!');
  };

  const handleUncompleteHabit = (habitId: string) => {
    uncompleteHabit(habitId, today);
    Alert.alert('Success', 'Habit marked as incomplete');
  };

  const isHabitCompletedToday = (habitId: string) => {
    return state.progress.some(
      p => p.habitId === habitId && p.date === today && p.completed
    );
  };

  const getHabitProgress = (habit: Habit) => {
    const progress = state.progress.filter(
      p => p.habitId === habit.id && p.completed
    );
    return progress.length;
  };

  const getWeeklyProgress = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    const weekData = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const completions = state.progress.filter(
        p => p.date === dateStr && p.completed
      ).length;
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completions,
      });
    }
    
    return weekData;
  };

  const getCategoryBreakdown = () => {
    const categories = {};
    activeHabits.forEach(habit => {
      if (!categories[habit.category]) {
        categories[habit.category] = 0;
      }
      categories[habit.category]++;
    });
    
    return Object.entries(categories).map(([category, count]) => ({
      name: category,
      count: count as number,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));
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

  const weeklyData = getWeeklyProgress();
  const categoryData = getCategoryBreakdown();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Stats */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Icon name="target" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {activeHabits.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Active Habits
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="check-circle" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {completedToday}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Completed Today
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="fire" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.currentStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Day Streak
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Habits */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Today's Habits
            </Title>
            {activeHabits.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="plus-circle" size={64} color={theme.colors.outline} />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No habits yet. Tap the + button to add your first habit!
                </Text>
              </View>
            ) : (
              activeHabits.map(habit => {
                const isCompleted = isHabitCompletedToday(habit.id);
                const progress = getHabitProgress(habit);
                const progressPercentage = habit.targetCount > 0 ? progress / habit.targetCount : 0;
                
                return (
                  <Card
                    key={habit.id}
                    style={[
                      styles.habitCard,
                      {
                        backgroundColor: isCompleted ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                        borderColor: theme.colors.outline,
                      },
                    ]}
                    mode="outlined"
                  >
                    <Card.Content>
                      <View style={styles.habitHeader}>
                        <View style={styles.habitInfo}>
                          <Icon name={habit.icon} size={24} color={habit.color} />
                          <View style={styles.habitText}>
                            <Text style={[styles.habitName, { color: theme.colors.onSurface }]}>
                              {habit.name}
                            </Text>
                            <Text style={[styles.habitDescription, { color: theme.colors.onSurfaceVariant }]}>
                              {habit.description}
                            </Text>
                          </View>
                        </View>
                        <Chip
                          mode={isCompleted ? 'flat' : 'outlined'}
                          selected={isCompleted}
                          onPress={() => {
                            if (isCompleted) {
                              handleUncompleteHabit(habit.id);
                            } else {
                              handleCompleteHabit(habit.id);
                            }
                          }}
                          style={styles.completionChip}
                        >
                          {isCompleted ? 'Completed' : 'Complete'}
                        </Chip>
                      </View>
                      
                      <View style={styles.habitProgress}>
                        <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                          Progress: {progress}/{habit.targetCount}
                        </Text>
                        <ProgressBar
                          progress={progressPercentage}
                          color={theme.colors.primary}
                          style={styles.progressBar}
                        />
                      </View>
                      
                      <View style={styles.habitTags}>
                        <Chip mode="outlined" compact>
                          {habit.category}
                        </Chip>
                        <Chip mode="outlined" compact>
                          {habit.frequency}
                        </Chip>
                        <Chip mode="outlined" compact>
                          {habit.priority}
                        </Chip>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })
            )}
          </Card.Content>
        </Card>

        {/* Weekly Progress Chart */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Weekly Progress
            </Title>
            <LineChart
              data={{
                labels: weeklyData.map(d => d.date),
                datasets: [
                  {
                    data: weeklyData.map(d => d.completions),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Category Breakdown */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Habit Categories
            </Title>
            <PieChart
              data={categoryData}
              width={Dimensions.get('window').width - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quick Actions
            </Title>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => navigation.navigate('AddHabit')}
                style={styles.actionButton}
              >
                Add Habit
              </Button>
              <Button
                mode="outlined"
                icon="chart-line"
                onPress={() => navigation.navigate('Analytics')}
                style={styles.actionButton}
              >
                Analytics
              </Button>
              <Button
                mode="outlined"
                icon="trophy"
                onPress={() => navigation.navigate('Achievements')}
                style={styles.actionButton}
              >
                Achievements
              </Button>
              <Button
                mode="outlined"
                icon="cog"
                onPress={() => navigation.navigate('Settings')}
                style={styles.actionButton}
              >
                Settings
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddHabit')}
      />

      {/* Add Habit Dialog */}
      <Portal>
        <Dialog visible={showAddHabitDialog} onDismiss={() => setShowAddHabitDialog(false)}>
          <Dialog.Title>Quick Add Habit</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Habit Name"
              value={newHabitName}
              onChangeText={setNewHabitName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <SegmentedButtons
              value={newHabitCategory}
              onValueChange={setNewHabitCategory}
              buttons={[
                { value: 'personal', label: 'Personal' },
                { value: 'health', label: 'Health' },
                { value: 'work', label: 'Work' },
              ]}
              style={styles.segmentedButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddHabitDialog(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={() => {
                if (newHabitName.trim()) {
                  // Add habit logic here
                  setShowAddHabitDialog(false);
                  setNewHabitName('');
                }
              }}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  habitCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitText: {
    marginLeft: 12,
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  completionChip: {
    marginLeft: 8,
  },
  habitProgress: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  habitTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
}); 