
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Realm from 'realm';

const screenWidth = Dimensions.get('window').width;

// Define Realm Schema (re-defined for clarity, but ideally imported)
const StudyItemSchema = {
  name: 'StudyItem',
  properties: {
    _id: 'objectId',
    title: 'string',
    subject: 'string',
    dueDate: 'string',
    isCompleted: 'bool',
    isPremium: 'bool',
  },
};

const AnalyticsScreen = () => {
  const [studyItems, setStudyItems] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'studyPlanner.realm',
          schema: [StudyItemSchema],
        });
        setRealm(newRealm);

        const allStudyItems = newRealm.objects('StudyItem');
        setStudyItems(Array.from(allStudyItems));

        allStudyItems.addListener(() => {
          setStudyItems(Array.from(allStudyItems));
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
    studyItems.forEach(item => {
      if (item.isCompleted) {
        dailyCompletions[item.dueDate] = (dailyCompletions[item.dueDate] || 0) + 1;
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
      <Text style={styles.title}>Study Analytics</Text>

      {studyItems.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Daily Study Completions (Last 7 Days)</Text>
          <BarChart
            data={getCompletionData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No study data to display analytics.</Text>
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
