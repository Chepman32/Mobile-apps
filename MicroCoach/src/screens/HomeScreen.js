
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const HomeScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);

  const loadHabits = useCallback(async () => {
    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  }, []);

  useEffect(() => {
    loadHabits();
    const unsubscribe = navigation.addListener('focus', () => {
      loadHabits();
    });
    return unsubscribe;
  }, [navigation, loadHabits]);

  const toggleHabit = async (id) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const deleteHabit = async (id) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedHabits = habits.filter((habit) => habit.id !== id);
            setHabits(updatedHabits);
            await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
            PushNotification.cancelLocalNotifications({ id: id });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.habitItem}
            onPress={() => toggleHabit(item.id)}
            onLongPress={() => deleteHabit(item.id)}
          >
            <Text style={[styles.habitName, item.completed && styles.completedHabit]}>
              {item.name}
            </Text>
            <Text style={styles.habitFrequency}>{item.frequency}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits yet. Add one!</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  habitItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedHabit: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  habitFrequency: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
