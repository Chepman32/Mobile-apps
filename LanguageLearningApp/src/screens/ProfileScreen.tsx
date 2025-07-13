import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

// Mock user data
const userData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  streak: 7,
  level: 3,
  xp: 450,
  nextLevelXp: 1000,
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};

// Mock achievements
const achievements = [
  { id: '1', name: 'Fast Learner', icon: 'flash', color: '#F9C74F', unlocked: true },
  { id: '2', name: 'Perfect Week', icon: 'calendar', color: '#4CC9F0', unlocked: true },
  { id: '3', name: 'Grammar Master', icon: 'school', color: '#F94144', unlocked: false },
  { id: '4', name: 'Vocabulary Pro', icon: 'book', color: '#90BE6D', unlocked: false },
];

// Mock stats
const stats = [
  { id: '1', label: 'Total XP', value: '1,250', icon: 'star' },
  { id: '2', label: 'Lessons Completed', value: '24', icon: 'checkmark-done' },
  { id: '3', label: 'Current Streak', value: '7 days', icon: 'flame' },
  { id: '4', label: 'Words Learned', value: '156', icon: 'bookmark' },
];

const ProfileScreen: React.FC<ScreenProps<'Profile'>> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [dailyReminder, setDailyReminder] = useState(true);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    toggleTheme(darkMode ? 'light' : 'dark');
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    navigation.navigate('Settings');
  };

  const progress = (userData.xp / userData.nextLevelXp) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: userData.avatar }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userData.email}</Text>
          
          <View style={styles.streakContainer}>
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={24} color="#F94144" />
              <Text style={[styles.streakCount, { color: colors.text }]}>{userData.streak}</Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.streakItem}>
              <Ionicons name="trophy" size={24} color="#F9C74F" />
              <Text style={[styles.streakCount, { color: colors.text }]}>Level {userData.level}</Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Current Level</Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={[styles.progressContainer, { backgroundColor: colors.card }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>Learning Progress</Text>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {userData.xp}/{userData.nextLevelXp} XP
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: `${colors.primary}20` }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: colors.primary,
                }
              ]} 
            />
          </View>
          <Text style={[styles.levelUpText, { color: colors.textSecondary }]}>
            {userData.nextLevelXp - userData.xp} XP to level {userData.level + 1}
          </Text>
        </View>

        {/* Stats */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Your Stats
        </Text>
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View 
              key={stat.id} 
              style={[styles.statCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.statIcon, { backgroundColor: `${colors.primary}10` }]}>
                <Ionicons name={stat.icon} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Settings
        </Text>
        <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color={colors.primary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch 
              value={darkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#E9ECEF', true: `${colors.primary}50` }}
              thumbColor={darkMode ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={colors.primary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E9ECEF', true: `${colors.primary}50` }}
              thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="time" size={20} color={colors.primary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Daily Reminder</Text>
            </View>
            <Switch 
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: '#E9ECEF', true: `${colors.primary}50` }}
              thumbColor={dailyReminder ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Achievements */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Achievements
        </Text>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard, 
                { 
                  backgroundColor: colors.card,
                  opacity: achievement.unlocked ? 1 : 0.6,
                }
              ]}
            >
              <View 
                style={[
                  styles.achievementIcon, 
                  { 
                    backgroundColor: `${achievement.color}20`,
                    borderColor: achievement.unlocked ? achievement.color : colors.border,
                  }
                ]}
              >
                <Ionicons 
                  name={achievement.icon} 
                  size={24} 
                  color={achievement.unlocked ? achievement.color : colors.textSecondary} 
                />
                {!achievement.unlocked && (
                  <View style={styles.lockIcon}>
                    <Ionicons name="lock-closed" size={12} color="white" />
                  </View>
                )}
              </View>
              <Text 
                style={[
                  styles.achievementName, 
                  { 
                    color: achievement.unlocked ? colors.text : colors.textSecondary,
                    fontWeight: achievement.unlocked ? '600' : '400',
                  }
                ]}
              >
                {achievement.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4361EE',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4361EE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  streakItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  streakLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 8,
  },
  progressContainer: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelUpText: {
    fontSize: 12,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  settingsContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  achievementCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 12,
  },
  lockIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#6C757D',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  achievementName: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProfileScreen;
