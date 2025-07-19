import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Title, Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HabitDetailScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          <Icon name="clipboard-text" size={64} color={theme.colors.primary} />
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            Habit Details
          </Title>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            This screen will show detailed information about a specific habit with charts and history.
          </Text>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => console.log('Habit detail screen functionality coming soon!')}
          >
            Coming Soon
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    marginTop: 16,
  },
}); 