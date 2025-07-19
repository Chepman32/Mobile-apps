
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Realm from 'realm';
import PushNotification from 'react-native-push-notification';
import { Calendar } from 'react-native-calendars';

// Define Realm Schema
const HabitSchema = {
  name: 'Habit',
  properties: {
    _id: 'objectId',
    name: 'string',
    frequency: 'string', // e.g., 'daily', 'weekly'
    completedDates: 'string[]', // Store dates as YYYY-MM-DD
    isPremium: 'bool', // For monetization
  },
};

const HabitListScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);
  const [realm, setRealm] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'habitTracker.realm',
          schema: [HabitSchema],
        });
        setRealm(newRealm);

        const initialHabits = newRealm.objects('Habit');
        setHabits(Array.from(initialHabits));

        newRealm.objects('Habit').addListener(() => {
          setHabits(Array.from(newRealm.objects('Habit')));
        });
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  const toggleHabitCompletion = (habitId) => {
    if (realm) {
      realm.write(() => {
        const habit = realm.objectForPrimaryKey('Habit', habitId);
        if (habit) {
          const today = new Date().toISOString().split('T')[0];
          const completedIndex = habit.completedDates.indexOf(today);

          if (completedIndex === -1) {
            habit.completedDates.push(today);
            Alert.alert('Habit Completed!', `Great job completing ${habit.name}!`);
          } else {
            habit.completedDates.splice(completedIndex, 1);
            Alert.alert('Habit Unmarked', `${habit.name} unmarked for today.`);
          }
        }
      });
    }
  };

  const addHabit = () => {
    navigation.navigate('AddHabit');
  };

  const viewAnalytics = () => {
    navigation.navigate('Analytics');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium analytics, unlimited habits, etc.'
    );
  };

  const getMarkedDates = () => {
    const markedDates = {};
    habits.forEach(habit => {
      habit.completedDates.forEach(date => {
        if (!markedDates[date]) {
          markedDates[date] = { marked: true, dotColor: '#007bff' };
        } else {
          markedDates[date].dots = [...(markedDates[date].dots || []), { key: habit._id.toHexString(), color: '#007bff' }];
        }
      });
    });
    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...getMarkedDates(),
          [selectedDate]: { selected: true, marked: true, selectedColor: '#007bff' },
        }}
      />

      <Text style={styles.headerText}>Habits for {selectedDate}</Text>
      <FlatList
        data={habits.filter(habit => habit.completedDates.includes(selectedDate) || !habit.completedDates.includes(selectedDate))}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.habitItem, item.completedDates.includes(selectedDate) && styles.completedHabitItem]}
            onPress={() => toggleHabitCompletion(item._id)}
          >
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.habitFrequency}>{item.frequency}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No habits yet. Add one!</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={addHabit}>
        <Text style={styles.buttonText}>Add New Habit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.analyticsButton} onPress={viewAnalytics}>
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  habitItem: {
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
  completedHabitItem: {
    backgroundColor: '#d4edda',
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  habitFrequency: {
    fontSize: 14,
    color: '#666',
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

export default HabitListScreen;
