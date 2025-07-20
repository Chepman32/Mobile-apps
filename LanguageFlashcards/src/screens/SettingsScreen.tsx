import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import {
  List,
  Switch,
  Divider,
  Button,
  Text,
  Card,
  useTheme,
  SegmentedButtons,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';
import { UserPreferences, NotificationSettings } from '../types';

const SettingsScreen: React.FC = () => {
  const { state, updateUser, exportData, importData, clearAllData } = useLanguageFlashcards();
  const theme = useTheme();
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importDataText, setImportDataText] = useState('');

  const user = state.user;

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          theme,
        },
      });
    }
  };

  const handleNotificationToggle = (enabled: boolean) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          notifications: enabled,
        },
      });
    }
  };

  const handleSoundToggle = (enabled: boolean) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          soundEnabled: enabled,
        },
      });
    }
  };

  const handleAutoPlayToggle = (enabled: boolean) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          autoPlay: enabled,
        },
      });
    }
  };

  const handleStudyRemindersToggle = (enabled: boolean) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          studyReminders: enabled,
        },
      });
    }
  };

  const handleDailyGoalChange = (goal: number) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          dailyGoal: goal,
        },
      });
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const fileName = `languageflashcards_export_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, data);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Export Complete', `Data exported to ${fileName}`);
      }
      
      setShowExportDialog(false);
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    try {
      if (!importDataText.trim()) {
        Alert.alert('Import Error', 'Please enter valid JSON data');
        return;
      }

      const success = await importData(importDataText);
      if (success) {
        Alert.alert('Import Success', 'Data imported successfully');
        setShowImportDialog(false);
        setImportDataText('');
      } else {
        Alert.alert('Import Error', 'Invalid data format');
      }
    } catch (error) {
      Alert.alert('Import Error', 'Failed to import data');
    }
  };

  const handleClearData = () => {
    setShowClearDataDialog(true);
  };

  const confirmClearData = async () => {
    try {
      await clearAllData();
      setShowClearDataDialog(false);
      Alert.alert('Data Cleared', 'All data has been cleared successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out LanguageFlashcards - the smart spaced repetition learning app!',
        url: 'https://expo.dev/@your-username/languageflashcards',
      });
    } catch (error) {
      Alert.alert('Share Error', 'Failed to share app');
    }
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'This would open the app store rating page');
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'This would open email or support chat');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'This would open the privacy policy page');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'This would open the terms of service page');
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorText}>
              User not found
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title="Appearance" />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Customize the app's appearance and theme
          </Text>
          <View style={styles.segmentedContainer}>
            <SegmentedButtons
              value={user.preferences.theme}
              onValueChange={handleThemeChange}
              buttons={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto' },
              ]}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Study Preferences" />
        <Card.Content>
          <List.Item
            title="Daily Goal"
            description={`${user.preferences.dailyGoal} cards per day`}
            left={(props) => <List.Icon {...props} icon="target" />}
            onPress={() => {
              Alert.prompt(
                'Set Daily Goal',
                'Enter number of cards to study per day:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Set',
                    onPress: (value) => {
                      const goal = parseInt(value || '50');
                      if (goal > 0) {
                        handleDailyGoalChange(goal);
                      }
                    },
                  },
                ],
                'plain-text',
                user.preferences.dailyGoal.toString()
              );
            }}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Auto Play Audio"
            description="Automatically play pronunciation audio"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={user.preferences.autoPlay}
                onValueChange={handleAutoPlayToggle}
              />
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Sound Effects"
            description="Play sound effects during study"
            left={(props) => <List.Icon {...props} icon="music" />}
            right={() => (
              <Switch
                value={user.preferences.soundEnabled}
                onValueChange={handleSoundToggle}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Notifications" />
        <Card.Content>
          <List.Item
            title="Enable Notifications"
            description="Receive notifications for study reminders"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={user.preferences.notifications}
                onValueChange={handleNotificationToggle}
              />
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Study Reminders"
            description="Daily reminders to study"
            left={(props) => <List.Icon {...props} icon="calendar" />}
            right={() => (
              <Switch
                value={user.preferences.studyReminders}
                onValueChange={handleStudyRemindersToggle}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Data Management" />
        <Card.Content>
          <List.Item
            title="Export Data"
            description="Export all your data to a file"
            left={(props) => <List.Icon {...props} icon="export" />}
            onPress={() => setShowExportDialog(true)}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Import Data"
            description="Import data from a backup file"
            left={(props) => <List.Icon {...props} icon="import" />}
            onPress={() => setShowImportDialog(true)}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Clear All Data"
            description="Delete all decks, cards, and settings"
            left={(props) => <List.Icon {...props} icon="delete" />}
            onPress={handleClearData}
            titleStyle={{ color: theme.colors.error }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="App Information" />
        <Card.Content>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Share App"
            description="Share LanguageFlashcards with friends"
            left={(props) => <List.Icon {...props} icon="share" />}
            onPress={handleShareApp}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Rate App"
            description="Rate us on the App Store"
            left={(props) => <List.Icon {...props} icon="star" />}
            onPress={handleRateApp}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Contact Support"
            description="Get help and support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={handleContactSupport}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Legal" />
        <Card.Content>
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={(props) => <List.Icon {...props} icon="shield" />}
            onPress={handlePrivacyPolicy}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Terms of Service"
            description="Read our terms of service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={handleTermsOfService}
          />
        </Card.Content>
      </Card>

      <View style={styles.statsContainer}>
        <Text variant="titleMedium" style={styles.statsTitle}>App Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {state.decks.length}
            </Text>
            <Text variant="bodySmall">Total Decks</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {state.flashcards.length}
            </Text>
            <Text variant="bodySmall">Total Cards</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {state.studySessions.length}
            </Text>
            <Text variant="bodySmall">Study Sessions</Text>
          </View>
        </View>
      </View>

      <Portal>
        <Dialog visible={showClearDataDialog} onDismiss={() => setShowClearDataDialog(false)}>
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to clear all data? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDataDialog(false)}>Cancel</Button>
            <Button onPress={confirmClearData} textColor={theme.colors.error}>
              Clear All
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showExportDialog} onDismiss={() => setShowExportDialog(false)}>
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Export all your decks, cards, and settings to a JSON file?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExportDialog(false)}>Cancel</Button>
            <Button onPress={handleExportData}>Export</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showImportDialog} onDismiss={() => setShowImportDialog(false)}>
          <Dialog.Title>Import Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.importDescription}>
              Paste your exported JSON data here:
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={8}
              value={importDataText}
              onChangeText={setImportDataText}
              placeholder="Paste JSON data here..."
              style={styles.importInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImportDialog(false)}>Cancel</Button>
            <Button onPress={handleImportData}>Import</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.7,
  },
  segmentedContainer: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
  statsContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  statsTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  importDescription: {
    marginBottom: 12,
  },
  importInput: {
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default SettingsScreen; 