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
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
  ActivityIndicator,
  Text,
  useTheme,
  ProgressBar,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { usePlantCareGuide } from '../context/PlantCareGuideContext';
import { RootStackParamList } from '../types/navigation';
import { UserPlant, CareSchedule, CareLog, GrowthTracking } from '../types';

type PlantDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlantDetail'>;
type PlantDetailScreenRouteProp = RouteProp<RootStackParamList, 'PlantDetail'>;

const { width } = Dimensions.get('window');

export default function PlantDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<PlantDetailScreenNavigationProp>();
  const route = useRoute<PlantDetailScreenRouteProp>();
  const { userPlant } = route.params;
  
  const { state, loadCareSchedules, loadCareLogs, loadGrowthTracking, updateUserPlant } = usePlantCareGuide();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadCareSchedules(),
        loadCareLogs(),
        loadGrowthTracking(),
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

  const getCareSchedulesForPlant = (): CareSchedule[] => {
    return state.careSchedules.filter(schedule => schedule.userPlantId === userPlant.id);
  };

  const getCareLogsForPlant = (): CareLog[] => {
    return state.careLogs
      .filter(log => log.userPlantId === userPlant.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getGrowthTrackingForPlant = (): GrowthTracking[] => {
    return state.growthTracking
      .filter(tracking => tracking.userPlantId === userPlant.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getPlantsNeedingCare = (): boolean => {
    const plantSchedules = getCareSchedulesForPlant().filter(s => s.isActive);
    const now = new Date();
    return plantSchedules.some(schedule => {
      const nextDue = new Date(schedule.nextDue);
      return nextDue <= now;
    });
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

  const getPlantAge = (plantingDate: Date): string => {
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 30) {
      return `${ageInDays} days`;
    } else if (ageInDays < 365) {
      const months = Math.floor(ageInDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(ageInDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  const getGrowthProgress = () => {
    const heightProgress = (userPlant.currentHeight / userPlant.plant.maxHeight) * 100;
    const spreadProgress = (userPlant.currentSpread / userPlant.plant.maxSpread) * 100;
    return { heightProgress, spreadProgress };
  };

  const chartData = {
    labels: getGrowthTrackingForPlant().slice(-6).map(tracking => 
      new Date(tracking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        data: getGrowthTrackingForPlant().slice(-6).map(tracking => tracking.height),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const handleMarkCareComplete = async (scheduleType: string) => {
    try {
      const updatedUserPlant = { ...userPlant };
      const now = new Date();

      switch (scheduleType) {
        case 'watering':
          updatedUserPlant.lastWatered = now;
          break;
        case 'fertilizing':
          updatedUserPlant.lastFertilized = now;
          break;
        case 'repotting':
          updatedUserPlant.lastRepotted = now;
          break;
        case 'pruning':
          updatedUserPlant.lastPruned = now;
          break;
      }

      await updateUserPlant(updatedUserPlant);
      Alert.alert('Success', `${scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1)} marked as complete!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update care status');
    }
  };

  const { heightProgress, spreadProgress } = getGrowthProgress();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Plant Header */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.plantHeader}>
            <Avatar.Icon
              size={80}
              icon={getHealthStatusIcon(userPlant.healthStatus)}
              style={{ backgroundColor: getHealthStatusColor(userPlant.healthStatus) }}
            />
            <View style={styles.plantInfo}>
              <Title style={{ color: theme.colors.onSurface }}>
                {userPlant.nickname || userPlant.plant.name}
              </Title>
              <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                {userPlant.plant.species}
              </Paragraph>
              <View style={styles.plantMeta}>
                <Chip
                  mode="outlined"
                  textStyle={{ fontSize: 10 }}
                  style={{ marginRight: 8 }}
                >
                  {userPlant.plant.category.name}
                </Chip>
                <Chip
                  mode="outlined"
                  textStyle={{ fontSize: 10 }}
                  style={{ marginRight: 8 }}
                >
                  {getPlantAge(userPlant.plantingDate)}
                </Chip>
                {getPlantsNeedingCare() && (
                  <Chip
                    mode="contained"
                    textStyle={{ fontSize: 10, color: 'white' }}
                    style={{ backgroundColor: theme.colors.error }}
                  >
                    Needs Care
                  </Chip>
                )}
              </View>
            </View>
          </View>

          <View style={styles.plantStats}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Current Height
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {userPlant.currentHeight}"
              </Text>
              <ProgressBar
                progress={heightProgress / 100}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
              <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                {heightProgress.toFixed(1)}% of max ({userPlant.plant.maxHeight}")
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Current Spread
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {userPlant.currentSpread}"
              </Text>
              <ProgressBar
                progress={spreadProgress / 100}
                color={theme.colors.secondary}
                style={styles.progressBar}
              />
              <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                {spreadProgress.toFixed(1)}% of max ({userPlant.plant.maxSpread}")
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Plant Details */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Plant Details</Title>
          <List.Item
            title="Location"
            description={userPlant.location}
            left={() => <List.Icon icon="map-marker" />}
          />
          <List.Item
            title="Pot Size"
            description={`${userPlant.potSize}" diameter`}
            left={() => <List.Icon icon="flower-pot" />}
          />
          <List.Item
            title="Soil Type"
            description={userPlant.soilType.name}
            left={() => <List.Icon icon="soil" />}
          />
          <List.Item
            title="Planting Date"
            description={new Date(userPlant.plantingDate).toLocaleDateString()}
            left={() => <List.Icon icon="calendar" />}
          />
          {userPlant.notes && (
            <List.Item
              title="Notes"
              description={userPlant.notes}
              left={() => <List.Icon icon="note-text" />}
            />
          )}
        </Card.Content>
      </Card>

      {/* Care Requirements */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Care Requirements</Title>
          <List.Item
            title="Light Requirements"
            description={userPlant.plant.lightRequirements.name}
            left={() => <List.Icon icon="white-balance-sunny" />}
          />
          <List.Item
            title="Water Needs"
            description={`${userPlant.plant.waterNeeds.frequency} days`}
            left={() => <List.Icon icon="water" />}
          />
          <List.Item
            title="Temperature Range"
            description={`${userPlant.plant.temperatureRange.min}°F - ${userPlant.plant.temperatureRange.max}°F`}
            left={() => <List.Icon icon="thermometer" />}
          />
          <List.Item
            title="Humidity Range"
            description={`${userPlant.plant.humidityRange.min}% - ${userPlant.plant.humidityRange.max}%`}
            left={() => <List.Icon icon="water-percent" />}
          />
          <List.Item
            title="Fertilizer"
            description={userPlant.plant.fertilizerType.name}
            left={() => <List.Icon icon="leaf" />}
          />
        </Card.Content>
      </Card>

      {/* Care Schedule */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Care Schedule</Title>
          {getCareSchedulesForPlant().map((schedule) => {
            const isOverdue = new Date(schedule.nextDue) <= new Date();
            return (
              <List.Item
                key={schedule.id}
                title={`${schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}`}
                description={`Next due: ${new Date(schedule.nextDue).toLocaleDateString()}`}
                left={() => (
                  <List.Icon 
                    icon={schedule.type === 'watering' ? 'water' : 'leaf'} 
                    color={isOverdue ? theme.colors.error : theme.colors.primary}
                  />
                )}
                right={() => (
                  <View style={styles.scheduleActions}>
                    {isOverdue && (
                      <Chip
                        mode="contained"
                        textStyle={{ fontSize: 10, color: 'white' }}
                        style={{ backgroundColor: theme.colors.error, marginRight: 8 }}
                      >
                        Overdue
                      </Chip>
                    )}
                    <Button
                      mode="contained"
                      onPress={() => handleMarkCareComplete(schedule.type)}
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      Complete
                    </Button>
                  </View>
                )}
              />
            );
          })}
          {getCareSchedulesForPlant().length === 0 && (
            <Paragraph style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              No care schedules set up for this plant.
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Growth Chart */}
      {getGrowthTrackingForPlant().length > 0 && (
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

      {/* Recent Care Logs */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Recent Care Logs</Title>
          {getCareLogsForPlant().slice(0, 3).map((log) => (
            <List.Item
              key={log.id}
              title={`${log.type.charAt(0).toUpperCase() + log.type.slice(1)}`}
              description={log.notes || 'No notes'}
              left={() => (
                <List.Icon 
                  icon={log.type === 'watering' ? 'water' : 'leaf'} 
                />
              )}
              right={() => (
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  {new Date(log.date).toLocaleDateString()}
                </Text>
              )}
            />
          ))}
          {getCareLogsForPlant().length === 0 && (
            <Paragraph style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              No care logs yet. Start tracking your plant care!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate('AddCareLog', { userPlant })}
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
        >
          Add Care Log
        </Button>
        <Button
          mode="outlined"
          icon="trending-up"
          onPress={() => navigation.navigate('AddGrowthTracking', { userPlant })}
          style={styles.actionButton}
        >
          Track Growth
        </Button>
        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => navigation.navigate('EditPlant', { userPlant })}
          style={styles.actionButton}
        >
          Edit Plant
        </Button>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  plantHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  plantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  plantMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  plantStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 10,
  },
  scheduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 