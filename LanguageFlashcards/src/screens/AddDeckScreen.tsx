import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

const AddDeckScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>Add Deck Screen</Text>
          <Text variant="bodyMedium" style={styles.description}>Create new flashcard deck</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', padding: 16 },
  card: { elevation: 2 },
  title: { fontWeight: 'bold', marginBottom: 8 },
  description: { color: '#6b7280' },
});

export default AddDeckScreen; 