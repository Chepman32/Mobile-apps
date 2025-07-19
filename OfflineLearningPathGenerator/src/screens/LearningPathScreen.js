
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'learningPath.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const LearningPathScreen = ({ navigation }) => {
  const [learningPath, setLearningPath] = useState([]);

  const generateLearningPath = useCallback(() => {
    // This is a conceptual AI-powered learning path generation.
    // In a real app, an AI would analyze user goals and progress to create a path.
    const dummyPath = [
      { id: '1', title: 'Introduction to Programming', description: 'Learn the basics of coding.', isPremium: 0 },
      { id: '2', title: 'Data Structures and Algorithms', description: 'Understand fundamental concepts.', isPremium: 0 },
      { id: '3', title: 'Advanced AI Concepts', description: 'Dive deep into AI models.', isPremium: 1 },
    ];

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM courses',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                dummyPath.forEach(course => {
                  tx.executeSql(
                    'INSERT INTO courses (title, description, isPremium) VALUES (?, ?, ?)',
                    [course.title, course.description, course.isPremium],
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
                  setLearningPath(loadedCourses);
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
    generateLearningPath();
  }, [generateLearningPath]);

  const handleCoursePress = (course) => {
    if (course.isPremium) {
      Alert.alert(
        'Premium Course',
        'This course is part of a premium learning path. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('CourseDetail', { courseId: course.id, courseTitle: course.title });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced learning paths, detailed analytics, etc.'
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Personalized Learning Path</Text>
      <FlatList
        data={learningPath}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCourseItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Generating your learning path...</Text>}
      />
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Paths</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  courseItem: {
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
    marginTop: 5,
  },
  premiumButton: {
    backgroundColor: '#28a745',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default LearningPathScreen;
