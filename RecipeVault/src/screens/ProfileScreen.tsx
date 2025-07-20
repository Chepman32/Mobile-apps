import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Avatar,
  List,
  useTheme,
  IconButton,
  SegmentedButtons,
  Portal,
  Dialog,
  ProgressBar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { Statistics, Achievement, CookingSession } from '../types';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, actions } = useRecipeVault();
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);

  const {
    recipes,
    cookingSessions,
    statistics,
    achievements,
  } = state;

  const totalRecipes = recipes.length;
  const totalCookingTime = cookingSessions.reduce((total, session) => total + session.duration, 0);
  const completedSessions = cookingSessions.filter(session => session.status === 'completed');
  const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);

  const renderOverview = () => (
    <View>
      {/* User Stats */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Your Cooking Stats
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
                {totalRecipes}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Total Recipes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineLarge" style={{ color: theme.colors.secondary }}>
                {Math.round(totalCookingTime / 60)}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Hours Cooked
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineLarge" style={{ color: theme.colors.tertiary }}>
                {completedSessions.length}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Sessions Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineLarge" style={{ color: theme.colors.error }}>
                {favoriteRecipes.length}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Favorites
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Recent Activity
          </Text>
          {cookingSessions.slice(0, 3).map((session, index) => (
            <List.Item
              key={session.id}
              title={session.recipe?.title || 'Unknown Recipe'}
              description={`${session.duration} min • ${new Date(session.startTime).toLocaleDateString()}`}
              left={(props) => (
                <List.Icon {...props} icon="chef-hat" />
              )}
              right={(props) => (
                <Chip
                  mode="outlined"
                  compact
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                >
                  {session.status}
                </Chip>
              )}
              style={styles.activityItem}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <Button
              mode="contained-tonal"
              icon="plus"
              onPress={() => navigation.navigate('AddRecipe' as never)}
              style={styles.quickActionButton}
            >
              Add Recipe
            </Button>
            <Button
              mode="contained-tonal"
              icon="calendar"
              onPress={() => navigation.navigate('MealPlans' as never)}
              style={styles.quickActionButton}
            >
              Plan Meals
            </Button>
            <Button
              mode="contained-tonal"
              icon="cart"
              onPress={() => navigation.navigate('Shopping' as never)}
              style={styles.quickActionButton}
            >
              Shopping List
            </Button>
            <Button
              mode="contained-tonal"
              icon="chart-line"
              onPress={() => setActiveTab('statistics')}
              style={styles.quickActionButton}
            >
              View Stats
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderAchievements = () => (
    <View>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Achievements
          </Text>
          {achievements.map((achievement, index) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {achievement.title}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {achievement.description}
                </Text>
                <ProgressBar
                  progress={achievement.progress / achievement.target}
                  style={styles.progressBar}
                />
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {achievement.progress} / {achievement.target}
                </Text>
              </View>
              {achievement.isUnlocked && (
                <Chip
                  mode="flat"
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                >
                  Unlocked
                </Chip>
              )}
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderStatistics = () => (
    <View>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Cooking Statistics
          </Text>
          {statistics && (
            <View>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  Total Cooking Time
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  {Math.round(statistics.totalCookingTime / 60)} hours
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  Average Session Duration
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
                  {Math.round(statistics.averageSessionDuration)} min
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  Most Cooked Recipe
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.tertiary }}>
                  {statistics.mostCookedRecipe || 'None'}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  Favorite Cuisine
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                  {statistics.favoriteCuisine || 'None'}
                </Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const renderSettings = () => (
    <View>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Data Management
          </Text>
          <List.Item
            title="Export Data"
            description="Export all your recipes and data"
            left={(props) => <List.Icon {...props} icon="download" />}
            onPress={() => setShowExportDialog(true)}
            style={styles.settingItem}
          />
          <List.Item
            title="Import Data"
            description="Import recipes from backup"
            left={(props) => <List.Icon {...props} icon="upload" />}
            onPress={() => {
              // TODO: Implement import functionality
              Alert.alert('Import', 'Import functionality coming soon!');
            }}
            style={styles.settingItem}
          />
          <List.Item
            title="Clear All Data"
            description="Delete all recipes and data"
            left={(props) => <List.Icon {...props} icon="delete" />}
            onPress={() => setShowClearDataDialog(true)}
            style={styles.settingItem}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            App Settings
          </Text>
          <List.Item
            title="Notifications"
            description="Manage cooking reminders"
            left={(props) => <List.Icon {...props} icon="bell" />}
            onPress={() => {
              // TODO: Implement notification settings
              Alert.alert('Notifications', 'Notification settings coming soon!');
            }}
            style={styles.settingItem}
          />
          <List.Item
            title="Theme"
            description="Change app appearance"
            left={(props) => <List.Icon {...props} icon="palette" />}
            onPress={() => {
              // TODO: Implement theme settings
              Alert.alert('Theme', 'Theme settings coming soon!');
            }}
            style={styles.settingItem}
          />
          <List.Item
            title="About"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="information" />}
            onPress={() => {
              Alert.alert('About Recipe Vault', 'Version 1.0.0\n\nA comprehensive recipe management app for cooking enthusiasts.');
            }}
            style={styles.settingItem}
          />
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          Profile
        </Text>
      </View>

      {/* Tab Navigation */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'overview', label: 'Overview' },
          { value: 'achievements', label: 'Achievements' },
          { value: 'statistics', label: 'Statistics' },
          { value: 'settings', label: 'Settings' },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'statistics' && renderStatistics()}
        {activeTab === 'settings' && renderSettings()}
      </ScrollView>

      {/* Export Dialog */}
      <Portal>
        <Dialog
          visible={showExportDialog}
          onDismiss={() => setShowExportDialog(false)}
        >
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Export all your recipes, meal plans, and cooking data to a backup file?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExportDialog(false)}>Cancel</Button>
            <Button onPress={async () => {
              try {
                await actions.exportData();
                Alert.alert('Success', 'Data exported successfully!');
                setShowExportDialog(false);
              } catch (error) {
                Alert.alert('Error', 'Failed to export data');
              }
            }}>
              Export
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Clear Data Dialog */}
      <Portal>
        <Dialog
          visible={showClearDataDialog}
          onDismiss={() => setShowClearDataDialog(false)}
        >
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete all recipes, meal plans, and cooking data? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDataDialog(false)}>Cancel</Button>
            <Button
              onPress={async () => {
                try {
                  await actions.clearAllData();
                  Alert.alert('Success', 'All data cleared successfully!');
                  setShowClearDataDialog(false);
                } catch (error) {
                  Alert.alert('Error', 'Failed to clear data');
                }
              }}
              textColor={theme.colors.error}
            >
              Clear All
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  segmentedButtons: {
    margin: 16,
    marginTop: 0,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: '45%',
    alignItems: 'center',
  },
  activityItem: {
    paddingVertical: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  progressBar: {
    marginVertical: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingItem: {
    paddingVertical: 4,
  },
});

export default ProfileScreen; 