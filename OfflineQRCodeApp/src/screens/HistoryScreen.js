
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'qrcodes.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, value TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM history ORDER BY timestamp DESC',
            [],
            (_, { rows }) => {
              const loadedHistory = [];
              for (let i = 0; i < rows.length; i++) {
                loadedHistory.push(rows.item(i));
              }
              setHistory(loadedHistory);
            },
            (tx, error) => console.error('Error fetching history', error)
          );
        },
        (tx, error) => console.error('Error creating history table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyType}>{item.type.toUpperCase()}</Text>
      <Text style={styles.historyValue}>{item.value}</Text>
      <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHistoryItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No history yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  historyItem: {
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
  historyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default HistoryScreen;
