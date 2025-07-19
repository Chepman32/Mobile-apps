
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import QRCode from 'react-native-qrcode-svg';

const CreateSurveyScreen = ({ navigation }) => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [generatedSurveyId, setGeneratedSurveyId] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  const addQuestion = () => {
    if (questionText.trim() === '') {
      Alert.alert('Error', 'Question text cannot be empty.');
      return;
    }
    setQuestions([...questions, { text: questionText, type: 'text' }]); // Simple text question for now
    setQuestionText('');
  };

  const handleCreateSurvey = async () => {
    if (!surveyTitle.trim() || questions.length === 0) {
      Alert.alert('Error', 'Please enter a survey title and add at least one question.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'surveys'), {
        title: surveyTitle,
        questions: questions,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        responseCount: 0,
      });
      setGeneratedSurveyId(docRef.id);
      Alert.alert('Success', 'Survey created successfully!');
    } catch (error) {
      console.error('Error creating survey:', error);
      Alert.alert('Error', 'Failed to create survey.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Survey Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Customer Satisfaction Survey"
        value={surveyTitle}
        onChangeText={setSurveyTitle}
      />

      <Text style={styles.label}>Add Questions:</Text>
      <TextInput
        style={styles.input}
        placeholder="Question text (e.g., How satisfied are you?)"
        value={questionText}
        onChangeText={setQuestionText}
      />
      <TouchableOpacity style={styles.addQuestionButton} onPress={addQuestion}>
        <Text style={styles.buttonText}>Add Question</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Current Questions:</Text>
      {questions.length > 0 ? (
        questions.map((q, index) => (
          <Text key={index} style={styles.questionItem}>• {q.text}</Text>
        ))
      ) : (
        <Text style={styles.emptyText}>No questions added yet.</Text>
      )}

      <TouchableOpacity style={styles.createSurveyButton} onPress={handleCreateSurvey}>
        <Text style={styles.buttonText}>Create Survey</Text>
      </TouchableOpacity>

      {generatedSurveyId && (
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodeText}>Share this QR code for your survey:</Text>
          <QRCode value={generatedSurveyId} size={200} />
          <Text style={styles.surveyIdText}>Survey ID: {generatedSurveyId}</Text>
        </View>
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
  addQuestionButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  questionItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  createSurveyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  surveyIdText: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
  },
});

export default CreateSurveyScreen;
