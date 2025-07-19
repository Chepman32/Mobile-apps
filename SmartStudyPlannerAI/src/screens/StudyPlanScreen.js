
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Realm from 'realm';
import { Calendar } from 'react-native-calendars';

// Define Realm Schema
const StudyItemSchema = {
  name: 'StudyItem',
  properties: {
    _id: 'objectId',
    title: 'string',
    subject: 'string',
    dueDate: 'string',
    isCompleted: 'bool',
    isPremium: 'bool',
  },
};

const StudyPlanScreen = ({ navigation }) => {
  const [studyItems, setStudyItems] = useState([]);
  const [realm, setRealm] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'studyPlanner.realm',
          schema: [StudyItemSchema],
        });
        setRealm(newRealm);

        const initialStudyItems = newRealm.objects('StudyItem');
        setStudyItems(Array.from(initialStudyItems));

        newRealm.objects('StudyItem').addListener(() => {
          setStudyItems(Array.from(newRealm.objects('StudyItem')));
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

  const toggleCompletion = (itemId, isCompleted) => {
    if (realm) {
      realm.write(() => {
        const item = realm.objectForPrimaryKey('StudyItem', itemId);
        if (item) {
          item.isCompleted = !isCompleted;
          Alert.alert('Study Item Updated', `Item marked as ${item.isCompleted ? 'completed' : 'incomplete'}.`);
        }
      });
    }
  };

  const addStudyItem = () => {
    navigation.navigate('AddStudyItem');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced AI insights, custom study methods, etc.'
    );
  };

  const getMarkedDates = () => {
    const markedDates = {};
    studyItems.forEach(item => {
      if (item.dueDate) {
        markedDates[item.dueDate] = { marked: true, dotColor: item.isCompleted ? 'green' : 'red' };
      }
    });
    return markedDates;
  };

  const filteredStudyItems = studyItems.filter(item => item.dueDate === selectedDate);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...getMarkedDates(),
          [selectedDate]: { selected: true, marked: true, selectedColor: '#007bff' },
        }}
      />

      <Text style={styles.headerText}>Study Items for {selectedDate}</Text>
      <FlatList
        data={filteredStudyItems}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.studyItem, item.isCompleted && styles.completedStudyItem]}
            onPress={() => toggleCompletion(item._id, item.isCompleted)}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubject}>{item.subject}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No study items for this date.</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={addStudyItem}>
        <Text style={styles.buttonText}>Add New Study Item</Text>
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
  studyItem: {
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
  completedStudyItem: {
    backgroundColor: '#d4edda',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubject: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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

export default StudyPlanScreen;
