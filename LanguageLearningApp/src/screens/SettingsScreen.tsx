import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

const SettingsScreen: React.FC<ScreenProps<'Settings'>> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState('Spanish');

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    toggleTheme(darkMode ? 'light' : 'dark');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all downloaded content. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Handle clear cache logic here
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will reset all your learning progress. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Handle reset progress logic here
            Alert.alert('Success', 'Progress has been reset');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    value, 
    onPress, 
    isSwitch = false, 
    switchValue = false, 
    onSwitchValueChange = () => {},
    showChevron = true,
  }: {
    icon: string;
    title: string;
    value?: string;
    onPress?: () => void;
    isSwitch?: boolean;
    switchValue?: boolean;
    onSwitchValueChange?: (value: boolean) => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}10` }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
        </View>
      </View>
      {isSwitch ? (
        <Switch 
          value={switchValue}
          onValueChange={onSwitchValueChange}
          trackColor={{ false: '#E9ECEF', true: `${colors.primary}50` }}
          thumbColor={switchValue ? colors.primary : '#f4f3f4'}
        />
      ) : showChevron ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Settings */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
          
          <SettingItem 
            icon="moon" 
            title="Dark Mode" 
            isSwitch 
            switchValue={darkMode} 
            onSwitchValueChange={handleThemeToggle}
            showChevron={false}
          />
          
          <SettingItem 
            icon="notifications" 
            title="Notifications" 
            isSwitch 
            switchValue={notifications} 
            onSwitchValueChange={setNotifications}
            showChevron={false}
          />
          
          <SettingItem 
            icon="time" 
            title="Daily Reminder" 
            isSwitch 
            switchValue={dailyReminder} 
            onSwitchValueChange={setDailyReminder}
            showChevron={false}
          />
          
          <SettingItem 
            icon="volume-high" 
            title="Sound Effects" 
            isSwitch 
            switchValue={soundEffects} 
            onSwitchValueChange={setSoundEffects}
            showChevron={false}
          />
          
          <SettingItem 
            icon="phone-portrait" 
            title="Haptic Feedback" 
            isSwitch 
            switchValue={hapticFeedback} 
            onSwitchValueChange={setHapticFeedback}
            showChevron={false}
          />
          
          <SettingItem 
            icon="globe" 
            title="App Language" 
            value={selectedLanguage}
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="language" 
            title="Target Language" 
            value={selectedTargetLanguage}
            onPress={() => {}}
          />
        </View>

        {/* Account */}
        <View style={[styles.section, { backgroundColor: colors.card, marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          <SettingItem 
            icon="person" 
            title="Edit Profile" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="lock-closed" 
            title="Change Password" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="mail" 
            title="Email Preferences" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="card" 
            title="Subscription" 
            value="Premium"
            onPress={() => {}}
          />
        </View>

        {/* Support */}
        <View style={[styles.section, { backgroundColor: colors.card, marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          
          <SettingItem 
            icon="help-circle" 
            title="Help Center" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="chatbubbles" 
            title="Contact Us" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="star" 
            title="Rate the App" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="share-social" 
            title="Share with Friends" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="information-circle" 
            title="About" 
            onPress={() => {}}
          />
        </View>

        {/* Data & Privacy */}
        <View style={[styles.section, { backgroundColor: colors.card, marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data & Privacy</Text>
          
          <SettingItem 
            icon="shield" 
            title="Privacy Policy" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="document-text" 
            title="Terms of Service" 
            onPress={() => {}}
          />
          
          <SettingItem 
            icon="trash" 
            title="Clear Cache" 
            onPress={handleClearCache}
          />
          
          <SettingItem 
            icon="refresh" 
            title="Reset Progress" 
            onPress={handleResetProgress}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#EF233C" />
          <Text style={[styles.logoutText, { color: '#EF233C' }]}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Language Learning App v1.0.0
          </Text>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            © 2025 Language Learning Inc.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default SettingsScreen;
