import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNomadFit } from '../context/NomadFitContext';

const ProfileScreen: React.FC = () => {
  const { user, stats } = useNomadFit();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar.Text
              label={user?.name?.charAt(0) || 'U'}
              size={80}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text variant="headlineMedium" style={styles.userName}>
                {user?.name || 'User'}
              </Text>
              <Text variant="bodyMedium" style={styles.userLevel}>
                {user?.fitnessLevel || 'beginner'} level
              </Text>
            </View>
          </View>
        </Surface>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Profile</Text>
            <Text variant="bodyMedium" style={styles.placeholderText}>
              User profile and settings will be implemented here
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Goals</Text>
            <Text variant="bodyMedium" style={styles.placeholderText}>
              Fitness goals and progress will be shown here
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#ffffff',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  userLevel: {
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

export default ProfileScreen; 