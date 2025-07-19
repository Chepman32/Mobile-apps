
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const [studyData, setStudyData] = useState([]);

  useEffect(() => {
    const loadStudyData = async () => {
      try {
        const storedDecks = await AsyncStorage.getItem('decks');
        const decks = storedDecks ? JSON.parse(storedDecks) : [];
        
        const allCards = decks.flatMap(deck => deck.cards);
        // For simplicity, we'll just track the number of times each card has been reviewed
        const reviewCounts = {};
        allCards.forEach(card => {
          // This is a very simplified representation of review data
          // In a real app, you'd store actual review events with dates
          reviewCounts[card.id] = (reviewCounts[card.id] || 0) + (card.interval > 0 ? 1 : 0); 
        });

        // Convert to a format suitable for charts (conceptual)
        const labels = Object.keys(reviewCounts);
        const data = Object.values(reviewCounts);

        setStudyData({
          labels: labels.slice(0, 5), // Show top 5 for simplicity
          datasets: [
            {
              data: data.slice(0, 5),
            },
          ],
        });

      } catch (error) {
        console.error('Failed to load study data:', error);
      }
    };
    loadStudyData();
  }, []);

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
      <Text style={styles.title}>Learning Analytics</Text>

      {studyData.labels && studyData.labels.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Card Review Counts (Top 5)</Text>
          <BarChart
            data={studyData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No study data to display analytics.</Text>
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
