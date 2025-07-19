
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'examSimulator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ExamListScreen = ({ navigation }) => {
  const [exams, setExams] = useState([]);

  const loadExams = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS exams (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, questions TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM exams',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyExams = [
                  { title: 'Math Basics', questions: JSON.stringify([
                    { id: 'q1', question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' },
                    { id: 'q2', question: 'What is 5 * 3?', options: ['10', '15', '20'], answer: '15' }
                  ]), isPremium: 0 },
                  { title: 'Science Fundamentals', questions: JSON.stringify([
                    { id: 'q3', question: 'What is H2O?', options: ['Oxygen', 'Water', 'Carbon Dioxide'], answer: 'Water' }
                  ]), isPremium: 0 },
                  { title: 'Advanced Physics', questions: JSON.stringify([
                    { id: 'q4', question: 'What is the theory of relativity?', options: ['E=mc^2', 'F=ma', 'V=IR'], answer: 'E=mc^2' }
                  ]), isPremium: 1 },
                ];
                dummyExams.forEach(exam => {
                  tx.executeSql(
                    'INSERT INTO exams (title, questions, isPremium) VALUES (?, ?, ?)',
                    [exam.title, exam.questions, exam.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting exam', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM exams',
                [],
                (_, { rows: allRows }) => {
                  const loadedExams = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedExams.push({ ...allRows.item(i), questions: JSON.parse(allRows.item(i).questions) });
                  }
                  setExams(loadedExams);
                },
                (tx, error) => console.error('Error fetching exams', error)
              );
            },
            (tx, error) => console.error('Error checking exams', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadExams();
    const unsubscribe = navigation.addListener('focus', () => {
      loadExams();
    });
    return unsubscribe;
  }, [navigation, loadExams]);

  const handleExamPress = (exam) => {
    if (exam.isPremium) {
      Alert.alert(
        'Premium Exam',
        'This exam is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('Exam', { examId: exam.id, examTitle: exam.title });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium question banks, detailed analytics, etc.'
    );
  };

  const renderExamItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.examItem, item.isPremium ? styles.premiumExamItem : null]}
      onPress={() => handleExamPress(item)}
    >
      <Text style={styles.examTitle}>{item.title}</Text>
      <Text style={styles.examQuestions}>{item.questions.length} questions</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExamItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No exams found.</Text>}
      />
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
  examItem: {
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
  premiumExamItem: {
    backgroundColor: '#ffe0b2',
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  examQuestions: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
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

export default ExamListScreen;
