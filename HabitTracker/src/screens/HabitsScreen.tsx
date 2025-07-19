import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HabitsScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          <Icon name="clipboard-check" size={64} color={theme.colors.primary} />
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            Habits Management
          </Title>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            This screen will display all your habits with advanced filtering, sorting, and management features.
          </Text>
          
          <View style={styles.featureList}>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • View all active and inactive habits
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Filter by category, difficulty, frequency
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Search habits by name or tags
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Quick complete/incomplete actions
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Bulk operations (archive, delete)
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Sort by streak, completion rate, creation date
            </Text>
          </View>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => console.log('Habits screen functionality coming soon!')}
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
  featureList: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  featureItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
  },
}); 