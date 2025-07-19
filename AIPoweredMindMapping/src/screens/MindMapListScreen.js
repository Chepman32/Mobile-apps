
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getRealm } from '../services/realm';

const MindMapListScreen = ({ navigation }) => {
  const [mindMaps, setMindMaps] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await getRealm();
        setRealm(newRealm);

        const initialMindMaps = newRealm.objects('MindMap');
        setMindMaps(Array.from(initialMindMaps));

        newRealm.objects('MindMap').addListener(() => {
          setMindMaps(Array.from(newRealm.objects('MindMap')));
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

  const createMindMap = () => {
    Alert.prompt(
      'New Mind Map',
      'Enter mind map name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name && realm) {
              realm.write(() => {
                const newMindMap = realm.create('MindMap', {
                  _id: new Realm.BSON.ObjectId(),
                  name: name,
                  createdAt: new Date(),
                  isPremium: false,
                });
                navigation.navigate('MindMapEditor', { mindMapId: newMindMap._id.toHexString() });
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleMindMapPress = (mindMap) => {
    if (mindMap.isPremium) {
      Alert.alert(
        'Premium Mind Map',
        'This mind map is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('MindMapEditor', { mindMapId: mindMap._id.toHexString() });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium templates, AI insights, etc.'
    );
  };

  const renderMindMapItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.mindMapItem, item.isPremium ? styles.premiumMindMapItem : null]}
      onPress={() => handleMindMapPress(item)}
    >
      <Text style={styles.mindMapName}>{item.name}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mindMaps}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={renderMindMapItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No mind maps yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createMindMap}>
        <Text style={styles.buttonText}>Create New Mind Map</Text>
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
  mindMapItem: {
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
  premiumMindMapItem: {
    backgroundColor: '#ffe0b2',
  },
  mindMapName: {
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

export default MindMapListScreen;
