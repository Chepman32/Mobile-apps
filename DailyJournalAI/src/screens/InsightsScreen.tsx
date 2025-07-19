import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useQuery } from '@realm/react';
import { JournalEntry } from '../models/JournalEntry';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

export const InsightsScreen: React.FC = () => {
  const { isDarkMode } = useSettings();
  const styles = getStyles(isDarkMode);
  
  const allEntries = useQuery(
    JournalEntry,
    (entries) => entries.sorted('date', true),
    []
  );

  const insights = useMemo(() => {
    if (allEntries.length === 0) return null;

    const now = new Date();
    const last30Days = allEntries.filter(entry => 
      (now.getTime() - entry.date.getTime()) / (1000 * 60 * 60 * 24) <= 30
    );
    const last7Days = allEntries.filter(entry => 
      (now.getTime() - entry.date.getTime()) / (1000 * 60 * 60 * 24) <= 7
    );

    // Mood distribution
    const moodCounts = {
      'Very Positive': 0,
      'Positive': 0,
      'Neutral': 0,
      'Negative': 0,
      'Very Negative': 0,
    };

    allEntries.forEach(entry => {
      moodCounts[entry.mood as keyof typeof moodCounts]++;
    });

    // Average sentiment over time
    const avgSentiment = allEntries.reduce((sum, entry) => sum + entry.sentimentScore, 0) / allEntries.length;
    const avgSentiment30Days = last30Days.length > 0 
      ? last30Days.reduce((sum, entry) => sum + entry.sentimentScore, 0) / last30Days.length 
      : 0;
    const avgSentiment7Days = last7Days.length > 0 
      ? last7Days.reduce((sum, entry) => sum + entry.sentimentScore, 0) / last7Days.length 
      : 0;

    // Most common tags
    const tagCounts: { [key: string]: number } = {};
    allEntries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Longest streak
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;

    const sortedEntries = [...allEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    sortedEntries.forEach(entry => {
      if (lastDate) {
        const daysDiff = Math.floor((entry.date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = entry.date;
    });
    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      totalEntries: allEntries.length,
      entriesLast30Days: last30Days.length,
      entriesLast7Days: last7Days.length,
      avgSentiment,
      avgSentiment30Days,
      avgSentiment7Days,
      moodCounts,
      topTags,
      longestStreak,
      currentStreak: getCurrentStreak(allEntries),
    };
  }, [allEntries]);

  const getCurrentStreak = (entries: typeof allEntries) => {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
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

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return '#28a745';
    if (score > 0.1) return '#20c997';
    if (score > -0.1) return '#6c757d';
    if (score > -0.3) return '#ffc107';
    return '#dc3545';
  };

  const formatSentimentScore = (score: number) => {
    return `${score >= 0 ? '+' : ''}${(score * 100).toFixed(1)}%`;
  };

  if (!insights) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💡 Insights</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No insights yet</Text>
          <Text style={styles.emptyStateText}>
            Start writing journal entries to see your patterns and insights!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💡 Insights</Text>
        <Text style={styles.headerSubtitle}>
          Your journaling patterns and trends
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{insights.totalEntries}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{insights.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{insights.longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{insights.entriesLast7Days}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Sentiment Trends</Text>
        <View style={styles.sentimentRow}>
          <Text style={styles.sentimentLabel}>Overall Average:</Text>
          <Text style={[
            styles.sentimentValue,
            { color: getSentimentColor(insights.avgSentiment) }
          ]}>
            {formatSentimentScore(insights.avgSentiment)}
          </Text>
        </View>
        <View style={styles.sentimentRow}>
          <Text style={styles.sentimentLabel}>Last 30 Days:</Text>
          <Text style={[
            styles.sentimentValue,
            { color: getSentimentColor(insights.avgSentiment30Days) }
          ]}>
            {formatSentimentScore(insights.avgSentiment30Days)}
          </Text>
        </View>
        <View style={styles.sentimentRow}>
          <Text style={styles.sentimentLabel}>Last 7 Days:</Text>
          <Text style={[
            styles.sentimentValue,
            { color: getSentimentColor(insights.avgSentiment7Days) }
          ]}>
            {formatSentimentScore(insights.avgSentiment7Days)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>😊 Mood Distribution</Text>
        {Object.entries(insights.moodCounts).map(([mood, count]) => {
          const percentage = (count / insights.totalEntries) * 100;
          return (
            <View key={mood} style={styles.moodRow}>
              <View style={styles.moodInfo}>
                <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                <Text style={styles.moodLabel}>{mood}</Text>
              </View>
              <View style={styles.moodBarContainer}>
                <View style={styles.moodBar}>
                  <View 
                    style={[
                      styles.moodBarFill,
                      { 
                        width: `${percentage}%`,
                        backgroundColor: getSentimentColor(
                          mood === 'Very Positive' ? 0.8 :
                          mood === 'Positive' ? 0.4 :
                          mood === 'Neutral' ? 0 :
                          mood === 'Negative' ? -0.4 : -0.8
                        )
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.moodPercentage}>{count}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {insights.topTags.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>#️⃣ Most Common Themes</Text>
          <View style={styles.tagsContainer}>
            {insights.topTags.map(([tag, count]) => (
              <View key={tag} style={styles.tagItem}>
                <Text style={styles.tagText}>#{tag}</Text>
                <Text style={styles.tagCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Recent Activity</Text>
        <Text style={styles.activityText}>
          You've written {insights.entriesLast7Days} entries in the last week
          {insights.entriesLast7Days > 0 && (
            <Text style={styles.encouragement}>
              {insights.entriesLast7Days >= 5 
                ? " - Great consistency! 🎉"
                : insights.entriesLast7Days >= 3
                ? " - You're doing well! 👍"
                : " - Try to write more regularly! 💪"
              }
            </Text>
          )}
        </Text>
        {insights.currentStreak > 0 && (
          <Text style={styles.streakText}>
            🔥 You're on a {insights.currentStreak}-day writing streak!
          </Text>
        )}
      </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 5,
    width: (width - 50) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
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
  sentimentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentimentLabel: {
    fontSize: 16,
    color: isDarkMode ? '#e9ecef' : '#495057',
  },
  sentimentValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
  },
  moodEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  moodLabel: {
    fontSize: 14,
    color: isDarkMode ? '#e9ecef' : '#495057',
    fontWeight: '500',
  },
  moodBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodBar: {
    flex: 1,
    height: 8,
    backgroundColor: isDarkMode ? '#404040' : '#e9ecef',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  moodPercentage: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    fontWeight: '500',
    width: 25,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#404040' : '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: isDarkMode ? '#e9ecef' : '#495057',
    fontWeight: '500',
  },
  tagCount: {
    fontSize: 12,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    marginLeft: 6,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activityText: {
    fontSize: 16,
    color: isDarkMode ? '#e9ecef' : '#495057',
    lineHeight: 24,
    marginBottom: 10,
  },
  encouragement: {
    color: '#007bff',
    fontWeight: '600',
  },
  streakText: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
});