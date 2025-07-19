
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const db = SQLite.openDatabase(
  { name: 'languageTutor.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const LessonScreen = ({ navigation }) => {
  const [lessons, setLessons] = useState([]);

  const loadLessons = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM lessons',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyLessons = [
                  { title: 'Greetings', content: 'Learn basic greetings in Spanish.', isPremium: 0 },
                  { title: 'Travel Phrases', content: 'Essential phrases for traveling.', isPremium: 0 },
                  { title: 'Advanced Grammar', content: 'Deep dive into Spanish grammar.', isPremium: 1 },
                ];
                dummyLessons.forEach(lesson => {
                  tx.executeSql(
                    'INSERT INTO lessons (title, content, isPremium) VALUES (?, ?, ?)',
                    [lesson.title, lesson.content, lesson.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting lesson', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM lessons',
                [],
                (_, { rows: allRows }) => {
                  const loadedLessons = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedLessons.push(allRows.item(i));
                  }
                  setLessons(loadedLessons);
                },
                (tx, error) => console.error('Error fetching lessons', error)
              );
            },
            (tx, error) => console.error('Error checking lessons', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const handleLessonPress = (lesson) => {
    if (lesson.isPremium) {
      Alert.alert(
        'Premium Lesson',
        'This lesson is part of a premium language pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Lesson Content', lesson.content);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium language packs, advanced AI coaching, etc.'
    );
  };

  const renderLessonItem = ({ item }) => (
    <Card style={styles.card} onPress={() => handleLessonPress(item)}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>{item.content}</Paragraph>
        {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLessonItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No lessons found.</Text>}
      />
      <Button mode="contained" onPress={purchasePremium} style={styles.premiumButton}>
        Unlock Premium Packs
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  card: {
    marginBottom: 10,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
    marginTop: 5,
  },
  premiumButton: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default LessonScreen;
