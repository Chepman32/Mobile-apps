
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [streak, setStreak] = useState(0);

  const loadStreak = useCallback(async () => {
    try {
      const storedStreak = await AsyncStorage.getItem('quizStreak');
      if (storedStreak) {
        setStreak(parseInt(storedStreak));
      }
    } catch (error) {
      console.error('Failed to load streak:', error);
    }
  }, []);

  useEffect(() => {
    loadStreak();
    const unsubscribe = navigation.addListener('focus', () => {
      loadStreak();
    });
    return unsubscribe;
  }, [navigation, loadStreak]);

  const startQuiz = () => {
    navigation.navigate('Quiz');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium lesson packs, ad-free experience, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Learning Quiz</Text>
      <Text style={styles.streakText}>Current Streak: {streak} 🔥</Text>

      <TouchableOpacity style={styles.button} onPress={startQuiz}>
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  streakText: {
    fontSize: 20,
    marginBottom: 40,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default HomeScreen;
