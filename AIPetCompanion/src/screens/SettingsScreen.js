
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const SettingsScreen = () => {
  const resetApp = () => {
    Alert.alert(
      'Reset App Data',
      'Are you sure you want to reset all pet data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => {
            // Placeholder for clearing Realm data and AsyncStorage
            Alert.alert('App Reset', 'All data has been reset (conceptual).');
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Settings</Text>
      <TouchableOpacity style={styles.settingButton} onPress={resetApp}>
        <Text style={styles.settingButtonText}>Reset All App Data</Text>
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
