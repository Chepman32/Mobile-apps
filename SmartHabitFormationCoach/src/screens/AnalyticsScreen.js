
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'habitCoach.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, frequency TEXT, completedDates TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM habits',
            [],
            (_, { rows }) => {
              const loadedHabits = [];
              for (let i = 0; i < rows.length; i++) {
                loadedHabits.push({ ...rows.item(i), completedDates: JSON.parse(rows.item(i).completedDates) });
              }
              setHabits(loadedHabits);
            },
            (tx, error) => console.error('Error fetching habits', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const getCompletionData = () => {
    const dailyCompletions = {};
    habits.forEach(habit => {
      habit.completedDates.forEach(date => {
        dailyCompletions[date] = (dailyCompletions[date] || 0) + 1;
      });
    });

    const sortedDates = Object.keys(dailyCompletions).sort();
    const labels = sortedDates.slice(-7); // Last 7 days
    const data = labels.map(date => dailyCompletions[date] || 0);

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
      <Text style={styles.title}>Habit Analytics</Text>

      {habits.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Daily Habit Completions (Last 7 Days)</Text>
          <BarChart
            data={getCompletionData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No habit data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced AI insights and custom study methods available with Premium.</Text>
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
