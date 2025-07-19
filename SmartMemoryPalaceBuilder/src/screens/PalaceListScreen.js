
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getRealm } from '../services/realm';

const PalaceListScreen = ({ navigation }) => {
  const [palaces, setPalaces] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await getRealm();
        setRealm(newRealm);

        const initialPalaces = newRealm.objects('MemoryPalace');
        setPalaces(Array.from(initialPalaces));

        newRealm.objects('MemoryPalace').addListener(() => {
          setPalaces(Array.from(newRealm.objects('MemoryPalace')));
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

  const createPalace = () => {
    Alert.prompt(
      'New Memory Palace',
      'Enter palace name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name && realm) {
              realm.write(() => {
                const newPalace = realm.create('MemoryPalace', {
                  _id: new Realm.BSON.ObjectId(),
                  name: name,
                  createdAt: new Date(),
                  isPremium: false,
                });
                navigation.navigate('PalaceEditor', { palaceId: newPalace._id.toHexString() });
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handlePalacePress = (palace) => {
    if (palace.isPremium) {
      Alert.alert(
        'Premium Palace',
        'This memory palace is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('PalaceEditor', { palaceId: palace._id.toHexString() });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium palace templates, AI coaching, etc.'
    );
  };

  const renderPalaceItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.palaceItem, item.isPremium ? styles.premiumPalaceItem : null]}
      onPress={() => handlePalacePress(item)}
    >
      <Text style={styles.palaceName}>{item.name}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={palaces}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={renderPalaceItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No memory palaces yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createPalace}>
        <Text style={styles.buttonText}>Create New Palace</Text>
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
  palaceItem: {
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
  premiumPalaceItem: {
    backgroundColor: '#ffe0b2',
  },
  palaceName: {
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

export default PalaceListScreen;
