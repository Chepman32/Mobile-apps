import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Capsule</Text>
      <Text style={styles.subtitle}>Save messages to open in the future.</Text>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('CreateCapsule' as never)}
      >
        <Ionicons name="add" size={32} color="#fff" />
        <Text style={styles.scanButtonText}>Create Capsule</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History' as never)}
      >
        <Ionicons name="time" size={22} color="#4a6fa5" />
        <Text style={styles.historyButtonText}>View Capsules</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a6fa5',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a6fa5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  historyButtonText: {
    color: '#4a6fa5',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default HomeScreen;
