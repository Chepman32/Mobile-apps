import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            📋 Complete Task List
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Advanced task management with filtering, sorting, and bulk operations.
          </Text>
          <Text variant="bodySmall" style={styles.status}>
            🚧 Screen to be implemented using established patterns
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    opacity: 0.7,
  },
  status: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
}); 