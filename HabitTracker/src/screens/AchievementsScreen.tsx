import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Title, Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AchievementsScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          <Icon name="trophy" size={64} color={theme.colors.primary} />
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            Achievements
          </Title>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            This screen will display all your unlocked achievements and progress towards new ones.
          </Text>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => console.log('Achievements screen functionality coming soon!')}
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