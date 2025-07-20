import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Avatar,
  useTheme,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';

export default function ProfileScreen() {
  const theme = useTheme();
  const { state, updateUserProfile } = useHabitTrackerPro();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState(state.userProfile.name);
  const [editEmail, setEditEmail] = useState(state.userProfile.email);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    updateUserProfile({
      name: editName.trim(),
      email: editEmail.trim(),
    });

    setShowEditDialog(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const getJoinDate = () => {
    return new Date(state.userProfile.joinDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysSinceJoin = () => {
    const joinDate = new Date(state.userProfile.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text 
                size={80} 
                label={state.userProfile.name.charAt(0).toUpperCase()}
                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              />
              <View style={styles.profileInfo}>
                <Title style={[styles.profileName, { color: theme.colors.onSurface }]}>
                  {state.userProfile.name}
                </Title>
                <Text style={[styles.profileEmail, { color: theme.colors.onSurfaceVariant }]}>
                  {state.userProfile.email}
                </Text>
                <Text style={[styles.joinDate, { color: theme.colors.onSurfaceVariant }]}>
                  Member since {getJoinDate()} ({getDaysSinceJoin()} days)
                </Text>
              </View>
            </View>

            <Button
              mode="outlined"
              icon="pencil"
              onPress={() => setShowEditDialog(true)}
              style={styles.editButton}
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Your Statistics
            </Title>

            <View style={styles.statsGrid}>
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

        {/* Preferences */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Preferences
            </Title>

            <View style={styles.preferenceItem}>
              <Icon name="theme-light-dark" size={24} color={theme.colors.primary} />
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceName, { color: theme.colors.onSurface }]}>
                  Theme
                </Text>
                <Text style={[styles.preferenceValue, { color: theme.colors.onSurfaceVariant }]}>
                  {state.userProfile.preferences.theme}
                </Text>
              </View>
            </View>

            <View style={styles.preferenceItem}>
              <Icon name="bell" size={24} color={theme.colors.primary} />
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceName, { color: theme.colors.onSurface }]}>
                  Notifications
                </Text>
                <Text style={[styles.preferenceValue, { color: theme.colors.onSurfaceVariant }]}>
                  {state.userProfile.preferences.notifications ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>

            <View style={styles.preferenceItem}>
              <Icon name="clock" size={24} color={theme.colors.primary} />
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceName, { color: theme.colors.onSurface }]}>
                  Reminder Time
                </Text>
                <Text style={[styles.preferenceValue, { color: theme.colors.onSurfaceVariant }]}>
                  {state.userProfile.preferences.reminderTime}
                </Text>
              </View>
            </View>

            <View style={styles.preferenceItem}>
              <Icon name="target" size={24} color={theme.colors.primary} />
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceName, { color: theme.colors.onSurface }]}>
                  Weekly Goal
                </Text>
                <Text style={[styles.preferenceValue, { color: theme.colors.onSurfaceVariant }]}>
                  {state.userProfile.preferences.weeklyGoal} habits
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Achievements Summary */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Achievements
            </Title>

            <View style={styles.achievementSummary}>
              <View style={styles.achievementItem}>
                <Icon name="trophy" size={32} color="#ffd700" />
                <Text style={[styles.achievementText, { color: theme.colors.onSurface }]}>
                  {state.achievements.filter(a => a.unlocked).length} unlocked
                </Text>
              </View>

              <View style={styles.achievementItem}>
                <Icon name="lock" size={32} color={theme.colors.outline} />
                <Text style={[styles.achievementText, { color: theme.colors.onSurface }]}>
                  {state.achievements.filter(a => !a.unlocked).length} locked
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Account
            </Title>

            <Button
              mode="outlined"
              icon="export"
              onPress={() => Alert.alert('Info', 'Export functionality would be implemented')}
              style={styles.accountButton}
            >
              Export Data
            </Button>

            <Button
              mode="outlined"
              icon="cloud-upload"
              onPress={() => Alert.alert('Info', 'Backup functionality would be implemented')}
              style={styles.accountButton}
            >
              Backup to Cloud
            </Button>

            <Button
              mode="outlined"
              icon="delete"
              onPress={() => Alert.alert('Info', 'Delete account functionality would be implemented')}
              style={styles.accountButton}
              textColor={theme.colors.error}
            >
              Delete Account
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              mode="outlined"
              style={styles.dialogInput}
              keyboardType="email-address"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSaveProfile}>Save</Button>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  joinDate: {
    fontSize: 12,
    marginTop: 4,
  },
  editButton: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
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
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferenceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  preferenceValue: {
    fontSize: 14,
    marginTop: 2,
  },
  achievementSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  accountButton: {
    marginBottom: 8,
  },
  dialogInput: {
    marginBottom: 16,
  },
}); 