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
  Searchbar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { usePlantCareGuide } from '../context/PlantCareGuideContext';
import { RootStackParamList } from '../types/navigation';
import { GrowthTracking, UserPlant } from '../types';

type GrowthTrackingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const { width } = Dimensions.get('window');

export default function GrowthTrackingScreen() {
  const theme = useTheme();
  const navigation = useNavigation<GrowthTrackingScreenNavigationProp>();
  const { state, loadGrowthTracking, loadUserPlants, deleteGrowthTracking } = usePlantCareGuide();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlant, setFilterPlant] = useState<string>('all');
  const [chartType, setChartType] = useState<'height' | 'spread' | 'health'>('height');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadGrowthTracking(),
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

  const getGrowthTrackingWithPlants = (): (GrowthTracking & { userPlant: UserPlant })[] => {
    return state.growthTracking
      .map(tracking => ({
        ...tracking,
        userPlant: state.userPlants.find(plant => plant.id === tracking.userPlantId)!,
      }))
      .filter(item => item.userPlant); // Filter out tracking without plants
  };

  const getFilteredTracking = () => {
    let tracking = getGrowthTrackingWithPlants();

    // Filter by search query
    if (searchQuery) {
      tracking = tracking.filter(item => 
        item.userPlant.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userPlant.plant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by plant
    if (filterPlant !== 'all') {
      tracking = tracking.filter(item => item.userPlantId === filterPlant);
    }

    return tracking.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getPlantStats = (userPlantId: string) => {
    const plantTracking = state.growthTracking
      .filter(tracking => tracking.userPlantId === userPlantId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (plantTracking.length === 0) return null;

    const first = plantTracking[0];
    const latest = plantTracking[plantTracking.length - 1];

    return {
      heightGrowth: latest.height - first.height,
      spreadGrowth: latest.spread - first.spread,
      averageHealth: plantTracking.reduce((sum, t) => sum + t.healthScore, 0) / plantTracking.length,
      trackingCount: plantTracking.length,
      firstDate: first.date,
      latestDate: latest.date,
    };
  };

  const getChartData = (userPlantId: string) => {
    const plantTracking = state.growthTracking
      .filter(tracking => tracking.userPlantId === userPlantId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 entries

    if (plantTracking.length === 0) return null;

    const labels = plantTracking.map(tracking => 
      new Date(tracking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    let data: number[];
    let color: string;

    switch (chartType) {
      case 'height':
        data = plantTracking.map(tracking => tracking.height);
        color = theme.colors.primary;
        break;
      case 'spread':
        data = plantTracking.map(tracking => tracking.spread);
        color = theme.colors.secondary;
        break;
      case 'health':
        data = plantTracking.map(tracking => tracking.healthScore);
        color = '#FF9800';
        break;
      default:
        data = plantTracking.map(tracking => tracking.height);
        color = theme.colors.primary;
    }

    return {
      labels,
      datasets: [{
        data,
        color: (opacity = 1) => color.replace(')', `, ${opacity})`).replace('rgb', 'rgba'),
        strokeWidth: 2,
      }],
    };
  };

  const getHealthColor = (score: number) => {
    if (score >= 8) return theme.colors.primary;
    if (score >= 6) return theme.colors.secondary;
    if (score >= 4) return '#FF9800';
    return theme.colors.error;
  };

  const handleDeleteTracking = (tracking: GrowthTracking) => {
    Alert.alert(
      'Delete Growth Record',
      'Are you sure you want to delete this growth tracking record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGrowthTracking(tracking.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete growth record');
            }
          },
        },
      ]
    );
  };

  const getUniquePlants = () => {
    const plantIds = [...new Set(state.growthTracking.map(t => t.userPlantId))];
    return state.userPlants.filter(plant => plantIds.includes(plant.id));
  };

  const filteredTracking = getFilteredTracking();
  const uniquePlants = getUniquePlants();

  if (state.loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading growth tracking...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search and Filters */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search plants..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <SegmentedButtons
          value={filterPlant}
          onValueChange={setFilterPlant}
          buttons={[
            { value: 'all', label: 'All Plants' },
            ...uniquePlants.slice(0, 3).map(plant => ({
              value: plant.id,
              label: plant.nickname || plant.plant.name,
            })),
          ]}
          style={styles.filterButtons}
        />

        <SegmentedButtons
          value={chartType}
          onValueChange={(value) => setChartType(value as 'height' | 'spread' | 'health')}
          buttons={[
            { value: 'height', label: 'Height' },
            { value: 'spread', label: 'Spread' },
            { value: 'health', label: 'Health' },
          ]}
          style={styles.chartButtons}
        />
      </View>

      {/* Growth Tracking List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTracking.length === 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.emptyContent}>
              <Ionicons 
                name="trending-up-outline" 
                size={64} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Title style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                No growth tracking found
              </Title>
              <Paragraph style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery || filterPlant !== 'all'
                  ? 'No tracking records match your filters.'
                  : 'Start tracking your plant growth to see progress over time!'
                }
              </Paragraph>
              {!searchQuery && filterPlant === 'all' && (
                <Button
                  mode="contained"
                  onPress={() => {
                    // Navigate to add growth tracking
                    Alert.alert('Coming Soon', 'Add growth tracking functionality will be implemented soon!');
                  }}
                  style={{ marginTop: 16, backgroundColor: theme.colors.primary }}
                >
                  Add Growth Tracking
                </Button>
              )}
            </Card.Content>
          </Card>
        ) : (
          uniquePlants.map(plant => {
            const plantTracking = filteredTracking.filter(t => t.userPlantId === plant.id);
            const stats = getPlantStats(plant.id);
            const chartData = getChartData(plant.id);

            if (plantTracking.length === 0) return null;

            return (
              <Card key={plant.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                  <View style={styles.plantHeader}>
                    <Avatar.Icon
                      size={50}
                      icon="leaf"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <View style={styles.plantInfo}>
                      <Title style={{ color: theme.colors.onSurface }}>
                        {plant.nickname || plant.plant.name}
                      </Title>
                      <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                        {plant.plant.species}
                      </Paragraph>
                      {stats && (
                        <View style={styles.statsRow}>
                          <Chip
                            mode="outlined"
                            textStyle={{ fontSize: 10 }}
                            style={{ marginRight: 8 }}
                          >
                            +{stats.heightGrowth.toFixed(1)}" height
                          </Chip>
                          <Chip
                            mode="outlined"
                            textStyle={{ fontSize: 10 }}
                            style={{ marginRight: 8 }}
                          >
                            +{stats.spreadGrowth.toFixed(1)}" spread
                          </Chip>
                          <Chip
                            mode="outlined"
                            textStyle={{ fontSize: 10 }}
                          >
                            {stats.trackingCount} records
                          </Chip>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Growth Chart */}
                  {chartData && (
                    <View style={styles.chartContainer}>
                      <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
                        {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Progress
                      </Text>
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
                    </View>
                  )}

                  {/* Recent Tracking Records */}
                  <View style={styles.recordsContainer}>
                    <Text style={[styles.recordsTitle, { color: theme.colors.onSurface }]}>
                      Recent Records
                    </Text>
                    {plantTracking.slice(0, 3).map((tracking) => (
                      <List.Item
                        key={tracking.id}
                        title={`${tracking.height}" height, ${tracking.spread}" spread`}
                        description={tracking.notes || 'No notes'}
                        left={() => (
                          <Avatar.Icon
                            size={40}
                            icon="ruler"
                            style={{ backgroundColor: getHealthColor(tracking.healthScore) }}
                          />
                        )}
                        right={() => (
                          <View style={styles.recordActions}>
                            <Chip
                              mode="outlined"
                              textStyle={{ fontSize: 10 }}
                              style={{ marginRight: 8 }}
                            >
                              Health: {tracking.healthScore}/10
                            </Chip>
                            <Text style={{ color: theme.colors.onSurfaceVariant }}>
                              {new Date(tracking.date).toLocaleDateString()}
                            </Text>
                          </View>
                        )}
                        onPress={() => handleDeleteTracking(tracking)}
                      />
                    ))}
                  </View>

                  <View style={styles.actionButtons}>
                    <Button
                      mode="contained"
                      icon="plus"
                      onPress={() => {
                        // Navigate to add growth tracking for this plant
                        Alert.alert('Coming Soon', 'Add growth tracking functionality will be implemented soon!');
                      }}
                      style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.primary }}
                    >
                      Add Record
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        // Navigate to view all records for this plant
                        Alert.alert('Coming Soon', 'View all records functionality will be implemented soon!');
                      }}
                      style={{ flex: 1, marginLeft: 8 }}
                    >
                      View All
                    </Button>
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
        onPress={() => {
          // Navigate to add growth tracking
          Alert.alert('Coming Soon', 'Add growth tracking functionality will be implemented soon!');
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
  header: {
    padding: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  filterButtons: {
    marginBottom: 16,
  },
  chartButtons: {
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
  plantHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  plantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recordsContainer: {
    marginBottom: 16,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recordActions: {
    alignItems: 'flex-end',
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