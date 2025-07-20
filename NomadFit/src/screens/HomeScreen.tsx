import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  FAB,
  ActivityIndicator,
  Surface,
  Chip,
  ProgressBar,
  Avatar,
  List,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNomadFit } from '../context/NomadFitContext';
import { RootStackParamList, WorkoutType } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    user,
    stats,
    currentWorkout,
    workouts,
    achievements,
    loading,
    error,
    startWorkout,
    endWorkout,
    refreshData,
    refreshStats,
  } = useNomadFit();

  useEffect(() => {
    refreshStats();
  }, []);

  const handleRefresh = async () => {
    await refreshData();
    await refreshStats();
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

  const handleQuickStart = async (workoutType: WorkoutType) => {
    try {
      await startWorkout();
      navigation.navigate('AddWorkout');
    } catch (error) {
      Alert.alert('Error', 'Failed to start workout');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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

  const renderStatsCard = () => (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.statsTitle}>
          Your Progress
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statValue}>
              {stats.totalWorkouts}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total Workouts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statValue}>
              {stats.currentStreak}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Day Streak
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statValue}>
              {formatDuration(stats.totalDuration)}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total Time
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineMedium" style={styles.statValue}>
              {stats.totalCaloriesBurned}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Calories Burned
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderQuickActions = () => (
    <Card style={styles.quickActionsCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quick Start
        </Text>
        <View style={styles.quickActionsGrid}>
          <Button
            mode="contained"
            onPress={() => handleQuickStart('strength_training')}
            style={[styles.quickActionButton, { backgroundColor: '#4a90e2' }]}
            icon="fitness"
          >
            Strength
          </Button>
          <Button
            mode="contained"
            onPress={() => handleQuickStart('cardio')}
            style={[styles.quickActionButton, { backgroundColor: '#e74c3c' }]}
            icon="heart"
          >
            Cardio
          </Button>
          <Button
            mode="contained"
            onPress={() => handleQuickStart('flexibility')}
            style={[styles.quickActionButton, { backgroundColor: '#9b59b6' }]}
            icon="body"
          >
            Stretch
          </Button>
          <Button
            mode="contained"
            onPress={() => handleQuickStart('hiit')}
            style={[styles.quickActionButton, { backgroundColor: '#f39c12' }]}
            icon="flash"
          >
            HIIT
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderCurrentWorkout = () => {
    if (!currentWorkout) return null;

    return (
      <Card style={styles.currentWorkoutCard}>
        <Card.Content>
          <View style={styles.currentWorkoutHeader}>
            <Ionicons name="play-circle" size={24} color="#4a90e2" />
            <Text variant="titleMedium" style={styles.currentWorkoutTitle}>
              Workout in Progress
            </Text>
          </View>
          <Text variant="bodyMedium" style={styles.currentWorkoutName}>
            {currentWorkout.name}
          </Text>
          <Text variant="bodySmall" style={styles.currentWorkoutTime}>
            Started at {new Date(currentWorkout.startTime || Date.now()).toLocaleTimeString()}
          </Text>
          <View style={styles.currentWorkoutActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('AddWorkout')}
              style={styles.currentWorkoutButton}
            >
              Continue
            </Button>
            <Button
              mode="contained"
              onPress={endWorkout}
              style={[styles.currentWorkoutButton, { backgroundColor: '#e74c3c' }]}
            >
              End Workout
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderRecentWorkouts = () => {
    const recentWorkouts = workouts.slice(0, 3);

    if (recentWorkouts.length === 0) {
      return (
        <Card style={styles.recentWorkoutsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Workouts
            </Text>
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={48} color="#ccc" />
              <Text variant="bodyMedium" style={styles.emptyText}>
                No workouts yet. Start your fitness journey!
              </Text>
            </View>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.recentWorkoutsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Workouts
          </Text>
          {recentWorkouts.map((workout, index) => (
            <React.Fragment key={workout.id}>
              <List.Item
                title={workout.name}
                description={`${workout.exercises.length} exercises • ${formatDuration(workout.duration || 0)}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={getWorkoutTypeIcon(workout.type)}
                    color={getWorkoutTypeColor(workout.type)}
                  />
                )}
                right={(props) => (
                  <Chip
                    mode="outlined"
                    compact
                    style={styles.workoutTypeChip}
                  >
                    {workout.type.replace('_', ' ')}
                  </Chip>
                )}
                onPress={() => navigation.navigate('WorkoutDetails', { workoutId: workout.id })}
              />
              {index < recentWorkouts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderAchievements = () => {
    const unlockedAchievements = achievements.filter(a => a.isUnlocked).slice(0, 3);

    if (unlockedAchievements.length === 0) {
      return (
        <Card style={styles.achievementsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Achievements
            </Text>
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={48} color="#ccc" />
              <Text variant="bodyMedium" style={styles.emptyText}>
                Complete workouts to unlock achievements!
              </Text>
            </View>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.achievementsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Achievements
          </Text>
          {unlockedAchievements.map((achievement, index) => (
            <React.Fragment key={achievement.id}>
              <List.Item
                title={achievement.name}
                description={achievement.description}
                left={(props) => (
                  <Avatar.Text
                    {...props}
                    label={achievement.icon}
                    size={40}
                    style={styles.achievementAvatar}
                  />
                )}
                right={(props) => (
                  <Text variant="bodySmall" style={styles.achievementDate}>
                    {new Date(achievement.unlockedAt || '').toLocaleDateString()}
                  </Text>
                )}
              />
              {index < unlockedAchievements.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          <Button
            mode="text"
            onPress={() => navigation.navigate('Achievements')}
            style={styles.viewAllButton}
          >
            View All Achievements
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderGoalProgress = () => {
    if (!user || user.goals.length === 0) return null;

    const activeGoals = user.goals.filter(goal => !goal.isCompleted);

    if (activeGoals.length === 0) return null;

    return (
      <Card style={styles.goalsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Goal Progress
          </Text>
          {activeGoals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <View key={goal.id} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text variant="bodyMedium" style={styles.goalName}>
                    {goal.type.replace('_', ' ')}
                  </Text>
                  <Text variant="bodySmall" style={styles.goalProgress}>
                    {goal.current}/{goal.target} {goal.unit}
                  </Text>
                </View>
                <ProgressBar
                  progress={progress / 100}
                  color={progress >= 100 ? '#27ae60' : '#4a90e2'}
                  style={styles.goalProgressBar}
                />
                {goal.deadline && (
                  <Text variant="bodySmall" style={styles.goalDeadline}>
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </Text>
                )}
                {index < activeGoals.length - 1 && <Divider style={styles.goalDivider} />}
              </View>
            );
          })}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading your fitness data...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text variant="headlineMedium" style={styles.welcomeText}>
                Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
              </Text>
              <Text variant="bodyMedium" style={styles.subtitleText}>
                Ready for your next workout?
              </Text>
            </View>
            <Avatar.Text
              label={user?.name?.charAt(0) || 'U'}
              size={50}
              style={styles.userAvatar}
            />
    </View>
        </Surface>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Current Workout */}
        {renderCurrentWorkout()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Goal Progress */}
        {renderGoalProgress()}

        {/* Recent Workouts */}
        {renderRecentWorkouts()}

        {/* Achievements */}
        {renderAchievements()}
      </ScrollView>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
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
  welcomeText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  userAvatar: {
    backgroundColor: '#ffffff',
  },
  statsCard: {
    margin: 16,
    elevation: 2,
  },
  statsTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
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
  },
  statValue: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  statLabel: {
    textAlign: 'center',
    marginTop: 4,
    color: '#666',
  },
  currentWorkoutCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  currentWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentWorkoutTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  currentWorkoutName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentWorkoutTime: {
    color: '#666',
    marginBottom: 12,
  },
  currentWorkoutActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentWorkoutButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    marginBottom: 8,
  },
  goalsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  goalProgress: {
    color: '#666',
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalDeadline: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
  },
  goalDivider: {
    marginTop: 16,
  },
  recentWorkoutsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  workoutTypeChip: {
    marginLeft: 8,
  },
  achievementsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  achievementAvatar: {
    backgroundColor: '#4a90e2',
  },
  achievementDate: {
    color: '#666',
    fontSize: 12,
  },
  viewAllButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4a90e2',
  },
});

export default HomeScreen;
