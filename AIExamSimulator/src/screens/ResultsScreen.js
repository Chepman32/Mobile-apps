
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ResultsScreen = ({ route, navigation }) => {
  const { score, totalQuestions } = route.params;
  const percentage = (score / totalQuestions) * 100;

  const data = [
    {
      name: "Correct",
      population: score,
      color: "#28a745",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Incorrect",
      population: totalQuestions - score,
      color: "#dc3545",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ];

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exam Results</Text>
      <Text style={styles.scoreText}>You scored {score} out of {totalQuestions}</Text>
      <Text style={styles.percentageText}>{percentage.toFixed(2)}%</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.popToTop()}>
        <Text style={styles.buttonText}>Back to Exam List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 30,
  },
  chartContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;
