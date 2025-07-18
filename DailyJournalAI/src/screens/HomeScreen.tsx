import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useQuery, useRealm } from '@realm/react';
import { JournalEntry } from '../models/JournalEntry';
import { useSettings } from '../context/SettingsContext';
import { SentimentAnalysisService } from '../services/SentimentAnalysis';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const realm = useRealm();
  const { isDarkMode } = useSettings();
  const styles = getStyles(isDarkMode);
  
  const recentEntries = useQuery(
    JournalEntry,
    (entries) => entries.sorted('date', true),
    []
  ).slice(0, 3);

  const today = new Date();
  const todaysEntry = recentEntries.find(
    entry => entry.date.toDateString() === today.toDateString()
  );

  const prompts = SentimentAnalysisService.generatePrompts('Neutral');
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      'Very Positive': '😄',
      'Positive': '😊',
      'Neutral': '😐',
      'Negative': '😔',
      'Very Negative': '😢',
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good day!</Text>
        <Text style={styles.date}>{formatDate(today)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💭 Daily Prompt</Text>
        <Text style={styles.promptText}>{randomPrompt}</Text>
        <TouchableOpacity style={styles.writeButton}>
          <Text style={styles.writeButtonText}>Start Writing</Text>
        </TouchableOpacity>
      </View>

      {todaysEntry ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ Today's Entry</Text>
          <View style={styles.entryPreview}>
            <Text style={styles.entryTitle}>{todaysEntry.title}</Text>
            <Text style={styles.entryContent} numberOfLines={3}>
              {todaysEntry.content}
            </Text>
            <View style={styles.moodContainer}>
              <Text style={styles.moodEmoji}>
                {getMoodEmoji(todaysEntry.mood)}
              </Text>
              <Text style={styles.moodText}>{todaysEntry.mood}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Today's Entry</Text>
          <Text style={styles.noEntryText}>
            You haven't written today yet. How are you feeling?
          </Text>
          <TouchableOpacity style={styles.writeButton}>
            <Text style={styles.writeButtonText}>Write Entry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Recent Insights</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{recentEntries.length}</Text>
            <Text style={styles.statLabel}>Recent Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {recentEntries.length > 0 
                ? Math.round(recentEntries.reduce((acc, entry) => acc + entry.sentimentScore, 0) / recentEntries.length * 100)
                : 0}%
            </Text>
            <Text style={styles.statLabel}>Avg. Sentiment</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {recentEntries.filter(entry => 
                new Date().getTime() - entry.date.getTime() < 7 * 24 * 60 * 60 * 1000
              ).length}
            </Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
      </View>

      {recentEntries.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📚 Recent Entries</Text>
          {recentEntries.map((entry) => (
            <TouchableOpacity key={entry._id.toString()} style={styles.entryItem}>
              <View style={styles.entryItemContent}>
                <Text style={styles.entryItemTitle}>{entry.title}</Text>
                <Text style={styles.entryItemDate}>
                  {entry.date.toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.entryItemMood}>
                {getMoodEmoji(entry.mood)}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Entries</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
  },
  card: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 15,
  },
  promptText: {
    fontSize: 16,
    color: isDarkMode ? '#e9ecef' : '#495057',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 15,
  },
  writeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  writeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  entryPreview: {
    padding: 15,
    backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
    borderRadius: 10,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 14,
    color: isDarkMode ? '#e9ecef' : '#495057',
    lineHeight: 20,
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodText: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    fontWeight: '500',
  },
  noEntryText: {
    fontSize: 16,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    textAlign: 'center',
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#404040' : '#e9ecef',
  },
  entryItemContent: {
    flex: 1,
  },
  entryItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 4,
  },
  entryItemDate: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
  },
  entryItemMood: {
    fontSize: 20,
  },
  viewAllButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
});