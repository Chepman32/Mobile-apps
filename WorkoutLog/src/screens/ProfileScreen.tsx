import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

const ProfileScreen: React.FC = () => {
  const { userProfile, stats } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Profile
        </Text>
      </Surface>
      
      <View style={styles.content}>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleLarge" style={styles.name}>
              {userProfile?.name || 'User'}
            </Text>
            <Text variant="bodyMedium" style={styles.level}>
              {userProfile?.fitnessLevel || 'Beginner'}
            </Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.statsTitle}>
              Your Statistics
            </Text>
            <Text variant="bodyMedium">
              Total Workouts: {stats.totalWorkouts}
            </Text>
            <Text variant="bodyMedium">
              Total Sets: {stats.totalSets}
            </Text>
          </Card.Content>
        </Card>
      </View>
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
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  level: {
    color: '#666',
  },
  statsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ProfileScreen;