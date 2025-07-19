
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'learningAnalytics.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const DashboardScreen = () => {
  const [learningData, setLearningData] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS learning_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, duration INTEGER, score REAL)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM learning_sessions',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummySessions = [
                  { date: '2024-07-01', duration: 60, score: 0.75 },
                  { date: '2024-07-02', duration: 90, score: 0.80 },
                  { date: '2024-07-03', duration: 45, score: 0.70 },
                  { date: '2024-07-04', duration: 120, score: 0.90 },
                  { date: '2024-07-05', duration: 75, score: 0.85 },
                  { date: '2024-07-06', duration: 100, score: 0.92 },
                  { date: '2024-07-07', duration: 80, score: 0.88 },
                ];
                dummySessions.forEach(session => {
                  tx.executeSql(
                    'INSERT INTO learning_sessions (date, duration, score) VALUES (?, ?, ?)',
                    [session.date, session.duration, session.score],
                    () => {},
                    (tx, error) => console.error('Error inserting session', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM learning_sessions ORDER BY date ASC',
                [],
                (_, { rows: allRows }) => {
                  const loadedData = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedData.push(allRows.item(i));
                  }
                  setLearningData(loadedData);
                },
                (tx, error) => console.error('Error fetching sessions', error)
              );
            },
            (tx, error) => console.error('Error checking sessions', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const getDurationData = () => {
    const labels = learningData.map(session => session.date);
    const data = learningData.map(session => session.duration);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
        },
      ],
    };
  };

  const getScoreData = () => {
    const labels = learningData.map(session => session.date);
    const data = learningData.map(session => session.score * 100);

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
      <Text style={styles.title}>Learning Analytics Dashboard</Text>

      {learningData.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Learning Duration Over Time (minutes)</Text>
          <LineChart
            data={getDurationData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Performance Score Over Time (%)</Text>
          <BarChart
            data={getScoreData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No learning data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced AI insights and custom reports available with Premium.</Text>
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

export default DashboardScreen;
