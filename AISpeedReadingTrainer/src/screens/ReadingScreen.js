
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import BackgroundTimer from 'react-native-background-timer';

const db = SQLite.openDatabase(
  { name: 'speedReading.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const sampleText = "The quick brown fox jumps over the lazy dog. This is a sample text for speed reading practice. Focus on reading groups of words rather than individual words. Try to minimize subvocalization and regressions. Practice regularly to improve your reading speed and comprehension. The more you practice, the faster you will become. Remember to stay focused and relaxed during your reading sessions. Good luck with your speed reading journey!";

const ReadingScreen = ({ navigation }) => {
  const [text, setText] = useState(sampleText);
  const [wpm, setWpm] = useState(200); // Words per minute
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const words = text.split(/\s+/).filter(word => word.length > 0);

  useEffect(() => {
    if (isRunning && currentWordIndex < words.length) {
      const interval = (60 / wpm) * 1000; // Milliseconds per word
      timerRef.current = BackgroundTimer.setInterval(() => {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }, interval);
    } else if (currentWordIndex >= words.length) {
      setIsRunning(false);
      BackgroundTimer.clearInterval(timerRef.current);
      Alert.alert('Reading Complete', `You read ${words.length} words in ${Math.round(words.length / wpm * 60)} seconds.`);
      saveReadingSession(words.length, Math.round(words.length / wpm * 60));
    }
    return () => BackgroundTimer.clearInterval(timerRef.current);
  }, [isRunning, currentWordIndex, wpm, words.length]);

  const startReading = () => {
    setCurrentWordIndex(0);
    setIsRunning(true);
  };

  const pauseReading = () => {
    setIsRunning(false);
  };

  const resetReading = () => {
    setIsRunning(false);
    setCurrentWordIndex(0);
    setText(sampleText);
  };

  const saveReadingSession = (wordCount, duration) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS reading_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, wordCount INTEGER, duration INTEGER, wpm INTEGER, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO reading_sessions (wordCount, duration, wpm, timestamp) VALUES (?, ?, ?, ?)',
            [wordCount, duration, wpm, new Date().toLocaleString()],
            () => console.log('Reading session saved!'),
            (tx, error) => console.error('Error saving session', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced exercises, detailed analytics, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Speed Reading Trainer</Text>

      <Text style={styles.label}>Words Per Minute (WPM): {wpm}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={wpm.toString()}
        onChangeText={(val) => setWpm(parseInt(val) || 0)}
      />

      <View style={styles.readingArea}>
        {words.map((word, index) => (
          <Text
            key={index}
            style={[
              styles.word,
              index === currentWordIndex && styles.highlightedWord,
            ]}
          >
            {word}
          </Text>
        ))}
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startReading}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={pauseReading}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={resetReading}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.buttonText}>View Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  readingArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  word: {
    fontSize: 24,
    marginHorizontal: 2,
    lineHeight: 36,
  },
  highlightedWord: {
    backgroundColor: 'yellow',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
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
  analyticsButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ReadingScreen;
