
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Realm from 'realm';
import { Calendar } from 'react-native-calendars';

// Define Realm Schema (re-defined for clarity, but ideally imported)
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

const AddStudyItemScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'studyPlanner.realm',
          schema: [StudyItemSchema],
        });
        setRealm(newRealm);
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

  const handleAddStudyItem = () => {
    if (!title.trim() || !subject.trim() || !dueDate.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (realm) {
      realm.write(() => {
        realm.create('StudyItem', {
          _id: new Realm.BSON.ObjectId(),
          title: title,
          subject: subject,
          dueDate: dueDate,
          isCompleted: false,
          isPremium: false, // Default to non-premium
        });
      });
      Alert.alert('Success', 'Study item added successfully!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Item Title (e.g., Chapter 5 Review)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject (e.g., Math, History)"
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={styles.label}>Due Date:</Text>
      <Calendar
        onDayPress={(day) => setDueDate(day.dateString)}
        markedDates={{
          [dueDate]: { selected: true, marked: true, selectedColor: '#007bff' },
        }}
        style={styles.calendar}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddStudyItem}>
        <Text style={styles.buttonText}>Add Study Item</Text>
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  calendar: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddStudyItemScreen;
