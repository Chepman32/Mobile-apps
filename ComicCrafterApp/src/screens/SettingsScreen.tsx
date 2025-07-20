import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Switch as PaperSwitch,
  Divider,
  useTheme,
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
  Text,
  Surface,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useAppContext } from '../context/AppContext';

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { 
    state, 
    loadAppSettings, 
    updateAppSettings, 
    loadPublishingSettings, 
    updatePublishingSettings,
    exportData,
    importData,
    clearAllData,
    loadUserProfile,
    updateUserProfile,
  } = useAppContext();
  
  const { appSettings, publishingSettings, userProfile, loading } = state;

  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
  const [profileDialogVisible, setProfileDialogVisible] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    loadAppSettings();
    loadPublishingSettings();
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        username: userProfile.username || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
      });
    }
  }, [userProfile]);

  const handleThemeChange = async (newTheme: string) => {
    try {
      await updateAppSettings({ theme: newTheme });
      setThemeDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update theme');
    }
  };

  const handleSettingToggle = async (setting: keyof typeof appSettings, value: boolean) => {
    try {
      await updateAppSettings({ [setting]: value });
    } catch (error) {
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handlePublishingSettingToggle = async (setting: keyof typeof publishingSettings, value: boolean) => {
    try {
      await updatePublishingSettings({ [setting]: value });
    } catch (error) {
      Alert.alert('Error', 'Failed to update publishing setting');
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      if (data) {
        const fileName = `comic_crafter_backup_${new Date().toISOString().split('T')[0]}.json`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
        
        setExportDialogVisible(false);
        Alert.alert('Success', 'Data exported successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    // This would typically involve file picker
    Alert.alert('Import', 'Import functionality would be implemented with file picker');
    setImportDialogVisible(false);
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your comics, characters, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              setClearDataDialogVisible(false);
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (!profileData.username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    try {
      await updateUserProfile(profileData);
      setProfileDialogVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Profile</Title>
          <List.Item
            title={userProfile?.username || 'Set Username'}
            description={userProfile?.email || 'No email set'}
            left={(props) => (
              <List.Icon {...props} icon="account" />
            )}
            right={(props) => (
              <Button {...props} onPress={() => setProfileDialogVisible(true)}>
                Edit
              </Button>
            )}
          />
        </Card.Content>
      </Card>

      {/* Appearance Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Appearance</Title>
          <List.Item
            title="Theme"
            description={appSettings?.theme === 'dark' ? 'Dark' : 'Light'}
            left={(props) => (
              <List.Icon {...props} icon="theme-light-dark" />
            )}
            right={(props) => (
              <Button {...props} onPress={() => setThemeDialogVisible(true)}>
                Change
              </Button>
            )}
          />
        </Card.Content>
      </Card>

      {/* General Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>General</Title>
          <List.Item
            title="Auto Save"
            description="Automatically save your work"
            left={(props) => (
              <List.Icon {...props} icon="content-save" />
            )}
            right={() => (
              <PaperSwitch
                value={appSettings?.autoSave || false}
                onValueChange={(value) => handleSettingToggle('autoSave', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Grid Snap"
            description="Snap elements to grid"
            left={(props) => (
              <List.Icon {...props} icon="grid" />
            )}
            right={() => (
              <PaperSwitch
                value={appSettings?.gridSnap || false}
                onValueChange={(value) => handleSettingToggle('gridSnap', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Show Guides"
            description="Show alignment guides"
            left={(props) => (
              <List.Icon {...props} icon="eye" />
            )}
            right={() => (
              <PaperSwitch
                value={appSettings?.showGuides || false}
                onValueChange={(value) => handleSettingToggle('showGuides', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Sound Effects"
            description="Play sound effects"
            left={(props) => (
              <List.Icon {...props} icon="volume-high" />
            )}
            right={() => (
              <PaperSwitch
                value={appSettings?.soundEnabled || false}
                onValueChange={(value) => handleSettingToggle('soundEnabled', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Publishing Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Publishing</Title>
          <List.Item
            title="Include Metadata"
            description="Include comic metadata in exports"
            left={(props) => (
              <List.Icon {...props} icon="information" />
            )}
            right={() => (
              <PaperSwitch
                value={publishingSettings?.includeMetadata || false}
                onValueChange={(value) => handlePublishingSettingToggle('includeMetadata', value)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Watermark"
            description="Add watermark to exports"
            left={(props) => (
              <List.Icon {...props} icon="watermark" />
            )}
            right={() => (
              <PaperSwitch
                value={publishingSettings?.watermark || false}
                onValueChange={(value) => handlePublishingSettingToggle('watermark', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Data Management</Title>
          <List.Item
            title="Export Data"
            description="Backup your comics and settings"
            left={(props) => (
              <List.Icon {...props} icon="export" />
            )}
            onPress={() => setExportDialogVisible(true)}
          />
          <Divider />
          <List.Item
            title="Import Data"
            description="Restore from backup"
            left={(props) => (
              <List.Icon {...props} icon="import" />
            )}
            onPress={() => setImportDialogVisible(true)}
          />
          <Divider />
          <List.Item
            title="Clear All Data"
            description="Delete all comics and settings"
            left={(props) => (
              <List.Icon {...props} icon="delete" color={theme.colors.error} />
            )}
            onPress={() => setClearDataDialogVisible(true)}
            titleStyle={{ color: theme.colors.error }}
          />
        </Card.Content>
      </Card>

      {/* About Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>About</Title>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => (
              <List.Icon {...props} icon="information" />
            )}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={(props) => (
              <List.Icon {...props} icon="file-document" />
            )}
            onPress={() => {/* Navigate to terms */}}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={(props) => (
              <List.Icon {...props} icon="shield-check" />
            )}
            onPress={() => {/* Navigate to privacy policy */}}
          />
        </Card.Content>
      </Card>

      {/* Dialogs */}
      <Portal>
        {/* Theme Dialog */}
        <Dialog visible={themeDialogVisible} onDismiss={() => setThemeDialogVisible(false)}>
          <Dialog.Title>Choose Theme</Dialog.Title>
          <Dialog.Content>
            <SegmentedButtons
              value={appSettings?.theme || 'light'}
              onValueChange={handleThemeChange}
              buttons={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setThemeDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Export Dialog */}
        <Dialog visible={exportDialogVisible} onDismiss={() => setExportDialogVisible(false)}>
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              This will export all your comics, characters, and settings to a file that you can share or backup.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setExportDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleExportData}>Export</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Import Dialog */}
        <Dialog visible={importDialogVisible} onDismiss={() => setImportDialogVisible(false)}>
          <Dialog.Title>Import Data</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Select a backup file to restore your comics, characters, and settings.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setImportDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleImportData}>Import</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Clear Data Dialog */}
        <Dialog visible={clearDataDialogVisible} onDismiss={() => setClearDataDialogVisible(false)}>
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              This will permanently delete all your comics, characters, and settings. This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearDataDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleClearData} textColor={theme.colors.error}>
              Clear All
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Profile Dialog */}
        <Dialog visible={profileDialogVisible} onDismiss={() => setProfileDialogVisible(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Username"
              value={profileData.username}
              onChangeText={(text) => setProfileData({ ...profileData, username: text })}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              label="Bio"
              value={profileData.bio}
              onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setProfileDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateProfile}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
});

export default SettingsScreen; 