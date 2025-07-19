import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { Exercise } from '../types';

const ExercisesScreen: React.FC = () => {
  const { exercises } = useAppContext();

  const renderExercise = ({ item }: { item: Exercise }) => (
    <Card style={styles.exerciseCard} mode="outlined">
      <Card.Content>
        <Text variant="titleMedium" style={styles.exerciseName}>
          {item.name}
        </Text>
        <Text variant="bodySmall" style={styles.exerciseCategory}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Exercises
        </Text>
      </Surface>
      
      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  exerciseCard: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  exerciseName: {
    fontWeight: 'bold',
  },
  exerciseCategory: {
    color: '#666',
    marginTop: 4,
  },
});

export default ExercisesScreen;