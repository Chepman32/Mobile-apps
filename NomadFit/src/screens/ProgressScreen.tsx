import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNomadFit } from '../context/NomadFitContext';

const ProgressScreen: React.FC = () => {
  const { stats, loading } = useNomadFit();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading progress data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Progress
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Track your fitness journey
          </Text>
        </Surface>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Progress Charts</Text>
            <Text variant="bodyMedium" style={styles.placeholderText}>
              Charts and progress tracking will be implemented here
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Statistics</Text>
            <Text variant="bodyMedium">
              Total Workouts: {stats.totalWorkouts}
            </Text>
            <Text variant="bodyMedium">
              Current Streak: {stats.currentStreak} days
            </Text>
            <Text variant="bodyMedium">
              Total Duration: {stats.totalDuration} minutes
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  placeholderText: {
    marginTop: 8,
    color: '#666',
  },
});

export default ProgressScreen; 