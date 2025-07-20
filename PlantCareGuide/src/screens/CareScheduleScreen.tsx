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
  SegmentedButtons,
  FAB,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { usePlantCareGuide } from '../context/PlantCareGuideContext';
import { RootStackParamList } from '../types/navigation';
import { CareSchedule, UserPlant } from '../types';

type CareScheduleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function CareScheduleScreen() {
  const theme = useTheme();
  const navigation = useNavigation<CareScheduleScreenNavigationProp>();
  const { state, loadCareSchedules, loadUserPlants, updateCareSchedule, deleteCareSchedule } = usePlantCareGuide();

  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'overdue' | 'today' | 'upcoming'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadCareSchedules(),
        loadUserPlants(),
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

  const getCareSchedulesWithPlants = (): (CareSchedule & { userPlant: UserPlant })[] => {
    return state.careSchedules
      .map(schedule => ({
        ...schedule,
        userPlant: state.userPlants.find(plant => plant.id === schedule.userPlantId)!,
      }))
      .filter(item => item.userPlant); // Filter out schedules without plants
  };

  const getFilteredSchedules = () => {
    const schedules = getCareSchedulesWithPlants();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filterType) {
      case 'overdue':
        return schedules.filter(schedule => {
          const nextDue = new Date(schedule.nextDue);
          return nextDue <= now && schedule.isActive;
        });
      case 'today':
        return schedules.filter(schedule => {
          const nextDue = new Date(schedule.nextDue);
          const dueDate = new Date(nextDue.getFullYear(), nextDue.getMonth(), nextDue.getDate());
          return dueDate.getTime() === today.getTime() && schedule.isActive;
        });
      case 'upcoming':
        return schedules.filter(schedule => {
          const nextDue = new Date(schedule.nextDue);
          return nextDue > tomorrow && schedule.isActive;
        });
      default:
        return schedules.filter(schedule => schedule.isActive);
    }
  };

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'watering': return 'water';
      case 'fertilizing': return 'leaf';
      case 'repotting': return 'flower-pot';
      case 'pruning': return 'scissors-cutting';
      case 'pest-control': return 'bug';
      default: return 'leaf';
    }
  };

  const getScheduleColor = (type: string) => {
    switch (type) {
      case 'watering': return theme.colors.primary;
      case 'fertilizing': return theme.colors.secondary;
      case 'repotting': return '#FF9800';
      case 'pruning': return '#9C27B0';
      case 'pest-control': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const isOverdue = (schedule: CareSchedule): boolean => {
    return new Date(schedule.nextDue) <= new Date();
  };

  const getDaysUntilDue = (schedule: CareSchedule): number => {
    const now = new Date();
    const dueDate = new Date(schedule.nextDue);
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleMarkComplete = async (schedule: CareSchedule) => {
    try {
      const updatedSchedule = {
        ...schedule,
        lastPerformed: new Date(),
        nextDue: new Date(Date.now() + schedule.frequency * 24 * 60 * 60 * 1000),
      };
      await updateCareSchedule(updatedSchedule);
      Alert.alert('Success', 'Care task marked as complete!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark task as complete');
    }
  };

  const handleToggleSchedule = async (schedule: CareSchedule) => {
    try {
      const updatedSchedule = {
        ...schedule,
        isActive: !schedule.isActive,
      };
      await updateCareSchedule(updatedSchedule);
    } catch (error) {
      Alert.alert('Error', 'Failed to update schedule');
    }
  };

  const handleDeleteSchedule = (schedule: CareSchedule) => {
    Alert.alert(
      'Delete Schedule',
      'Are you sure you want to delete this care schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCareSchedule(schedule.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete schedule');
            }
          },
        },
      ]
    );
  };

  const getScheduleStats = () => {
    const schedules = getCareSchedulesWithPlants();
    const now = new Date();
    
    const overdue = schedules.filter(s => isOverdue(s.schedule) && s.schedule.isActive).length;
    const today = schedules.filter(s => {
      const nextDue = new Date(s.schedule.nextDue);
      const dueDate = new Date(nextDue.getFullYear(), nextDue.getMonth(), nextDue.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return dueDate.getTime() === today.getTime() && s.schedule.isActive;
    }).length;
    
    const total = schedules.filter(s => s.schedule.isActive).length;
    
    return { overdue, today, total };
  };

  const stats = getScheduleStats();
  const filteredSchedules = getFilteredSchedules();

  if (state.loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading care schedules...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Stats Overview */}
      <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.onSurface }}>Care Schedule Overview</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.total}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Total Active
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: stats.overdue > 0 ? theme.colors.error : theme.colors.primary }]}>
                {stats.overdue}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Overdue
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
                {stats.today}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Due Today
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filterType}
          onValueChange={(value) => setFilterType(value as 'all' | 'overdue' | 'today' | 'upcoming')}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'overdue', label: 'Overdue' },
            { value: 'today', label: 'Today' },
            { value: 'upcoming', label: 'Upcoming' },
          ]}
          style={styles.filterButtons}
        />
      </View>

      {/* Schedules List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredSchedules.length === 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.emptyContent}>
              <Ionicons 
                name="calendar-outline" 
                size={64} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Title style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                No schedules found
              </Title>
              <Paragraph style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                {filterType === 'overdue' 
                  ? 'No overdue tasks! Great job keeping up with plant care.'
                  : filterType === 'today'
                  ? 'No tasks due today.'
                  : filterType === 'upcoming'
                  ? 'No upcoming tasks scheduled.'
                  : 'No active care schedules. Add some to get started!'
                }
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredSchedules.map(({ schedule, userPlant }) => (
            <Card key={schedule.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleInfo}>
                    <Avatar.Icon
                      size={50}
                      icon={getScheduleIcon(schedule.type)}
                      style={{ backgroundColor: getScheduleColor(schedule.type) }}
                    />
                    <View style={styles.scheduleDetails}>
                      <Title style={{ color: theme.colors.onSurface }}>
                        {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
                      </Title>
                      <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                        {userPlant.nickname || userPlant.plant.name}
                      </Paragraph>
                      <View style={styles.scheduleMeta}>
                        <Chip
                          mode="outlined"
                          textStyle={{ fontSize: 10 }}
                          style={{ marginRight: 8 }}
                        >
                          Every {schedule.frequency} days
                        </Chip>
                        {isOverdue(schedule) && (
                          <Chip
                            mode="contained"
                            textStyle={{ fontSize: 10, color: 'white' }}
                            style={{ backgroundColor: theme.colors.error }}
                          >
                            Overdue
                          </Chip>
                        )}
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.scheduleActions}>
                    <Text style={[styles.dueText, { color: theme.colors.onSurfaceVariant }]}>
                      {isOverdue(schedule) 
                        ? 'Overdue'
                        : getDaysUntilDue(schedule) === 0
                        ? 'Due today'
                        : getDaysUntilDue(schedule) === 1
                        ? 'Due tomorrow'
                        : `Due in ${getDaysUntilDue(schedule)} days`
                      }
                    </Text>
                    <Text style={[styles.dueDate, { color: theme.colors.onSurfaceVariant }]}>
                      {new Date(schedule.nextDue).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {schedule.notes && (
                  <Paragraph style={[styles.notes, { color: theme.colors.onSurfaceVariant }]}>
                    📝 {schedule.notes}
                  </Paragraph>
                )}

                <View style={styles.actionButtons}>
                  <Button
                    mode="contained"
                    onPress={() => handleMarkComplete(schedule)}
                    style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.primary }}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleToggleSchedule(schedule)}
                    style={{ flex: 1, marginHorizontal: 4 }}
                  >
                    {schedule.isActive ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleDeleteSchedule(schedule)}
                    style={{ flex: 1, marginLeft: 8 }}
                    textColor={theme.colors.error}
                  >
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // Navigate to add schedule screen
          Alert.alert('Coming Soon', 'Add schedule functionality will be implemented soon!');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  statsCard: {
    margin: 16,
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButtons: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  scheduleInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  scheduleDetails: {
    flex: 1,
    marginLeft: 12,
  },
  scheduleMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  scheduleActions: {
    alignItems: 'flex-end',
  },
  dueText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 10,
    marginTop: 2,
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
  },
}); 