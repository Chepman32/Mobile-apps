
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'recoveryTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [recoveryData, setRecoveryData] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS recovery_data (id INTEGER PRIMARY KEY AUTOINCREMENT, score INTEGER, workoutDate TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM recovery_data ORDER BY timestamp ASC',
            [],
            (_, { rows }) => {
              const loadedData = [];
              for (let i = 0; i < rows.length; i++) {
                loadedData.push(rows.item(i));
              }
              setRecoveryData(loadedData);
            },
            (tx, error) => console.error('Error fetching data', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const getScoreData = () => {
    const labels = recoveryData.map(record => new Date(record.timestamp).toLocaleDateString());
    const data = recoveryData.map(record => record.score);

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
      <Text style={styles.title}>Recovery Analytics</Text>

      {recoveryData.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Recovery Score Over Time</Text>
          <LineChart
            data={getScoreData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No recovery data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced recovery analytics and custom programs available with Premium.</Text>
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
