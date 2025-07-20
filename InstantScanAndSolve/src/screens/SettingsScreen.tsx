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
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { AppContext } from '../context/AppContext';
import { Settings } from '../types';

const SettingsScreen: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const theme = useTheme();
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme } });
  };

  const handleNotificationToggle = (enabled: boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { notifications: enabled } });
  };

  const handleAutoSaveToggle = (enabled: boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { autoSave: enabled } });
  };

  const handleHighQualityToggle = (enabled: boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { highQualityScans: enabled } });
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        scans: state.scans,
        subjects: state.subjects,
        sessions: state.sessions,
        userProfile: state.userProfile,
        settings: state.settings,
        statistics: state.statistics,
        achievements: state.achievements,
        exportDate: new Date().toISOString(),
      };

      const fileName = `instantscan_export_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2));
      
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
    Alert.alert('Import Data', 'Import functionality would be implemented here');
  };

  const handleClearData = () => {
    setShowClearDataDialog(true);
  };

  const confirmClearData = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    setShowClearDataDialog(false);
    Alert.alert('Data Cleared', 'All data has been cleared successfully');
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out InstantScan - the smart scanning and solving app!',
        url: 'https://expo.dev/@your-username/instantscan',
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
              value={state.settings.theme}
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
        <Card.Title title="Notifications" />
        <Card.Content>
          <List.Item
            title="Enable Notifications"
            description="Receive notifications for scan results and achievements"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={state.settings.notifications}
                onValueChange={handleNotificationToggle}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Scan Settings" />
        <Card.Content>
          <List.Item
            title="Auto Save Scans"
            description="Automatically save all scan results"
            left={(props) => <List.Icon {...props} icon="content-save" />}
            right={() => (
              <Switch
                value={state.settings.autoSave}
                onValueChange={handleAutoSaveToggle}
              />
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="High Quality Scans"
            description="Use higher resolution for better accuracy"
            left={(props) => <List.Icon {...props} icon="high-definition" />}
            right={() => (
              <Switch
                value={state.settings.highQualityScans}
                onValueChange={handleHighQualityToggle}
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
            onPress={handleImportData}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Clear All Data"
            description="Delete all scans, subjects, and settings"
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
            description="Share InstantScan with friends"
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
              {state.scans.length}
            </Text>
            <Text variant="bodySmall">Total Scans</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {state.subjects.length}
            </Text>
            <Text variant="bodySmall">Subjects</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {state.sessions.length}
            </Text>
            <Text variant="bodySmall">Sessions</Text>
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
              Export all your scans, subjects, and settings to a JSON file?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExportDialog(false)}>Cancel</Button>
            <Button onPress={handleExportData}>Export</Button>
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
});

export default SettingsScreen; 