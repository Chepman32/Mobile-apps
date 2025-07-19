
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';

const db = SQLite.openDatabase(
  { name: 'waterTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const WaterTrackerScreen = ({ navigation }) => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(2000); // Default goal in ml

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS water_intake (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT SUM(amount) as totalIntake FROM water_intake WHERE timestamp LIKE ?',
            [`${new Date().toISOString().split('T')[0]}%`],
            (_, { rows }) => {
              setWaterIntake(rows.item(0).totalIntake || 0);
            },
            (tx, error) => console.error('Error fetching water intake', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });

    // Schedule daily reminder (conceptual)
    PushNotification.localNotificationSchedule({
      message: "Time to drink some water!", // (required)
      date: new Date(Date.now() + 60 * 1000 * 60 * 24), // 24 hours from now
      repeatType: 'day',
    });
  }, []);

  const addWater = (amount) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO water_intake (amount, timestamp) VALUES (?, ?)',
        [amount, new Date().toLocaleString()],
        () => {
          setWaterIntake(waterIntake + amount);
          Alert.alert('Success', `${amount}ml added!`);
        },
        (tx, error) => console.error('Error adding water', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced reminders, health analytics, etc.'
    );
  };

  const progress = waterIntake / goal;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake</Text>
      <Text style={styles.goalText}>Goal: {goal} ml</Text>
      <Text style={styles.intakeText}>{waterIntake} ml</Text>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${Math.min(100, progress * 100)}%` }]} />
      </View>

      <View style={styles.addButtons}>
        <TouchableOpacity style={styles.addButton} onPress={() => addWater(200)}>
          <Text style={styles.buttonText}>+200ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => addWater(500)}>
          <Text style={styles.buttonText}>+500ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => addWater(1000)}>
          <Text style={styles.buttonText}>+1000ml</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
    marginBottom: 10,
  },
  goalText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  intakeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '90%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  addButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
});

export default WaterTrackerScreen;
