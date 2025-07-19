
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AskQuestionScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  const handleAskQuestion = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please enter both title and body for your question.');
      return;
    }

    try {
      await addDoc(collection(db, 'questions'), {
        title: title,
        body: body,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email, // Or display name
        answerCount: 0,
      });
      Alert.alert('Success', 'Question posted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting question:', error);
      Alert.alert('Error', 'Failed to post question.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Question Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., How to center a div in CSS?"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Question Details:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Provide more details about your question..."
        multiline
        value={body}
        onChangeText={setBody}
      />

      <TouchableOpacity style={styles.button} onPress={handleAskQuestion}>
        <Text style={styles.buttonText}>Ask Question</Text>
      </TouchableOpacity>
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
});

export default AskQuestionScreen;
