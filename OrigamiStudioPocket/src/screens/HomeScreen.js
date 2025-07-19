
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import modelsData from '../data/models.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [models, setModels] = useState([]);

  const loadModels = useCallback(async () => {
    try {
      const unlockedModels = await AsyncStorage.getItem('unlockedModels');
      let updatedModels = modelsData.models.map(model => ({
        ...model,
        locked: model.locked && !(unlockedModels && JSON.parse(unlockedModels).includes(model.id))
      }));
      setModels(updatedModels);
    } catch (error) {
      console.error('Failed to load models:', error);
      setModels(modelsData.models); // Fallback to default
    }
  }, []);

  useEffect(() => {
    loadModels();
    const unsubscribe = navigation.addListener('focus', () => {
      loadModels();
    });
    return unsubscribe;
  }, [navigation, loadModels]);

  const handleModelPress = (model) => {
    if (model.locked) {
      Alert.alert(
        'Model Locked',
        'This model is part of a premium pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseModelPack() },
        ]
      );
    } else {
      navigation.navigate('ModelView', { modelId: model.id });
    }
  };

  const purchaseModelPack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Model Pack',
      'In a real app, this would initiate an in-app purchase for a model pack.'
    );
    // For demonstration, let's unlock all locked models
    const newUnlockedModels = modelsData.models.filter(m => m.locked).map(m => m.id);
    AsyncStorage.getItem('unlockedModels').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...newUnlockedModels])];
      AsyncStorage.setItem('unlockedModels', JSON.stringify(combinedUnlocked));
      loadModels(); // Reload models to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={models}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.modelItem, item.locked && styles.lockedModelItem]}
            onPress={() => handleModelPress(item)}
          >
            <Text style={styles.modelName}>{item.name}</Text>
            {item.locked && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseModelPack}>
        <Text style={styles.purchaseButtonText}>Unlock All Premium Models</Text>
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
  modelItem: {
    padding: 20,
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
  lockedModelItem: {
    backgroundColor: '#e0e0e0',
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lockedText: {
    color: '#888',
    fontSize: 14,
  },
  purchaseButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
