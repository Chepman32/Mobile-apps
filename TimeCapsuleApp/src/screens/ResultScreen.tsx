import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types';

const ResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const { getScanById } = useAppContext();
  const scan = getScanById(route.params.scanId);

  if (!scan) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Scan not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: scan.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="scan" size={24} color="#4a6fa5" />
            <Text style={styles.cardTitle}>Recognized Problem</Text>
          </View>
          <Text style={styles.problemText}>{scan.problemText}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Solution</Text>
          </View>
          <Text style={styles.solutionText}>{scan.solution}</Text>
        </View>

        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  problemText: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#555',
  },
  solutionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  doneButton: {
    backgroundColor: '#4a6fa5',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
