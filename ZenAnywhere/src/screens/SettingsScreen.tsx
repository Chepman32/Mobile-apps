import React from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, toggleTheme, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(theme === 'dark');
  const [sleepTimer, setSleepTimer] = React.useState(30);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    toggleTheme();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
    },
    backText: {
      color: '#FFFFFF',
      fontSize: 24,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      marginLeft: 8,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.subtext,
    },
    switch: {
      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    timerValue: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.primary,
      width: 50,
      textAlign: 'right',
    },
    footer: {
      padding: 20,
      alignItems: 'center',
    },
    versionText: {
      fontSize: 14,
      color: colors.subtext,
      marginBottom: 8,
    },
    privacyText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Enable dark theme for better night-time use</Text>
            </View>
            <Switch
              trackColor={{ false: colors.switchTrack, true: colors.primary }}
              thumbColor="#FFFFFF"
              onValueChange={handleThemeToggle}
              value={darkMode}
              style={styles.switch}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Get reminders for your meditation practice</Text>
            </View>
            <Switch
              trackColor={{ false: colors.switchTrack, true: colors.primary }}
              thumbColor="#FFFFFF"
              onValueChange={(value) => setNotificationsEnabled(value)}
              value={notificationsEnabled}
              style={styles.switch}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sleep Timer</Text>
              <Text style={styles.settingDescription}>Automatically stop playback after a set time</Text>
            </View>
            <Text style={styles.timerValue}>{sleepTimer} min</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Rate Us</Text>
              <Text style={styles.settingDescription}>Enjoying Zen Anywhere? Leave us a review</Text>
            </View>
            <Text style={styles.backText}>→</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Share with Friends</Text>
              <Text style={styles.settingDescription}>Spread the peace and share the app</Text>
            </View>
            <Text style={styles.backText}>→</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Zen Anywhere v1.0.0</Text>
        <TouchableOpacity>
          <Text style={styles.privacyText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
