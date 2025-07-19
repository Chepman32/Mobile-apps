import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddHabitScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          <Icon name="plus-circle" size={64} color={theme.colors.primary} />
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            Add New Habit
          </Title>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            This screen will provide a comprehensive habit creation form with templates and smart suggestions.
          </Text>
          
          <View style={styles.featureList}>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Choose from popular habit templates
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Set frequency (daily, weekly, custom)
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Select category and difficulty level
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Configure reminders and notifications
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Add custom icons and colors
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Set target counts and goals
            </Text>
          </View>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => console.log('Add habit screen functionality coming soon!')}
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