
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'expenses.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnalyticsScreen = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT category, SUM(amount) as totalAmount FROM transactions GROUP BY category',
        [],
        (_, { rows }) => {
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push({ x: rows.item(i).category, y: rows.item(i).totalAmount });
          }
          setCategoryData(data);
        },
        (tx, error) => console.error('Error fetching category data', error)
      );
    });
  }, []);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Analytics</Text>

      {categoryData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <Svg width={screenWidth - 40} height={220}>
            <VictoryPie
              standalone={false}
              width={screenWidth - 40}
              height={220}
              data={categoryData}
              innerRadius={50}
              labelRadius={({ innerRadius }) => innerRadius + 20}
              style={{
                labels: { fontSize: 14, fill: "black" },
              }}
            />
          </Svg>
        </View>
      ) : (
        <Text style={styles.emptyText}>No data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced reports and insights available with Premium.</Text>
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
