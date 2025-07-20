import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Text,
  useTheme,
  Switch,
  SegmentedButtons,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { usePlantCareGuide } from '../context/PlantCareGuideContext';
import { RootStackParamList } from '../types/navigation';
import { User, Achievement, Statistics } from '../types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { 
    state, 
    loadUser, 
    loadAchievements, 
    loadStatistics, 
    loadNotificationSettings,
    saveUser,
    saveNotificationSettings,
    updateAchievement,
    exportData,
    importData,
    clearAllData,
  } = usePlantCareGuide();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'statistics' | 'settings'>('profile');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadUser(),
        loadAchievements(),
        loadStatistics(),
        loadNotificationSettings(),
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

  const handleExportData = async () => {
    try {
      const data = exportData();
      // In a real app, you would save this to a file or share it
      Alert.alert('Export Successful', 'Your data has been exported successfully!');
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export your data.');
    }
  };

  const handleImportData = async () => {
    Alert.alert(
      'Import Data',
      'This will replace all your current data. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            try {
              // In a real app, you would read from a file
              const sampleData = '{"user": null, "plants": [], "userPlants": []}';
              const success = await importData(sampleData);
              if (success) {
                Alert.alert('Import Successful', 'Your data has been imported successfully!');
              } else {
                Alert.alert('Import Failed', 'Failed to import data. Please check the file format.');
              }
            } catch (error) {
              Alert.alert('Import Failed', 'Failed to import data.');
            }
          },
        },
      ]
    );
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your data. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Data Cleared', 'All data has been cleared successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleNotificationToggle = async (setting: keyof typeof state.notificationSettings) => {
    try {
      const updatedSettings = {
        ...state.notificationSettings,
        [setting]: !state.notificationSettings[setting],
      };
      await saveNotificationSettings(updatedSettings);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const getAchievementProgress = (achievement: Achievement) => {
    return Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  };

  const getAchievementColor = (achievement: Achievement) => {
    if (achievement.isUnlocked) return theme.colors.primary;
    const progress = getAchievementProgress(achievement);
    if (progress >= 75) return theme.colors.secondary;
    if (progress >= 50) return '#FF9800';
    return theme.colors.outline;
  };

  if (state.loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'profile' | 'achievements' | 'statistics' | 'settings')}
          buttons={[
            { value: 'profile', label: 'Profile' },
            { value: 'achievements', label: 'Achievements' },
            { value: 'statistics', label: 'Stats' },
            { value: 'settings', label: 'Settings' },
          ]}
          style={styles.tabButtons}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'profile' && (
          <>
            {/* User Profile */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.profileHeader}>
                  <Avatar.Icon
                    size={80}
                    icon="account"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <View style={styles.profileInfo}>
                    <Title style={{ color: theme.colors.onSurface }}>
                      {state.user?.name || 'Plant Care Enthusiast'}
                    </Title>
                    <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                      {state.user?.email || 'gardener@example.com'}
                    </Paragraph>
                    <Chip
                      mode="outlined"
                      textStyle={{ fontSize: 10 }}
                      style={{ marginTop: 8 }}
                    >
                      {state.userPlants.length} plants
                    </Chip>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Quick Stats */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: theme.colors.onSurface }}>Quick Stats</Title>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                      {state.statistics.totalPlants}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Total Plants
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
                      {state.statistics.healthyPlants}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Healthy
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.tertiary }]}>
                      {state.statistics.careStreak}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Day Streak
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.error }]}>
                      {state.statistics.plantsNeedingCare}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Need Care
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Recent Activity */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: theme.colors.onSurface }}>Recent Activity</Title>
                {state.careLogs.slice(0, 5).map((log) => (
                  <List.Item
                    key={log.id}
                    title={`${log.type} - ${log.userPlant.nickname || log.userPlant.plant.name}`}
                    description={new Date(log.date).toLocaleDateString()}
                    left={() => (
                      <List.Icon 
                        icon={log.type === 'watering' ? 'water' : 'leaf'} 
                      />
                    )}
                  />
                ))}
                {state.careLogs.length === 0 && (
                  <Paragraph style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                    No recent activity. Start caring for your plants!
                  </Paragraph>
                )}
              </Card.Content>
            </Card>
          </>
        )}

        {activeTab === 'achievements' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: theme.colors.onSurface }}>Achievements</Title>
                <Text style={[styles.achievementCount, { color: theme.colors.onSurfaceVariant }]}>
                  {state.achievements.filter(a => a.isUnlocked).length} of {state.achievements.length} unlocked
                </Text>
              </Card.Content>
            </Card>

            {state.achievements.map((achievement) => (
              <Card key={achievement.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                  <View style={styles.achievementHeader}>
                    <Avatar.Icon
                      size={50}
                      icon={achievement.icon}
                      style={{ backgroundColor: getAchievementColor(achievement) }}
                    />
                    <View style={styles.achievementInfo}>
                      <Title style={{ color: theme.colors.onSurface }}>
                        {achievement.title}
                      </Title>
                      <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                        {achievement.description}
                      </Paragraph>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${getAchievementProgress(achievement)}%`,
                                backgroundColor: getAchievementColor(achievement),
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                          {achievement.progress}/{achievement.maxProgress}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'statistics' && (
          <>
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: theme.colors.onSurface }}>Plant Care Statistics</Title>
                <View style={styles.statsList}>
                  <List.Item
                    title="Total Plants"
                    description={state.statistics.totalPlants.toString()}
                    left={() => <List.Icon icon="flower" />}
                  />
                  <List.Item
                    title="Healthy Plants"
                    description={state.statistics.healthyPlants.toString()}
                    left={() => <List.Icon icon="heart" />}
                  />
                  <List.Item
                    title="Plants Needing Care"
                    description={state.statistics.plantsNeedingCare.toString()}
                    left={() => <List.Icon icon="alert" />}
                  />
                  <List.Item
                    title="Total Care Logs"
                    description={state.statistics.totalCareLogs.toString()}
                    left={() => <List.Icon icon="clipboard-list" />}
                  />
                  <List.Item
                    title="Average Health Score"
                    description={`${state.statistics.averageHealthScore.toFixed(1)}/10`}
                    left={() => <List.Icon icon="chart-line" />}
                  />
                  <List.Item
                    title="Longest Plant Age"
                    description={`${state.statistics.longestPlantAge} days`}
                    left={() => <List.Icon icon="calendar" />}
                  />
                  <List.Item
                    title="Care Streak"
                    description={`${state.statistics.careStreak} days`}
                    left={() => <List.Icon icon="fire" />}
                  />
                </View>
              </Card.Content>
            </Card>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* Notification Settings */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: theme.colors.onSurface }}>Notification Settings</Title>
                <List.Item
                  title="Watering Reminders"
                  description="Get notified when plants need watering"
                  left={() => <List.Icon icon="water" />}
                  right={() => (
                    <Switch
                      value={state.notificationSettings.wateringReminders}
                      onValueChange={() => handleNotificationToggle('wateringReminders')}
                    />
                  )}
                />
                <List.Item
                  title="Fertilizing Reminders"
                  description="Get notified when plants need fertilizing"
                  left={() => <List.Icon icon="leaf" />}
                  right={() => (
                    <Switch
                      value={state.notificationSettings.fertilizingReminders}
                      onValueChange={() => handleNotificationToggle('fertilizingReminders')}
                    />
                  )}
                />
                <List.Item
                  title="Repotting Reminders"
                  description="Get notified when plants need repotting"
                  left={() => <List.Icon icon="flower-pot" />}
                  right={() => (
                    <Switch
                      value={state.notificationSettings.repottingReminders}
                      onValueChange={() => handleNotificationToggle('repottingReminders')}
                    />
                  )}
                />
                <List.Item
                  title="Pruning Reminders"
                  description="Get notified when plants need pruning"
                  left={() => <List.Icon icon="scissors-cutting" />}
                  right={() => (
                    <Switch
                      value={state.notificationSettings.pruningReminders}
                      onValueChange={() => handleNotificationToggle('pruningReminders')}
                    />
                  )}
                />
                <List.Item
                  title="Pest Control Reminders"
                  description="Get notified for pest control tasks"
                  left={() => <List.Icon icon="bug" />}
                  right={() => (
                    <Switch
                      value={state.notificationSettings.pestControlReminders}
                      onValueChange={() => handleNotificationToggle('pestControlReminders')}
                    />
                  )}
                />
                <List.Item
                  title="Custom Reminders"
                  description="Get notified for custom care tasks"
                  left={() => <List.Icon icon="bell" />}
                  right={() => (
                    <Switch
                      value={state.notificationSettings.customReminders}
                      onValueChange={() => handleNotificationToggle('customReminders')}
                    />
                  )}
                />
              </Card.Content>
            </Card>

            {/* Data Management */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: theme.colors.onSurface }}>Data Management</Title>
                <Button
                  mode="outlined"
                  icon="download"
                  onPress={handleExportData}
                  style={styles.settingButton}
                >
                  Export Data
                </Button>
                <Button
                  mode="outlined"
                  icon="upload"
                  onPress={handleImportData}
                  style={styles.settingButton}
                >
                  Import Data
                </Button>
                <Button
                  mode="outlined"
                  icon="delete"
                  onPress={handleClearData}
                  style={[styles.settingButton, { borderColor: theme.colors.error }]}
                  textColor={theme.colors.error}
                >
                  Clear All Data
                </Button>
              </Card.Content>
            </Card>

            {/* App Info */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Title style={{ color: theme.colors.onSurface }}>App Information</Title>
                <List.Item
                  title="Version"
                  description="1.0.0"
                  left={() => <List.Icon icon="information" />}
                />
                <List.Item
                  title="Build"
                  description="2024.1.0"
                  left={() => <List.Icon icon="code-tags" />}
                />
                <List.Item
                  title="Data Storage"
                  description="Local (MMKV)"
                  left={() => <List.Icon icon="database" />}
                />
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  tabContainer: {
    padding: 16,
  },
  tabButtons: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  achievementCount: {
    fontSize: 14,
    marginTop: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
  },
  statsList: {
    marginTop: 8,
  },
  settingButton: {
    marginBottom: 8,
  },
}); 