import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
  Text,
  ActivityIndicator,
  Surface,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, Challenge, Session, Statistics } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { state, loadStatistics, loadSessions, loadChallenges, addSession } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const { challenges, sessions, statistics, userProfile, loading } = state;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadStatistics(),
        loadSessions(),
        loadChallenges(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const startSession = async (challenge: Challenge) => {
    try {
      const session = {
        challengeId: challenge.id,
        challenge,
        startedAt: new Date().toISOString(),
        completed: false,
        duration: 0,
        interruptions: 0,
        moodBefore: 3,
        moodAfter: 3,
      };

      await addSession(session);
      navigation.navigate('ActiveSession', { challengeId: challenge.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to start session');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRecentSessions = () => {
    return sessions.slice(0, 5);
  };

  const getQuickChallenges = () => {
    return challenges.filter(c => c.difficulty === 'easy').slice(0, 3);
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <View style={styles.welcomeHeader}>
            <Avatar.Text
              size={50}
              label={userProfile?.name?.charAt(0) || 'U'}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.welcomeText}>
              <Title>Welcome back!</Title>
              <Paragraph>
                {userProfile?.name || 'User'}, ready for your next detox session?
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
          <Card.Content>
            <Title style={styles.statTitle}>Total Sessions</Title>
            <Text style={styles.statValue}>{statistics.totalSessions}</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.secondary }]}>
          <Card.Content>
            <Title style={styles.statTitle}>Total Time</Title>
            <Text style={styles.statValue}>{formatDuration(statistics.totalMinutes)}</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.tertiary }]}>
          <Card.Content>
            <Title style={styles.statTitle}>Current Streak</Title>
            <Text style={styles.statValue}>
              {statistics.currentStreak} {getStreakEmoji(statistics.currentStreak)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Start Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Quick Start</Title>
          <Paragraph>Choose a challenge to begin your detox session</Paragraph>
          
          <View style={styles.challengeGrid}>
            {getQuickChallenges().map((challenge) => (
              <Card
                key={challenge.id}
                style={[styles.challengeCard, { borderColor: challenge.color }]}
                onPress={() => setSelectedChallenge(challenge)}
              >
                <Card.Content>
                  <Text style={styles.challengeIcon}>{challenge.icon}</Text>
                  <Title style={styles.challengeTitle}>{challenge.name}</Title>
                  <Paragraph style={styles.challengeDuration}>
                    {challenge.durationMinutes} min
                  </Paragraph>
                  <Chip
                    mode="outlined"
                    textStyle={{ fontSize: 10 }}
                    style={[styles.difficultyChip, { borderColor: challenge.color }]}
                  >
                    {challenge.difficulty}
                  </Chip>
                </Card.Content>
              </Card>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Challenges' as any)}
            style={styles.viewAllButton}
          >
            View All Challenges
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Sessions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Recent Sessions</Title>
          {getRecentSessions().length > 0 ? (
            getRecentSessions().map((session, index) => (
              <React.Fragment key={session.id}>
                <List.Item
                  title={session.challenge.name}
                  description={`${session.duration} minutes • ${new Date(session.startedAt).toLocaleDateString()}`}
                  left={() => (
                    <Avatar.Text
                      size={40}
                      label={session.challenge.icon}
                      style={{ backgroundColor: session.challenge.color }}
                    />
                  )}
                  right={() => (
                    <Chip
                      mode={session.completed ? 'flat' : 'outlined'}
                      textStyle={{ fontSize: 10 }}
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor: session.completed ? theme.colors.primary : 'transparent',
                        },
                      ]}
                    >
                      {session.completed ? 'Completed' : 'In Progress'}
                    </Chip>
                  )}
                  onPress={() => navigation.navigate('Session', { sessionId: session.id })}
                />
                {index < getRecentSessions().length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Paragraph style={styles.emptyText}>
              No sessions yet. Start your first detox session!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Goals Progress */}
      {userProfile?.goals && userProfile.goals.length > 0 && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title>Goals Progress</Title>
            {userProfile.goals.slice(0, 3).map((goal) => (
              <View key={goal.id} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalProgress}>
                    {goal.currentMinutes}/{goal.targetMinutes} min
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((goal.currentMinutes / goal.targetMinutes) * 100, 100)}%`,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              icon="plus"
              onPress={() => navigation.navigate('AddGoal' as any)}
              style={styles.actionButton}
            >
              Add Goal
            </Button>
            <Button
              mode="outlined"
              icon="chart-line"
              onPress={() => navigation.navigate('Statistics' as any)}
              style={styles.actionButton}
            >
              View Stats
            </Button>
            <Button
              mode="outlined"
              icon="trophy"
              onPress={() => navigation.navigate('Achievements' as any)}
              style={styles.actionButton}
            >
              Achievements
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    margin: 16,
    elevation: 2,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 16,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 12,
    color: 'white',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  challengeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  challengeCard: {
    width: '48%',
    marginBottom: 16,
    borderWidth: 2,
    elevation: 1,
  },
  challengeIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  challengeDuration: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  difficultyChip: {
    alignSelf: 'center',
    height: 20,
  },
  viewAllButton: {
    marginTop: 16,
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  statusChip: {
    height: 20,
  },
  goalItem: {
    marginVertical: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalProgress: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
