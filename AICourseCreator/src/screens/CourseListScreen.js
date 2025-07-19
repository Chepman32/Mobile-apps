
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'courseCreator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CourseListScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);

  const loadCourses = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, content TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM courses',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyCourses = [
                  { title: 'Introduction to React Native', description: 'Learn the basics of mobile app development.', content: 'Lesson 1: Setup. Lesson 2: Components.', isPremium: 0 },
                  { title: 'Advanced JavaScript', description: 'Deep dive into modern JavaScript.', content: 'Module 1: ES6. Module 2: Async JS.', isPremium: 0 },
                  { title: 'AI for Beginners', description: 'Understand fundamental AI concepts.', content: 'Chapter 1: What is AI? Chapter 2: Machine Learning.', isPremium: 1 },
                ];
                dummyCourses.forEach(c => {
                  tx.executeSql(
                    'INSERT INTO courses (title, description, content, isPremium) VALUES (?, ?, ?, ?)',
                    [c.title, c.description, c.content, c.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting course', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM courses',
                [],
                (_, { rows: allRows }) => {
                  const loadedCourses = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedCourses.push(allRows.item(i));
                  }
                  setCourses(loadedCourses);
                },
                (tx, error) => console.error('Error fetching courses', error)
              );
            },
            (tx, error) => console.error('Error checking courses', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadCourses();
    const unsubscribe = navigation.addListener('focus', () => {
      loadCourses();
    });
    return unsubscribe;
  }, [navigation, loadCourses]);

  const createCourse = () => {
    Alert.prompt(
      'New Course',
      'Enter course title:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (title) => {
            if (title) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO courses (title, description, content, isPremium) VALUES (?, ?, ?, ?)',
                  [title, '', '', 0],
                  (_, result) => {
                    navigation.navigate('CourseEditor', { courseId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding course', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleCoursePress = (course) => {
    if (course.isPremium) {
      Alert.alert(
        'Premium Course',
        'This course is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('CourseEditor', { courseId: course.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium AI features, advanced tools, etc.'
    );
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.courseItem, item.isPremium ? styles.premiumCourseItem : null]}
      onPress={() => handleCoursePress(item)}
    >
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseDescription}>{item.description}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
      <TouchableOpacity onPress={() => deleteCourse(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCourseItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No courses found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createCourse}>
        <Text style={styles.buttonText}>Create New Course</Text>
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
  courseItem: {
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
  premiumCourseItem: {
    backgroundColor: '#ffe0b2',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  courseDescription: {
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
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
});

const deleteCourse = (id) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM courses WHERE id = ?', [id], () => {
      loadCourses();
    });
  });
};

export default CourseListScreen;
