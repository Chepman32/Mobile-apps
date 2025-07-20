import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  FAB,
  ActivityIndicator,
  IconButton,
  Surface,
  Chip,
  Searchbar,
  Menu,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNomadFit } from '../context/NomadFitContext';
import { RootStackParamList, Workout, WorkoutType } from '../types';
import { Ionicons } from '@expo/vector-icons';

type WorkoutsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const WorkoutsScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutsScreenNavigationProp>();
  const {
    workouts,
    currentWorkout,
    loading,
    startWorkout,
    endWorkout,
    deleteWorkout,
    refreshData,
    stats,
  } = useNomadFit();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<WorkoutType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'name'>('date');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleStartWorkout = async () => {
    try {
      if (currentWorkout) {
        Alert.alert(
          'Workout in Progress',
          'You have a workout in progress. Would you like to end it and start a new one?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'End Current',
              onPress: async () => {
                await endWorkout();
                await startWorkout();
                navigation.navigate('AddWorkout');
              },
            },
          ]
        );
      } else {
        await startWorkout();
        navigation.navigate('AddWorkout');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start workout');
    }
  };

  const handleDeleteWorkout = (workoutId: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWorkout(workoutId),
        },
      ]
    );
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getWorkoutTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case 'strength_training':
        return 'fitness';
      case 'cardio':
        return 'heart';
      case 'flexibility':
        return 'body';
      case 'hiit':
        return 'flash';
      case 'yoga':
        return 'leaf';
      case 'pilates':
        return 'body';
      case 'running':
        return 'walk';
      case 'cycling':
        return 'bicycle';
      case 'swimming':
        return 'water';
      case 'walking':
        return 'footsteps';
      default:
        return 'fitness';
    }
  };

  const getWorkoutTypeColor = (type: WorkoutType) => {
    switch (type) {
      case 'strength_training':
        return '#4a90e2';
      case 'cardio':
        return '#e74c3c';
      case 'flexibility':
        return '#9b59b6';
      case 'hiit':
        return '#f39c12';
      case 'yoga':
        return '#27ae60';
      case 'pilates':
        return '#e67e22';
      case 'running':
        return '#3498db';
      case 'cycling':
        return '#1abc9c';
      case 'swimming':
        return '#2980b9';
      case 'walking':
        return '#95a5a6';
      default:
        return '#4a90e2';
    }
  };

  // Filter and sort workouts
  const filteredWorkouts = workouts
    .filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || workout.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const renderWorkoutCard = ({ item }: { item: Workout }) => (
    <Card style={styles.workoutCard} mode="outlined">
      <Card.Content>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text variant="titleMedium" style={styles.workoutTitle}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.workoutDate}>
              {formatDate(item.date)}
            </Text>
          </View>
          <IconButton
            icon="delete-outline"
            size={20}
            onPress={() => handleDeleteWorkout(item.id)}
          />
        </View>

        <View style={styles.workoutStats}>
          <Chip icon="timer-outline" compact>
            {formatDuration(item.duration)}
          </Chip>
          <Chip icon="fitness-outline" compact>
            {item.exercises.length} exercises
          </Chip>
          <Chip icon="repeat-outline" compact>
            {item.exercises.reduce((total, ex) => total + (ex.sets?.length || 0), 0)} sets
          </Chip>
        </View>

        {item.notes && (
          <Text variant="bodySmall" style={styles.workoutNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </Card.Content>

      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.id })}
          icon="eye-outline"
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="fitness-outline" size={80} color="#ccc" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No workouts yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        Start your first workout to begin tracking your progress
      </Text>
      <Button
        mode="contained"
        onPress={handleStartWorkout}
        style={styles.emptyButton}
        icon="add"
      >
        Start Workout
      </Button>
    </View>
  );

  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip
          selected={filterType === 'all'}
          onPress={() => setFilterType('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip
          selected={filterType === 'strength_training'}
          onPress={() => setFilterType('strength_training')}
          style={styles.filterChip}
          icon="fitness"
        >
          Strength
        </Chip>
        <Chip
          selected={filterType === 'cardio'}
          onPress={() => setFilterType('cardio')}
          style={styles.filterChip}
          icon="heart"
        >
          Cardio
        </Chip>
        <Chip
          selected={filterType === 'flexibility'}
          onPress={() => setFilterType('flexibility')}
          style={styles.filterChip}
          icon="body"
        >
          Flexibility
        </Chip>
        <Chip
          selected={filterType === 'hiit'}
          onPress={() => setFilterType('hiit')}
          style={styles.filterChip}
          icon="flash"
        >
          HIIT
        </Chip>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text variant="headlineMedium" style={styles.headerTitle}>
              Workouts
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
              {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="sort"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setSortBy('date');
                setMenuVisible(false);
              }}
              title="Sort by Date"
              leadingIcon="calendar"
            />
            <Menu.Item
              onPress={() => {
                setSortBy('duration');
                setMenuVisible(false);
              }}
              title="Sort by Duration"
              leadingIcon="timer"
            />
            <Menu.Item
              onPress={() => {
                setSortBy('name');
                setMenuVisible(false);
              }}
              title="Sort by Name"
              leadingIcon="alphabetical"
            />
          </Menu>
        </View>
        {currentWorkout && (
          <Chip
            icon="play-circle"
            mode="outlined"
            style={styles.currentWorkoutChip}
            onPress={() => navigation.navigate('AddWorkout')}
          >
            Workout in progress
          </Chip>
        )}
      </Surface>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search workouts..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Filter Chips */}
      {renderFilterChips()}

      {/* Workouts List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading workouts...
          </Text>
        </View>
      ) : filteredWorkouts.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkoutCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleStartWorkout}
        label="Start Workout"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  currentWorkoutChip: {
    marginTop: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  workoutCard: {
    marginBottom: 16,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutDate: {
    color: '#666',
  },
  workoutStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  workoutNotes: {
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4a90e2',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4a90e2',
  },
});

export default WorkoutsScreen; 