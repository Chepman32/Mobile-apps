
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'fitnessTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ProgressScreen = ({ route }) => {
  const { goalId, goalName } = route.params;
  const [goal, setGoal] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM goals WHERE id = ?',
        [goalId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setGoal(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching goal', error)
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS goal_progress (id INTEGER PRIMARY KEY AUTOINCREMENT, goalId INTEGER, date TEXT, progress REAL)',
        [],
        () => {
          // Insert dummy progress data for the goal
          tx.executeSql(
            'SELECT * FROM goal_progress WHERE goalId = ?',
            [goalId],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyProgress = [
                  { date: '2024-07-01', progress: 10 },
                  { date: '2024-07-05', progress: 15 },
                  { date: '2024-07-10', progress: 20 },
                ];
                dummyProgress.forEach(p => {
                  tx.executeSql(
                    'INSERT INTO goal_progress (goalId, date, progress) VALUES (?, ?, ?)',
                    [goalId, p.date, p.progress],
                    () => {},
                    (tx, error) => console.error('Error inserting progress', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM goal_progress WHERE goalId = ? ORDER BY date ASC',
                [goalId],
                (_, { rows: allRows }) => {
                  const loadedProgress = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedProgress.push(allRows.item(i));
                  }
                  setProgressHistory(loadedProgress);
                },
                (tx, error) => console.error('Error fetching progress history', error)
              );
            },
            (tx, error) => console.error('Error checking progress table', error)
          );
        },
        (tx, error) => console.error('Error creating progress table', error)
      );
    });
  }, [goalId]);

  const getProgressData = () => {
    const labels = progressHistory.map(record => record.date);
    const data = progressHistory.map(record => record.progress);

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

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Loading goal progress...</Text>
      </View>
    );
  }

  const currentProgressPercentage = (goal.current / goal.target) * 100;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{goal.name} Progress</Text>
      <Text style={styles.currentProgress}>Current: {goal.current} / {goal.target}</Text>
      <Text style={styles.percentage}>{currentProgressPercentage.toFixed(1)}%</Text>

      {progressHistory.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Progress Over Time</Text>
          <LineChart
            data={getProgressData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No progress data to display charts.</Text>
      )}

      <Text style={styles.infoText}>Advanced analytics and personal coaching available with Premium.</Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  currentProgress: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 30,
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

export default ProgressScreen;
