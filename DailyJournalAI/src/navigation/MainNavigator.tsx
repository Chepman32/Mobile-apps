import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { HomeScreen } from '../screens/HomeScreen';
import { WriteScreen } from '../screens/WriteScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useSettings } from '../context/SettingsContext';

export const MainNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const { isDarkMode } = useSettings();

  const tabs = [
    { name: 'Home', component: HomeScreen, icon: '🏠' },
    { name: 'Write', component: WriteScreen, icon: '✍️' },
    { name: 'History', component: HistoryScreen, icon: '📚' },
    { name: 'Insights', component: InsightsScreen, icon: '💡' },
    { name: 'Settings', component: SettingsScreen, icon: '⚙️' },
  ];

  const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component || HomeScreen;
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActiveComponent />
      </View>
      
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tab,
              activeTab === tab.name && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.name)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabText,
              activeTab === tab.name && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? '#404040' : '#e9ecef',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: isDarkMode ? '#404040' : '#e9ecef',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabText: {
    fontSize: 12,
    color: isDarkMode ? '#adb5bd' : '#6c757d',
    fontWeight: '500',
  },
  activeTabText: {
    color: isDarkMode ? '#ffffff' : '#007bff',
    fontWeight: '600',
  },
});