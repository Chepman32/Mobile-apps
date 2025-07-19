
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'personalExpenses.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM transactions ORDER BY date DESC',
        [],
        (_, { rows }) => {
          const loadedTransactions = [];
          for (let i = 0; i < rows.length; i++) {
            loadedTransactions.push(rows.item(i));
          }
          setTransactions(loadedTransactions);
        },
        (tx, error) => console.error('Error fetching transactions', error)
      );
    });
  }, []);

  const getCategoryData = () => {
    const categoryMap = {};
    transactions.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'];
    return Object.keys(categoryMap).map((category, index) => ({
      name: category,
      population: categoryMap[category],
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
  };

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Analytics</Text>

      {getCategoryData().length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <PieChart
            data={getCategoryData()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute // For the absolute value of the chart labels
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No expense data for charts.</Text>
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
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
