
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dummyPalettes = [
  {
    id: '1',
    name: 'Ocean Breeze',
    colors: ['#ADD8E6', '#87CEEB', '#6495ED', '#4169E1'],
    isPremium: false,
  },
  {
    id: '2',
    name: 'Sunset Hues',
    colors: ['#FFD700', '#FFA500', '#FF4500', '#DC143C'],
    isPremium: true,
  },
];

const PaletteListScreen = ({ navigation }) => {
  const [palettes, setPalettes] = useState([]);

  const loadPalettes = useCallback(async () => {
    try {
      const storedPalettes = await AsyncStorage.getItem('palettes');
      if (storedPalettes) {
        setPalettes(JSON.parse(storedPalettes));
      } else {
        // Initialize with dummy data if no palettes exist
        await AsyncStorage.setItem('palettes', JSON.stringify(dummyPalettes));
        setPalettes(dummyPalettes);
      }
    } catch (error) {
      console.error('Failed to load palettes:', error);
    }
  }, []);

  useEffect(() => {
    loadPalettes();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPalettes();
    });
    return unsubscribe;
  }, [navigation, loadPalettes]);

  const handlePalettePress = (palette) => {
    if (palette.isPremium) {
      Alert.alert(
        'Premium Palette',
        'This palette is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase Premium', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Palette Selected', `You selected ${palette.name}`);
      // In a real app, you might navigate to a detail screen or apply the palette
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium palettes, advanced tools, etc.'
    );
  };

  const renderPaletteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.paletteItem, item.isPremium ? styles.premiumPaletteItem : null]}
      onPress={() => handlePalettePress(item)}
    >
      <Text style={styles.paletteName}>{item.name}</Text>
      <View style={styles.colorSwatches}>
        {item.colors.map((color, index) => (
          <View key={index} style={[styles.colorSwatch, { backgroundColor: color }]} />
        ))}
      </View>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={palettes}
        keyExtractor={(item) => item.id}
        renderItem={renderPaletteItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No palettes found.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ColorPicker')}>
        <Text style={styles.buttonText}>Create New Palette</Text>
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
  paletteItem: {
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
  premiumPaletteItem: {
    backgroundColor: '#ffe0b2',
  },
  paletteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  colorSwatches: {
    flexDirection: 'row',
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
    marginTop: 10,
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

export default PaletteListScreen;
