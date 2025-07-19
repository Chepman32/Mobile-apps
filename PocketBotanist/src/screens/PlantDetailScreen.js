
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import plantsData from '../data/plants.json';

const PlantDetailScreen = ({ route }) => {
  const { plantId } = route.params;
  const plant = plantsData.plants.find((p) => p.id === plantId);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text>Plant not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {plant.image && (
        <Image source={{ uri: plant.image }} style={styles.plantImage} />
      )}
      <Text style={styles.plantName}>{plant.name}</Text>
      <Text style={styles.plantScientificName}>{plant.scientificName}</Text>
      <Text style={styles.sectionTitle}>Description:</Text>
      <Text style={styles.sectionContent}>{plant.description}</Text>
      <Text style={styles.sectionTitle}>Care Instructions:</Text>
      <Text style={styles.sectionContent}>{plant.care}</Text>
      {plant.locked && (
        <Text style={styles.lockedText}>This is a premium plant. Purchase a pack to unlock more!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  plantImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  plantName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  plantScientificName: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  lockedText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default PlantDetailScreen;
