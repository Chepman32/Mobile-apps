import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  ProgressBar,
  useTheme,
  ActivityIndicator,
  Surface,
  Text,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Achievement } from '../types';

const AchievementsScreen: React.FC = () => {
  const theme = useTheme();
  const { state, loadAchievements, loadStatistics } = useAppContext();
  const { achievements, statistics, loading } = state;

  useEffect(() => {
    loadAchievements();
    loadStatistics();
  }, []);

  const onRefresh = async () => {
    await Promise.all([loadAchievements(), loadStatistics()]);
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  const getAchievementIcon = (achievement: Achievement) => {
    if (achievement.isUnlocked) {
      return 'trophy';
    }
    return 'trophy-outline';
  };

  const getAchievementColor = (achievement: Achievement) => {
    if (achievement.isUnlocked) {
      return '#FFD700';
    }
    return theme.colors.outline;
  };

  const getProgressForAchievement = (achievement: Achievement) => {
    if (!statistics) return 0;

    switch (achievement.condition) {
      case 'comics_created':
        return Math.min(statistics.totalComics / achievement.threshold, 1);
      case 'characters_created':
        return Math.min(statistics.customCharacters / achievement.threshold, 1);
      case 'comics_completed':
        return Math.min(statistics.completedComics / achievement.threshold, 1);
      default:
        return 0;
    }
  };

  const getCurrentValue = (achievement: Achievement) => {
    if (!statistics) return 0;

    switch (achievement.condition) {
      case 'comics_created':
        return statistics.totalComics;
      case 'characters_created':
        return statistics.customCharacters;
      case 'comics_completed':
        return statistics.completedComics;
      default:
        return 0;
    }
  };

  if (loading && achievements.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Achievement Overview */}
      <Surface style={styles.overviewCard}>
        <View style={styles.overviewContent}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{unlockedAchievements.length}</Text>
            <Text style={styles.overviewLabel}>Unlocked</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{achievements.length}</Text>
            <Text style={styles.overviewLabel}>Total</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </Text>
            <Text style={styles.overviewLabel}>Progress</Text>
          </View>
        </View>
      </Surface>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>🏆 Unlocked Achievements</Title>
            {unlockedAchievements.map((achievement) => (
              <List.Item
                key={achievement.id}
                title={achievement.name}
                description={achievement.description}
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon={getAchievementIcon(achievement)}
                    color={getAchievementColor(achievement)}
                  />
                )}
                right={(props) => (
                  <View {...props} style={styles.achievementRight}>
                    <Chip mode="outlined" compact>
                      {achievement.reward}
                    </Chip>
                    {achievement.unlockedAt && (
                      <Text style={styles.unlockDate}>
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                )}
                style={styles.achievementItem}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>🔒 Locked Achievements</Title>
            {lockedAchievements.map((achievement) => {
              const progress = getProgressForAchievement(achievement);
              const currentValue = getCurrentValue(achievement);
              
              return (
                <List.Item
                  key={achievement.id}
                  title={achievement.name}
                  description={achievement.description}
                  left={(props) => (
                    <List.Icon 
                      {...props} 
                      icon={getAchievementIcon(achievement)}
                      color={getAchievementColor(achievement)}
                    />
                  )}
                  right={(props) => (
                    <View {...props} style={styles.achievementRight}>
                      <Text style={styles.progressText}>
                        {currentValue}/{achievement.threshold}
                      </Text>
                      <ProgressBar 
                        progress={progress} 
                        color={theme.colors.primary}
                        style={styles.progressBar}
                      />
                    </View>
                  )}
                  style={styles.achievementItem}
                />
              );
            })}
          </Card.Content>
        </Card>
      )}

      {/* Achievement Categories */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Achievement Categories</Title>
          <View style={styles.categoryGrid}>
            <Surface style={styles.categoryCard}>
              <View style={styles.categoryContent}>
                <Ionicons name="book" size={32} color="#FF6B6B" />
                <Text style={styles.categoryTitle}>Creation</Text>
                <Text style={styles.categoryDescription}>
                  Achievements for creating comics and content
                </Text>
                <Text style={styles.categoryCount}>
                  {achievements.filter(a => a.condition.includes('created')).length} achievements
                </Text>
              </View>
            </Surface>

            <Surface style={styles.categoryCard}>
              <View style={styles.categoryContent}>
                <Ionicons name="checkmark-circle" size={32} color="#4ECDC4" />
                <Text style={styles.categoryTitle}>Completion</Text>
                <Text style={styles.categoryDescription}>
                  Achievements for finishing projects
                </Text>
                <Text style={styles.categoryCount}>
                  {achievements.filter(a => a.condition.includes('completed')).length} achievements
                </Text>
              </View>
            </Surface>

            <Surface style={styles.categoryCard}>
              <View style={styles.categoryContent}>
                <Ionicons name="people" size={32} color="#45B7D1" />
                <Text style={styles.categoryTitle}>Characters</Text>
                <Text style={styles.categoryDescription}>
                  Achievements for character creation
                </Text>
                <Text style={styles.categoryCount}>
                  {achievements.filter(a => a.condition.includes('characters')).length} achievements
                </Text>
              </View>
            </Surface>

            <Surface style={styles.categoryCard}>
              <View style={styles.categoryContent}>
                <Ionicons name="star" size={32} color="#FFD700" />
                <Text style={styles.categoryTitle}>Special</Text>
                <Text style={styles.categoryDescription}>
                  Special and unique achievements
                </Text>
                <Text style={styles.categoryCount}>
                  {achievements.filter(a => !a.condition.includes('created') && 
                    !a.condition.includes('completed') && 
                    !a.condition.includes('characters')).length} achievements
                </Text>
              </View>
            </Surface>
          </View>
        </Card.Content>
      </Card>

      {/* Tips for Unlocking */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>💡 Tips to Unlock More</Title>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>
              • Create more comics to unlock creation achievements
            </Text>
            <Text style={styles.tipText}>
              • Complete your comics to earn completion badges
            </Text>
            <Text style={styles.tipText}>
              • Design custom characters to unlock character achievements
            </Text>
            <Text style={styles.tipText}>
              • Try different genres to discover special achievements
            </Text>
            <Text style={styles.tipText}>
              • Stay consistent with your comic creation
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Rewards Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>🎁 Rewards</Title>
          <View style={styles.rewardsList}>
            <Text style={styles.rewardText}>
              • Unlock new templates and tools
            </Text>
            <Text style={styles.rewardText}>
              • Access to advanced features
            </Text>
            <Text style={styles.rewardText}>
              • Special character customization options
            </Text>
            <Text style={styles.rewardText}>
              • Premium export formats
            </Text>
            <Text style={styles.rewardText}>
              • Exclusive comic themes and styles
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  overviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  achievementItem: {
    paddingVertical: 8,
  },
  achievementRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  unlockDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 10,
    color: '#999',
  },
  tipsList: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rewardsList: {
    marginTop: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default AchievementsScreen; 