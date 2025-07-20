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
  Searchbar,
  useTheme,
  Portal,
  Dialog,
  SegmentedButtons,
  List,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';
import { RootStackParamList, Habit } from '../types';

type HabitsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Habits'>;

export default function HabitsScreen() {
  const navigation = useNavigation<HabitsScreenNavigationProp>();
  const theme = useTheme();
  const { state, deleteHabit } = useHabitTrackerPro();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'priority'>('name');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const categories = ['all', ...Array.from(new Set(state.habits.map(h => h.category)))];

  const filteredHabits = state.habits
    .filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          habit.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || habit.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const getHabitProgress = (habit: Habit) => {
    const progress = state.progress.filter(
      p => p.habitId === habit.id && p.completed
    ).length;
    return progress;
  };

  const getHabitStreak = (habit: Habit) => {
    const streak = state.streaks.find(s => s.habitId === habit.id);
    return streak?.currentStreak || 0;
  };

  const handleDeleteHabit = (habit: Habit) => {
    setHabitToDelete(habit);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      setShowDeleteDialog(false);
      setHabitToDelete(null);
      Alert.alert('Success', 'Habit deleted successfully');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Search and Filters */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Searchbar
              placeholder="Search habits..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />

            <Text style={[styles.filterLabel, { color: theme.colors.onSurface }]}>
              Filter by Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryFilters}>
                {categories.map(category => (
                  <Chip
                    key={category}
                    selected={filterCategory === category}
                    onPress={() => setFilterCategory(category)}
                    style={styles.categoryChip}
                  >
                    {category === 'all' ? 'All' : category}
                  </Chip>
                ))}
              </View>
            </ScrollView>

            <Text style={[styles.filterLabel, { color: theme.colors.onSurface }]}>
              Sort by
            </Text>
            <SegmentedButtons
              value={sortBy}
              onValueChange={(value) => setSortBy(value as any)}
              buttons={[
                { value: 'name', label: 'Name' },
                { value: 'date', label: 'Date' },
                { value: 'priority', label: 'Priority' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Habits List */}
        {filteredHabits.length === 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.emptyState}>
                <Icon name="plus-circle" size={64} color={theme.colors.outline} />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  {searchQuery || filterCategory !== 'all' 
                    ? 'No habits match your search criteria'
                    : 'No habits yet. Create your first habit!'
                  }
                </Text>
                {!searchQuery && filterCategory === 'all' && (
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('AddHabit')}
                    style={styles.addButton}
                  >
                    Add First Habit
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ) : (
          filteredHabits.map(habit => {
            const progress = getHabitProgress(habit);
            const streak = getHabitStreak(habit);
            const progressPercentage = habit.targetCount > 0 ? progress / habit.targetCount : 0;

            return (
              <Card
                key={habit.id}
                style={[styles.habitCard, { backgroundColor: theme.colors.surface }]}
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
                    <View style={styles.habitActions}>
                      <Button
                        mode="text"
                        icon="pencil"
                        onPress={() => navigation.navigate('EditHabit', { habitId: habit.id })}
                      >
                        Edit
                      </Button>
                      <Button
                        mode="text"
                        icon="delete"
                        onPress={() => handleDeleteHabit(habit)}
                        textColor={theme.colors.error}
                      >
                        Delete
                      </Button>
                    </View>
                  </View>

                  <View style={styles.habitStats}>
                    <View style={styles.statItem}>
                      <Icon name="target" size={16} color={theme.colors.primary} />
                      <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                        {progress}/{habit.targetCount}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Icon name="fire" size={16} color={theme.colors.primary} />
                      <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                        {streak} day streak
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Icon name="calendar" size={16} color={theme.colors.primary} />
                      <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                        {habit.frequency}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.outline }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            backgroundColor: habit.color,
                            width: `${Math.min(progressPercentage * 100, 100)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                      {Math.round(progressPercentage * 100)}%
                    </Text>
                  </View>

                  <View style={styles.habitTags}>
                    <Chip mode="outlined" compact>
                      {habit.category}
                    </Chip>
                    <Chip mode="outlined" compact>
                      {habit.priority}
                    </Chip>
                    {habit.tags.map(tag => (
                      <Chip key={tag} mode="outlined" compact>
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddHabit')}
      />

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Habit</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete "{habitToDelete?.name}"? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={confirmDelete} buttonColor={theme.colors.error}>
              Delete
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
  searchbar: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryFilters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
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
  addButton: {
    marginTop: 16,
  },
  habitCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  habitActions: {
    flexDirection: 'row',
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    minWidth: 30,
  },
  habitTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 