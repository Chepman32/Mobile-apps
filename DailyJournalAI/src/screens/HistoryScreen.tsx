import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useQuery, useRealm } from '@realm/react';
import { JournalEntry } from '../models/JournalEntry';
import { useSettings } from '../context/SettingsContext';

export const HistoryScreen: React.FC = () => {
  const realm = useRealm();
  const { isDarkMode } = useSettings();
  const styles = getStyles(isDarkMode);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const allEntries = useQuery(
    JournalEntry,
    (entries) => entries.sorted('date', true),
    []
  );

  const filteredEntries = allEntries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMood = selectedMood === null || entry.mood === selectedMood;
    
    return matchesSearch && matchesMood;
  });

  const moods = ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'];

  const getMoodEmoji = (mood: string) => {
    const emojis: { [key: string]: string } = {
      'Very Positive': '😄',
      'Positive': '😊',
      'Neutral': '😐',
      'Negative': '😔',
      'Very Negative': '😢',
    };
    return emojis[mood] || '😐';
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            realm.write(() => {
              realm.delete(entry);
            });
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Journal History</Text>
        <Text style={styles.headerSubtitle}>
          {filteredEntries.length} of {allEntries.length} entries
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search entries..."
          placeholderTextColor={isDarkMode ? '#adb5bd' : '#6c757d'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.moodFilters}
        contentContainerStyle={styles.moodFiltersContent}
      >
        <TouchableOpacity
          style={[
            styles.moodFilter,
            selectedMood === null && styles.activeMoodFilter
          ]}
          onPress={() => setSelectedMood(null)}
        >
          <Text style={[
            styles.moodFilterText,
            selectedMood === null && styles.activeMoodFilterText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodFilter,
              selectedMood === mood && styles.activeMoodFilter
            ]}
            onPress={() => setSelectedMood(selectedMood === mood ? null : mood)}
          >
            <Text style={styles.moodFilterEmoji}>{getMoodEmoji(mood)}</Text>
            <Text style={[
              styles.moodFilterText,
              selectedMood === mood && styles.activeMoodFilterText
            ]}>
              {mood}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {searchQuery || selectedMood ? 'No matching entries' : 'No entries yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedMood 
                ? 'Try adjusting your search or filter criteria'
                : 'Start writing your first journal entry!'
              }
            </Text>
          </View>
        ) : (
          filteredEntries.map((entry) => (
            <TouchableOpacity
              key={entry._id.toString()}
              style={styles.entryCard}
              onLongPress={() => handleDeleteEntry(entry)}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleContainer}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryDate}>
                    {formatDate(entry.date)} • {getTimeAgo(entry.date)}
                  </Text>
                </View>
                <Text style={styles.entryMood}>{getMoodEmoji(entry.mood)}</Text>
              </View>
              
              <Text style={styles.entryContent} numberOfLines={3}>
                {entry.content}
              </Text>
              
              {entry.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {entry.tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                  {entry.tags.length > 3 && (
                    <Text style={styles.moreTagsText}>
                      +{entry.tags.length - 3} more
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: isDarkMode ? '#ffffff' : '#212529',
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
  },
  moodFilters: {
    marginBottom: 15,
  },
  moodFiltersContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  moodFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
  },
  activeMoodFilter: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  moodFilterEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  moodFilterText: {
    fontSize: 14,
    color: isDarkMode ? '#ffffff' : '#212529',
    fontWeight: '500',
  },
  activeMoodFilterText: {
    color: '#ffffff',
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  entryCard: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
  },
  entryMood: {
    fontSize: 24,
  },
  entryContent: {
    fontSize: 14,
    color: isDarkMode ? '#e9ecef' : '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: isDarkMode ? '#404040' : '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    fontStyle: 'italic',
  },
});