
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedChats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(loadedChats);
    });
    return unsubscribe;
  }, []);

  const createNewChat = async () => {
    Alert.prompt(
      'New Chat',
      'Enter chat name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: async (chatName) => {
            if (chatName) {
              try {
                await addDoc(collection(db, 'chats'), {
                  name: chatName,
                  createdAt: new Date(),
                  createdBy: auth.currentUser.email,
                });
              } catch (error) {
                Alert.alert('Error', 'Failed to create chat.');
              }
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { chatId: item.id, chatName: item.name })}
    >
      <Text style={styles.chatName}>{item.name}</Text>
      <Text style={styles.chatCreator}>Created by: {item.createdBy}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createNewChat}>
        <Text style={styles.buttonText}>Create New Chat</Text>
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
  chatItem: {
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
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatCreator: {
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

export default ChatListScreen;
