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
  Searchbar,
  FAB,
  ActivityIndicator,
  Text,
  useTheme,
  SegmentedButtons,
  Menu,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { usePlantCareGuide } from '../context/PlantCareGuideContext';
import { RootStackParamList } from '../types/navigation';
import { UserPlant, PlantCategory } from '../types';

type PlantsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function PlantsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<PlantsScreenNavigationProp>();
  const { state, loadUserPlants, loadCareSchedules, deleteUserPlant } = usePlantCareGuide();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'health' | 'date'>('name');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadUserPlants(),
        loadCareSchedules(),
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

  const getPlantsNeedingCare = (userPlant: UserPlant): boolean => {
    const plantSchedules = state.careSchedules.filter(s => s.userPlantId === userPlant.id && s.isActive);
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

  const getCategoryIcon = (categoryName: string) => {
    const category = state.plantCategories.find(cat => cat.name === categoryName);
    return category?.icon || 'leaf';
  };

  const filteredAndSortedPlants = state.userPlants
    .filter(userPlant => {
      // Search filter
      const matchesSearch = 
        userPlant.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userPlant.plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userPlant.plant.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userPlant.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = filterCategory === 'all' || 
        userPlant.plant.category.name === filterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.nickname || a.plant.name).localeCompare(b.nickname || b.plant.name);
        case 'health':
          const healthOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
          return healthOrder[b.healthStatus] - healthOrder[a.healthStatus];
        case 'date':
          return new Date(b.plantingDate).getTime() - new Date(a.plantingDate).getTime();
        default:
          return 0;
      }
    });

  const handleDeletePlant = (userPlant: UserPlant) => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete ${userPlant.nickname || userPlant.plant.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserPlant(userPlant.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plant');
            }
          },
        },
      ]
    );
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

  if (state.loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your plants...</Text>
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
          value={filterCategory}
          onValueChange={setFilterCategory}
          buttons={[
            { value: 'all', label: 'All' },
            ...state.plantCategories.slice(0, 3).map(category => ({
              value: category.name,
              label: category.name,
            })),
          ]}
          style={styles.filterButtons}
        />

        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: theme.colors.onSurfaceVariant }]}>
            Sort by:
          </Text>
          <SegmentedButtons
            value={sortBy}
            onValueChange={(value) => setSortBy(value as 'name' | 'health' | 'date')}
            buttons={[
              { value: 'name', label: 'Name' },
              { value: 'health', label: 'Health' },
              { value: 'date', label: 'Date' },
            ]}
            style={styles.sortButtons}
          />
        </View>
      </View>

      {/* Plant Count */}
      <Card style={[styles.countCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.countText, { color: theme.colors.onSurface }]}>
            {filteredAndSortedPlants.length} plant{filteredAndSortedPlants.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </Text>
        </Card.Content>
      </Card>

      {/* Plants List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAndSortedPlants.length === 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.emptyContent}>
              <Ionicons 
                name="leaf-outline" 
                size={64} 
                color={theme.colors.onSurfaceVariant} 
              />
              <Title style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                No plants found
              </Title>
              <Paragraph style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery 
                  ? `No plants match "${searchQuery}"`
                  : 'Add your first plant to get started!'
                }
              </Paragraph>
              {!searchQuery && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddPlant')}
                  style={{ marginTop: 16, backgroundColor: theme.colors.primary }}
                >
                  Add Your First Plant
                </Button>
              )}
            </Card.Content>
          </Card>
        ) : (
          filteredAndSortedPlants.map((userPlant) => (
            <Card key={userPlant.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.plantHeader}>
                  <View style={styles.plantInfo}>
                    <Avatar.Icon
                      size={50}
                      icon={getHealthStatusIcon(userPlant.healthStatus)}
                      style={{ backgroundColor: getHealthStatusColor(userPlant.healthStatus) }}
                    />
                    <View style={styles.plantDetails}>
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
                        {getPlantsNeedingCare(userPlant) && (
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
                  
                  <Menu
                    visible={menuVisible === userPlant.id}
                    onDismiss={() => setMenuVisible(null)}
                    anchor={
                      <Button
                        mode="text"
                        onPress={() => setMenuVisible(userPlant.id)}
                        icon="dots-vertical"
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        setMenuVisible(null);
                        navigation.navigate('PlantDetail', { userPlant });
                      }}
                      title="View Details"
                      leadingIcon="eye"
                    />
                    <Menu.Item
                      onPress={() => {
                        setMenuVisible(null);
                        navigation.navigate('EditPlant', { userPlant });
                      }}
                      title="Edit Plant"
                      leadingIcon="pencil"
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() => {
                        setMenuVisible(null);
                        handleDeletePlant(userPlant);
                      }}
                      title="Delete Plant"
                      leadingIcon="delete"
                      titleStyle={{ color: theme.colors.error }}
                    />
                  </Menu>
                </View>

                <View style={styles.plantStats}>
                  <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Height
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                      {userPlant.currentHeight}" / {userPlant.plant.maxHeight}"
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Spread
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                      {userPlant.currentSpread}" / {userPlant.plant.maxSpread}"
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Location
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                      {userPlant.location}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('PlantDetail', { userPlant })}
                    style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.primary }}
                  >
                    View Details
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('CareLogs', { userPlant })}
                    style={{ flex: 1, marginLeft: 8 }}
                  >
                    Care Logs
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
        onPress={() => navigation.navigate('AddPlant')}
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sortLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  sortButtons: {
    flex: 1,
  },
  countCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    textAlign: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  plantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  plantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  plantMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  plantStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
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