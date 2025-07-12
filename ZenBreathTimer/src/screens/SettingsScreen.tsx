import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { settings, updateSettings } = useAppContext();

  const toggleSound = () => updateSettings({ enableSound: !settings.enableSound });
  const toggleHaptics = () => updateSettings({ hapticFeedback: !settings.hapticFeedback });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.itemContainer}>
            <Ionicons name="volume-medium-outline" size={24} color="#8e8e93" style={styles.itemIcon} />
            <Text style={styles.itemText}>Enable Sound</Text>
            <Switch
              trackColor={{ false: '#e9e9ea', true: '#34c759' }}
              thumbColor={'#fff'}
              ios_backgroundColor="#e9e9ea"
              onValueChange={toggleSound}
              value={settings.enableSound}
            />
          </View>
          <View style={styles.itemContainer}>
            <Ionicons name="pulse-outline" size={24} color="#8e8e93" style={styles.itemIcon} />
            <Text style={styles.itemText}>Haptic Feedback</Text>
            <Switch
              trackColor={{ false: '#e9e9ea', true: '#34c759' }}
              thumbColor={'#fff'}
              ios_backgroundColor="#e9e9ea"
              onValueChange={toggleHaptics}
              value={settings.hapticFeedback}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.itemContainer}>
            <Ionicons name="contrast-outline" size={24} color="#8e8e93" style={styles.itemIcon} />
            <Text style={styles.itemText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: '#e9e9ea', true: '#8e8e93' }}
              thumbColor={'#fff'}
              ios_backgroundColor="#e9e9ea"
              onValueChange={() => {}} // Placeholder for theme switching
              value={settings.theme === 'dark'}
              disabled
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginLeft: 16,
  },
  list: {
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8e8e93',
    textTransform: 'uppercase',
    marginLeft: 16,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  itemIcon: {
    marginRight: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 17,
    color: '#1c1c1e',
  },
});

export default SettingsScreen;

