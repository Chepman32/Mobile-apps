import React, { useEffect } from 'react';
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
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
  FAB,
  ActivityIndicator,
  Text,
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { usePlantCareGuide } from '../context/PlantCareGuideContext';
import { RootStackParamList } from '../types/navigation';
import { UserPlant, CareSchedule, Reminder } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { state, loadUserPlants, loadCareSchedules, loadReminders, loadStatistics } = usePlantCareGuide();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadUserPlants(),
        loadCareSchedules(),
        loadReminders(),
        loadStatistics(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getPlantsNeedingCare = (): UserPlant[] => {
    return state.userPlants.filter(userPlant => {
      const plantSchedules = state.careSchedules.filter(s => s.userPlantId === userPlant.id && s.isActive);
      const now = new Date();
      return plantSchedules.some(schedule => {
        const nextDue = new Date(schedule.nextDue);
        return nextDue <= now;
      });
    });
  };

  const getUpcomingReminders = (): Reminder[] => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return state.reminders
      .filter(reminder => !reminder.isCompleted && new Date(reminder.scheduledDate) <= tomorrow)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return theme.colors.primary;
      case 'good': return theme.colors.secondary;
      case 'fair': return '#FF9800';
      case 'poor': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return 'happy';
      case 'good': return 'happy-outline';
      case 'fair': return 'sad-outline';
      case 'poor': return 'sad';
      default: return 'help-outline';
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: state.statistics.monthlyGrowth.map(item => item.averageGrowth) || [0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (state.loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your plant care data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>
            Welcome to Plant Care Guide! 🌱
          </Title>
          <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
            You have {state.userPlants.length} plants in your care. 
            {getPlantsNeedingCare().length > 0 && ` ${getPlantsNeedingCare().length} need attention today.`}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Statistics Overview */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Overview</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {state.userPlants.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Total Plants
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
                {state.statistics.healthyPlants}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Healthy
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: getPlantsNeedingCare().length > 0 ? theme.colors.error : theme.colors.primary }]}>
                {getPlantsNeedingCare().length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Need Care
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.tertiary }]}>
                {state.statistics.careStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Day Streak
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Growth Chart */}
      {state.statistics.monthlyGrowth.length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface }}>Growth Progress</Title>
            <LineChart
              data={chartData}
              width={width - 80}
              height={180}
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: theme.colors.primary,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </Card.Content>
        </Card>
      )}

      {/* Plants Needing Care */}
      {getPlantsNeedingCare().length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface }}>Plants Needing Care</Title>
            {getPlantsNeedingCare().slice(0, 3).map((userPlant) => (
              <List.Item
                key={userPlant.id}
                title={userPlant.nickname || userPlant.plant.name}
                description={userPlant.plant.species}
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon={getHealthStatusIcon(userPlant.healthStatus)}
                    style={{ backgroundColor: getHealthStatusColor(userPlant.healthStatus) }}
                  />
                )}
                right={() => (
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('PlantDetail', { userPlant })}
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    Care
                  </Button>
                )}
                onPress={() => navigation.navigate('PlantDetail', { userPlant })}
              />
            ))}
            {getPlantsNeedingCare().length > 3 && (
              <Button
                mode="text"
                onPress={() => navigation.navigate('Plants')}
                style={{ marginTop: 8 }}
              >
                View All ({getPlantsNeedingCare().length})
              </Button>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Upcoming Reminders */}
      {getUpcomingReminders().length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface }}>Upcoming Reminders</Title>
            {getUpcomingReminders().map((reminder) => (
              <List.Item
                key={reminder.id}
                title={reminder.title}
                description={reminder.message}
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon="alarm"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                )}
                right={() => (
                  <Chip
                    mode="outlined"
                    textStyle={{ fontSize: 12 }}
                  >
                    {new Date(reminder.scheduledDate).toLocaleDateString()}
                  </Chip>
                )}
                onPress={() => navigation.navigate('Reminders')}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Quick Actions</Title>
          <View style={styles.quickActions}>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => navigation.navigate('AddPlant')}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            >
              Add Plant
            </Button>
            <Button
              mode="outlined"
              icon="water"
              onPress={() => navigation.navigate('Care')}
              style={styles.actionButton}
            >
              Care Schedule
            </Button>
            <Button
              mode="outlined"
              icon="trending-up"
              onPress={() => navigation.navigate('Growth')}
              style={styles.actionButton}
            >
              Track Growth
            </Button>
            <Button
              mode="outlined"
              icon="book"
              onPress={() => navigation.navigate('Tips')}
              style={styles.actionButton}
            >
              Care Tips
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Recent Activity</Title>
          {state.careLogs.slice(0, 3).map((log) => (
            <List.Item
              key={log.id}
              title={`${log.type} - ${log.userPlant.nickname || log.userPlant.plant.name}`}
              description={new Date(log.date).toLocaleDateString()}
              left={() => (
                <Avatar.Icon
                  size={40}
                  icon={log.type === 'watering' ? 'water' : 'leaf'}
                  style={{ backgroundColor: theme.colors.tertiary }}
                />
              )}
            />
          ))}
          {state.careLogs.length === 0 && (
            <Paragraph style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              No recent activity. Start caring for your plants!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
}); 