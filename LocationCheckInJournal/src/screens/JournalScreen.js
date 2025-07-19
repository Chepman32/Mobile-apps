
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const JournalScreen = () => {
  const [checkIns, setCheckIns] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'checkins'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedCheckIns = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCheckIns(loadedCheckIns);
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const renderCheckInItem = ({ item }) => (
    <View style={styles.checkInItem}>
      <Text style={styles.placeName}>{item.placeName}</Text>
      <Text style={styles.timestamp}>{item.timestamp?.toDate().toLocaleString()}</Text>
      <Text style={styles.coordinates}>Lat: {item.latitude?.toFixed(4)}, Lon: {item.longitude?.toFixed(4)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={checkIns}
        keyExtractor={(item) => item.id}
        renderItem={renderCheckInItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No check-ins yet. Go check in somewhere!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  checkInItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default JournalScreen;
