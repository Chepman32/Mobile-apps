import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { EXERCISES } from '../data/exercises';
import { Session } from '../types';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const { sessions } = useAppContext();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const renderItem = ({ item }: { item: Session }) => {
    const exercise = EXERCISES.find(e => e.id === item.exerciseId);
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{exercise?.name || 'Unknown Exercise'}</Text>
          <Text style={styles.itemSubtitle}>Duration: {formatDuration(item.duration)}</Text>
        </View>
        <Text style={styles.itemDate}>
          {new Date(item.completedAt).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Session History</Text>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#d1d1d6" />
          <Text style={styles.emptyText}>No sessions yet.</Text>
          <Text style={styles.emptySubtext}>Complete a breathing exercise to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
  },
  itemDate: {
    fontSize: 14,
    color: '#8e8e93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8e8e93',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#d1d1d6',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HistoryScreen;

