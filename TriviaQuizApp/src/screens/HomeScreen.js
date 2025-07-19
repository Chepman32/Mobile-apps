
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import questionsData from '../data/questions.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState([]);

  const loadQuizzes = useCallback(async () => {
    try {
      const unlockedQuizzes = await AsyncStorage.getItem('unlockedQuizzes');
      let updatedQuizzes = questionsData.quizzes.map(quiz => ({
        ...quiz,
        locked: quiz.locked && !(unlockedQuizzes && JSON.parse(unlockedQuizzes).includes(quiz.id))
      }));
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
      setQuizzes(questionsData.quizzes); // Fallback to default
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
    const unsubscribe = navigation.addListener('focus', () => {
      loadQuizzes();
    });
    return unsubscribe;
  }, [navigation, loadQuizzes]);

  const handleQuizPress = (quiz) => {
    if (quiz.locked) {
      Alert.alert(
        'Quiz Locked',
        'This quiz pack is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseQuizPack() },
        ]
      );
    } else {
      navigation.navigate('Quiz', { quizId: quiz.id });
    }
  };

  const purchaseQuizPack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Quiz Pack',
      'In a real app, this would initiate an in-app purchase for a quiz pack.'
    );
    // For demonstration, let's unlock all locked quizzes
    const newUnlockedQuizzes = questionsData.quizzes.filter(q => q.locked).map(q => q.id);
    AsyncStorage.getItem('unlockedQuizzes').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...newUnlockedQuizzes])];
      AsyncStorage.setItem('unlockedQuizzes', JSON.stringify(combinedUnlocked));
      loadQuizzes(); // Reload quizzes to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.quizItem, item.locked && styles.lockedQuizItem]}
            onPress={() => handleQuizPress(item)}
          >
            <Text style={styles.quizName}>{item.name}</Text>
            {item.locked && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No quizzes found.</Text>}
      />
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseQuizPack}>
        <Text style={styles.buttonText}>Unlock Premium Quiz Packs</Text>
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
  quizItem: {
    padding: 20,
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
  lockedQuizItem: {
    backgroundColor: '#e0e0e0',
  },
  quizName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lockedText: {
    color: '#888',
    fontSize: 14,
  },
  purchaseButton: {
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

export default HomeScreen;
