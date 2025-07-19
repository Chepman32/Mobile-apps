
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Tts from 'react-native-tts';

const db = SQLite.openDatabase(
  { name: 'vocabularyBuilder.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PracticeScreen = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);

  const loadWordsForPractice = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM words ORDER BY RANDOM() LIMIT 10', // Get 10 random words for practice
        [],
        (_, { rows }) => {
          const loadedWords = [];
          for (let i = 0; i < rows.length; i++) {
            loadedWords.push(rows.item(i));
          }
          setWords(loadedWords);
          setCurrentWordIndex(0);
          setShowDefinition(false);
        },
        (tx, error) => console.error('Error fetching words for practice', error)
      );
    });
  }, []);

  useEffect(() => {
    loadWordsForPractice();
  }, [loadWordsForPractice]);

  const speakWord = (text) => {
    Tts.speak(text);
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowDefinition(false);
    } else {
      Alert.alert('Practice Complete', 'You have completed this practice session!');
      loadWordsForPractice(); // Start a new session
    }
  };

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading words for practice...</Text>
      </View>
    );
  }

  const currentWord = words[currentWordIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={() => setShowDefinition(!showDefinition)}>
        <Text style={styles.wordText}>{currentWord.word}</Text>
        {showDefinition && (
          <View>
            <Text style={styles.definitionText}>{currentWord.definition}</Text>
            <Text style={styles.exampleText}>Example: {currentWord.example}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => speakWord(currentWord.word)}>
          <Text style={styles.buttonText}>Speak Word</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextWord}>
          <Text style={styles.buttonText}>Next Word</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  card: {
    width: '90%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  definitionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  exampleText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PracticeScreen;
