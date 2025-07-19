
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'workouts.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS workout_history (id INTEGER PRIMARY KEY AUTOINCREMENT, workoutId INTEGER, date TEXT, duration INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM workout_history ORDER BY date ASC',
            [],
            (_, { rows }) => {
              const loadedHistory = [];
              for (let i = 0; i < rows.length; i++) {
                loadedHistory.push(rows.item(i));
              }
              setWorkoutHistory(loadedHistory);
            },
            (tx, error) => console.error('Error fetching workout history', error)
          );
        },
        (tx, error) => console.error('Error creating history table', error)
      );
    });
  }, []);

  const getWorkoutDurationData = () => {
    const dailyDurations = {};
    workoutHistory.forEach(record => {
      dailyDurations[record.date] = (dailyDurations[record.date] || 0) + record.duration;
    });

    const sortedDates = Object.keys(dailyDurations).sort();
    const labels = sortedDates.slice(-7); // Last 7 days
    const data = labels.map(date => dailyDurations[date] || 0);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workout Analytics</Text>

      {workoutHistory.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Daily Workout Duration (Last 7 Days)</Text>
          <LineChart
            data={getWorkoutDurationData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No workout history to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced analytics available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default AnalyticsScreen;
