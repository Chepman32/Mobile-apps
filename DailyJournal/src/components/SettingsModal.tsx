import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Appbar,
  List,
  Switch,
  Button,
  TextInput,
  Dialog,
  Portal,
  Text,
  Card,
  Divider,
} from 'react-native-paper';
import { EncryptionService } from '../services/EncryptionService';
import { JournalService } from '../services/JournalService';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const enabled = await EncryptionService.isEncryptionEnabled();
      setEncryptionEnabled(enabled);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleToggleEncryption = () => {
    if (encryptionEnabled) {
      handleDisableEncryption();
    } else {
      setShowPasswordDialog(true);
    }
  };

  const handleEnableEncryption = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await EncryptionService.enableEncryption(password);
      setEncryptionEnabled(true);
      setShowPasswordDialog(false);
      setPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Encryption has been enabled for your journal entries');
    } catch (error) {
      console.error('Failed to enable encryption:', error);
      Alert.alert('Error', 'Failed to enable encryption');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableEncryption = () => {
    Alert.alert(
      'Disable Encryption',
      'Are you sure you want to disable encryption? Your journal entries will no longer be encrypted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            try {
              await EncryptionService.disableEncryption();
              setEncryptionEnabled(false);
              Alert.alert('Success', 'Encryption has been disabled');
            } catch (error) {
              console.error('Failed to disable encryption:', error);
              Alert.alert('Error', 'Failed to disable encryption');
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await EncryptionService.changePassword(currentPassword, newPassword);
      setShowChangePasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      Alert.alert('Success', 'Password has been changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      Alert.alert('Error', 'Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowStats = async () => {
    setIsLoading(true);
    try {
      const journalStats = await JournalService.getStats();
      setStats(journalStats);
      setShowStatsDialog(true);
    } catch (error) {
      console.error('Failed to load stats:', error);
      Alert.alert('Error', 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await JournalService.exportEntries();
      // In a real app, you would use a proper file sharing mechanism
      Alert.alert(
        'Export Data',
        'Data export functionality would be implemented here with proper file sharing.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to export data:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Data import functionality would be implemented here with file picker.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onClose} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Security</Text>
            <List.Item
              title="Encrypt Journal Entries"
              description="Protect your entries with a password"
              left={props => <List.Icon {...props} icon="lock" />}
              right={() => (
                <Switch
                  value={encryptionEnabled}
                  onValueChange={handleToggleEncryption}
                />
              )}
            />
            {encryptionEnabled && (
              <List.Item
                title="Change Password"
                description="Update your encryption password"
                left={props => <List.Icon {...props} icon="key" />}
                onPress={() => setShowChangePasswordDialog(true)}
              />
            )}
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <List.Item
              title="View Statistics"
              description="See your journaling habits and stats"
              left={props => <List.Icon {...props} icon="chart-line" />}
              onPress={handleShowStats}
            />
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Data Management</Text>
            <List.Item
              title="Export Data"
              description="Export your journal entries"
              left={props => <List.Icon {...props} icon="export" />}
              onPress={handleExportData}
            />
            <List.Item
              title="Import Data"
              description="Import journal entries from a file"
              left={props => <List.Icon {...props} icon="import" />}
              onPress={handleImportData}
            />
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>About</Text>
            <List.Item
              title="Daily Journal"
              description="Version 1.0.0"
              left={props => <List.Icon {...props} icon="information" />}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={showPasswordDialog} onDismiss={() => setShowPasswordDialog(false)}>
          <Dialog.Title>Enable Encryption</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Enter a password to encrypt your journal entries. You'll need this password to access your entries.
            </Text>
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button onPress={handleEnableEncryption} loading={isLoading}>
              Enable
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showChangePasswordDialog} onDismiss={() => setShowChangePasswordDialog(false)}>
          <Dialog.Title>Change Password</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowChangePasswordDialog(false)}>Cancel</Button>
            <Button onPress={handleChangePassword} loading={isLoading}>
              Change
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showStatsDialog} onDismiss={() => setShowStatsDialog(false)}>
          <Dialog.Title>Journal Statistics</Dialog.Title>
          <Dialog.Content>
            {stats && (
              <View>
                <Text style={styles.statItem}>Total Entries: {stats.totalEntries}</Text>
                <Text style={styles.statItem}>Total Words: {stats.totalWords}</Text>
                <Text style={styles.statItem}>Average Words per Entry: {stats.averageWordsPerEntry}</Text>
                <Text style={styles.statItem}>Entries This Month: {stats.entriesThisMonth}</Text>
                <Text style={styles.statItem}>Longest Streak: {stats.longestStreak} days</Text>
                
                {stats.mostUsedTags.length > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <Text style={styles.statTitle}>Most Used Tags:</Text>
                    {stats.mostUsedTags.map((tag: any, index: number) => (
                      <Text key={tag.tag} style={styles.tagStat}>
                        {index + 1}. {tag.tag} ({tag.count} times)
                      </Text>
                    ))}
                  </>
                )}
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowStatsDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dialogText: {
    marginBottom: 16,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  statItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  tagStat: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  divider: {
    marginVertical: 12,
  },
});