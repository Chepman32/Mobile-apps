
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const QuestionListScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedQuestions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(loadedQuestions);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.questionItem}
      onPress={() => navigation.navigate('QuestionDetail', { questionId: item.id, questionTitle: item.title })}
    >
      <Text style={styles.questionTitle}>{item.title}</Text>
      <Text style={styles.questionAuthor}>Asked by: {item.userName}</Text>
      <Text style={styles.questionAnswers}>{item.answerCount || 0} answers</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestionItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No questions yet. Be the first to ask!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AskQuestion')}>
        <Text style={styles.buttonText}>Ask a Question</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
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
  questionItem: {
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
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  questionAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  questionAnswers: {
    fontSize: 14,
    color: '#007bff',
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
  logoutButton: {
    backgroundColor: '#dc3545',
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

export default QuestionListScreen;
