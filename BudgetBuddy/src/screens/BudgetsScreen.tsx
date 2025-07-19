import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function BudgetsScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Budgets Screen
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            🚧 Screen to be implemented using established patterns.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 16 },
  title: { marginBottom: 8 },
  description: { opacity: 0.7 },
});
