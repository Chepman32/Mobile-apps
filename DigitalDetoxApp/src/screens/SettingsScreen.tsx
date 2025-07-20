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
  Paragraph,
  Button,
  Switch,
  List,
  Divider,
  Text,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
  Snackbar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, AppSettings } from '../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const theme = useTheme();
  const { state, updateSettings, exportData, importData, clearAllData } = useAppContext();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [importDataText, setImportDataText] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { settings } = state;

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    updateSettings({ theme });
  };

  const handleNotificationToggle = (key: keyof AppSettings['notifications'], value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const handleSoundToggle = (key: keyof AppSettings['sound'], value: boolean) => {
    updateSettings({
      sound: {
        ...settings.sound,
        [key]: value,
      },
    });
  };

  const handlePrivacyToggle = (key: keyof AppSettings['privacy'], value: boolean) => {
    updateSettings({
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    });
  };

  const handleAutoBackupToggle = (value: boolean) => {
    updateSettings({
      dataExport: {
        ...settings.dataExport,
        autoBackup: value,
      },
    });
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      await Share.share({
        message: 'Digital Detox App Data',
        title: 'Digital Detox Data Export',
      });
      showSnackbar('Data exported successfully');
      setShowExportDialog(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    try {
      const success = await importData(importDataText);
      if (success) {
        showSnackbar('Data imported successfully');
        setShowImportDialog(false);
        setImportDataText('');
      } else {
        Alert.alert('Error', 'Invalid data format');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import data');
    }
  };

  const handleClearData = async () => {
    try {
      await clearAllData();
      showSnackbar('All data cleared successfully');
      setShowClearDialog(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const getThemeLabel = (theme: string) => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'auto': return 'Auto';
      default: return 'Auto';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Theme Settings */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Appearance</Title>
          <List.Item
            title="Theme"
            description={getThemeLabel(settings.theme)}
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => (
              <SegmentedButtons
                value={settings.theme}
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

      {/* Notification Settings */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Notifications</Title>
          <List.Item
            title="Session Reminders"
            description="Get reminded to start your detox sessions"
            left={() => <List.Icon icon="bell" />}
            right={() => (
              <Switch
                value={settings.notifications.sessionReminders}
                onValueChange={(value) => handleNotificationToggle('sessionReminders', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Goal Reminders"
            description="Get reminded about your detox goals"
            left={() => <List.Icon icon="target" />}
            right={() => (
              <Switch
                value={settings.notifications.goalReminders}
                onValueChange={(value) => handleNotificationToggle('goalReminders', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Streak Reminders"
            description="Get reminded to maintain your streak"
            left={() => <List.Icon icon="fire" />}
            right={() => (
              <Switch
                value={settings.notifications.streakReminders}
                onValueChange={(value) => handleNotificationToggle('streakReminders', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Weekly Reports"
            description="Receive weekly progress reports"
            left={() => <List.Icon icon="chart-line" />}
            right={() => (
              <Switch
                value={settings.notifications.weeklyReports}
                onValueChange={(value) => handleNotificationToggle('weeklyReports', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Achievement Notifications"
            description="Get notified when you unlock achievements"
            left={() => <List.Icon icon="trophy" />}
            right={() => (
              <Switch
                value={settings.notifications.achievementNotifications}
                onValueChange={(value) => handleNotificationToggle('achievementNotifications', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Daily Motivation"
            description="Receive daily motivational messages"
            left={() => <List.Icon icon="heart" />}
            right={() => (
              <Switch
                value={settings.notifications.dailyMotivation}
                onValueChange={(value) => handleNotificationToggle('dailyMotivation', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Sound Settings */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Sound</Title>
          <List.Item
            title="Session Start Sound"
            description="Play sound when starting a session"
            left={() => <List.Icon icon="play" />}
            right={() => (
              <Switch
                value={settings.sound.sessionStart}
                onValueChange={(value) => handleSoundToggle('sessionStart', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Session End Sound"
            description="Play sound when completing a session"
            left={() => <List.Icon icon="stop" />}
            right={() => (
              <Switch
                value={settings.sound.sessionEnd}
                onValueChange={(value) => handleSoundToggle('sessionEnd', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Achievement Sounds"
            description="Play sound when unlocking achievements"
            left={() => <List.Icon icon="trophy" />}
            right={() => (
              <Switch
                value={settings.sound.achievements}
                onValueChange={(value) => handleSoundToggle('achievements', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Privacy Settings */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Privacy</Title>
          <List.Item
            title="Share Statistics"
            description="Allow sharing your detox statistics"
            left={() => <List.Icon icon="share" />}
            right={() => (
              <Switch
                value={settings.privacy.shareStats}
                onValueChange={(value) => handlePrivacyToggle('shareStats', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Share Achievements"
            description="Allow sharing your achievements"
            left={() => <List.Icon icon="trophy" />}
            right={() => (
              <Switch
                value={settings.privacy.shareAchievements}
                onValueChange={(value) => handlePrivacyToggle('shareAchievements', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Data Management</Title>
          <List.Item
            title="Auto Backup"
            description="Automatically backup your data"
            left={() => <List.Icon icon="cloud-upload" />}
            right={() => (
            <Switch
                value={settings.dataExport.autoBackup}
                onValueChange={handleAutoBackupToggle}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Export Data"
            description="Export your data to a file"
            left={() => <List.Icon icon="download" />}
            onPress={() => setShowExportDialog(true)}
          />
          <Divider />
          <List.Item
            title="Import Data"
            description="Import data from a file"
            left={() => <List.Icon icon="upload" />}
            onPress={() => setShowImportDialog(true)}
          />
          <Divider />
          <List.Item
            title="Clear All Data"
            description="Delete all your data permanently"
            left={() => <List.Icon icon="delete" color={theme.colors.error} />}
            onPress={() => setShowClearDialog(true)}
            titleStyle={{ color: theme.colors.error }}
          />
        </Card.Content>
      </Card>

      {/* About Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>About</Title>
          <List.Item
            title="Version"
            description="1.0.0"
            left={() => <List.Icon icon="information" />}
          />
          <Divider />
          <List.Item
            title="Developer"
            description="Digital Detox Team"
            left={() => <List.Icon icon="account-group" />}
          />
          <Divider />
          <List.Item
            title="Support"
            description="Get help and support"
            left={() => <List.Icon icon="help-circle" />}
            onPress={() => {
              // Handle support contact
            }}
          />
        </Card.Content>
      </Card>

      {/* Export Dialog */}
      <Portal>
        <Dialog visible={showExportDialog} onDismiss={() => setShowExportDialog(false)}>
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              This will export all your data including challenges, sessions, goals, and achievements.
              The data will be shared as a JSON file.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExportDialog(false)}>Cancel</Button>
            <Button onPress={handleExportData}>Export</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Import Dialog */}
      <Portal>
        <Dialog visible={showImportDialog} onDismiss={() => setShowImportDialog(false)}>
          <Dialog.Title>Import Data</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Paste your exported data here. This will replace all existing data.
            </Paragraph>
            <TextInput
              label="Data (JSON)"
              value={importDataText}
              onChangeText={setImportDataText}
              multiline
              numberOfLines={10}
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImportDialog(false)}>Cancel</Button>
            <Button onPress={handleImportData}>Import</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Clear Data Dialog */}
      <Portal>
        <Dialog visible={showClearDialog} onDismiss={() => setShowClearDialog(false)}>
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete all your data? This action cannot be undone.
              All your challenges, sessions, goals, and achievements will be permanently deleted.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>Cancel</Button>
            <Button onPress={handleClearData} textColor={theme.colors.error}>
              Clear All Data
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  textInput: {
    marginTop: 16,
  },
});

