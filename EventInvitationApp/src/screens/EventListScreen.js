
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch events created by the user or where the user is invited
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      // This is a simplified query. In a real app, you'd manage invitations more robustly.
      // For now, it fetches all events. You'd filter client-side or use more complex Firestore queries.
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(loadedEvents);
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id, eventName: item.name })}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No events yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateEvent')}>
        <Text style={styles.buttonText}>Create New Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  eventItem: {
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
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default EventListScreen;
