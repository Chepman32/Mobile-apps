
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'budget.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const BudgetOverviewScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const loadTransactions = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, type TEXT, category TEXT, date TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM transactions ORDER BY date DESC',
            [],
            (_, { rows }) => {
              const loadedTransactions = [];
              let income = 0;
              let expenses = 0;
              for (let i = 0; i < rows.length; i++) {
                const item = rows.item(i);
                loadedTransactions.push(item);
                if (item.type === 'income') {
                  income += item.amount;
                } else {
                  expenses += item.amount;
                }
              }
              setTransactions(loadedTransactions);
              setTotalIncome(income);
              setTotalExpenses(expenses);
            },
            (tx, error) => console.error('Error fetching transactions', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadTransactions();
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
    });
    return unsubscribe;
  }, [navigation, loadTransactions]);

  const getCategoryData = () => {
    const categoryMap = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
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

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium calculators, advanced analytics, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Budget Overview</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Income: ${totalIncome.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Expenses: ${totalExpenses.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Balance: ${(totalIncome - totalExpenses).toFixed(2)}</Text>
      </View>

      {getCategoryData().length > 0 ? (
        <View>
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

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={styles.buttonText}>Add Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.calculatorButton} onPress={() => navigation.navigate('FinancialCalculator')}>
        <Text style={styles.buttonText}>Financial Calculator</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculatorButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default BudgetOverviewScreen;
