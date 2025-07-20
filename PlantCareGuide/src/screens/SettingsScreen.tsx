import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import {
  Text,
  Card,
  List,
  Switch,
  Button,
  Divider,
  useTheme,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';

export default function SettingsScreen({ navigation }: any) {
  const theme = useTheme();
  const { state, dispatch } = useContext(PlantCareGuideContext);
  const [loading, setLoading] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');

  const handleExportData = async () => {
    setLoading(true);
    try {
      const exportData = {
        plants: state.plants,
        userPlants: state.userPlants,
        careSchedules: state.careSchedules,
        careLogs: state.careLogs,
        growthTracking: state.growthTracking,
        reminders: state.reminders,
        userAchievements: state.userAchievements,
        statistics: state.statistics,
        notificationSettings: state.notificationSettings,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const dataString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: 'PlantCareGuide Data Export',
        title: 'PlantCareGuide Data',
        url: `data:text/json;base64,${Buffer.from(dataString).toString('base64')}`,
      });

      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    if (!importData.trim()) {
      Alert.alert('Error', 'Please enter valid data to import.');
      return;
    }

    setLoading(true);
    try {
      const parsedData = JSON.parse(importData);
      
      // Validate the imported data structure
      if (!parsedData.plants || !parsedData.careLogs) {
        throw new Error('Invalid data format');
      }

      await dispatch({ type: 'IMPORT_DATA', payload: parsedData });
      
      setShowImportDialog(false);
      setImportData('');
      Alert.alert('Success', 'Data imported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to import data. Please check the format and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    setLoading(true);
    try {
      await dispatch({ type: 'CLEAR_ALL_DATA' });
      setShowClearDataDialog(false);
      Alert.alert('Success', 'All data has been cleared.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (setting: string, value: boolean) => {
    try {
      await dispatch({
        type: 'UPDATE_NOTIFICATION_SETTINGS',
        payload: { [setting]: value }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const getNotificationSetting = (key: string) => {
    return state.notificationSettings.find(setting => setting.key === key)?.enabled || false;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Notification Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Notifications
          </Text>
          <List.Item
            title="Care Reminders"
            description="Get notified about upcoming plant care tasks"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={getNotificationSetting('care_reminders')}
                onValueChange={(value) => handleNotificationToggle('care_reminders', value)}
              />
            )}
          />
          <List.Item
            title="Growth Milestones"
            description="Celebrate when your plants reach growth milestones"
            left={(props) => <List.Icon {...props} icon="chart-line" />}
            right={() => (
              <Switch
                value={getNotificationSetting('growth_milestones')}
                onValueChange={(value) => handleNotificationToggle('growth_milestones', value)}
              />
            )}
          />
          <List.Item
            title="Achievement Unlocks"
            description="Get notified when you unlock new achievements"
            left={(props) => <List.Icon {...props} icon="trophy" />}
            right={() => (
              <Switch
                value={getNotificationSetting('achievement_unlocks')}
                onValueChange={(value) => handleNotificationToggle('achievement_unlocks', value)}
              />
            )}
          />
          <List.Item
            title="Weekly Reports"
            description="Receive weekly summaries of your plant care activities"
            left={(props) => <List.Icon {...props} icon="calendar-week" />}
            right={() => (
              <Switch
                value={getNotificationSetting('weekly_reports')}
                onValueChange={(value) => handleNotificationToggle('weekly_reports', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Data Management
          </Text>
          <List.Item
            title="Export Data"
            description="Export all your plant data as a backup"
            left={(props) => <List.Icon {...props} icon="export" />}
            onPress={handleExportData}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Import Data"
            description="Import plant data from a backup file"
            left={(props) => <List.Icon {...props} icon="import" />}
            onPress={() => setShowImportDialog(true)}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Clear All Data"
            description="Permanently delete all your plant data"
            left={(props) => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
            onPress={() => setShowClearDataDialog(true)}
            titleStyle={{ color: theme.colors.error }}
          />
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            App Information
          </Text>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Total Plants"
            description={`${state.plants.length} plants in database`}
            left={(props) => <List.Icon {...props} icon="flower" />}
          />
          <List.Item
            title="Care Logs"
            description={`${state.careLogs.length} care activities recorded`}
            left={(props) => <List.Icon {...props} icon="clipboard-list" />}
          />
          <List.Item
            title="Growth Records"
            description={`${state.growthTracking.length} growth measurements`}
            left={(props) => <List.Icon {...props} icon="chart-line" />}
          />
          <List.Item
            title="Reminders"
            description={`${state.reminders.length} active reminders`}
            left={(props) => <List.Icon {...props} icon="bell" />}
          />
        </Card.Content>
      </Card>

      {/* Support */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Support
          </Text>
          <List.Item
            title="Help & FAQ"
            description="Get help with using the app"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => Alert.alert('Help', 'Help content would be displayed here.')}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Report Bug"
            description="Report issues or bugs"
            left={(props) => <List.Icon {...props} icon="bug" />}
            onPress={() => Alert.alert('Report Bug', 'Bug reporting would be implemented here.')}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Rate App"
            description="Rate us on the app store"
            left={(props) => <List.Icon {...props} icon="star" />}
            onPress={() => Alert.alert('Rate App', 'App store rating would be implemented here.')}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      {/* Import Data Dialog */}
      <Portal>
        <Dialog visible={showImportDialog} onDismiss={() => setShowImportDialog(false)}>
          <Dialog.Title>Import Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogText}>
              Paste your exported data here to restore your plant information.
            </Text>
            <TextInput
              label="Data (JSON format)"
              value={importData}
              onChangeText={setImportData}
              multiline
              numberOfLines={8}
              style={styles.importInput}
              placeholder="Paste your exported data here..."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImportDialog(false)}>Cancel</Button>
            <Button onPress={handleImportData} loading={loading} disabled={loading}>
              Import
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Clear Data Dialog */}
      <Portal>
        <Dialog visible={showClearDataDialog} onDismiss={() => setShowClearDataDialog(false)}>
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogText}>
              This action will permanently delete all your plant data, care logs, reminders, and settings. This cannot be undone.
            </Text>
            <Text variant="bodyMedium" style={[styles.dialogText, { color: theme.colors.error, fontWeight: 'bold' }]}>
              Are you sure you want to continue?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDataDialog(false)}>Cancel</Button>
            <Button 
              onPress={handleClearAllData} 
              loading={loading} 
              disabled={loading}
              textColor={theme.colors.error}
            >
              Clear All Data
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  dialogText: {
    marginBottom: 16,
  },
  importInput: {
    marginTop: 8,
  },
}); 