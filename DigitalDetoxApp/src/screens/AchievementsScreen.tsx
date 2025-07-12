import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';

const AchievementsScreen = () => {
  const { sessions } = useAppContext();

  // Simple achievement calculation: 10 sessions = Bronze, 20 = Silver, 30 = Gold
  const total = sessions.length;
  const level = total >= 30 ? 'Gold' : total >= 20 ? 'Silver' : total >= 10 ? 'Bronze' : 'None';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <Text style={styles.subtitle}>Completed Sessions: {total}</Text>
      {level !== 'None' && <Text style={styles.badge}>Badge: {level}</Text>}
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{new Date(item.startedAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  badge: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 14 },
});

export default AchievementsScreen;
