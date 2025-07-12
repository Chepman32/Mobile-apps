import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Capsule } from '../types';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const { capsules } = useAppContext();

  const renderItem = ({ item }: { item: Capsule }) => (
    <View style={styles.itemContainer}>
      <Ionicons name="cube" size={24} color="#4a6fa5" style={{ marginRight: 12 }} />
      <View style={styles.itemContent}>
        <Text style={styles.problemText}>{item.text}</Text>
        <Text style={styles.dateText}>Unlocks {new Date(item.unlockDate).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="time-outline" size={64} color="#e0e0e0" />
      <Text style={styles.emptyStateTitle}>No History Yet</Text>
      <Text style={styles.emptyStateText}>Your scanned problems will appear here.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={capsules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContent: {
    flex: 1,
  },
  problemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  solutionText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
});

export default HistoryScreen;
