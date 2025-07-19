import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Searchbar,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, Exercise, ExerciseCategory } from '../types';

type AddExerciseScreenProps = StackScreenProps<RootStackParamList, 'AddExercise'>;
type AddExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AddExerciseScreen: React.FC = () => {
  const navigation = useNavigation<AddExerciseScreenNavigationProp>();
  const route = useRoute<AddExerciseScreenProps['route']>();
  const { workoutId } = route.params;
  
  const { exercises, addExerciseToWorkout, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => 
                           muscle.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.values(ExerciseCategory);

  const handleAddExercise = async (exerciseId: string) => {
    try {
      await addExerciseToWorkout(exerciseId);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add exercise:', error);
    }
  };

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <Card style={styles.exerciseCard} mode="outlined">
      <Card.Content>
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text variant="titleMedium" style={styles.exerciseName}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.exerciseCategory}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
            <View style={styles.muscleContainer}>
              {item.targetMuscles.slice(0, 3).map((muscle) => (
                <Chip key={muscle} compact style={styles.muscleChip}>
                  {muscle}
                </Chip>
              ))}
              {item.targetMuscles.length > 3 && (
                <Text variant="bodySmall" style={styles.moreText}>
                  +{item.targetMuscles.length - 3} more
                </Text>
              )}
            </View>
          </View>
          <Button
            mode="contained"
            compact
            onPress={() => handleAddExercise(item.id)}
            icon="plus"
          >
            Add
          </Button>
        </View>
        
        {item.instructions && (
          <Text variant="bodySmall" style={styles.instructions} numberOfLines={2}>
            {item.instructions}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search exercises..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={[null, ...categories]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item || 'all'}
          renderItem={({ item }) => (
            <Chip
              mode={selectedCategory === item ? 'flat' : 'outlined'}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={styles.categoryChip}
            >
              {item ? item.charAt(0).toUpperCase() + item.slice(1) : 'All'}
            </Chip>
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Exercises List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading exercises...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                No exercises found
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Try adjusting your search or category filter
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  exerciseCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseCategory: {
    color: '#666',
    marginBottom: 8,
  },
  muscleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  muscleChip: {
    height: 24,
  },
  moreText: {
    color: '#666',
    marginLeft: 4,
  },
  instructions: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#999',
  },
});

export default AddExerciseScreen;