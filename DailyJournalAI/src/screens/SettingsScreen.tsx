import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRealm } from '@realm/react';
import { useSettings } from '../context/SettingsContext';
import { JournalEntry } from '../models/JournalEntry';

export const SettingsScreen: React.FC = () => {
  const realm = useRealm();
  const {
    isDarkMode,
    setDarkMode,
    autoAnalyze,
    setAutoAnalyze,
    dailyReminder,
    setDailyReminder,
    reminderTime,
    setReminderTime,
    enableHapticFeedback,
    setEnableHapticFeedback,
  } = useSettings();
  
  const styles = getStyles(isDarkMode);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will allow you to export your journal entries to a text file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // In a real app, this would implement actual export functionality
          Alert.alert('Coming Soon', 'Export functionality will be available in a future update.');
        }},
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your journal entries. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'This will delete ALL your journal entries permanently.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete All',
                  style: 'destructive',
                  onPress: () => {
                    realm.write(() => {
                      realm.delete(realm.objects('JournalEntry'));
                    });
                    Alert.alert('Success', 'All data has been cleared.');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Daily Journal AI',
      'A private, AI-powered journal that analyzes sentiment and suggests prompts, storing entries locally.\n\nVersion 1.0.0\n\nBuilt with React Native and Realm Database.',
      [{ text: 'OK' }]
    );
  };

  const SettingRow: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }> = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent && <View style={styles.settingRight}>{rightComponent}</View>}
      {onPress && !rightComponent && <Text style={styles.chevron}>{'>'}</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Settings</Text>
        <Text style={styles.headerSubtitle}>
          Customize your journal experience
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🌙"
            title="Dark Mode"
            subtitle="Use dark theme"
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e9ecef', true: '#007bff' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Writing Experience</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🤖"
            title="Auto Analysis"
            subtitle="Analyze sentiment while typing"
            rightComponent={
              <Switch
                value={autoAnalyze}
                onValueChange={setAutoAnalyze}
                trackColor={{ false: '#e9ecef', true: '#007bff' }}
                thumbColor={autoAnalyze ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          <SettingRow
            icon="📳"
            title="Haptic Feedback"
            subtitle="Vibration for interactions"
            rightComponent={
              <Switch
                value={enableHapticFeedback}
                onValueChange={setEnableHapticFeedback}
                trackColor={{ false: '#e9ecef', true: '#007bff' }}
                thumbColor={enableHapticFeedback ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminders</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🔔"
            title="Daily Reminder"
            subtitle="Get reminded to write daily"
            rightComponent={
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ false: '#e9ecef', true: '#007bff' }}
                thumbColor={dailyReminder ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          {dailyReminder && (
            <SettingRow
              icon="⏰"
              title="Reminder Time"
              subtitle={`Daily reminder at ${reminderTime}`}
              onPress={() => {
                Alert.alert(
                  'Coming Soon',
                  'Time picker will be available in a future update.'
                );
              }}
            />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <SettingRow
            icon="📤"
            title="Export Data"
            subtitle="Export your entries as text"
            onPress={handleExportData}
          />
          <SettingRow
            icon="🗑️"
            title="Clear All Data"
            subtitle="Delete all journal entries"
            onPress={handleClearData}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <SettingRow
            icon="📝"
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => {
              Alert.alert(
                'Privacy Policy',
                'Your journal entries are stored locally on your device and never sent to external servers. All sentiment analysis is performed on-device to ensure your privacy.',
                [{ text: 'OK' }]
              );
            }}
          />
          <SettingRow
            icon="💬"
            title="Feedback"
            subtitle="Send us your thoughts"
            onPress={() => {
              Alert.alert(
                'Feedback',
                'We\'d love to hear from you! Please contact us at feedback@dailyjournalai.com',
                [{ text: 'OK' }]
              );
            }}
          />
          <SettingRow
            icon="ℹ️"
            title="About"
            subtitle="App version and info"
            onPress={handleAbout}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Daily Journal AI v1.0.0
        </Text>
        <Text style={styles.footerSubtext}>
          Your thoughts, your insights, your privacy.
        </Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    marginHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: isDarkMode ? '#404040' : '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#404040' : '#e9ecef',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
  },
  settingRight: {
    marginLeft: 10,
  },
  chevron: {
    fontSize: 18,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#ffffff' : '#212529',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});