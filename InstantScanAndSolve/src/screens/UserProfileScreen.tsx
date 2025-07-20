import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Avatar,
  Button,
  List,
  Divider,
  TextInput,
  Dialog,
  Portal,
  Switch,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { AppContext } from '../context/AppContext';
import { UserProfile } from '../types';

const UserProfileScreen: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const theme = useTheme();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: state.userProfile.name,
    email: state.userProfile.email,
    bio: state.userProfile.bio,
  });

  const profileStats = {
    totalScans: state.scans.length,
    successfulScans: state.scans.filter(s => s.status === 'successful').length,
    totalSubjects: new Set(state.scans.map(s => s.subjectId)).size,
    totalSessions: state.sessions.length,
    averageAccuracy: state.scans.length > 0 
      ? state.scans.reduce((sum, scan) => sum + (scan.accuracy || 0), 0) / state.scans.length 
      : 0,
    totalProcessingTime: state.scans.reduce((sum, scan) => sum + (scan.processingTime || 0), 0),
    unlockedAchievements: state.achievements.filter(a => a.unlocked).length,
    totalAchievements: state.achievements.length,
  };

  const handleSaveProfile = () => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        ...state.userProfile,
        ...editForm,
        updatedAt: new Date().toISOString(),
      },
    });
    setShowEditDialog(false);
    Alert.alert('Profile Updated', 'Your profile has been updated successfully');
  };

  const handleDeleteAccount = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    setShowDeleteDialog(false);
    Alert.alert('Account Deleted', 'Your account and all data have been deleted');
  };

  const handleExportProfile = () => {
    Alert.alert('Export Profile', 'Profile export functionality would be implemented here');
  };

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'Profile sharing functionality would be implemented here');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy Settings', 'Privacy settings would be implemented here');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Notification Settings', 'Notification settings would be implemented here');
  };

  const handleDataUsage = () => {
    Alert.alert('Data Usage', 'Data usage information would be displayed here');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getLevel = (totalScans: number) => {
    if (totalScans >= 100) return { level: 'Master', color: '#FFD700' };
    if (totalScans >= 50) return { level: 'Expert', color: '#C0C0C0' };
    if (totalScans >= 25) return { level: 'Advanced', color: '#CD7F32' };
    if (totalScans >= 10) return { level: 'Intermediate', color: '#4CAF50' };
    return { level: 'Beginner', color: '#2196F3' };
  };

  const userLevel = getLevel(profileStats.totalScans);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={80} 
              label={state.userProfile.name.charAt(0).toUpperCase()}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.profileName}>
                {state.userProfile.name}
              </Text>
              <Text variant="bodyMedium" style={styles.profileEmail}>
                {state.userProfile.email}
              </Text>
              <View style={[styles.levelBadge, { backgroundColor: userLevel.color }]}>
                <Text variant="bodySmall" style={styles.levelText}>
                  {userLevel.level}
                </Text>
              </View>
            </View>
          </View>
          {state.userProfile.bio && (
            <Text variant="bodyMedium" style={styles.profileBio}>
              {state.userProfile.bio}
            </Text>
          )}
          <View style={styles.profileActions}>
            <Button
              mode="outlined"
              icon="pencil"
              onPress={() => setShowEditDialog(true)}
              style={styles.actionButton}
            >
              Edit Profile
            </Button>
            <Button
              mode="outlined"
              icon="share"
              onPress={handleShareProfile}
              style={styles.actionButton}
            >
              Share Profile
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Statistics" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {profileStats.totalScans}
              </Text>
              <Text variant="bodySmall">Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {profileStats.successfulScans}
              </Text>
              <Text variant="bodySmall">Successful</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {profileStats.totalSubjects}
              </Text>
              <Text variant="bodySmall">Subjects</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {profileStats.totalSessions}
              </Text>
              <Text variant="bodySmall">Sessions</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Performance" />
        <Card.Content>
          <List.Item
            title="Average Accuracy"
            description="Overall accuracy across all scans"
            left={(props) => <List.Icon {...props} icon="target" />}
            right={() => (
              <Text variant="titleMedium">{profileStats.averageAccuracy.toFixed(1)}%</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Total Processing Time"
            description="Time spent processing scans"
            left={(props) => <List.Icon {...props} icon="timer" />}
            right={() => (
              <Text variant="titleMedium">{formatDuration(profileStats.totalProcessingTime)}</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Achievements"
            description="Unlocked achievements"
            left={(props) => <List.Icon {...props} icon="trophy" />}
            right={() => (
              <Text variant="titleMedium">
                {profileStats.unlockedAchievements}/{profileStats.totalAchievements}
              </Text>
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Account Information" />
        <Card.Content>
          <List.Item
            title="Member Since"
            description={new Date(state.userProfile.createdAt).toLocaleDateString()}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Last Updated"
            description={new Date(state.userProfile.updatedAt).toLocaleDateString()}
            left={(props) => <List.Icon {...props} icon="time" />}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Account Status"
            description="Active"
            left={(props) => <List.Icon {...props} icon="checkmark-circle" color={theme.colors.primary} />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Settings" />
        <Card.Content>
          <List.Item
            title="Privacy Settings"
            description="Manage your privacy preferences"
            left={(props) => <List.Icon {...props} icon="shield" />}
            onPress={handlePrivacySettings}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Notification Settings"
            description="Configure notification preferences"
            left={(props) => <List.Icon {...props} icon="bell" />}
            onPress={handleNotificationSettings}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Data Usage"
            description="View app data usage"
            left={(props) => <List.Icon {...props} icon="analytics" />}
            onPress={handleDataUsage}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Export Profile"
            description="Export your profile data"
            left={(props) => <List.Icon {...props} icon="download" />}
            onPress={handleExportProfile}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Danger Zone" />
        <Card.Content>
          <List.Item
            title="Delete Account"
            description="Permanently delete your account and all data"
            left={(props) => <List.Icon {...props} icon="trash" color={theme.colors.error} />}
            onPress={() => setShowDeleteDialog(true)}
            titleStyle={{ color: theme.colors.error }}
          />
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              label="Bio"
              value={editForm.bio}
              onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveProfile}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeleteAccount} textColor={theme.colors.error}>
              Delete
            </Button>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    opacity: 0.7,
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileBio: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
    marginVertical: 8,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  input: {
    marginBottom: 16,
  },
});

export default UserProfileScreen; 