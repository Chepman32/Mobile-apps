import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ResultsScreen() {
  const navigation = useNavigation();
  // Placeholder: In a real app, fetch and display high scores from local storage
  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>
      <Text style={styles.score}>1. Alice - 10</Text>
      <Text style={styles.score}>2. Bob - 8</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate('HomeScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  score: { fontSize: 20, marginBottom: 10 },
});
