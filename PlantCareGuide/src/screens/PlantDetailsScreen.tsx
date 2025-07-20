import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  useTheme,
  IconButton,
  Portal,
  Dialog,
  SegmentedButtons,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { Plant, CareTask, GrowthRecord, CareSession } from '../types';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface PlantDetailsScreenProps {
  route: {
    params: {
      plantId: string;
    };
  };
}

const PlantDetailsScreen: React.FC<PlantDetailsScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { state, actions } = useContext(PlantCareGuideContext);
  const [viewMode, setViewMode] = useState<'overview' | 'care' | 'growth'>('overview');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { plantId } = route.params;
  const { plants, careTasks, growthRecords, careSessions } = state;

  const plant = plants.find(p => p.id === plantId);
  const plantTasks = careTasks.filter(task => task.plantId === plantId);
  const plantGrowth = growthRecords.filter(record => record.plantId === plantId);
  const plantSessions = careSessions.filter(session => session.plantId === plantId);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await actions.fetchAllData();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeletePlant = async () => {
    if (!plant) return;
    
    try {
      await actions.deletePlant(plant.id);
      // Navigate back
    } catch (error) {
      Alert.alert('Error', 'Failed to delete plant');
    }
  };

  const getPlantStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.primary;
      case 'dormant': return theme.colors.secondary;
      case 'sick': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const getPlantIcon = (species: string) => {
    const lowerSpecies = species.toLowerCase();
    if (lowerSpecies.includes('cactus')) return 'cactus';
    if (lowerSpecies.includes('succulent')) return 'flower-outline';
    if (lowerSpecies.includes('tree')) return 'tree';
    if (lowerSpecies.includes('herb')) return 'leaf';
    return 'flower';
  };

  if (!plant) {
    return (
      <View style={styles.errorContainer}>
        <Title>Plant not found</Title>
        <Paragraph>The plant you're looking for doesn't exist.</Paragraph>
      </View>
    );
  }

  // Prepare growth chart data
  const growthChartData = {
    labels: plantGrowth
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(record => new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      data: plantGrowth
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(record => record.height || 0),
    }],
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Plant Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.plantHeader}>
            <Avatar.Icon
              size={80}
              icon={getPlantIcon(plant.species)}
              style={{ backgroundColor: getPlantStatusColor(plant.status) }}
            />
            <View style={styles.plantInfo}>
              <Title>{plant.name}</Title>
              <Paragraph>{plant.species}</Paragraph>
              <Paragraph>📍 {plant.location}</Paragraph>
              <Chip
                mode="outlined"
                style={{ backgroundColor: getPlantStatusColor(plant.status) + '20' }}
              >
                {plant.status}
              </Chip>
            </View>
            <IconButton
              icon="dots-vertical"
              onPress={() => setDeleteDialogVisible(true)}
            />
          </View>

          {plant.notes && (
            <Paragraph style={styles.notesText}>
              📝 {plant.notes}
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* View Mode Selector */}
      <Card style={styles.viewModeCard}>
        <Card.Content>
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode}
            buttons={[
              { value: 'overview', label: 'Overview', icon: 'information' },
              { value: 'care', label: 'Care', icon: 'leaf' },
              { value: 'growth', label: 'Growth', icon: 'chart-line' },
            ]}
          />
        </Card.Content>
      </Card>

      {viewMode === 'overview' && (
        <>
          {/* Plant Details */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Title>Plant Details</Title>
              <List.Item
                title="Date Added"
                description={new Date(plant.dateAdded).toLocaleDateString()}
                left={(props) => <List.Icon {...props} icon="calendar" />}
              />
              <List.Item
                title="Last Watered"
                description={plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}
                left={(props) => <List.Icon {...props} icon="water" />}
              />
              <List.Item
                title="Last Fertilized"
                description={plant.lastFertilized ? new Date(plant.lastFertilized).toLocaleDateString() : 'Never'}
                left={(props) => <List.Icon {...props} icon="leaf" />}
              />
              <List.Item
                title="Pot Size"
                description={plant.potSize || 'Not specified'}
                left={(props) => <List.Icon {...props} icon="flower-pot" />}
              />
              <List.Item
                title="Soil Type"
                description={plant.soilType || 'Not specified'}
                left={(props) => <List.Icon {...props} icon="earth" />}
              />
            </Card.Content>
          </Card>

          {/* Quick Stats */}
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title>Quick Stats</Title>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Title style={styles.statNumber}>{plantTasks.length}</Title>
                  <Paragraph>Total Tasks</Paragraph>
                </View>
                <View style={styles.statItem}>
                  <Title style={styles.statNumber}>
                    {plantTasks.filter(task => task.completed).length}
                  </Title>
                  <Paragraph>Completed</Paragraph>
                </View>
                <View style={styles.statItem}>
                  <Title style={styles.statNumber}>{plantGrowth.length}</Title>
                  <Paragraph>Growth Records</Paragraph>
                </View>
                <View style={styles.statItem}>
                  <Title style={styles.statNumber}>{plantSessions.length}</Title>
                  <Paragraph>Care Sessions</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
        </>
      )}

      {viewMode === 'care' && (
        <>
          {/* Upcoming Tasks */}
          <Card style={styles.tasksCard}>
            <Card.Content>
              <Title>Upcoming Care Tasks</Title>
              {plantTasks
                .filter(task => !task.completed)
                .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime())
                .map(task => (
                  <List.Item
                    key={task.id}
                    title={task.title}
                    description={`${task.type} • ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}`}
                    left={(props) => (
                      <Avatar.Icon
                        {...props}
                        icon={task.type === 'watering' ? 'water' : 'leaf'}
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    )}
                    right={(props) => (
                      <IconButton
                        {...props}
                        icon="check"
                        onPress={() => actions.completeCareTask(task.id)}
                      />
                    )}
                  />
                ))}
              {plantTasks.filter(task => !task.completed).length === 0 && (
                <Paragraph style={styles.emptyText}>No upcoming tasks</Paragraph>
              )}
            </Card.Content>
          </Card>

          {/* Recent Care Sessions */}
          <Card style={styles.sessionsCard}>
            <Card.Content>
              <Title>Recent Care Sessions</Title>
              {plantSessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(session => (
                  <List.Item
                    key={session.id}
                    title={session.title}
                    description={`${session.type} • ${new Date(session.date).toLocaleDateString()}`}
                    left={(props) => (
                      <Avatar.Icon
                        {...props}
                        icon={session.type === 'watering' ? 'water' : 'leaf'}
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                    )}
                  />
                ))}
              {plantSessions.length === 0 && (
                <Paragraph style={styles.emptyText}>No care sessions recorded</Paragraph>
              )}
            </Card.Content>
          </Card>
        </>
      )}

      {viewMode === 'growth' && (
        <>
          {/* Growth Chart */}
          {plantGrowth.length > 0 && (
            <Card style={styles.chartCard}>
              <Card.Content>
                <Title>Growth Progress</Title>
                <LineChart
                  data={growthChartData}
                  width={width - 80}
                  height={180}
                  chartConfig={{
                    backgroundColor: theme.colors.surface,
                    backgroundGradientFrom: theme.colors.surface,
                    backgroundGradientTo: theme.colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </Card.Content>
            </Card>
          )}

          {/* Growth Records */}
          <Card style={styles.growthCard}>
            <Card.Content>
              <Title>Growth Records</Title>
              {plantGrowth
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(record => (
                  <List.Item
                    key={record.id}
                    title={`${record.height}cm height`}
                    description={`${new Date(record.date).toLocaleDateString()} • ${record.notes || 'No notes'}`}
                    left={(props) => (
                      <Avatar.Icon
                        {...props}
                        icon="chart-line"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    )}
                  />
                ))}
              {plantGrowth.length === 0 && (
                <Paragraph style={styles.emptyText}>No growth records yet</Paragraph>
              )}
            </Card.Content>
          </Card>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Plant</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete "{plant.name}"? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeletePlant} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  plantInfo: {
    marginLeft: 12,
    flex: 1,
  },
  notesText: {
    marginTop: 12,
    fontStyle: 'italic',
  },
  viewModeCard: {
    marginBottom: 16,
  },
  detailsCard: {
    marginBottom: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tasksCard: {
    marginBottom: 16,
  },
  sessionsCard: {
    marginBottom: 16,
  },
  chartCard: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  growthCard: {
    marginBottom: 16,
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PlantDetailsScreen; 