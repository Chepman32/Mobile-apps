
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'languageTutor.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ProgressScreen = () => {
  const [totalLessonsCompleted, setTotalLessonsCompleted] = useState(0);
  const [totalPracticeTime, setTotalPracticeTime] = useState(0);

  useEffect(() => {
    db.transaction((tx) => {
      // Conceptual: In a real app, you'd track completed lessons and practice time
      // For now, we'll just show dummy data
      setTotalLessonsCompleted(5); // Dummy data
      setTotalPracticeTime(120); // Dummy data in minutes
    });
  }, []);

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced AI coaching, pronunciation analysis, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Lessons Completed</Text>
        <Text style={styles.cardValue}>{totalLessonsCompleted}</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Total Practice Time</Text>
        <Text style={styles.cardValue}>{totalPracticeTime} minutes</Text>
      </View>

      <Text style={styles.infoText}>Detailed analytics and personalized insights available with Premium.</Text>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Insights</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007bff',
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
});

export default ProgressScreen;
