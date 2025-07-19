
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const SettingsScreen = () => {
  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear cached weather data? This will require an internet connection to refresh.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => {
            // Placeholder for clearing AsyncStorage cache
            Alert.alert('Cache Cleared', 'Cached weather data has been cleared (conceptual).');
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.settingButton} onPress={clearCache}>
        <Text style={styles.settingButtonText}>Clear Cached Weather Data</Text>
      </TouchableOpacity>
      {/* More settings can be added here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  settingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
