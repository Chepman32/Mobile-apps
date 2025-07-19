
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'dailyPlanner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, dueDate TEXT, isCompleted INTEGER, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM tasks ORDER BY dueDate ASC',
            [],
            (_, { rows }) => {
              const loadedTasks = [];
              for (let i = 0; i < rows.length; i++) {
                loadedTasks.push(rows.item(i));
              }
              setTasks(loadedTasks);
            },
            (tx, error) => console.error('Error fetching tasks', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const getCompletionData = () => {
    const dailyCompletions = {};
    tasks.forEach(task => {
      if (task.isCompleted) {
        dailyCompletions[task.dueDate] = (dailyCompletions[task.dueDate] || 0) + 1;
      }
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
      <Text style={styles.title}>Productivity Analytics</Text>

      {tasks.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Daily Task Completions (Last 7 Days)</Text>
          <BarChart
            data={getCompletionData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No task data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced analytics and insights available with Premium.</Text>
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
