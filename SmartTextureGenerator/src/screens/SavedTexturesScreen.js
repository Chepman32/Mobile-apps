import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'textureGenerator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const SavedTexturesScreen = ({ navigation }) => {
  const [textures, setTextures] = useState([]);

  const loadTextures = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS textures (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, color1 TEXT, color2 TEXT, uri TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM textures ORDER BY timestamp DESC',
            [],
            (_, { rows }) => {
              const loadedTextures = [];
              for (let i = 0; i < rows.length; i++) {
                loadedTextures.push(rows.item(i));
              }
              setTextures(loadedTextures);
            },
            (tx, error) => console.error('Error fetching textures', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadTextures();
    const unsubscribe = navigation.addListener('focus', () => {
      loadTextures();
    });
    return unsubscribe;
  }, [navigation, loadTextures]);

  const handleTexturePress = (texture) => {
    if (texture.isPremium) {
      Alert.alert(
        'Premium Texture',
        'This texture is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Texture Details', `Type: ${texture.type}\nColors: ${texture.color1}, ${texture.color2}`);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium textures, AI features, commercial licensing, etc.'
    );
  };

  const renderTextureItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.textureItem, item.isPremium ? styles.premiumTextureItem : null]}
      onPress={() => handleTexturePress(item)}
    >
      {item.uri && <Image source={{ uri: item.uri }} style={styles.texturePreview} />}
      <View style={styles.textureInfo}>
        <Text style={styles.textureName}>{item.type}</Text>
        <Text style={styles.textureColors}>{item.color1} / {item.color2}</Text>
      </View>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={textures}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTextureItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No textures saved yet. Generate one!</Text>}
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
  textureItem: {
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
  premiumTextureItem: {
    backgroundColor: '#ffe0b2',
  },
  texturePreview: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textureInfo: {
    flex: 1,
  },
  textureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textureColors: {
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

export default SavedTexturesScreen;
