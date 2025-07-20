import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, Avatar, List, Divider, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, getUser, getDecks, getFlashcards, getDueCards } = useLanguageFlashcards();
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      getUser(),
      getDecks(),
      getFlashcards(),
    ]);
    
    // Get due cards count
    const dueCards = await getDueCards();
    setDueCardsCount(dueCards.length);
    
    // Generate recent activity (mock data for now)
    setRecentActivity([
      {
        id: '1',
        type: 'study',
        title: 'Studied Basic Spanish',
        description: 'Reviewed 15 cards',
        time: '2 hours ago',
        icon: 'school',
      },
      {
        id: '2',
        type: 'deck',
        title: 'Created French Basics',
        description: 'Added 20 new cards',
        time: '1 day ago',
        icon: 'cards',
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Streak Master',
        description: '7 day study streak!',
        time: '2 days ago',
        icon: 'trophy',
      },
    ]);
  };

  const getTotalCards = () => {
    return state.flashcards.length;
  };

  const getTotalDecks = () => {
    return state.decks.length;
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

  const handleStartStudy = () => {
    if (dueCardsCount > 0) {
      navigation.navigate('StudySession' as never);
    }
  };

  const handleCreateDeck = () => {
    navigation.navigate('AddDeck' as never);
  };

  const handleViewDecks = () => {
    navigation.navigate('Decks' as never);
  };

  const handleViewProgress = () => {
    navigation.navigate('Progress' as never);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'study':
        return 'school';
      case 'deck':
        return 'cards';
      case 'achievement':
        return 'trophy';
      default:
        return 'information';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'study':
        return '#6366f1';
      case 'deck':
        return '#8b5cf6';
      case 'achievement':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            Welcome back, {state.user?.name || 'Learner'}!
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Ready to continue your language learning journey?
          </Text>
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                onPress={handleStartStudy}
                disabled={dueCardsCount === 0}
                style={styles.actionButton}
                icon="school"
              >
                Study Now ({dueCardsCount})
              </Button>
              <Button
                mode="outlined"
                onPress={handleCreateDeck}
                style={styles.actionButton}
                icon="plus"
              >
                Create Deck
              </Button>
            </View>
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
                <Avatar.Icon size={40} icon="cards" style={styles.statIcon} />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {getTotalDecks()}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Decks
                </Text>
              </View>
              <View style={styles.statItem}>
                <Avatar.Icon size={40} icon="card-text" style={styles.statIcon} />
                <Text variant="titleLarge" style={styles.statNumber}>
                  {getTotalCards()}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Cards
                </Text>
              </View>
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
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <View style={styles.activityHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recent Activity
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('StudyHistory' as never)}
                compact
              >
                View All
              </Button>
            </View>
            {recentActivity.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <List.Item
                  title={activity.title}
                  description={activity.description}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={getActivityIcon(activity.type)}
                      color={getActivityColor(activity.type)}
                    />
                  )}
                  right={() => (
                    <Text variant="bodySmall" style={styles.activityTime}>
                      {activity.time}
                    </Text>
                  )}
                />
                {index < recentActivity.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>

        {/* Quick Navigation */}
        <Card style={styles.navigationCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Navigation
            </Text>
            <View style={styles.navigationButtons}>
              <Button
                mode="outlined"
                onPress={handleViewDecks}
                style={styles.navButton}
                icon="cards"
              >
                All Decks
              </Button>
              <Button
                mode="outlined"
                onPress={handleViewProgress}
                style={styles.navButton}
                icon="chart-line"
              >
                Progress
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Achievements' as never)}
                style={styles.navButton}
                icon="trophy"
              >
                Achievements
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Settings' as never)}
                style={styles.navButton}
                icon="cog"
              >
                Settings
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateDeck}
        label="Add Card"
      />
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
  greeting: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
  },
  quickActionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  quickActions: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    marginVertical: 4,
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
  activityCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTime: {
    color: '#6b7280',
    alignSelf: 'center',
  },
  navigationCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 100, // Space for FAB
    elevation: 2,
  },
  navigationButtons: {
    gap: 12,
  },
  navButton: {
    marginVertical: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});

export default HomeScreen; 