
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'courseCreator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CourseEditorScreen = ({ route }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM courses WHERE id = ?',
        [courseId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedCourse = rows.item(0);
            setCourse(loadedCourse);
            setTitle(loadedCourse.title);
            setDescription(loadedCourse.description);
            setContent(loadedCourse.content);
          }
        },
        (tx, error) => console.error('Error fetching course', error)
      );
    });
  }, [courseId]);

  const saveCourse = () => {
    if (!course) return;

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE courses SET title = ?, description = ?, content = ? WHERE id = ?',
        [title, description, content, courseId],
        () => Alert.alert('Success', 'Course saved!'),
        (tx, error) => console.error('Error saving course', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-assisted content generation. (Conceptual)'
    );
    // In a real app, an AI model would suggest content for the course.
  };

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Loading course...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Course Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Course Title"
        value={title}
        onChangeText={setTitle}
        onBlur={saveCourse} // Save on blur
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Course Description"
        multiline
        value={description}
        onChangeText={setDescription}
        onBlur={saveCourse} // Save on blur
      />

      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Course Content (e.g., Lesson 1, Lesson 2)"
        multiline
        value={content}
        onChangeText={setContent}
        onBlur={saveCourse} // Save on blur
      />

      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Content Suggestion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={saveCourse}>
        <Text style={styles.buttonText}>Save Course</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ModuleList', { courseId: course.id })}>
        <Text style={styles.buttonText}>Manage Modules</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Premium AI features and publishing options available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
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
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default CourseEditorScreen;
