
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getRealm } from '../services/realm';

const CreateFlashcardScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await getRealm();
        setRealm(newRealm);
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  const handleCreateFlashcard = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Error', 'Please enter both question and answer.');
      return;
    }

    if (realm) {
      realm.write(() => {
        realm.create('Flashcard', {
          _id: new Realm.BSON.ObjectId(),
          question: question,
          answer: answer,
          interval: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString().split('T')[0],
          deckId: new Realm.BSON.ObjectId(deckId),
        });
      });
      Alert.alert('Success', 'Flashcard added successfully!');
      navigation.goBack();
    }
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered flashcard generation from study material. (Conceptual)'
    );
    // In a real app, an AI model would generate flashcards based on input text.
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Question:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter question..."
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      <Text style={styles.label}>Answer:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter answer..."
        value={answer}
        onChangeText={setAnswer}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateFlashcard}>
        <Text style={styles.buttonText}>Create Flashcard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiButton} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>Generate with AI</Text>
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
  aiButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default CreateFlashcardScreen;
