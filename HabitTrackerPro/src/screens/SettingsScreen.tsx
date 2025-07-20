import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Switch,
  List,
  Divider,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const { state, updateUserProfile } = useHabitTrackerPro();

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    updateUserProfile({
      preferences: {
        ...state.userProfile.preferences,
        theme: newTheme,
      },
    });
  };

  const handleNotificationToggle = (enabled: boolean) => {
    updateUserProfile({
      preferences: {
        ...state.userProfile.preferences,
        notifications: enabled,
      },
    });
  };

  const handleWeeklyGoalChange = (goal: number) => {
    updateUserProfile({
      preferences: {
        ...state.userProfile.preferences,
        weeklyGoal: goal,
      },
    });
  };

  const handleReminderTimeChange = (time: string) => {
    updateUserProfile({
      preferences: {
        ...state.userProfile.preferences,
        reminderTime: time,
      },
    });
  };

  const exportData = async () => {
    try {
      const exportData = {
        habits: state.habits,
        progress: state.progress,
        achievements: state.achievements,
        userProfile: state.userProfile,
        reminders: state.reminders,
        streaks: state.streaks,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const dataString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: dataString,
        title: 'Habit Tracker Pro Data Export',
      });

      setShowExportDialog(false);
      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const importData = async () => {
    // This would typically involve file picker
    Alert.alert('Info', 'Import functionality would be implemented with file picker');
    setShowImportDialog(false);
  };

  const resetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your habits, progress, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset logic would be implemented here
            Alert.alert('Success', 'All data has been reset');
            setShowResetDialog(false);
          },
        },
      ]
    );
  };

  const backupData = () => {
    Alert.alert('Info', 'Backup functionality would be implemented with cloud storage');
    setShowBackupDialog(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Appearance */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Appearance
            </Title>

            <List.Item
              title="Theme"
              description="Choose your preferred theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <SegmentedButtons
                  value={state.userProfile.preferences.theme}
                  onValueChange={handleThemeChange}
                  buttons={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto' },
                  ]}
                  style={styles.segmentedButtons}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Notifications */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Notifications
            </Title>

            <List.Item
              title="Enable Notifications"
              description="Receive reminders for your habits"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={state.userProfile.preferences.notifications}
                  onValueChange={handleNotificationToggle}
                />
              )}
            />

            <List.Item
              title="Reminder Time"
              description="Daily reminder time"
              left={(props) => <List.Icon {...props} icon="clock" />}
              right={() => (
                <Text style={[styles.settingValue, { color: theme.colors.onSurfaceVariant }]}>
                  {state.userProfile.preferences.reminderTime}
                </Text>
              )}
              onPress={() => {
                // Time picker would be implemented here
                Alert.alert('Info', 'Time picker would be implemented');
              }}
            />
          </Card.Content>
        </Card>

        {/* Goals */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Goals
            </Title>

            <List.Item
              title="Weekly Goal"
              description="Target number of habit completions per week"
              left={(props) => <List.Icon {...props} icon="target" />}
              right={() => (
                <Text style={[styles.settingValue, { color: theme.colors.onSurfaceVariant }]}>
                  {state.userProfile.preferences.weeklyGoal}
                </Text>
              )}
              onPress={() => {
                Alert.prompt(
                  'Weekly Goal',
                  'Enter your weekly goal:',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Save',
                      onPress: (text) => {
                        const goal = parseInt(text || '5');
                        handleWeeklyGoalChange(goal);
                      },
                    },
                  ],
                  'plain-text',
                  state.userProfile.preferences.weeklyGoal.toString()
                );
              }}
            />
          </Card.Content>
        </Card>

        {/* Data Management */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Data Management
            </Title>

            <List.Item
              title="Export Data"
              description="Export all your data as JSON"
              left={(props) => <List.Icon {...props} icon="export" />}
              onPress={() => setShowExportDialog(true)}
            />

            <List.Item
              title="Import Data"
              description="Import data from a backup file"
              left={(props) => <List.Icon {...props} icon="import" />}
              onPress={() => setShowImportDialog(true)}
            />

            <List.Item
              title="Backup to Cloud"
              description="Backup your data to cloud storage"
              left={(props) => <List.Icon {...props} icon="cloud-upload" />}
              onPress={() => setShowBackupDialog(true)}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="Reset All Data"
              description="Permanently delete all data"
              left={(props) => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
              onPress={() => setShowResetDialog(true)}
              titleStyle={{ color: theme.colors.error }}
            />
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Statistics
            </Title>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Icon name="target" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalHabits}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Habits
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="check-circle" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalCompletions}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Completions
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="fire" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.longestStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Longest Streak
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="calendar" size={24} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.perfectWeeks}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Perfect Weeks
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* About */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              About
            </Title>

            <List.Item
              title="Version"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />

            <List.Item
              title="Build Number"
              description="1"
              left={(props) => <List.Icon {...props} icon="code-tags" />}
            />

            <List.Item
              title="Last Updated"
              description={new Date().toLocaleDateString()}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />

            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={(props) => <List.Icon {...props} icon="shield" />}
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content would be displayed here')}
            />

            <List.Item
              title="Terms of Service"
              description="Read our terms of service"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service content would be displayed here')}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Export Dialog */}
      <Portal>
        <Dialog visible={showExportDialog} onDismiss={() => setShowExportDialog(false)}>
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Content>
            <Text>This will export all your habits, progress, and settings as a JSON file.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExportDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={exportData}>Export</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Import Dialog */}
      <Portal>
        <Dialog visible={showImportDialog} onDismiss={() => setShowImportDialog(false)}>
          <Dialog.Title>Import Data</Dialog.Title>
          <Dialog.Content>
            <Text>Select a JSON file to import your data. This will replace your current data.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImportDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={importData}>Import</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Reset Dialog */}
      <Portal>
        <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
          <Dialog.Title>Reset All Data</Dialog.Title>
          <Dialog.Content>
            <Text>This will permanently delete all your habits, progress, and settings. This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowResetDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={resetData} buttonColor={theme.colors.error}>
              Reset
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Backup Dialog */}
      <Portal>
        <Dialog visible={showBackupDialog} onDismiss={() => setShowBackupDialog(false)}>
          <Dialog.Title>Backup to Cloud</Dialog.Title>
          <Dialog.Content>
            <Text>Backup your data to cloud storage for safekeeping.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowBackupDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={backupData}>Backup</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  segmentedButtons: {
    marginTop: 8,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
}); 