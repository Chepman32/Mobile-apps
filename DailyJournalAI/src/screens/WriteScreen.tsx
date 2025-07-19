import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRealm } from '@realm/react';
import { BSON } from 'realm';
import { JournalEntry } from '../models/JournalEntry';
import { useSettings } from '../context/SettingsContext';
import { SentimentAnalysisService } from '../services/SentimentAnalysis';
import { trigger } from 'react-native-haptic-feedback';

export const WriteScreen: React.FC = () => {
  const realm = useRealm();
  const { isDarkMode, enableHapticFeedback, autoAnalyze } = useSettings();
  const styles = getStyles(isDarkMode);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentMood, setCurrentMood] = useState('Neutral');
  const [currentScore, setCurrentScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (autoAnalyze && content.length > 10) {
      setIsAnalyzing(true);
      const timeoutId = setTimeout(() => {
        const analysis = SentimentAnalysisService.analyzeSentiment(content);
        setCurrentMood(analysis.mood);
        setCurrentScore(analysis.score);
        setSuggestions(SentimentAnalysisService.generatePrompts(analysis.mood));
        setIsAnalyzing(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [content, autoAnalyze]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please add both a title and content for your entry.');
      return;
    }

    try {
      const analysis = SentimentAnalysisService.analyzeSentiment(content);
      
      realm.write(() => {
        realm.create('JournalEntry', {
          _id: new BSON.ObjectId(),
          title: title.trim(),
          content: content.trim(),
          date: new Date(),
          mood: analysis.mood,
          sentimentScore: analysis.score,
          tags: extractTags(content),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      if (enableHapticFeedback) {
        trigger('impactMedium');
      }

      Alert.alert(
        'Entry Saved! ✨',
        `Your journal entry has been saved with a ${analysis.mood.toLowerCase()} sentiment.`,
        [
          {
            text: 'Write Another',
            onPress: () => {
              setTitle('');
              setContent('');
              setCurrentMood('Neutral');
              setCurrentScore(0);
              setSuggestions([]);
            },
          },
          {
            text: 'Done',
            style: 'default',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
      console.error('Save error:', error);
    }
  };

  const extractTags = (text: string): string[] => {
    // Simple tag extraction based on keywords
    const keywords = [
      'work', 'family', 'friends', 'health', 'exercise', 'travel', 'food',
      'love', 'stress', 'anxiety', 'happiness', 'sadness', 'anger', 'fear',
      'gratitude', 'achievement', 'goal', 'dream', 'challenge', 'success'
    ];
    
    const lowerText = text.toLowerCase();
    return keywords.filter(keyword => lowerText.includes(keyword));
  };

  const insertSuggestion = (suggestion: string) => {
    setContent(prev => prev + '\n\n' + suggestion + '\n');
    if (enableHapticFeedback) {
      trigger('impactLight');
    }
  };

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      'Very Positive': '#28a745',
      'Positive': '#20c997',
      'Neutral': '#6c757d',
      'Negative': '#ffc107',
      'Very Negative': '#dc3545',
    };
    return colors[mood] || '#6c757d';
  };

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

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✍️ New Journal Entry</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="What's on your mind today?"
            placeholderTextColor={isDarkMode ? '#adb5bd' : '#6c757d'}
            value={title}
            onChangeText={setTitle}
            multiline={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.contentInput}
            placeholder="Start writing your thoughts..."
            placeholderTextColor={isDarkMode ? '#adb5bd' : '#6c757d'}
            value={content}
            onChangeText={setContent}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {content.length > 10 && (
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>🤖 Real-time Analysis</Text>
            <View style={styles.moodDisplay}>
              <Text style={styles.moodEmoji}>{getMoodEmoji(currentMood)}</Text>
              <View style={styles.moodInfo}>
                <Text style={styles.moodText}>{currentMood}</Text>
                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreIndicator, 
                      { 
                        backgroundColor: getMoodColor(currentMood),
                        width: `${Math.abs(currentScore) * 100}%`,
                        alignSelf: currentScore >= 0 ? 'flex-end' : 'flex-start'
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
            {isAnalyzing && (
              <Text style={styles.analyzingText}>Analyzing sentiment...</Text>
            )}
          </View>
        )}

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>💡 Writing Prompts</Text>
            {suggestions.slice(0, 2).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => insertSuggestion(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
                <Text style={styles.addIcon}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Save Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
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
  headerDate: {
    fontSize: 16,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  titleInput: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
  },
  contentInput: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDarkMode ? '#ffffff' : '#212529',
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
    minHeight: 200,
    lineHeight: 24,
  },
  analysisContainer: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 12,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  moodInfo: {
    flex: 1,
  },
  moodText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 8,
  },
  scoreBar: {
    height: 6,
    backgroundColor: isDarkMode ? '#404040' : '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreIndicator: {
    height: '100%',
    borderRadius: 3,
  },
  analyzingText: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    fontStyle: 'italic',
    marginTop: 8,
  },
  suggestionsContainer: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: isDarkMode ? '#e9ecef' : '#495057',
    fontStyle: 'italic',
  },
  addIcon: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: 'bold',
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});