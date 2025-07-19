
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const LobbyScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [newGameName, setNewGameName] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedGames = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(loadedGames);
    });
    return unsubscribe;
  }, []);

  const createGame = async () => {
    if (newGameName.trim() === '') {
      Alert.alert('Error', 'Please enter a game name.');
      return;
    }
    try {
      await addDoc(collection(db, 'games'), {
        name: newGameName,
        hostId: auth.currentUser.uid,
        hostName: auth.currentUser.email, // Or display name
        players: [{ uid: auth.currentUser.uid, name: auth.currentUser.email }],
        status: 'waiting', // 'waiting', 'in-progress', 'completed'
        createdAt: new Date(),
      });
      setNewGameName('');
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', 'Failed to create game.');
    }
  };

  const joinGame = async (gameId, players) => {
    if (players.some(p => p.uid === auth.currentUser.uid)) {
      Alert.alert('Already Joined', 'You have already joined this game.');
      navigation.navigate('Game', { gameId: gameId });
      return;
    }
    try {
      const gameRef = doc(db, 'games', gameId);
      await updateDoc(gameRef, {
        players: [...players, { uid: auth.currentUser.uid, name: auth.currentUser.email }],
      });
      navigation.navigate('Game', { gameId: gameId });
    } catch (error) {
      console.error('Error joining game:', error);
      Alert.alert('Error', 'Failed to join game.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const renderGameItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameItem}
      onPress={() => joinGame(item.id, item.players)}
    >
      <Text style={styles.gameName}>{item.name}</Text>
      <Text style={styles.gameHost}>Host: {item.hostName}</Text>
      <Text style={styles.gamePlayers}>Players: {item.players.length}</Text>
      <Text style={styles.gameStatus}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New Game Name"
        value={newGameName}
        onChangeText={setNewGameName}
      />
      <TouchableOpacity style={styles.createButton} onPress={createGame}>
        <Text style={styles.buttonText}>Create Game</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Available Games</Text>
      <FlatList
        data={games.filter(game => game.status === 'waiting')}
        keyExtractor={(item) => item.id}
        renderItem={renderGameItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No games available. Create one!</Text>}
      />
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  gameItem: {
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
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  gameHost: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  gamePlayers: {
    fontSize: 14,
    color: '#666',
  },
  gameStatus: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default LobbyScreen;
