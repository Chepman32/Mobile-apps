import React, { useContext, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  ProgressBar,
  useTheme,
  Chip,
  Button,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { Achievement } from '../types';

export default function AchievementsScreen({ navigation }: any) {
  const theme = useTheme();
  const { state } = useContext(PlantCareGuideContext);

  const userAchievements = useMemo(() => {
    return state.achievements.map(achievement => {
      const userAchievement = state.userAchievements.find(ua => ua.achievementId === achievement.id);
      return {
        ...achievement,
        unlocked: userAchievement?.unlocked || false,
        progress: userAchievement?.progress || 0,
        unlockedAt: userAchievement?.unlockedAt,
      };
    });
  }, [state.achievements, state.userAchievements]);

  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  const totalCount = userAchievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'care': return '🌱';
      case 'collection': return '🪴';
      case 'knowledge': return '📚';
      case 'consistency': return '📅';
      case 'growth': return '📈';
      case 'community': return '👥';
      case 'special': return '🏆';
      default: return '🎖️';
    }
  };

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#4caf50';
      case 'uncommon': return '#2196f3';
      case 'rare': return '#9c27b0';
      case 'epic': return '#ff9800';
      case 'legendary': return '#f44336';
      default: return '#666';
    }
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return '#4caf50';
    if (percentage >= 75) return '#ff9800';
    if (percentage >= 50) return '#2196f3';
    return '#666';
  };

  const renderAchievementItem = ({ item: achievement }: { item: Achievement & { unlocked: boolean; progress: number; unlockedAt?: string } }) => {
    const progressPercentage = Math.min((achievement.progress / achievement.target) * 100, 100);
    const isCompleted = achievement.unlocked;
    
    return (
      <Card style={[styles.achievementCard, isCompleted && styles.completedCard]}>
        <Card.Content>
          <View style={styles.achievementHeader}>
            <View style={styles.achievementIcon}>
              <Text style={styles.iconText}>{getAchievementIcon(achievement.category)}</Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text variant="titleMedium" style={styles.achievementTitle}>
                {achievement.title}
              </Text>
              <Text variant="bodySmall" style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <View style={styles.achievementMeta}>
                <Chip
                  mode="outlined"
                  style={[styles.rarityChip, { borderColor: getAchievementColor(achievement.rarity) }]}
                  textStyle={{ color: getAchievementColor(achievement.rarity) }}
                >
                  {achievement.rarity}
                </Chip>
                <Text variant="bodySmall" style={styles.category}>
                  {achievement.category}
                </Text>
              </View>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedIcon}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text variant="bodySmall" style={styles.progressText}>
                Progress: {achievement.progress} / {achievement.target}
              </Text>
              <Text variant="bodySmall" style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <ProgressBar
              progress={progressPercentage / 100}
              color={getProgressColor(achievement.progress, achievement.target)}
              style={styles.progressBar}
            />
          </View>

          {isCompleted && achievement.unlockedAt && (
            <Text variant="bodySmall" style={styles.unlockedDate}>
              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}

          {achievement.rewards && achievement.rewards.length > 0 && (
            <View style={styles.rewardsSection}>
              <Text variant="titleSmall" style={styles.rewardsTitle}>
                Rewards:
              </Text>
              {achievement.rewards.map((reward, index) => (
                <Text key={index} variant="bodySmall" style={styles.reward}>
                  • {reward}
                </Text>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const groupedAchievements = useMemo(() => {
    const groups: Record<string, (Achievement & { unlocked: boolean; progress: number; unlockedAt?: string })[]> = {};
    
    userAchievements.forEach(achievement => {
      if (!groups[achievement.category]) {
        groups[achievement.category] = [];
      }
      groups[achievement.category].push(achievement);
    });

    return groups;
  }, [userAchievements]);

  const renderCategorySection = ({ item: category }: { item: string }) => {
    const achievements = groupedAchievements[category];
    const unlockedInCategory = achievements.filter(a => a.unlocked).length;
    const totalInCategory = achievements.length;

    return (
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{getAchievementIcon(category)}</Text>
          <View style={styles.categoryInfo}>
            <Text variant="titleMedium" style={styles.categoryTitle}>
              {category.replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
            <Text variant="bodySmall" style={styles.categoryProgress}>
              {unlockedInCategory} / {totalInCategory} completed
            </Text>
          </View>
        </View>
        {achievements.map(achievement => (
          <View key={achievement.id} style={styles.achievementWrapper}>
            {renderAchievementItem({ item: achievement })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.statsTitle}>
            Achievement Progress
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {unlockedCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Unlocked
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {totalCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {Math.round(completionPercentage)}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Complete
              </Text>
            </View>
          </View>
          <ProgressBar
            progress={completionPercentage / 100}
            color={theme.colors.primary}
            style={styles.overallProgress}
          />
        </Card.Content>
      </Card>

      <FlatList
        data={Object.keys(groupedAchievements)}
        renderItem={renderCategorySection}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                No Achievements
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Start caring for your plants to unlock achievements!
              </Text>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsCard: {
    margin: 16,
    elevation: 2,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  overallProgress: {
    height: 8,
    borderRadius: 4,
  },
  listContainer: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
  categoryProgress: {
    color: '#666',
  },
  achievementWrapper: {
    marginBottom: 8,
  },
  achievementCard: {
    elevation: 2,
  },
  completedCard: {
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    color: '#666',
    marginBottom: 8,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rarityChip: {
    height: 24,
  },
  category: {
    color: '#666',
    textTransform: 'capitalize',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    color: '#666',
  },
  progressPercentage: {
    color: '#666',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  unlockedDate: {
    color: '#4caf50',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  rewardsSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  rewardsTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reward: {
    color: '#666',
    marginLeft: 8,
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 