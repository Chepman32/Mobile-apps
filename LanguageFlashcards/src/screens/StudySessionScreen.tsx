import React, { useMemo, useState } from 'react';
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
  List,
  Chip,
  Divider,
  Button,
  ProgressBar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';
import { StudySession, Deck, Flashcard } from '../types';

const { width } = Dimensions.get('window');

const StudySessionScreen: React.FC = () => {
  const { state } = useLanguageFlashcards();
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  
  const sessionId = route.params?.sessionId;
  const session = state.studySessions.find(s => s.id === sessionId);

  const sessionData = useMemo(() => {
    if (!session) return null;

    const deck = state.decks.find(d => d.id === session.deckId);
    const sessionCards = state.flashcards.filter(card => card.deckId === session.deckId);
    const sessionReviews = state.reviews.filter(review => {
      const reviewDate = new Date(review.createdAt);
      const sessionStart = new Date(session.startTime);
      const sessionEnd = session.endTime ? new Date(session.endTime) : new Date();
      return reviewDate >= sessionStart && reviewDate <= sessionEnd;
    });

    // Calculate session statistics
    const accuracy = session.totalCards > 0 ? (session.correctCards / session.totalCards) * 100 : 0;
    const averageTimePerCard = session.totalCards > 0 ? session.timeSpent / session.totalCards : 0;
    
    // Session duration
    const sessionStart = new Date(session.startTime);
    const sessionEnd = session.endTime ? new Date(session.endTime) : new Date();
    const sessionDuration = (sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60); // in minutes

    // Performance over time (by card order)
    const performanceData = sessionReviews
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((review, index) => ({
        cardNumber: index + 1,
        correct: review.response === 'correct',
        timeSpent: review.timeSpent,
        response: review.response,
      }));

    // Response distribution
    const responseDistribution = {
      correct: sessionReviews.filter(r => r.response === 'correct').length,
      incorrect: sessionReviews.filter(r => r.response === 'incorrect').length,
      easy: sessionReviews.filter(r => r.response === 'easy').length,
      hard: sessionReviews.filter(r => r.response === 'hard').length,
    };

    // Difficulty analysis
    const easyCards = sessionCards.filter(card => card.difficulty === 'easy');
    const mediumCards = sessionCards.filter(card => card.difficulty === 'medium');
    const hardCards = sessionCards.filter(card => card.difficulty === 'hard');

    return {
      session,
      deck,
      sessionCards,
      sessionReviews,
      accuracy,
      averageTimePerCard,
      sessionDuration,
      performanceData,
      responseDistribution,
      easyCards,
      mediumCards,
      hardCards,
    };
  }, [session, state.decks, state.flashcards, state.reviews, sessionId]);

  if (!sessionData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorText}>
              Session not found
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 27, 31, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'correct': return theme.colors.primary;
      case 'incorrect': return theme.colors.error;
      case 'easy': return theme.colors.secondary;
      case 'hard': return '#FF9800';
      default: return theme.colors.outline;
    }
  };

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'correct': return 'checkmark-circle';
      case 'incorrect': return 'close-circle';
      case 'easy': return 'star';
      case 'hard': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };

  const formatTimePerCard = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}m ${secs}s`;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title 
          title={`Session ${sessionData.session.id.slice(0, 8)}`}
          subtitle={sessionData.deck?.name}
        />
        <Card.Content>
          <View style={styles.sessionInfo}>
            <View style={styles.sessionIcon}>
              <Ionicons name="timer" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.sessionDetails}>
              <Text variant="bodyMedium" style={styles.sessionDescription}>
                Started at {new Date(sessionData.session.startTime).toLocaleTimeString()}
              </Text>
              {sessionData.session.endTime && (
                <Text variant="bodyMedium" style={styles.sessionDescription}>
                  Ended at {new Date(sessionData.session.endTime).toLocaleTimeString()}
                </Text>
              )}
              <Text variant="bodyMedium" style={styles.sessionDuration}>
                Duration: {formatDuration(sessionData.sessionDuration)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Session Statistics" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {sessionData.session.totalCards}
              </Text>
              <Text variant="bodySmall">Total Cards</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {sessionData.session.correctCards}
              </Text>
              <Text variant="bodySmall">Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {sessionData.accuracy.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Accuracy</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {formatTimePerCard(sessionData.averageTimePerCard)}
              </Text>
              <Text variant="bodySmall">Avg Time/Card</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Performance Over Time" />
        <Card.Content>
          {sessionData.performanceData.length > 0 && (
            <LineChart
              data={{
                labels: sessionData.performanceData.map((_, index) => (index + 1).toString()),
                datasets: [{
                  data: sessionData.performanceData.map(d => d.correct ? 100 : 0),
                }],
              }}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Response Distribution" />
        <Card.Content>
          <View style={styles.responseDistribution}>
            <View style={styles.responseItem}>
              <View style={[styles.responseIcon, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </View>
              <View style={styles.responseInfo}>
                <Text variant="titleMedium">Correct</Text>
                <Text variant="bodySmall">{sessionData.responseDistribution.correct} responses</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {sessionData.session.totalCards > 0 
                  ? ((sessionData.responseDistribution.correct / sessionData.session.totalCards) * 100).toFixed(1)
                  : 0}%
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.responseItem}>
              <View style={[styles.responseIcon, { backgroundColor: theme.colors.error }]}>
                <Ionicons name="close-circle" size={24} color="white" />
              </View>
              <View style={styles.responseInfo}>
                <Text variant="titleMedium">Incorrect</Text>
                <Text variant="bodySmall">{sessionData.responseDistribution.incorrect} responses</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {sessionData.session.totalCards > 0 
                  ? ((sessionData.responseDistribution.incorrect / sessionData.session.totalCards) * 100).toFixed(1)
                  : 0}%
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.responseItem}>
              <View style={[styles.responseIcon, { backgroundColor: theme.colors.secondary }]}>
                <Ionicons name="star" size={24} color="white" />
              </View>
              <View style={styles.responseInfo}>
                <Text variant="titleMedium">Easy</Text>
                <Text variant="bodySmall">{sessionData.responseDistribution.easy} responses</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {sessionData.session.totalCards > 0 
                  ? ((sessionData.responseDistribution.easy / sessionData.session.totalCards) * 100).toFixed(1)
                  : 0}%
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.responseItem}>
              <View style={[styles.responseIcon, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="alert-circle" size={24} color="white" />
              </View>
              <View style={styles.responseInfo}>
                <Text variant="titleMedium">Hard</Text>
                <Text variant="bodySmall">{sessionData.responseDistribution.hard} responses</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {sessionData.session.totalCards > 0 
                  ? ((sessionData.responseDistribution.hard / sessionData.session.totalCards) * 100).toFixed(1)
                  : 0}%
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Difficulty Analysis" />
        <Card.Content>
          <List.Item
            title="Easy Cards"
            description={`${sessionData.easyCards.length} cards in deck`}
            left={(props) => <List.Icon {...props} icon="star" color={theme.colors.secondary} />}
            right={() => (
              <Text variant="titleMedium">{sessionData.easyCards.length}</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Medium Cards"
            description={`${sessionData.mediumCards.length} cards in deck`}
            left={(props) => <List.Icon {...props} icon="star-half" color={theme.colors.primary} />}
            right={() => (
              <Text variant="titleMedium">{sessionData.mediumCards.length}</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Hard Cards"
            description={`${sessionData.hardCards.length} cards in deck`}
            left={(props) => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
            right={() => (
              <Text variant="titleMedium">{sessionData.hardCards.length}</Text>
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Session Reviews" />
        <Card.Content>
          {sessionData.sessionReviews.length > 0 ? (
            sessionData.sessionReviews
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((review, index) => (
                <View key={review.id}>
                  <List.Item
                    title={`Review ${index + 1}`}
                    description={`${new Date(review.createdAt).toLocaleTimeString()} - ${formatTimePerCard(review.timeSpent)}`}
                    left={(props) => (
                      <List.Icon 
                        {...props} 
                        icon={getResponseIcon(review.response)} 
                        color={getResponseColor(review.response)}
                      />
                    )}
                    right={() => (
                      <Chip 
                        mode="outlined" 
                        compact 
                        textStyle={{ fontSize: 10 }}
                        style={{ borderColor: getResponseColor(review.response) }}
                      >
                        {review.response}
                      </Chip>
                    )}
                  />
                  {index < sessionData.sessionReviews.length - 1 && <Divider />}
                </View>
              ))
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No reviews in this session
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Actions" />
        <Card.Content>
          <Button
            mode="contained"
            icon="play"
            onPress={() => {
              navigation.navigate('Study' as never, { deckId: sessionData.session.deckId } as never);
            }}
            style={styles.actionButton}
          >
            Continue Studying
          </Button>
          <Button
            mode="outlined"
            icon="chart-line"
            onPress={() => {
              navigation.navigate('StudyHistory' as never);
            }}
            style={styles.actionButton}
          >
            View All Sessions
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sessionIcon: {
    marginRight: 16,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionDescription: {
    marginBottom: 4,
  },
  sessionDuration: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
    marginVertical: 8,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  responseDistribution: {
    marginVertical: 8,
  },
  responseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  responseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  responseInfo: {
    flex: 1,
  },
  responsePercentage: {
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    marginVertical: 20,
  },
  divider: {
    marginVertical: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default StudySessionScreen; 