
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';

const db = SQLite.openDatabase(
  { name: 'todoList.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, dueDate TEXT, isCompleted INTEGER, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM tasks ORDER BY dueDate ASC',
            [],
            (_, { rows }) => {
              const loadedTasks = [];
              for (let i = 0; i < rows.length; i++) {
                loadedTasks.push(rows.item(i));
              }
              setTasks(loadedTasks);
            },
            (tx, error) => console.error('Error fetching tasks', error)
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

  const toggleTaskCompletion = (taskId, isCompleted) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE tasks SET isCompleted = ? WHERE id = ?',
        [isCompleted ? 0 : 1, taskId],
        () => {
          Alert.alert('Task Updated', `Task marked as ${isCompleted ? 'incomplete' : 'complete'}.`);
          loadTasks(); // Reload tasks
        },
        (tx, error) => console.error('Error updating task', error)
      );
    });
  };

  const addTask = () => {
    navigation.navigate('AddTask');
  };

  const viewCalendar = () => {
    navigation.navigate('Calendar');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for recurring tasks, sub-task hierarchies, etc.'
    );
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.isCompleted ? styles.completedTaskItem : null]}
      onPress={() => toggleTaskCompletion(item.id, item.isCompleted)}
    >
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDueDate}>Due: {item.dueDate}</Text>
      </View>
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
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.buttonText}>Add New Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.calendarButton} onPress={viewCalendar}>
        <Text style={styles.buttonText}>View Calendar</Text>
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
  completedTaskItem: {
    backgroundColor: '#d4edda',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDueDate: {
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
  calendarButton: {
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
