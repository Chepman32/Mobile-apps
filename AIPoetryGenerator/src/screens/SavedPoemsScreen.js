import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'poetryGenerator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const SavedPoemsScreen = ({ navigation }) => {
  const [poems, setPoems] = useState([]);

  const loadPoems = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS poems (id INTEGER PRIMARY KEY AUTOINCREMENT, theme TEXT, content TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM poems ORDER BY timestamp DESC',
            [],
            (_, { rows }) => {
              const loadedPoems = [];
              for (let i = 0; i < rows.length; i++) {
                loadedPoems.push(rows.item(i));
              }
              setPoems(loadedPoems);
            },
            (tx, error) => console.error('Error fetching poems', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadPoems();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPoems();
    });
    return unsubscribe;
  }, [navigation, loadPoems]);

  const handlePoemPress = (poem) => {
    if (poem.isPremium) {
      Alert.alert(
        'Premium Poem',
        'This poem is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Poem Content', `Theme: ${poem.theme}\n\n${poem.content}`);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium AI features, style analysis, publishing tools, etc.'
    );
  };

  const renderPoemItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.poemItem, item.isPremium ? styles.premiumPoemItem : null]}
      onPress={() => handlePoemPress(item)}
    >
      <Text style={styles.poemTitle}>{item.theme}</Text>
      <Text style={styles.poemContent} numberOfLines={2}>{item.content}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={poems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPoemItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No poems saved yet.</Text>}
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
  poemItem: {
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
  premiumPoemItem: {
    backgroundColor: '#ffe0b2',
  },
  poemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  poemContent: {
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

export default SavedPoemsScreen;
