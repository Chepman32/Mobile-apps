
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CreatePollScreen = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  const handleCreatePoll = async () => {
    if (!question.trim() || !option1.trim() || !option2.trim()) {
      Alert.alert('Error', 'Please enter a question and at least two options.');
      return;
    }

    const options = [
      option1.trim(),
      option2.trim(),
      option3.trim(),
      option4.trim(),
    ].filter(opt => opt !== '');

    if (options.length < 2) {
      Alert.alert('Error', 'Please provide at least two valid options.');
      return;
    }

    try {
      await addDoc(collection(db, 'polls'), {
        question: question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.email, // Or display name
        votedUsers: [], // To track who voted
      });
      Alert.alert('Success', 'Poll created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating poll:', error);
      Alert.alert('Error', 'Failed to create poll.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Poll Question:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., What's your favorite color?"
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      <Text style={styles.label}>Options (at least 2 required):</Text>
      <TextInput
        style={styles.input}
        placeholder="Option 1"
        value={option1}
        onChangeText={setOption1}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 2"
        value={option2}
        onChangeText={setOption2}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 3 (Optional)"
        value={option3}
        onChangeText={setOption3}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 4 (Optional)"
        value={option4}
        onChangeText={setOption4}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreatePoll}>
        <Text style={styles.buttonText}>Create Poll</Text>
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

export default CreatePollScreen;
