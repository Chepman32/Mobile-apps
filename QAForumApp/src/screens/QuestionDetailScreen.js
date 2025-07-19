
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const QuestionDetailScreen = ({ route }) => {
  const { questionId } = route.params;
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswerText, setNewAnswerText] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchQuestion = async () => {
      const docRef = doc(db, 'questions', questionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuestion({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Question not found.');
      }
    };
    fetchQuestion();

    const q = query(collection(db, 'questions', questionId, 'answers'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedAnswers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnswers(loadedAnswers);
    });
    return unsubscribe;
  }, [questionId]);

  const addAnswer = async () => {
    if (!newAnswerText.trim() || !auth.currentUser || !question) return;

    try {
      await addDoc(collection(db, 'questions', question.id, 'answers'), {
        text: newAnswerText,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email, // Or display name
        upvotes: 0,
      });
      // Update answer count on the question document
      const questionRef = doc(db, 'questions', question.id);
      await updateDoc(questionRef, {
        answerCount: (question.answerCount || 0) + 1,
      });
      setNewAnswerText('');
    } catch (error) {
      console.error('Error adding answer:', error);
      Alert.alert('Error', 'Failed to add answer.');
    }
  };

  const handleUpvote = async (answerId, currentUpvotes) => {
    try {
      const answerRef = doc(db, 'questions', questionId, 'answers', answerId);
      await updateDoc(answerRef, {
        upvotes: currentUpvotes + 1,
      });
    } catch (error) {
      console.error('Error upvoting answer:', error);
      Alert.alert('Error', 'Failed to upvote answer.');
    }
  };

  const renderAnswer = ({ item }) => (
    <View style={styles.answerItem}>
      <Text style={styles.answerUser}>{item.userName}</Text>
      <Text style={styles.answerText}>{item.text}</Text>
      <View style={styles.answerFooter}>
        <Text style={styles.answerTime}>{item.createdAt?.toDate().toLocaleString()}</Text>
        <TouchableOpacity onPress={() => handleUpvote(item.id, item.upvotes)}>
          <Text style={styles.upvoteButton}>👍 {item.upvotes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!question) {
    return (
      <View style={styles.container}>
        <Text>Loading question details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.questionBody}>{question.body}</Text>
      <Text style={styles.questionAuthor}>Asked by: {question.userName} on {question.createdAt?.toDate().toLocaleString()}</Text>

      <Text style={styles.sectionTitle}>Answers ({answers.length}):</Text>
      <FlatList
        data={answers}
        keyExtractor={(item) => item.id}
        renderItem={renderAnswer}
        ListEmptyComponent={<Text style={styles.emptyText}>No answers yet. Be the first to answer!</Text>}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.answerInput}
          placeholder="Post your answer..."
          multiline
          value={newAnswerText}
          onChangeText={setNewAnswerText}
        />
        <TouchableOpacity style={styles.postAnswerButton} onPress={addAnswer}>
          <Text style={styles.buttonText}>Post Answer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  questionBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 10,
  },
  questionAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  answerItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  answerUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
  answerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  answerTime: {
    fontSize: 12,
    color: '#999',
  },
  upvoteButton: {
    padding: 5,
    backgroundColor: '#d4edda',
    borderRadius: 5,
  },
  commentInputContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  answerInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  postAnswerButton: {
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default QuestionDetailScreen;
