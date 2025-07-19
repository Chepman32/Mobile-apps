
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Realm from 'realm';

const screenWidth = Dimensions.get('window').width;

// Define Realm Schema (re-defined for clarity, but ideally imported)
const HabitSchema = {
  name: 'Habit',
  properties: {
    _id: 'objectId',
    name: 'string',
    frequency: 'string', // e.g., 'daily', 'weekly'
    completedDates: 'string[]', // Store dates as YYYY-MM-DD
    isPremium: 'bool', // For monetization
  },
};

const AnalyticsScreen = () => {
  const [habits, setHabits] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'habitTracker.realm',
          schema: [HabitSchema],
        });
        setRealm(newRealm);

        const allHabits = newRealm.objects('Habit');
        setHabits(Array.from(allHabits));

        allHabits.addListener(() => {
          setHabits(Array.from(allHabits));
        });
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
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

      <Text style={styles.chartTitle}>Daily Completions (Last 7 Days)</Text>
      <LineChart
        data={getCompletionData()}
        width={screenWidth - 40} // from react-native
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      {/* More charts and analytics can be added here */}

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
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default AnalyticsScreen;
