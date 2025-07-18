import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Settings
        </Text>
      </Surface>
      <View style={styles.content}>
        <Text variant="bodyLarge">App settings will be shown here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
});

export default SettingsScreen;