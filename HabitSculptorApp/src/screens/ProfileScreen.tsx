import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { AppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  const { habits, categories, todayProgress, stats, resetAllData } = useContext(AppContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // User stats
  const completedHabits = todayProgress.completedHabits.length;
  const totalHabits = todayProgress.totalHabits;
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive reminders.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // This will open the app's notification settings
                Notifications.getPermissionsAsync().then(settings => {
                  if (settings.status === 'denied') {
                    // On iOS, we can't open settings directly, so we'll show an alert
                    Alert.alert(
                      'Enable Notifications',
                      'Please go to Settings > Notifications > MicroCoach and enable notifications.',
                      [
                        { text: 'OK' }
                      ]
                    );
                  }
                });
              } 
            },
          ]
        );
        return;
      }
    }
    setNotificationsEnabled(value);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // In a real app, you would upload the image to a server here
        // For now, we'll just set it in state
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const handleExportData = () => {
    // In a real app, this would export the user's data
    Alert.alert(
      'Export Data',
      'Your habit data will be exported as a JSON file. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // This is where you'd implement the export functionality
            // For now, we'll just show a success message
            setTimeout(() => {
              Alert.alert('Success', 'Your data has been exported successfully!');
            }, 1000);
          } 
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await resetAllData();
              Alert.alert('Success', 'All data has been reset.');
            } catch (error) {
              console.error('Failed to reset data:', error);
              Alert.alert('Error', 'An error occurred while resetting your data.');
            } finally {
              setIsLoading(false);
            }
          } 
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <Ionicons name="person" size={50} color="#fff" />
          )}
          <View style={styles.avatarEditIcon}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.userName}>User Name</Text>
      <Text style={styles.userEmail}>user@example.com</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{habits.length}</Text>
          <Text style={styles.statLabel}>Habits</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationToggle}
          trackColor={{ false: '#f0f0f0', true: '#4a6fa5' }}
          thumbColor="#fff"
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.switchTrack, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate('Reminders' as never)}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="time" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>Reminders</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  const renderDataSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Data</Text>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={handleExportData}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="download" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>Export Data</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate('Backup' as never)}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="cloud-upload" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>Backup & Sync</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomWidth: 0 }]}
        onPress={handleResetData}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="trash" size={22} color="#ff6b6b" style={styles.settingIcon} />
          <Text style={[styles.settingText, { color: '#ff6b6b' }]}>Reset All Data</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSupportSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Support</Text>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate('Help' as never)}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="help-circle" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>Help & Support</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate('Feedback' as never)}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="chatbubbles" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>Send Feedback</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomWidth: 0 }]}
        onPress={() => navigation.navigate('About' as never)}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="information-circle" size={22} color="#4a6fa5" style={styles.settingIcon} />
          <Text style={styles.settingText}>About MicroCoach</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a6fa5" />
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderProfileHeader()}
          {renderSettingsSection()}
          {renderDataSection()}
          {renderSupportSection()}
          
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>MicroCoach v1.0.0</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

import { themes } from '../context/ThemeContext';

const createStyles = (colors: typeof themes.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.subtext,
  },
  section: {
    marginTop: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtext,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: colors.subtext,
  },
});

export default ProfileScreen;
