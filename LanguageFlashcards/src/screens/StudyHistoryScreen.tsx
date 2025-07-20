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
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';
import { StudySession, Deck } from '../types';

const { width } = Dimensions.get('window');

const StudyHistoryScreen: React.FC = () => {
  const { state } = useLanguageFlashcards();
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const historyData = useMemo(() => {
    const sessions = state.studySessions;
    const decks = state.decks;
    const flashcards = state.flashcards;

    // Calculate basic stats
    const totalSessions = sessions.length;
    const totalCardsStudied = sessions.reduce((sum, session) => sum + session.totalCards, 0);
    const totalTimeSpent = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
    const averageAccuracy = sessions.length > 0 
      ? sessions.reduce((sum, session) => {
          const accuracy = session.totalCards > 0 ? (session.correctCards / session.totalCards) * 100 : 0;
          return sum + accuracy;
        }, 0) / sessions.length 
      : 0;

    // Group sessions by date for chart
    const now = new Date();
    const periodDays = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const dailyData = Array.from({ length: periodDays }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (periodDays - 1 - i));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      const cardsStudied = daySessions.reduce((sum, session) => sum + session.totalCards, 0);
      const timeSpent = daySessions.reduce((sum, session) => sum + session.timeSpent, 0);
      const accuracy = daySessions.length > 0 
        ? daySessions.reduce((sum, session) => {
            const sessionAccuracy = session.totalCards > 0 ? (session.correctCards / session.totalCards) * 100 : 0;
            return sum + sessionAccuracy;
          }, 0) / daySessions.length 
        : 0;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cardsStudied,
        timeSpent,
        accuracy,
        sessions: daySessions.length,
      };
    });

    // Top performing decks
    const deckStats = decks.map(deck => {
      const deckSessions = sessions.filter(session => session.deckId === deck.id);
      const totalCards = deckSessions.reduce((sum, session) => sum + session.totalCards, 0);
      const correctCards = deckSessions.reduce((sum, session) => sum + session.correctCards, 0);
      const accuracy = totalCards > 0 ? (correctCards / totalCards) * 100 : 0;
      const totalTime = deckSessions.reduce((sum, session) => sum + session.timeSpent, 0);

      return {
        deck,
        sessions: deckSessions.length,
        totalCards,
        correctCards,
        accuracy,
        totalTime,
      };
    }).filter(stat => stat.sessions > 0)
      .sort((a, b) => b.totalCards - a.totalCards)
      .slice(0, 5);

    // Recent sessions
    const recentSessions = sessions
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 10);

    return {
      totalSessions,
      totalCardsStudied,
      totalTimeSpent,
      averageAccuracy,
      dailyData,
      deckStats,
      recentSessions,
    };
  }, [state.studySessions, state.decks, state.flashcards, selectedPeriod]);

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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };

  const getSessionAccuracy = (session: StudySession) => {
    return session.totalCards > 0 ? (session.correctCards / session.totalCards) * 100 : 0;
  };

  const getDeckName = (deckId: string) => {
    const deck = state.decks.find(d => d.id === deckId);
    return deck?.name || 'Unknown Deck';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title="Overview" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {historyData.totalSessions}
              </Text>
              <Text variant="bodySmall">Total Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {historyData.totalCardsStudied}
              </Text>
              <Text variant="bodySmall">Cards Studied</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {formatDuration(historyData.totalTimeSpent)}
              </Text>
              <Text variant="bodySmall">Total Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {historyData.averageAccuracy.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Avg Accuracy</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Study Activity" />
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
          
          {historyData.dailyData.length > 0 && (
            <LineChart
              data={{
                labels: historyData.dailyData.map(d => d.date),
                datasets: [{
                  data: historyData.dailyData.map(d => d.cardsStudied),
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
        <Card.Title title="Top Performing Decks" />
        <Card.Content>
          {historyData.deckStats.length > 0 ? (
            historyData.deckStats.map((stat, index) => (
              <View key={stat.deck.id}>
                <List.Item
                  title={stat.deck.name}
                  description={`${stat.sessions} sessions, ${stat.totalCards} cards`}
                  left={(props) => <List.Icon {...props} icon="book" />}
                  right={() => (
                    <View style={styles.deckStats}>
                      <Text variant="bodySmall" style={styles.accuracyText}>
                        {stat.accuracy.toFixed(1)}%
                      </Text>
                      <Text variant="bodySmall" style={styles.timeText}>
                        {formatDuration(stat.totalTime)}
                      </Text>
                    </View>
                  )}
                />
                {index < historyData.deckStats.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No study sessions yet
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Recent Sessions" />
        <Card.Content>
          {historyData.recentSessions.length > 0 ? (
            historyData.recentSessions.map((session, index) => (
              <View key={session.id}>
                <List.Item
                  title={getDeckName(session.deckId)}
                  description={`${new Date(session.startTime).toLocaleDateString()} - ${session.totalCards} cards`}
                  left={(props) => (
                    <List.Icon 
                      {...props} 
                      icon="timer" 
                      color={getSessionAccuracy(session) >= 80 ? theme.colors.primary : theme.colors.error}
                    />
                  )}
                  right={() => (
                    <View style={styles.sessionStats}>
                      <Text variant="bodySmall" style={styles.accuracyText}>
                        {getSessionAccuracy(session).toFixed(1)}%
                      </Text>
                      <Text variant="bodySmall" style={styles.timeText}>
                        {formatDuration(session.timeSpent)}
                      </Text>
                      <Chip 
                        mode="outlined" 
                        compact 
                        textStyle={{ fontSize: 10 }}
                        style={{ 
                          borderColor: session.isCompleted ? theme.colors.primary : theme.colors.outline 
                        }}
                      >
                        {session.isCompleted ? 'Completed' : 'Incomplete'}
                      </Chip>
                    </View>
                  )}
                />
                {index < historyData.recentSessions.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No recent sessions
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Performance Analytics" />
        <Card.Content>
          <List.Item
            title="Average Session Length"
            description="Time spent per study session"
            left={(props) => <List.Icon {...props} icon="clock" />}
            right={() => (
              <Text variant="titleMedium">
                {historyData.totalSessions > 0 
                  ? formatDuration(historyData.totalTimeSpent / historyData.totalSessions)
                  : '0m'
                }
              </Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Cards per Session"
            description="Average cards studied per session"
            left={(props) => <List.Icon {...props} icon="cards" />}
            right={() => (
              <Text variant="titleMedium">
                {historyData.totalSessions > 0 
                  ? Math.round(historyData.totalCardsStudied / historyData.totalSessions)
                  : 0
                }
              </Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Study Frequency"
            description="Sessions per day on average"
            left={(props) => <List.Icon {...props} icon="calendar" />}
            right={() => {
              const daysSinceFirstSession = historyData.recentSessions.length > 0 
                ? Math.ceil((new Date().getTime() - new Date(historyData.recentSessions[historyData.recentSessions.length - 1].startTime).getTime()) / (1000 * 60 * 60 * 24))
                : 0;
              const frequency = daysSinceFirstSession > 0 ? (historyData.totalSessions / daysSinceFirstSession).toFixed(1) : '0';
              return <Text variant="titleMedium">{frequency}</Text>;
            }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Actions" />
        <Card.Content>
          <Button
            mode="contained"
            icon="play"
            onPress={() => {
              // Navigate to study screen
            }}
            style={styles.actionButton}
          >
            Start New Session
          </Button>
          <Button
            mode="outlined"
            icon="chart-line"
            onPress={() => {
              // Navigate to detailed analytics
            }}
            style={styles.actionButton}
          >
            View Detailed Analytics
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
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    marginVertical: 20,
  },
  deckStats: {
    alignItems: 'flex-end',
  },
  sessionStats: {
    alignItems: 'flex-end',
  },
  accuracyText: {
    marginBottom: 4,
  },
  timeText: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default StudyHistoryScreen; 