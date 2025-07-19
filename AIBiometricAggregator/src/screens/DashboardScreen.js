
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;

const db = SQLite.openDatabase(
  { name: 'biometricAggregator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const DashboardScreen = () => {
  const [biometricData, setBiometricData] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState('Heart Rate');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS biometrics (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, value REAL, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM biometrics',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyData = [
                  { type: 'Heart Rate', value: 70, timestamp: '2024-07-01 08:00', isPremium: 0 },
                  { type: 'Heart Rate', value: 72, timestamp: '2024-07-02 08:00', isPremium: 0 },
                  { type: 'Steps', value: 8000, timestamp: '2024-07-01 23:00', isPremium: 0 },
                  { type: 'Steps', value: 9500, timestamp: '2024-07-02 23:00', isPremium: 0 },
                  { type: 'Sleep Hours', value: 7.5, timestamp: '2024-07-01 07:00', isPremium: 1 },
                ];
                dummyData.forEach(d => {
                  tx.executeSql(
                    'INSERT INTO biometrics (type, value, timestamp, isPremium) VALUES (?, ?, ?, ?)',
                    [d.type, d.value, d.timestamp, d.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting data', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM biometrics ORDER BY timestamp ASC',
                [],
                (_, { rows: allRows }) => {
                  const loadedData = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedData.push(allRows.item(i));
                  }
                  setBiometricData(loadedData);
                },
                (tx, error) => console.error('Error fetching data', error)
              );
            },
            (tx, error) => console.error('Error checking data', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const getChartData = (type) => {
    const filteredData = biometricData.filter(d => d.type === type);
    const labels = filteredData.map(d => new Date(d.timestamp).toLocaleDateString());
    const data = filteredData.map(d => d.value);

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

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced analytics, health insights, etc.'
    );
  };

  const addData = () => {
    if (newValue) {
      const timestamp = new Date().toISOString();
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO biometrics (type, value, timestamp, isPremium) VALUES (?, ?, ?, ?)',
          [newType, parseFloat(newValue), timestamp, 0],
          () => {
            // Refresh data
            tx.executeSql(
              'SELECT * FROM biometrics ORDER BY timestamp ASC',
              [],
              (_, { rows: allRows }) => {
                const loadedData = [];
                for (let i = 0; i < allRows.length; i++) {
                  loadedData.push(allRows.item(i));
                }
                setBiometricData(loadedData);
                setNewValue('');
              },
              (tx, error) => console.error('Error fetching data', error)
            );
          }
        );
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Biometric Dashboard</Text>

      {biometricData.length > 0 ? (
        <View>
          <Text style={styles.chartTitle}>Heart Rate Over Time</Text>
          <LineChart
            data={getChartData('Heart Rate')}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Steps Over Time</Text>
          <BarChart
            data={getChartData('Steps')}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No biometric data to display analytics.</Text>
      )}

      <Text style={styles.infoText}>Advanced analytics and health insights available with Premium.</Text>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>

      <View style={styles.addDataContainer}>
        <Text style={styles.chartTitle}>Add New Data</Text>
        <TextInput
          style={styles.input}
          placeholder="Value"
          keyboardType="numeric"
          onChangeText={setNewValue}
          value={newValue}
        />
        <Picker
          selectedValue={newType}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setNewType(itemValue)}
        >
          <Picker.Item label="Heart Rate" value="Heart Rate" />
          <Picker.Item label="Steps" value="Steps" />
          <Picker.Item label="Sleep Hours" value="Sleep Hours" />
        </Picker>
        <Button title="Add Data" onPress={addData} />
      </View>
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
  premiumButton: {
    backgroundColor: '#28a745',
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
  addDataContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default DashboardScreen;
