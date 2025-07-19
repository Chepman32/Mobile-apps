
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const PollListScreen = ({ navigation }) => {
  const [polls, setPolls] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedPolls = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(loadedPolls);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const renderPollItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pollItem}
      onPress={() => navigation.navigate('PollDetail', { pollId: item.id, pollQuestion: item.question })}
    >
      <Text style={styles.pollQuestion}>{item.question}</Text>
      <Text style={styles.pollCreator}>Created by: {item.createdBy}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={polls}
        keyExtractor={(item) => item.id}
        renderItem={renderPollItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No polls yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreatePoll')}>
        <Text style={styles.buttonText}>Create New Poll</Text>
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
  pollItem: {
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
  pollQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pollCreator: {
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

export default PollListScreen;
