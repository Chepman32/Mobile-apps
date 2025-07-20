import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, Avatar, List, Divider, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';

const StudyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, getDecks, getFlashcards, getDueCards, getStudySessions } = useLanguageFlashcards();
  const [dueCardsByDeck, setDueCardsByDeck] = useState<{[key: string]: number}>({});
  const [totalDueCards, setTotalDueCards] = useState(0);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      getDecks(),
      getFlashcards(),
      getStudySessions(),
    ]);
    
    await loadDueCards();
    loadRecentSessions();
  };

  const loadDueCards = async () => {
    const dueCards = await getDueCards();
    setTotalDueCards(dueCards.length);
    
    // Group due cards by deck
    const dueByDeck: {[key: string]: number} = {};
    for (const card of dueCards) {
      dueByDeck[card.deckId] = (dueByDeck[card.deckId] || 0) + 1;
    }
    setDueCardsByDeck(dueByDeck);
  };

  const loadRecentSessions = () => {
    const recent = state.studySessions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    setRecentSessions(recent);
  };

  const handleStartStudy = () => {
    if (totalDueCards > 0) {
      navigation.navigate('StudySession' as never);
    }
  };

  const handleStudyDeck = (deckId: string) => {
    navigation.navigate('StudySession' as never, { deckId } as never);
  };

  const handleViewProgress = () => {
    navigation.navigate('Progress' as never);
  };

  const handleViewHistory = () => {
    navigation.navigate('StudyHistory' as never);
  };

  const getDeckName = (deckId: string) => {
    const deck = state.decks.find(d => d.id === deckId);
    return deck?.name || 'Unknown Deck';
  };

  const getDeckLanguage = (deckId: string) => {
    const deck = state.decks.find(d => d.id === deckId);
    return deck?.language || 'Unknown';
  };

  const getLanguageFlag = (language: string) => {
    const flags: {[key: string]: string} = {
      'Spanish': '🇪🇸',
      'French': '🇫🇷',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'Russian': '🇷🇺',
      'Japanese': '🇯🇵',
      'Chinese': '🇨🇳',
      'Korean': '🇰🇷',
      'Arabic': '🇸🇦',
    };
    return flags[language] || '🌐';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'review':
        return 'refresh';
      case 'new':
        return 'plus-circle';
      case 'mixed':
        return 'shuffle';
      default:
        return 'school';
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'review':
        return '#6366f1';
      case 'new':
        return '#10b981';
      case 'mixed':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getStudyStreak = () => {
    return state.user?.statistics.currentStreak || 0;
  };

  const getAverageAccuracy = () => {
    const totalReviews = state.reviews.length;
    if (totalReviews === 0) return 0;
    
    const correctReviews = state.reviews.filter(review => review.wasCorrect).length;
    return Math.round((correctReviews / totalReviews) * 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Study Overview */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Study Dashboard
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Keep your learning momentum going
          </Text>
        </View>

        {/* Quick Study Card */}
        <Card style={styles.quickStudyCard}>
          <Card.Content>
            <View style={styles.quickStudyHeader}>
              <MaterialCommunityIcons name="school" size={32} color="#6366f1" />
              <View style={styles.quickStudyInfo}>
                <Text variant="titleLarge" style={styles.quickStudyTitle}>
                  {totalDueCards} cards due
                </Text>
                <Text variant="bodyMedium" style={styles.quickStudySubtitle}>
                  Ready for review
                </Text>
              </View>
            </View>
            
            {totalDueCards > 0 ? (
              <Button
                mode="contained"
                onPress={handleStartStudy}
                style={styles.studyButton}
                icon="play"
              >
                Start Studying
              </Button>
            ) : (
              <View style={styles.noDueCards}>
                <MaterialCommunityIcons name="check-circle" size={24} color="#10b981" />
                <Text variant="bodyMedium" style={styles.noDueCardsText}>
                  All caught up! Great job!
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Your Progress
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Avatar.Icon size={40} icon="fire" style={styles.statIcon} />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {getStudyStreak()}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Day Streak
                </Text>
              </View>
              <View style={styles.statItem}>
                <Avatar.Icon size={40} icon="target" style={styles.statIcon} />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {getAverageAccuracy()}%
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Accuracy
                </Text>
              </View>
              <View style={styles.statItem}>
                <Avatar.Icon size={40} icon="clock" style={styles.statIcon} />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {state.studySessions.length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Sessions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Avatar.Icon size={40} icon="cards" style={styles.statIcon} />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {state.flashcards.length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Cards
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Due Cards by Deck */}
        {Object.keys(dueCardsByDeck).length > 0 && (
          <Card style={styles.deckCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Due Cards by Deck
                </Text>
                <Button
                  mode="text"
                  onPress={handleViewProgress}
                  compact
                >
                  View All
                </Button>
              </View>
              
              {Object.entries(dueCardsByDeck).map(([deckId, count]) => {
                const deck = state.decks.find(d => d.id === deckId);
                if (!deck) return null;
                
                return (
                  <List.Item
                    key={deckId}
                    title={deck.name}
                    description={`${count} cards due for review`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="clock-alert"
                        color="#f59e0b"
                      />
                    )}
                    right={() => (
                      <Chip mode="outlined" compact>
                        {count}
                      </Chip>
                    )}
                    onPress={() => handleStudyDeck(deckId)}
                    style={styles.deckItem}
                  />
                );
              })}
            </Card.Content>
          </Card>
        )}

        {/* Recent Study Sessions */}
        {recentSessions.length > 0 && (
          <Card style={styles.sessionsCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Recent Sessions
                </Text>
                <Button
                  mode="text"
                  onPress={handleViewHistory}
                  compact
                >
                  View All
                </Button>
              </View>
              
              {recentSessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  <List.Item
                    title={getDeckName(session.deckId)}
                    description={`${session.cardsStudied} cards • ${formatDuration(session.duration)} • ${session.accuracy}% accuracy`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={getSessionIcon(session.type)}
                        color={getSessionColor(session.type)}
                      />
                    )}
                    right={() => (
                      <Text variant="bodySmall" style={styles.sessionTime}>
                        {new Date(session.createdAt).toLocaleDateString()}
                      </Text>
                    )}
                  />
                  {index < recentSessions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Study Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Study Tips
            </Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <MaterialCommunityIcons name="lightbulb" size={20} color="#f59e0b" />
                <Text variant="bodyMedium" style={styles.tipText}>
                  Study a little every day to maintain your streak
                </Text>
              </View>
              <View style={styles.tipItem}>
                <MaterialCommunityIcons name="target" size={20} color="#10b981" />
                <Text variant="bodyMedium" style={styles.tipText}>
                  Focus on accuracy over speed for better retention
                </Text>
              </View>
              <View style={styles.tipItem}>
                <MaterialCommunityIcons name="refresh" size={20} color="#6366f1" />
                <Text variant="bodyMedium" style={styles.tipText}>
                  Review due cards regularly to reinforce learning
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
  },
  quickStudyCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  quickStudyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickStudyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  quickStudyTitle: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quickStudySubtitle: {
    color: '#6b7280',
  },
  studyButton: {
    marginTop: 8,
  },
  noDueCards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noDueCardsText: {
    marginLeft: 8,
    color: '#10b981',
    fontWeight: '500',
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    backgroundColor: '#6366f1',
    marginBottom: 8,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    color: '#6b7280',
    textAlign: 'center',
  },
  deckCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deckItem: {
    paddingVertical: 4,
  },
  sessionsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  sessionTime: {
    color: '#6b7280',
    alignSelf: 'center',
  },
  tipsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 100,
    elevation: 2,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: '#4b5563',
  },
});

export default StudyScreen; 