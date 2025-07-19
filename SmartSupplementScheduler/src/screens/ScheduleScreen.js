
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'supplementScheduler.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM supplements',
        [],
        (_, { rows }) => {
          const newSchedule = {};
          for (let i = 0; i < rows.length; i++) {
            const supplement = rows.item(i);
            // Simplified scheduling logic
            if (supplement.frequency === 'daily') {
              const today = new Date().toISOString().split('T')[0];
              if (!newSchedule[today]) newSchedule[today] = [];
              newSchedule[today].push(`${supplement.name} (${supplement.dosage})`);
            } else if (supplement.frequency === 'weekly') {
              // Add to schedule for next 7 days (conceptual)
              for (let j = 0; j < 7; j++) {
                const date = new Date();
                date.setDate(date.getDate() + j);
                const dateString = date.toISOString().split('T')[0];
                if (!newSchedule[dateString]) newSchedule[dateString] = [];
                newSchedule[dateString].push(`${supplement.name} (${supplement.dosage})`);
              }
            }
          }
          setSchedule(newSchedule);
        },
        (tx, error) => console.error('Error fetching supplements for schedule', error)
      );
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Supplement Schedule</Text>
      {Object.keys(schedule).length > 0 ? (
        Object.keys(schedule).sort().map(date => (
          <View key={date} style={styles.dayContainer}>
            <Text style={styles.dateText}>{date}</Text>
            {schedule[date].map((item, index) => (
              <Text key={index} style={styles.scheduleItem}>• {item}</Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No supplements scheduled yet.</Text>
      )}
      <Text style={styles.infoText}>Advanced scheduling and health analytics available with Premium.</Text>
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
  dayContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scheduleItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
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

export default ScheduleScreen;
