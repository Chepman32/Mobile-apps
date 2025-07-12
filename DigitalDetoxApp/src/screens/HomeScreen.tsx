import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CHALLENGES } from '../data/challenges';
import { Challenge } from '../types';

const HomeScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Challenge', { challengeId: item.id })}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.durationMinutes} minutes</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#d1d1d6" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Detox</Text>
        <Text style={styles.subtitle}>Select a challenge to start</Text>
      </View>
      <FlatList
        data={CHALLENGES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('History' as never)} style={styles.footerButton}>
          <Ionicons name="time-outline" size={24} color="#8e8e93" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)} style={styles.footerButton}>
          <Ionicons name="settings-outline" size={24} color="#8e8e93" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  subtitle: {
    fontSize: 17,
    color: '#8e8e93',
    marginTop: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#8e8e93',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  footerButton: {
    padding: 8,
  },
});

export default HomeScreen;
