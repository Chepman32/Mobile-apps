import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const ProgressScreen: React.FC = () => {
  const { stats, workouts } = useAppContext();

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#4a90e2"
    }
  };

  // Generate sample data for the chart
  const workoutsData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [3, 4, 2, 5, 4],
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Surface style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Progress
          </Text>
        </Surface>

        {/* Statistics Overview */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard} mode="outlined">
            <Card.Content style={styles.statContent}>
              <Text variant="headlineLarge" style={styles.statValue}>
                {stats.totalWorkouts}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Total Workouts
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard} mode="outlined">
            <Card.Content style={styles.statContent}>
              <Text variant="headlineLarge" style={styles.statValue}>
                {stats.totalSets}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Total Sets
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard} mode="outlined">
            <Card.Content style={styles.statContent}>
              <Text variant="headlineLarge" style={styles.statValue}>
                {Math.round(stats.totalVolume)}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Total Volume (kg)
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard} mode="outlined">
            <Card.Content style={styles.statContent}>
              <Text variant="headlineLarge" style={styles.statValue}>
                {Math.round(stats.averageWorkoutDuration)}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Avg Duration (min)
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Workout Frequency Chart */}
        <Card style={styles.chartCard} mode="outlined">
          <Card.Content>
            <Text variant="titleLarge" style={styles.chartTitle}>
              Workout Frequency
            </Text>
            <LineChart
              data={workoutsData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard} mode="outlined">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Recent Achievements
            </Text>
            <View style={styles.achievementsList}>
              <View style={styles.achievementItem}>
                <Text variant="bodyLarge">🎯 First Workout Completed</Text>
                <Text variant="bodySmall" style={styles.achievementDate}>
                  Start your fitness journey
                </Text>
              </View>
              <View style={styles.achievementItem}>
                <Text variant="bodyLarge">💪 10 Workouts Milestone</Text>
                <Text variant="bodySmall" style={styles.achievementDate}>
                  Building consistency
                </Text>
              </View>
            </View>
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
    color: '#666',
  },
  chartCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
  },
  chartTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  achievementsCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementDate: {
    color: '#666',
    marginTop: 4,
  },
});

export default ProgressScreen;