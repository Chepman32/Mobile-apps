import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';

export default function AchievementsScreen() {
  const theme = useTheme();
  const { state } = useHabitTrackerPro();

  const mockAchievements = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first habit',
      icon: 'star',
      category: 'milestone',
      requirement: { type: 'completions', value: 1 },
      unlocked: state.progress.filter(p => p.completed).length >= 1,
      progress: Math.min(state.progress.filter(p => p.completed).length, 1),
      maxProgress: 1,
    },
    {
      id: '2',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      icon: 'fire',
      category: 'streak',
      requirement: { type: 'streak', value: 7 },
      unlocked: state.userProfile.stats.longestStreak >= 7,
      progress: Math.min(state.userProfile.stats.longestStreak, 7),
      maxProgress: 7,
    },
    {
      id: '3',
      name: 'Habit Builder',
      description: 'Create 5 habits',
      icon: 'plus-circle',
      category: 'milestone',
      requirement: { type: 'completions', value: 5 },
      unlocked: state.habits.length >= 5,
      progress: Math.min(state.habits.length, 5),
      maxProgress: 5,
    },
    {
      id: '4',
      name: 'Perfect Week',
      description: 'Complete all habits for 7 days straight',
      icon: 'calendar-check',
      category: 'special',
      requirement: { type: 'perfect_week', value: 1 },
      unlocked: state.userProfile.stats.perfectWeeks >= 1,
      progress: Math.min(state.userProfile.stats.perfectWeeks, 1),
      maxProgress: 1,
    },
    {
      id: '5',
      name: 'Consistency King',
      description: 'Complete 100 habits total',
      icon: 'crown',
      category: 'completion',
      requirement: { type: 'completions', value: 100 },
      unlocked: state.progress.filter(p => p.completed).length >= 100,
      progress: Math.min(state.progress.filter(p => p.completed).length, 100),
      maxProgress: 100,
    },
  ];

  const unlockedAchievements = mockAchievements.filter(a => a.unlocked);
  const lockedAchievements = mockAchievements.filter(a => !a.unlocked);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'streak': return '#ff6b6b';
      case 'completion': return '#4ecdc4';
      case 'milestone': return '#45b7d1';
      case 'special': return '#feca57';
      default: return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Achievement Stats */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Achievement Progress
            </Title>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Icon name="trophy" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {unlockedAchievements.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Unlocked
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="lock" size={32} color={theme.colors.outline} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {lockedAchievements.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Locked
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="percent" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {Math.round((unlockedAchievements.length / mockAchievements.length) * 100)}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Completion
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Unlocked Achievements
              </Title>

              {unlockedAchievements.map(achievement => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <View style={styles.achievementHeader}>
                    <Icon 
                      name={achievement.icon} 
                      size={32} 
                      color={getCategoryColor(achievement.category)} 
                    />
                    <View style={styles.achievementInfo}>
                      <Text style={[styles.achievementName, { color: theme.colors.onSurface }]}>
                        {achievement.name}
                      </Text>
                      <Text style={[styles.achievementDescription, { color: theme.colors.onSurfaceVariant }]}>
                        {achievement.description}
                      </Text>
                    </View>
                    <Icon name="check-circle" size={24} color={theme.colors.primary} />
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Locked Achievements */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Locked Achievements
            </Title>

            {lockedAchievements.length > 0 ? (
              lockedAchievements.map(achievement => {
                const progressPercentage = achievement.maxProgress > 0 
                  ? achievement.progress / achievement.maxProgress 
                  : 0;

                return (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <View style={styles.achievementHeader}>
                      <Icon 
                        name={achievement.icon} 
                        size={32} 
                        color={theme.colors.outline} 
                      />
                      <View style={styles.achievementInfo}>
                        <Text style={[styles.achievementName, { color: theme.colors.onSurface }]}>
                          {achievement.name}
                        </Text>
                        <Text style={[styles.achievementDescription, { color: theme.colors.onSurfaceVariant }]}>
                          {achievement.description}
                        </Text>
                        <View style={styles.progressContainer}>
                          <ProgressBar
                            progress={progressPercentage}
                            color={getCategoryColor(achievement.category)}
                            style={styles.progressBar}
                          />
                          <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                            {achievement.progress}/{achievement.maxProgress}
                          </Text>
                        </View>
                      </View>
                      <Icon name="lock" size={24} color={theme.colors.outline} />
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                All achievements unlocked! You're a habit master!
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Achievement Categories */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Achievement Categories
            </Title>

            <View style={styles.categoryItem}>
              <Icon name="fire" size={24} color="#ff6b6b" />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
                  Streak Achievements
                </Text>
                <Text style={[styles.categoryDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Based on maintaining consistent streaks
                </Text>
              </View>
            </View>

            <View style={styles.categoryItem}>
              <Icon name="check-circle" size={24} color="#4ecdc4" />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
                  Completion Achievements
                </Text>
                <Text style={[styles.categoryDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Based on total habit completions
                </Text>
              </View>
            </View>

            <View style={styles.categoryItem}>
              <Icon name="star" size={24} color="#45b7d1" />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
                  Milestone Achievements
                </Text>
                <Text style={[styles.categoryDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Based on reaching important milestones
                </Text>
              </View>
            </View>

            <View style={styles.categoryItem}>
              <Icon name="crown" size={24} color="#feca57" />
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
                  Special Achievements
                </Text>
                <Text style={[styles.categoryDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Unique and challenging achievements
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  achievementItem: {
    marginBottom: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    minWidth: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 32,
    fontStyle: 'italic',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 14,
    marginTop: 2,
  },
}); 