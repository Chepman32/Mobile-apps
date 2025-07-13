import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Trivia Game</Text>
      <Button title="Start Game" onPress={() => navigation.navigate('GameScreen')} />
      <Button title="High Scores" onPress={() => navigation.navigate('ResultsScreen')} />
      <Button title="Store" onPress={() => navigation.navigate('StoreScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
});
