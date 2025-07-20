import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Chip,
  Button,
  List,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { Plant, PlantCategory, LightRequirement, WaterNeed, SoilType } from '../types';

export default function PlantDatabaseScreen({ navigation }: any) {
  const theme = useTheme();
  const { state } = useContext(PlantCareGuideContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLight, setSelectedLight] = useState<string>('all');
  const [selectedWater, setSelectedWater] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'growthRate'>('name');

  const filteredPlants = useMemo(() => {
    let filtered = state.plants;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(query) ||
        plant.scientificName?.toLowerCase().includes(query) ||
        plant.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plant => plant.categoryId === selectedCategory);
    }

    // Light requirement filter
    if (selectedLight !== 'all') {
      filtered = filtered.filter(plant => plant.lightRequirement === selectedLight);
    }

    // Water need filter
    if (selectedWater !== 'all') {
      filtered = filtered.filter(plant => plant.waterNeed === selectedWater);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(plant => plant.careDifficulty === selectedDifficulty);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.careDifficulty] - difficultyOrder[b.careDifficulty];
        case 'growthRate':
          const growthOrder = { slow: 1, medium: 2, fast: 3 };
          return growthOrder[a.growthRate] - growthOrder[b.growthRate];
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.plants, searchQuery, selectedCategory, selectedLight, selectedWater, selectedDifficulty, sortBy]);

  const getPlantIcon = (plant: Plant) => {
    const category = state.categories.find(c => c.id === plant.categoryId);
    if (category?.name.toLowerCase().includes('cactus')) return '🌵';
    if (category?.name.toLowerCase().includes('succulent')) return '🌱';
    if (category?.name.toLowerCase().includes('tree')) return '🌳';
    if (category?.name.toLowerCase().includes('herb')) return '🌿';
    if (category?.name.toLowerCase().includes('flower')) return '🌸';
    return '🪴';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#666';
    }
  };

  const getLightIcon = (light: LightRequirement) => {
    switch (light) {
      case 'low': return '🌑';
      case 'medium': return '🌤️';
      case 'high': return '☀️';
      default: return '🌤️';
    }
  };

  const getWaterIcon = (water: WaterNeed) => {
    switch (water) {
      case 'low': return '💧';
      case 'moderate': return '💧💧';
      case 'high': return '💧💧💧';
      default: return '💧💧';
    }
  };

  const renderPlantItem = ({ item: plant }: { item: Plant }) => {
    const category = state.categories.find(c => c.id === plant.categoryId);
    
    return (
      <Card style={styles.plantCard} onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}>
        <Card.Content>
          <View style={styles.plantHeader}>
            <Text style={styles.plantIcon}>{getPlantIcon(plant)}</Text>
            <View style={styles.plantInfo}>
              <Text variant="titleMedium" style={styles.plantName}>
                {plant.name}
              </Text>
              {plant.scientificName && (
                <Text variant="bodySmall" style={styles.scientificName}>
                  {plant.scientificName}
                </Text>
              )}
              {category && (
                <Text variant="bodySmall" style={styles.category}>
                  {category.name}
                </Text>
              )}
            </View>
          </View>

          {plant.description && (
            <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
              {plant.description}
            </Text>
          )}

          <View style={styles.plantDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>{getLightIcon(plant.lightRequirement)}</Text>
              <Text variant="bodySmall" style={styles.detailText}>
                {plant.lightRequirement} light
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>{getWaterIcon(plant.waterNeed)}</Text>
              <Text variant="bodySmall" style={styles.detailText}>
                {plant.waterNeed} water
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plant.careDifficulty) }]}>
                {plant.careDifficulty}
              </Text>
            </View>
          </View>

          {plant.maxHeight && plant.maxSpread && (
            <Text variant="bodySmall" style={styles.sizeInfo}>
              Size: {plant.maxHeight}" × {plant.maxSpread}"
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search plants..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <Chip
          selected={selectedCategory === 'all'}
          onPress={() => setSelectedCategory('all')}
          style={styles.filterChip}
          mode="outlined"
        >
          All Categories
        </Chip>
        {state.categories.map((category) => (
          <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={styles.filterChip}
            mode="outlined"
          >
            {category.name}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <Chip
          selected={selectedLight === 'all'}
          onPress={() => setSelectedLight('all')}
          style={styles.filterChip}
          mode="outlined"
        >
          All Light
        </Chip>
        <Chip
          selected={selectedLight === 'low'}
          onPress={() => setSelectedLight('low')}
          style={styles.filterChip}
          mode="outlined"
        >
          Low Light
        </Chip>
        <Chip
          selected={selectedLight === 'medium'}
          onPress={() => setSelectedLight('medium')}
          style={styles.filterChip}
          mode="outlined"
        >
          Medium Light
        </Chip>
        <Chip
          selected={selectedLight === 'high'}
          onPress={() => setSelectedLight('high')}
          style={styles.filterChip}
          mode="outlined"
        >
          High Light
        </Chip>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <Chip
          selected={selectedWater === 'all'}
          onPress={() => setSelectedWater('all')}
          style={styles.filterChip}
          mode="outlined"
        >
          All Water
        </Chip>
        <Chip
          selected={selectedWater === 'low'}
          onPress={() => setSelectedWater('low')}
          style={styles.filterChip}
          mode="outlined"
        >
          Low Water
        </Chip>
        <Chip
          selected={selectedWater === 'moderate'}
          onPress={() => setSelectedWater('moderate')}
          style={styles.filterChip}
          mode="outlined"
        >
          Moderate Water
        </Chip>
        <Chip
          selected={selectedWater === 'high'}
          onPress={() => setSelectedWater('high')}
          style={styles.filterChip}
          mode="outlined"
        >
          High Water
        </Chip>
      </ScrollView>

      <View style={styles.sortContainer}>
        <Text variant="bodyMedium" style={styles.sortLabel}>Sort by:</Text>
        <SegmentedButtons
          value={sortBy}
          onValueChange={(value) => setSortBy(value as 'name' | 'difficulty' | 'growthRate')}
          buttons={[
            { value: 'name', label: 'Name' },
            { value: 'difficulty', label: 'Difficulty' },
            { value: 'growthRate', label: 'Growth' },
          ]}
          style={styles.sortButtons}
        />
      </View>

      <FlatList
        data={filteredPlants}
        renderItem={renderPlantItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                No Plants Found
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Try adjusting your search or filters to find plants.
              </Text>
            </Card.Content>
          </Card>
        }
        ListHeaderComponent={
          <Text variant="titleMedium" style={styles.resultsCount}>
            {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchbar: {
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  filterChip: {
    marginRight: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortLabel: {
    marginRight: 12,
  },
  sortButtons: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  resultsCount: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  plantCard: {
    marginBottom: 12,
    elevation: 2,
  },
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  plantIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontWeight: 'bold',
  },
  scientificName: {
    fontStyle: 'italic',
    color: '#666',
  },
  category: {
    color: '#666',
    marginTop: 2,
  },
  description: {
    marginBottom: 12,
    color: '#333',
  },
  plantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  detailText: {
    color: '#666',
  },
  difficultyBadge: {
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  sizeInfo: {
    color: '#666',
    fontStyle: 'italic',
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 