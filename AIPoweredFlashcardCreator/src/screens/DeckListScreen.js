
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getRealm } from '../services/realm';

const DeckListScreen = ({ navigation }) => {
  const [decks, setDecks] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await getRealm();
        setRealm(newRealm);

        const initialDecks = newRealm.objects('Deck');
        setDecks(Array.from(initialDecks));

        newRealm.objects('Deck').addListener(() => {
          setDecks(Array.from(newRealm.objects('Deck')));
        });
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  const createDeck = () => {
    Alert.prompt(
      'New Flashcard Deck',
      'Enter deck name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name && realm) {
              realm.write(() => {
                realm.create('Deck', {
                  _id: new Realm.BSON.ObjectId(),
                  name: name,
                  isPremium: false,
                });
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleDeckPress = (deck) => {
    if (deck.isPremium) {
      Alert.alert(
        'Premium Deck',
        'This deck is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('Flashcard', { deckId: deck._id.toHexString() });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium AI generation, advanced algorithms, etc.'
    );
  };

  const renderDeckItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.deckItem, item.isPremium ? styles.premiumDeckItem : null]}
      onPress={() => handleDeckPress(item)}
    >
      <Text style={styles.deckName}>{item.name}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={renderDeckItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No decks found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createDeck}>
        <Text style={styles.buttonText}>Create New Deck</Text>
      </TouchableOpacity>
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
  deckItem: {
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
  premiumDeckItem: {
    backgroundColor: '#ffe0b2',
  },
  deckName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
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
  premiumButton: {
    backgroundColor: '#28a745',
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

export default DeckListScreen;
