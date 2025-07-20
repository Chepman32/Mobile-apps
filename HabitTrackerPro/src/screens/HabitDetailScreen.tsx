import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Chip,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';
import { RootStackParamList, Habit, HabitProgress } from '../types';

type HabitDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HabitDetail'>;
type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;

const { width } = Dimensions.get('window');

export default function HabitDetailScreen() {
  const navigation = useNavigation<HabitDetailScreenNavigationProp>();
  const route = useRoute<HabitDetailScreenRouteProp>();
  const theme = useTheme();
  const { state, completeHabit, uncompleteHabit } = useHabitTrackerPro();

  const habit = state.habits.find(h => h.id === route.params.habitId);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              Habit not found
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const habitProgress = state.progress.filter(p => p.habitId === habit.id);
  const completedCount = habitProgress.filter(p => p.completed).length;
  const streak = state.streaks.find(s => s.habitId === habit.id);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habitProgress.some(p => p.date === today && p.completed);

  const getWeeklyProgress = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const completed = habitProgress.some(p => p.date === dateStr && p.completed);
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completed ? 1 : 0,
      });
    }
    return weekData;
  };

  const handleCompleteToday = () => {
    if (isCompletedToday) {
      uncompleteHabit(habit.id, today);
      Alert.alert('Success', 'Habit marked as incomplete for today');
    } else {
      completeHabit(habit.id, today);
      Alert.alert('Success', 'Habit completed for today!');
    }
  };

  const addNote = () => {
    if (noteText.trim()) {
      // Add note logic would be implemented here
      setShowAddNoteDialog(false);
      setNoteText('');
      Alert.alert('Success', 'Note added successfully');
    }
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

  const weeklyData = getWeeklyProgress();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Habit Header */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.habitHeader}>
              <Icon name={habit.icon} size={48} color={habit.color} />
              <View style={styles.habitInfo}>
                <Title style={[styles.habitName, { color: theme.colors.onSurface }]}>
                  {habit.name}
                </Title>
                <Text style={[styles.habitDescription, { color: theme.colors.onSurfaceVariant }]}>
                  {habit.description}
                </Text>
              </View>
            </View>

            <View style={styles.habitStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {completedCount}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Completions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {streak?.currentStreak || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Current Streak
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {streak?.longestStreak || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Longest Streak
                </Text>
              </View>
            </View>

            <Button
              mode={isCompletedToday ? 'outlined' : 'contained'}
              onPress={handleCompleteToday}
              icon={isCompletedToday ? 'check-circle' : 'plus'}
              style={styles.completeButton}
            >
              {isCompletedToday ? 'Completed Today' : 'Complete Today'}
            </Button>
          </Card.Content>
        </Card>

        {/* Weekly Progress */}
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
                    data: weeklyData.map(d => d.completed),
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

        {/* Habit Details */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Habit Details
            </Title>

            <View style={styles.detailItem}>
              <Icon name="target" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                Target: {habit.targetCount} per {habit.frequency}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="flag" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                Priority: {habit.priority}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="tag" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                Category: {habit.category}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="calendar" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                Started: {new Date(habit.startDate).toLocaleDateString()}
              </Text>
            </View>

            {habit.notes && (
              <View style={styles.detailItem}>
                <Icon name="note-text" size={20} color={theme.colors.primary} />
                <Text style={[styles.detailText, { color: theme.colors.onSurface }]}>
                  Notes: {habit.notes}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Tags */}
        {habit.tags.length > 0 && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Tags
              </Title>
              <View style={styles.tagsContainer}>
                {habit.tags.map(tag => (
                  <Chip key={tag} style={styles.tagChip}>
                    {tag}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Actions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Actions
            </Title>

            <Button
              mode="outlined"
              icon="pencil"
              onPress={() => navigation.navigate('EditHabit', { habitId: habit.id })}
              style={styles.actionButton}
            >
              Edit Habit
            </Button>

            <Button
              mode="outlined"
              icon="note-plus"
              onPress={() => setShowAddNoteDialog(true)}
              style={styles.actionButton}
            >
              Add Note
            </Button>

            <Button
              mode="outlined"
              icon="chart-line"
              onPress={() => navigation.navigate('Analytics')}
              style={styles.actionButton}
            >
              View Analytics
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Note Dialog */}
      <Portal>
        <Dialog visible={showAddNoteDialog} onDismiss={() => setShowAddNoteDialog(false)}>
          <Dialog.Title>Add Note</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Note"
              value={noteText}
              onChangeText={setNoteText}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Add a note about this habit..."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddNoteDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={addNote}>Add</Button>
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
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitInfo: {
    marginLeft: 16,
    flex: 1,
  },
  habitName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  habitDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  completeButton: {
    marginTop: 8,
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
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    marginBottom: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 32,
  },
}); 