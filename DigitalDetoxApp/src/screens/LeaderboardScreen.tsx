import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DATA = [
  { id: '1', name: 'Alex', points: 120 },
  { id: '2', name: 'Jordan', points: 90 },
  { id: '3', name: 'Sam', points: 75 },
];

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Community Leaderboard</Text>
      </View>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  backButton: { padding: 8, marginLeft: -8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1c1c1e', marginLeft: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  rank: { fontSize: 18, width: 24, textAlign: 'center', color: '#8e8e93' },
  name: { flex: 1, fontSize: 18, color: '#1c1c1e' },
  points: { fontSize: 18, color: '#4e7396' },
});

export default LeaderboardScreen;
