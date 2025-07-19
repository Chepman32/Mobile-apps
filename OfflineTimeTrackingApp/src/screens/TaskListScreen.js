
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'timeTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM tasks',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyTasks = [
                  { name: 'Work on Project X', description: 'Develop new feature', isPremium: 0 },
                  { name: 'Study React Native', description: 'Learn about hooks', isPremium: 0 },
                  { name: 'Premium Task', description: 'Advanced research', isPremium: 1 },
                ];
                dummyTasks.forEach(task => {
                  tx.executeSql(
                    'INSERT INTO tasks (name, description, isPremium) VALUES (?, ?, ?)',
                    [task.name, task.description, task.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting task', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM tasks',
                [],
                (_, { rows: allRows }) => {
                  const loadedTasks = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedTasks.push(allRows.item(i));
                  }
                  setTasks(loadedTasks);
                },
                (tx, error) => console.error('Error fetching tasks', error)
              );
            },
            (tx, error) => console.error('Error checking tasks', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadTasks();
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });
    return unsubscribe;
  }, [navigation, loadTasks]);

  const handleTaskPress = (task) => {
    if (task.isPremium) {
      Alert.alert(
        'Premium Task',
        'This task is part of a premium feature. Purchase a subscription to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Subscribe', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('TimeTracker', { taskId: task.id, taskName: task.name });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced analytics, team features, etc.'
    );
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.isPremium ? styles.premiumTaskItem : null]}
      onPress={() => handleTaskPress(item)}
    >
      <Text style={styles.taskName}>{item.name}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTaskItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('TimeTracker', { taskId: null, taskName: 'Untracked Time' })}>
        <Text style={styles.buttonText}>Start New Session</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.buttonText}>View Analytics</Text>
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
  taskItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumTaskItem: {
    backgroundColor: '#ffe0b2',
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
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
  analyticsButton: {
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

export default TaskListScreen;
