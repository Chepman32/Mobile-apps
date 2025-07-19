
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'learningPath.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CourseDetailScreen = ({ route }) => {
  const { courseId, courseTitle } = route.params;
  const [course, setCourse] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM courses WHERE id = ?',
        [courseId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setCourse(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching course', error)
      );
    });
  }, [courseId]);

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Loading course details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.courseTitle}>{course.title}</Text>
      <Text style={styles.courseDescription}>{course.description}</Text>

      <Text style={styles.sectionTitle}>Course Content (Conceptual):</Text>
      <Text style={styles.sectionContent}>
        This is where the actual course material would be displayed.
        For a real app, this could include text, images, videos, and interactive elements.
        All content would be stored offline.
      </Text>

      {course.isPremium && (
        <Text style={styles.premiumFeatureText}>This is a premium course. Access to advanced content and features.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  courseDescription: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  premiumFeatureText: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
});

export default CourseDetailScreen;
