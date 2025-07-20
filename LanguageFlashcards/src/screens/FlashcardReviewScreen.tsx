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
  SegmentedButtons,
  Button,
  ProgressBar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';
import { Flashcard, Review, Deck } from '../types';

const { width } = Dimensions.get('window');

const FlashcardReviewScreen: React.FC = () => {
  const { state } = useLanguageFlashcards();
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const flashcardId = route.params?.flashcardId;
  const flashcard = state.flashcards.find(f => f.id === flashcardId);

  const reviewData = useMemo(() => {
    if (!flashcard) return null;

    const reviews = state.reviews.filter(r => r.flashcardId === flashcardId);
    const deck = state.decks.find(d => d.id === flashcard.deckId);

    // Calculate basic stats
    const totalReviews = reviews.length;
    const correctReviews = reviews.filter(r => r.response === 'correct').length;
    const accuracy = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;
    
    const averageResponseTime = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.timeSpent, 0) / reviews.length 
      : 0;

    // Group reviews by date for chart
    const now = new Date();
    const periodDays = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const dailyData = Array.from({ length: periodDays }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (periodDays - 1 - i));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayReviews = reviews.filter(review => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate >= dayStart && reviewDate <= dayEnd;
      });

      const correctCount = dayReviews.filter(r => r.response === 'correct').length;
      const totalCount = dayReviews.length;
      const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        reviews: totalCount,
        accuracy,
        correctCount,
      };
    });

    // Response quality distribution
    const responseDistribution = {
      correct: reviews.filter(r => r.response === 'correct').length,
      incorrect: reviews.filter(r => r.response === 'incorrect').length,
      easy: reviews.filter(r => r.response === 'easy').length,
      hard: reviews.filter(r => r.response === 'hard').length,
    };

    // Recent reviews
    const recentReviews = reviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Spaced repetition data
    const intervals = reviews.map(r => r.interval);
    const averageInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    const maxInterval = intervals.length > 0 ? Math.max(...intervals) : 0;

    return {
      flashcard,
      deck,
      totalReviews,
      correctReviews,
      accuracy,
      averageResponseTime,
      dailyData,
      responseDistribution,
      recentReviews,
      averageInterval,
      maxInterval,
    };
  }, [flashcard, state.reviews, state.decks, selectedPeriod]);

  if (!reviewData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorText}>
              Flashcard not found
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

  const formatDuration = (seconds: number) => {
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
          title={reviewData.flashcard.front}
          subtitle={reviewData.deck?.name}
        />
        <Card.Content>
          <View style={styles.flashcardInfo}>
            <View style={styles.flashcardIcon}>
              <Ionicons name="card" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.flashcardDetails}>
              <Text variant="bodyMedium" style={styles.flashcardBack}>
                {reviewData.flashcard.back}
              </Text>
              {reviewData.flashcard.pronunciation && (
                <Text variant="bodySmall" style={styles.pronunciation}>
                  [{reviewData.flashcard.pronunciation}]
                </Text>
              )}
              <View style={styles.flashcardTags}>
                <Chip mode="outlined" compact style={styles.tag}>
                  {reviewData.flashcard.difficulty}
                </Chip>
                <Chip mode="outlined" compact style={styles.tag}>
                  {reviewData.flashcard.tags.join(', ')}
                </Chip>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Review Statistics" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {reviewData.totalReviews}
              </Text>
              <Text variant="bodySmall">Total Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {reviewData.correctReviews}
              </Text>
              <Text variant="bodySmall">Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {reviewData.accuracy.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Accuracy</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {formatDuration(reviewData.averageResponseTime)}
              </Text>
              <Text variant="bodySmall">Avg Time</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Performance Over Time" />
        <Card.Content>
          <View style={styles.periodSelector}>
            <SegmentedButtons
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
              buttons={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
          </View>
          
          {reviewData.dailyData.length > 0 && (
            <LineChart
              data={{
                labels: reviewData.dailyData.map(d => d.date),
                datasets: [{
                  data: reviewData.dailyData.map(d => d.accuracy),
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
                <Text variant="bodySmall">{reviewData.responseDistribution.correct} reviews</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {reviewData.totalReviews > 0 
                  ? ((reviewData.responseDistribution.correct / reviewData.totalReviews) * 100).toFixed(1)
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
                <Text variant="bodySmall">{reviewData.responseDistribution.incorrect} reviews</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {reviewData.totalReviews > 0 
                  ? ((reviewData.responseDistribution.incorrect / reviewData.totalReviews) * 100).toFixed(1)
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
                <Text variant="bodySmall">{reviewData.responseDistribution.easy} reviews</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {reviewData.totalReviews > 0 
                  ? ((reviewData.responseDistribution.easy / reviewData.totalReviews) * 100).toFixed(1)
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
                <Text variant="bodySmall">{reviewData.responseDistribution.hard} reviews</Text>
              </View>
              <Text variant="titleMedium" style={styles.responsePercentage}>
                {reviewData.totalReviews > 0 
                  ? ((reviewData.responseDistribution.hard / reviewData.totalReviews) * 100).toFixed(1)
                  : 0}%
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Spaced Repetition" />
        <Card.Content>
          <List.Item
            title="Current Interval"
            description="Days until next review"
            left={(props) => <List.Icon {...props} icon="calendar" />}
            right={() => (
              <Text variant="titleMedium">{reviewData.flashcard.interval} days</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Average Interval"
            description="Average interval across all reviews"
            left={(props) => <List.Icon {...props} icon="timer" />}
            right={() => (
              <Text variant="titleMedium">{reviewData.averageInterval.toFixed(1)} days</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Ease Factor"
            description="Spaced repetition ease factor"
            left={(props) => <List.Icon {...props} icon="trending-up" />}
            right={() => (
              <Text variant="titleMedium">{reviewData.flashcard.easeFactor.toFixed(2)}</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Next Review"
            description="Scheduled review date"
            left={(props) => <List.Icon {...props} icon="clock" />}
            right={() => (
              <Text variant="titleMedium">
                {new Date(reviewData.flashcard.nextReview).toLocaleDateString()}
              </Text>
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Recent Reviews" />
        <Card.Content>
          {reviewData.recentReviews.length > 0 ? (
            reviewData.recentReviews.map((review, index) => (
              <View key={review.id}>
                <List.Item
                  title={`Review ${index + 1}`}
                  description={`${new Date(review.createdAt).toLocaleDateString()} - ${formatDuration(review.timeSpent)}`}
                  left={(props) => (
                    <List.Icon 
                      {...props} 
                      icon={getResponseIcon(review.response)} 
                      color={getResponseColor(review.response)}
                    />
                  )}
                  right={() => (
                    <View style={styles.reviewDetails}>
                      <Text variant="bodySmall" style={styles.intervalText}>
                        {review.interval} days
                      </Text>
                      <Chip 
                        mode="outlined" 
                        compact 
                        textStyle={{ fontSize: 10 }}
                        style={{ borderColor: getResponseColor(review.response) }}
                      >
                        {review.response}
                      </Chip>
                    </View>
                  )}
                />
                {index < reviewData.recentReviews.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No reviews yet
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
              // Navigate to study this specific card
            }}
            style={styles.actionButton}
          >
            Study This Card
          </Button>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => {
              navigation.navigate('EditCard' as never, { flashcardId: reviewData.flashcard.id } as never);
            }}
            style={styles.actionButton}
          >
            Edit Card
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
  flashcardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flashcardIcon: {
    marginRight: 16,
  },
  flashcardDetails: {
    flex: 1,
  },
  flashcardBack: {
    marginBottom: 8,
  },
  pronunciation: {
    fontStyle: 'italic',
    opacity: 0.7,
    marginBottom: 8,
  },
  flashcardTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    marginRight: 8,
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
  periodSelector: {
    marginBottom: 16,
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
  reviewDetails: {
    alignItems: 'flex-end',
  },
  intervalText: {
    marginBottom: 4,
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

export default FlashcardReviewScreen; 