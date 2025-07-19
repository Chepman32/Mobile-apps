import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Text, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          <Icon name="cog" size={64} color={theme.colors.primary} />
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            Settings & Preferences
          </Title>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            This screen will allow you to customize your habit tracking experience.
          </Text>
          
          <View style={styles.featureList}>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Theme selection (light/dark/auto)
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Notification preferences and timing
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Daily reminder settings
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Data backup and sync options
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Privacy and security settings
            </Text>
            <Text style={[styles.featureItem, { color: theme.colors.onSurface }]}>
              • Export/import data functionality
            </Text>
          </View>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => console.log('Settings screen functionality coming soon!')}
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