import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ExerciseDetailsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Exercise Details</Text>
          <Text variant="bodyMedium" style={styles.placeholderText}>
            Exercise information and instructions will be implemented here
          </Text>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  card: {
    elevation: 2,
  },
  placeholderText: {
    marginTop: 8,
    color: '#666',
  },
});

export default ExerciseDetailsScreen; 