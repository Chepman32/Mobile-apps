import React, { useContext, useMemo } from 'react';
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

import { AppContext } from '../context/AppContext';
import { Achievement } from '../types';

const { width } = Dimensions.get('window');

const AchievementsScreen: React.FC = () => {
  const { state } = useContext(AppContext);
  const theme = useTheme();

  const achievements = useMemo(() => {
    const scans = state.scans;
    const subjects = state.subjects;
    const sessions = state.sessions;

    const achievementList: Achievement[] = [
      {
        id: 'first_scan',
        title: 'First Scan',
        description: 'Complete your first scan',
        icon: 'camera',
        category: 'milestone',
        requirement: 1,
        current: scans.length,
        unlocked: scans.length >= 1,
        reward: 'Basic Scanner Badge',
      },
      {
        id: 'scan_master',
        title: 'Scan Master',
        description: 'Complete 50 scans',
        icon: 'camera',
        category: 'milestone',
        requirement: 50,
        current: scans.length,
        unlocked: scans.length >= 50,
        reward: 'Scan Master Badge',
      },
      {
        id: 'perfect_accuracy',
        title: 'Perfect Accuracy',
        description: 'Achieve 100% accuracy on a scan',
        icon: 'target',
        category: 'skill',
        requirement: 1,
        current: scans.filter(s => s.accuracy === 100).length,
        unlocked: scans.some(s => s.accuracy === 100),
        reward: 'Perfect Accuracy Badge',
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete a scan in under 5 seconds',
        icon: 'flash',
        category: 'skill',
        requirement: 1,
        current: scans.filter(s => (s.processingTime || 0) < 5).length,
        unlocked: scans.some(s => (s.processingTime || 0) < 5),
        reward: 'Speed Demon Badge',
      },
      {
        id: 'subject_explorer',
        title: 'Subject Explorer',
        description: 'Scan 5 different subjects',
        icon: 'book',
        category: 'exploration',
        requirement: 5,
        current: new Set(scans.map(s => s.subjectId)).size,
        unlocked: new Set(scans.map(s => s.subjectId)).size >= 5,
        reward: 'Subject Explorer Badge',
      },
      {
        id: 'daily_streak',
        title: 'Daily Streak',
        description: 'Scan for 7 consecutive days',
        icon: 'calendar',
        category: 'consistency',
        requirement: 7,
        current: calculateDailyStreak(scans),
        unlocked: calculateDailyStreak(scans) >= 7,
        reward: 'Daily Streak Badge',
      },
      {
        id: 'high_accuracy',
        title: 'High Accuracy',
        description: 'Maintain 90%+ accuracy over 10 scans',
        icon: 'target',
        category: 'skill',
        requirement: 10,
        current: calculateHighAccuracyStreak(scans),
        unlocked: calculateHighAccuracyStreak(scans) >= 10,
        reward: 'High Accuracy Badge',
      },
      {
        id: 'session_master',
        title: 'Session Master',
        description: 'Complete a scan session with 10+ scans',
        icon: 'timer',
        category: 'endurance',
        requirement: 10,
        current: Math.max(...sessions.map(s => s.scanIds.length), 0),
        unlocked: sessions.some(s => s.scanIds.length >= 10),
        reward: 'Session Master Badge',
      },
      {
        id: 'quick_solver',
        title: 'Quick Solver',
        description: 'Solve 3 problems in under 30 seconds total',
        icon: 'lightning-bolt',
        category: 'skill',
        requirement: 3,
        current: calculateQuickSolverProgress(scans),
        unlocked: calculateQuickSolverProgress(scans) >= 3,
        reward: 'Quick Solver Badge',
      },
      {
        id: 'accuracy_master',
        title: 'Accuracy Master',
        description: 'Achieve 95%+ average accuracy over 20 scans',
        icon: 'trophy',
        category: 'mastery',
        requirement: 20,
        current: calculateAccuracyMasterProgress(scans),
        unlocked: calculateAccuracyMasterProgress(scans) >= 20,
        reward: 'Accuracy Master Badge',
      },
    ];

    return achievementList;
  }, [state.scans, state.subjects, state.sessions]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return theme.colors.primary;
      case 'skill': return theme.colors.secondary;
      case 'exploration': return theme.colors.tertiary;
      case 'consistency': return '#9C27B0';
      case 'endurance': return '#FF5722';
      case 'mastery': return '#FFD700';
      default: return theme.colors.primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone': return 'flag';
      case 'skill': return 'star';
      case 'exploration': return 'compass';
      case 'consistency': return 'calendar';
      case 'endurance': return 'timer';
      case 'mastery': return 'trophy';
      default: return 'star';
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
          {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement, index) => (
            <View key={achievement.id}>
              <List.Item
                title={achievement.title}
                description={achievement.description}
                left={(props) => (
                  <View style={[styles.achievementIcon, { backgroundColor: getCategoryColor(achievement.category) }]}>
                    <Ionicons name={achievement.icon as any} size={24} color="white" />
                  </View>
                )}
                right={() => (
                  <Chip mode="outlined" compact>
                    {achievement.reward}
                  </Chip>
                )}
              />
              {index < Math.min(3, achievements.filter(a => a.unlocked).length) - 1 && <Divider />}
            </View>
          ))}
          {achievements.filter(a => a.unlocked).length === 0 && (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No achievements unlocked yet. Start scanning to earn achievements!
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
                  opacity: achievement.unlocked ? 1 : 0.6,
                  borderColor: achievement.unlocked ? getCategoryColor(achievement.category) : theme.colors.outline,
                }
              ]}>
                <Card.Content>
                  <View style={styles.achievementHeader}>
                    <View style={styles.achievementIconContainer}>
                      <View style={[
                        styles.achievementIcon,
                        { 
                          backgroundColor: achievement.unlocked ? getCategoryColor(achievement.category) : theme.colors.outline,
                        }
                      ]}>
                        <Ionicons name={achievement.icon as any} size={24} color="white" />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text variant="titleMedium" style={styles.achievementTitle}>
                          {achievement.title}
                        </Text>
                        <Text variant="bodySmall" style={styles.achievementDescription}>
                          {achievement.description}
                        </Text>
                        <View style={styles.achievementProgress}>
                          <Text variant="bodySmall">
                            {achievement.current} / {achievement.requirement}
                          </Text>
                          <ProgressBar 
                            progress={Math.min(achievement.current / achievement.requirement, 1)} 
                            color={getCategoryColor(achievement.category)}
                            style={styles.achievementProgressBar}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.achievementReward}>
                      <Chip 
                        mode={achievement.unlocked ? "flat" : "outlined"}
                        compact
                        textStyle={{ fontSize: 10 }}
                      >
                        {achievement.reward}
                      </Chip>
                      {achievement.unlocked && (
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
          {['milestone', 'skill', 'exploration', 'consistency', 'endurance', 'mastery'].map(category => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
            const totalInCategory = categoryAchievements.length;
            
            return (
              <View key={category}>
                <List.Item
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                  description={`${unlockedInCategory} / ${totalInCategory} unlocked`}
                  left={(props) => (
                    <List.Icon {...props} icon={getCategoryIcon(category)} color={getCategoryColor(category)} />
                  )}
                  right={() => (
                    <Text variant="bodySmall" style={{ color: getCategoryColor(category) }}>
                      {totalInCategory > 0 ? ((unlockedInCategory / totalInCategory) * 100).toFixed(0) + '%' : '0%'}
                    </Text>
                  )}
                />
                {category !== 'mastery' && <Divider />}
              </View>
            );
          })}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Helper functions
const calculateDailyStreak = (scans: any[]) => {
  if (scans.length === 0) return 0;
  
  const dates = scans.map(s => new Date(s.createdAt).toDateString());
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

const calculateHighAccuracyStreak = (scans: any[]) => {
  if (scans.length < 10) return 0;
  
  let streak = 0;
  for (let i = scans.length - 1; i >= 0; i--) {
    if (scans[i].accuracy >= 90) {
      streak++;
      if (streak >= 10) break;
    } else {
      break;
    }
  }
  
  return streak;
};

const calculateQuickSolverProgress = (scans: any[]) => {
  // This would need more complex logic based on actual solving time
  // For now, return a placeholder
  return scans.filter(s => s.status === 'successful').length;
};

const calculateAccuracyMasterProgress = (scans: any[]) => {
  if (scans.length < 20) return 0;
  
  const recentScans = scans.slice(-20);
  const averageAccuracy = recentScans.reduce((sum, scan) => sum + (scan.accuracy || 0), 0) / recentScans.length;
  
  return averageAccuracy >= 95 ? 20 : 0;
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