
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'sleepOptimizer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [sleepSessions, setSleepSessions] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS sleep_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, duration INTEGER, quality TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM sleep_sessions ORDER BY timestamp ASC',
            [],
            (_, { rows }) => {
              const loadedSessions = [];
              for (let i = 0; i < rows.length; i++) {
                loadedSessions.push(rows.item(i));
              }
              setSleepSessions(loadedSessions);
            },
            (tx, error) => console.error('Error fetching sessions', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const getDurationData = () => {
    const labels = sleepSessions.map(session => new Date(session.timestamp).toLocaleDateString());
    const data = sleepSessions.map(session => session.duration / 3600); // Convert seconds to hours

    return {
      labels: labels,
      datasets: [
        {
          data: data,
        },
      ],
    };
  };

  const getQualityData = () => {
    const qualityMap = { 'Good': 3, 'Restless': 2, 'Poor': 1 }; // Map quality to numeric value
    const labels = sleepSessions.map(session => new Date(session.timestamp).toLocaleDateString());
    const data = sleepSessions.map(session => qualityMap[session.quality] || 0);

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
    decimalPlaces: 1, // optional, defaults to 2dp
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
      <Text style={styles.title}>Sleep Analytics</Text>

      {sleepSessions.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Sleep Duration (Hours)</Text>
          <LineChart
            data={getDurationData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Sleep Quality Over Time (1=Poor, 3=Good)</Text>
          <BarChart
            data={getQualityData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No sleep data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced sleep analysis and custom recommendations available with Premium.</Text>
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
