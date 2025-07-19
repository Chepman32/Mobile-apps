
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'musicComposer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const LibraryScreen = ({ navigation }) => {
  const [compositions, setCompositions] = useState([]);

  const loadCompositions = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS compositions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, notes TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM compositions ORDER BY timestamp DESC',
            [],
            (_, { rows }) => {
              const loadedCompositions = [];
              for (let i = 0; i < rows.length; i++) {
                loadedCompositions.push(rows.item(i));
              }
              setCompositions(loadedCompositions);
            },
            (tx, error) => console.error('Error fetching compositions', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadCompositions();
    const unsubscribe = navigation.addListener('focus', () => {
      loadCompositions();
    });
    return unsubscribe;
  }, [navigation, loadCompositions]);

  const handleCompositionPress = (composition) => {
    if (composition.isPremium) {
      Alert.alert(
        'Premium Composition',
        'This composition is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Composition Details', `Title: ${composition.title}\nNotes: ${composition.notes}`);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium instruments, AI features, export options, etc.'
    );
  };

  const renderCompositionItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.compositionItem, item.isPremium ? styles.premiumCompositionItem : null]}
      onPress={() => handleCompositionPress(item)}
    >
      <Text style={styles.compositionTitle}>{item.title}</Text>
      <Text style={styles.compositionNotes} numberOfLines={1}>{item.notes}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={compositions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCompositionItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No compositions found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  compositionItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumCompositionItem: {
    backgroundColor: '#ffe0b2',
  },
  compositionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  compositionNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default LibraryScreen;
