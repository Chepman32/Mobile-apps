import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
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
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, Workout } from '../types';
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
  } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

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
            {item.exercises.reduce((total, ex) => total + ex.sets.length, 0)} sets
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Workouts
        </Text>
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

      {/* Stats Overview */}
      <Surface style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {stats.totalWorkouts}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Total Workouts
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {stats.currentStreak}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Current Streak
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={styles.statValue}>
            {Math.round(stats.averageWorkoutDuration)}m
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Avg Duration
          </Text>
        </View>
      </Surface>

      {/* Workouts List */}
      {loading && workouts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading workouts...
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleStartWorkout}
        label={currentWorkout ? 'Continue' : 'Start Workout'}
        extended
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
    padding: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  currentWorkoutChip: {
    backgroundColor: '#e3f2fd',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  statLabel: {
    marginTop: 4,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  workoutCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
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
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
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
    textAlign: 'center',
    color: '#666',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 8,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4a90e2',
  },
});

export default WorkoutsScreen;