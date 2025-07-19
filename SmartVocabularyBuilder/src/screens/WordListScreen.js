
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Tts from 'react-native-tts';

const db = SQLite.openDatabase(
  { name: 'vocabularyBuilder.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const WordListScreen = ({ navigation }) => {
  const [words, setWords] = useState([]);

  const loadWords = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, definition TEXT, example TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM words',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyWords = [
                  { word: 'Ephemeral', definition: 'Lasting for a very short time.', example: 'Fashion trends are often ephemeral.', isPremium: 0 },
                  { word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', example: 'Coffee shops are ubiquitous in the city.', isPremium: 0 },
                  { word: 'Serendipity', definition: 'The occurrence and development of events by chance in a happy or beneficial way.', example: 'Finding money on the street was pure serendipity.', isPremium: 1 },
                ];
                dummyWords.forEach(w => {
                  tx.executeSql(
                    'INSERT INTO words (word, definition, example, isPremium) VALUES (?, ?, ?, ?)',
                    [w.word, w.definition, w.example, w.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting word', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM words',
                [],
                (_, { rows: allRows }) => {
                  const loadedWords = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedWords.push(allRows.item(i));
                  }
                  setWords(loadedWords);
                },
                (tx, error) => console.error('Error fetching words', error)
              );
            },
            (tx, error) => console.error('Error checking words', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadWords();
    const unsubscribe = navigation.addListener('focus', () => {
      loadWords();
    });
    return unsubscribe;
  }, [navigation, loadWords]);

  const speakWord = (text) => {
    Tts.speak(text);
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium word lists, advanced games, etc.'
    );
  };

  const renderWordItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.wordItem, item.isPremium ? styles.premiumWordItem : null]}
      onPress={() => speakWord(item.word)}
    >
      <View>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.definitionText}>{item.definition}</Text>
      </View>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWordItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No words found.</Text>}
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
  wordItem: {
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
  premiumWordItem: {
    backgroundColor: '#ffe0b2',
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  definitionText: {
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

export default WordListScreen;
