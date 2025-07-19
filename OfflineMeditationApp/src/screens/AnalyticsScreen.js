
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const [meditationSessions, setMeditationSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const storedSessions = await AsyncStorage.getItem('meditationSessions');
        if (storedSessions) {
          setMeditationSessions(JSON.parse(storedSessions));
        }
      } catch (error) {
        console.error('Failed to load meditation sessions:', error);
      }
    };
    loadSessions();
  }, []);

  const getDurationData = () => {
    const dailyDurations = {};
    meditationSessions.forEach(session => {
      dailyDurations[session.date] = (dailyDurations[session.date] || 0) + session.duration;
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

  const getBreathData = () => {
    const dailyBreaths = {};
    meditationSessions.forEach(session => {
      dailyBreaths[session.date] = (dailyBreaths[session.date] || 0) + session.breaths;
    });

    const sortedDates = Object.keys(dailyBreaths).sort();
    const labels = sortedDates.slice(-7); // Last 7 days
    const data = labels.map(date => dailyBreaths[date] || 0);

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
      <Text style={styles.title}>Meditation Analytics</Text>

      {meditationSessions.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Meditation Duration (Last 7 Days)</Text>
          <LineChart
            data={getDurationData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Breaths Count (Last 7 Days)</Text>
          <BarChart
            data={getBreathData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No meditation data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced statistics and insights available with Premium.</Text>
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
