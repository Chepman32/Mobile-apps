
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'moodTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const MoodHistoryScreen = () => {
  const [moodEntries, setMoodEntries] = useState([]);

  const loadMoodEntries = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS mood_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, mood INTEGER, journal TEXT, date TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM mood_entries ORDER BY date DESC',
            [],
            (_, { rows }) => {
              const loadedEntries = [];
              for (let i = 0; i < rows.length; i++) {
                loadedEntries.push(rows.item(i));
              }
              setMoodEntries(loadedEntries);
            },
            (tx, error) => console.error('Error fetching mood entries', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadMoodEntries();
  }, [loadMoodEntries]);

  const renderMoodEntry = ({ item }) => (
    <View style={styles.moodEntryItem}>
      <Text style={styles.moodDate}>{item.date}</Text>
      <Text style={styles.moodRating}>Mood: {item.mood} / 5</Text>
      {item.journal ? <Text style={styles.journalText}>{item.journal}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={moodEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMoodEntry}
        ListEmptyComponent={<Text style={styles.emptyText}>No mood entries yet.</Text>}
      />
    </View>
  );
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  moodEntryItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  moodRating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  journalText: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default MoodHistoryScreen;
