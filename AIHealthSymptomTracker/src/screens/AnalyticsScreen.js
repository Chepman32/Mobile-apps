
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'healthTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS symptoms (id INTEGER PRIMARY KEY AUTOINCREMENT, symptom TEXT, severity INTEGER, notes TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM symptoms ORDER BY timestamp ASC',
            [],
            (_, { rows }) => {
              const loadedSymptoms = [];
              for (let i = 0; i < rows.length; i++) {
                loadedSymptoms.push(rows.item(i));
              }
              setSymptoms(loadedSymptoms);
            },
            (tx, error) => console.error('Error fetching symptoms', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const getSeverityData = () => {
    const dailySeverity = {};
    symptoms.forEach(symptom => {
      const date = new Date(symptom.timestamp).toISOString().split('T')[0];
      dailySeverity[date] = (dailySeverity[date] || 0) + symptom.severity;
    });

    const sortedDates = Object.keys(dailySeverity).sort();
    const labels = sortedDates.slice(-7); // Last 7 days
    const data = labels.map(date => dailySeverity[date] / (symptoms.filter(s => new Date(s.timestamp).toISOString().split('T')[0] === date).length || 1)); // Average severity

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
      <Text style={styles.title}>Symptom Analytics</Text>

      {symptoms.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Average Daily Symptom Severity (Last 7 Days)</Text>
          <LineChart
            data={getSeverityData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No symptom data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced analytics and health insights available with Premium.</Text>
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
