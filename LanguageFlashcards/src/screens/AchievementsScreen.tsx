import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  ProgressBar,
  Chip,
  List,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';
import { Achievement } from '../types';

const { width } = Dimensions.get('window');

const AchievementsScreen: React.FC = () => {
  const { state } = useLanguageFlashcards();
  const theme = useTheme();

  const achievements = useMemo(() => {
    const user = state.user;
    const decks = state.decks;
    const flashcards = state.flashcards;
    const studySessions = state.studySessions;
    const reviews = state.reviews;

    const achievementList: Achievement[] = [
      {
        id: 'first_card',
        name: 'First Steps',
        description: 'Create your first flashcard',
        type: 'first_card',
        icon: 'card',
        isUnlocked: flashcards.length >= 1,
        progress: flashcards.length,
        target: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'study_streak',
        name: 'Consistent Learner',
        description: 'Study for 7 consecutive days',
        type: 'study_streak',
        icon: 'calendar',
        isUnlocked: calculateStudyStreak(studySessions) >= 7,
        progress: calculateStudyStreak(studySessions),
        target: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'perfect_session',
        name: 'Perfect Session',
        description: 'Complete a study session with 100% accuracy',
        type: 'perfect_session',
        icon: 'star',
        isUnlocked: studySessions.some(session => 
          session.totalCards > 0 && session.correctCards === session.totalCards
        ),
        progress: studySessions.filter(session => 
          session.totalCards > 0 && session.correctCards === session.totalCards
        ).length,
        target: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'deck_master',
        name: 'Deck Master',
        description: 'Complete all cards in a deck',
        type: 'deck_master',
        icon: 'book',
        isUnlocked: decks.some(deck => {
          const deckCards = flashcards.filter(card => card.deckId === deck.id);
          return deckCards.length > 0 && deckCards.every(card => card.reviewCount > 0);
        }),
        progress: decks.filter(deck => {
          const deckCards = flashcards.filter(card => card.deckId === deck.id);
          return deckCards.length > 0 && deckCards.every(card => card.reviewCount > 0);
        }).length,
        target: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'speed_learner',
        name: 'Speed Learner',
        description: 'Review 50 cards in a single session',
        type: 'speed_learner',
        icon: 'flash',
        isUnlocked: studySessions.some(session => session.totalCards >= 50),
        progress: Math.max(...studySessions.map(session => session.totalCards), 0),
        target: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Study for 30 consecutive days',
        type: 'consistency_king',
        icon: 'crown',
        isUnlocked: calculateStudyStreak(studySessions) >= 30,
        progress: calculateStudyStreak(studySessions),
        target: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'vocabulary_builder',
        name: 'Vocabulary Builder',
        description: 'Create 100 flashcards',
        type: 'vocabulary_builder',
        icon: 'library',
        isUnlocked: flashcards.length >= 100,
        progress: flashcards.length,
        target: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'grammar_expert',
        name: 'Grammar Expert',
        description: 'Study grammar cards for 10 days',
        type: 'grammar_expert',
        icon: 'school',
        isUnlocked: calculateGrammarStudyDays(studySessions) >= 10,
        progress: calculateGrammarStudyDays(studySessions),
        target: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pronunciation_perfect',
        name: 'Pronunciation Perfect',
        description: 'Review 200 cards with audio',
        type: 'pronunciation_perfect',
        icon: 'volume-high',
        isUnlocked: flashcards.filter(card => card.audioUrl).length >= 200,
        progress: flashcards.filter(card => card.audioUrl).length,
        target: 200,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'multilingual_master',
        name: 'Multilingual Master',
        description: 'Study cards in 5 different languages',
        type: 'multilingual_master',
        icon: 'globe',
        isUnlocked: new Set(decks.map(deck => deck.language)).size >= 5,
        progress: new Set(decks.map(deck => deck.language)).size,
        target: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return achievementList;
  }, [state.user, state.decks, state.flashcards, state.studySessions, state.reviews]);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'card': return 'card';
      case 'calendar': return 'calendar';
      case 'star': return 'star';
      case 'book': return 'book';
      case 'flash': return 'flash';
      case 'crown': return 'crown';
      case 'library': return 'library';
      case 'school': return 'school';
      case 'volume-high': return 'volume-high';
      case 'globe': return 'globe';
      default: return 'star';
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'first_card': return theme.colors.primary;
      case 'study_streak': return theme.colors.secondary;
      case 'perfect_session': return '#FFD700';
      case 'deck_master': return theme.colors.tertiary;
      case 'speed_learner': return '#FF5722';
      case 'consistency_king': return '#9C27B0';
      case 'vocabulary_builder': return '#4CAF50';
      case 'grammar_expert': return '#2196F3';
      case 'pronunciation_perfect': return '#FF9800';
      case 'multilingual_master': return '#E91E63';
      default: return theme.colors.primary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title="Achievement Progress" />
        <Card.Content>
          <View style={styles.progressContainer}>
            <Text variant="titleMedium" style={styles.progressText}>
              {unlockedCount} / {totalCount} Achievements Unlocked
            </Text>
            <ProgressBar 
              progress={progressPercentage / 100} 
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.progressPercentage}>
              {progressPercentage.toFixed(1)}% Complete
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Recent Unlocks" />
        <Card.Content>
          {achievements.filter(a => a.isUnlocked).slice(0, 3).map((achievement, index) => (
            <View key={achievement.id}>
              <List.Item
                title={achievement.name}
                description={achievement.description}
                left={(props) => (
                  <View style={[styles.achievementIcon, { backgroundColor: getAchievementColor(achievement.type) }]}>
                    <Ionicons name={getAchievementIcon(achievement.icon) as any} size={24} color="white" />
                  </View>
                )}
                right={() => (
                  <Chip mode="outlined" compact>
                    Unlocked
                  </Chip>
                )}
              />
              {index < Math.min(3, achievements.filter(a => a.isUnlocked).length) - 1 && <Divider />}
            </View>
          ))}
          {achievements.filter(a => a.isUnlocked).length === 0 && (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No achievements unlocked yet. Start studying to earn achievements!
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="All Achievements" />
        <Card.Content>
          {achievements.map((achievement, index) => (
            <View key={achievement.id}>
              <Card style={[
                styles.achievementCard,
                { 
                  opacity: achievement.isUnlocked ? 1 : 0.6,
                  borderColor: achievement.isUnlocked ? getAchievementColor(achievement.type) : theme.colors.outline,
                }
              ]}>
                <Card.Content>
                  <View style={styles.achievementHeader}>
                    <View style={styles.achievementIconContainer}>
                      <View style={[
                        styles.achievementIcon,
                        { 
                          backgroundColor: achievement.isUnlocked ? getAchievementColor(achievement.type) : theme.colors.outline,
                        }
                      ]}>
                        <Ionicons name={getAchievementIcon(achievement.icon) as any} size={24} color="white" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text variant="titleMedium" style={styles.achievementTitle}>
                          {achievement.name}
                        </Text>
                        <Text variant="bodySmall" style={styles.achievementDescription}>
                          {achievement.description}
                        </Text>
                        <View style={styles.achievementProgress}>
                          <Text variant="bodySmall">
                            {achievement.progress} / {achievement.target}
                          </Text>
                          <ProgressBar 
                            progress={Math.min(achievement.progress / achievement.target, 1)} 
                            color={getAchievementColor(achievement.type)}
                            style={styles.achievementProgressBar}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.achievementReward}>
                      <Chip 
                        mode={achievement.isUnlocked ? "flat" : "outlined"}
                        compact
                        textStyle={{ fontSize: 10 }}
                      >
                        {achievement.isUnlocked ? 'Unlocked' : 'Locked'}
                      </Chip>
                      {achievement.isUnlocked && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
              {index < achievements.length - 1 && <View style={styles.achievementSpacer} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Achievement Categories" />
        <Card.Content>
          {['first_card', 'study_streak', 'perfect_session', 'deck_master', 'speed_learner', 'consistency_king', 'vocabulary_builder', 'grammar_expert', 'pronunciation_perfect', 'multilingual_master'].map(type => {
            const categoryAchievements = achievements.filter(a => a.type === type);
            const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length;
            const totalInCategory = categoryAchievements.length;
            
            return (
              <View key={type}>
                <List.Item
                  title={type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  description={`${unlockedInCategory} / ${totalInCategory} unlocked`}
                  left={(props) => (
                    <List.Icon {...props} icon={getAchievementIcon('star')} color={getAchievementColor(type)} />
                  )}
                  right={() => (
                    <Text variant="bodySmall" style={{ color: getAchievementColor(type) }}>
                      {totalInCategory > 0 ? ((unlockedInCategory / totalInCategory) * 100).toFixed(0) + '%' : '0%'}
                    </Text>
                  )}
                />
                {type !== 'multilingual_master' && <Divider />}
              </View>
            );
          })}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Helper functions
const calculateStudyStreak = (studySessions: any[]) => {
  if (studySessions.length === 0) return 0;
  
  const dates = studySessions.map(s => new Date(s.startTime).toDateString());
  const uniqueDates = [...new Set(dates)].sort();
  
  let streak = 0;
  const today = new Date().toDateString();
  
  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const currentDate = new Date(uniqueDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - streak);
    
    if (currentDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const calculateGrammarStudyDays = (studySessions: any[]) => {
  // This would need more complex logic based on grammar cards
  // For now, return a placeholder based on study sessions
  return Math.min(studySessions.length, 10);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  progressPercentage: {
    marginTop: 8,
    opacity: 0.7,
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    marginVertical: 20,
  },
  achievementCard: {
    borderWidth: 1,
    borderRadius: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  achievementIconContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    marginBottom: 8,
    opacity: 0.7,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementProgressBar: {
    flex: 1,
    marginLeft: 8,
    height: 4,
  },
  achievementReward: {
    alignItems: 'flex-end',
  },
  achievementSpacer: {
    height: 8,
  },
});

export default AchievementsScreen; 