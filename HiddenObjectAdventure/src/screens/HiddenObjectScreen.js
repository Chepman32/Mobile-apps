
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import levelsData from '../data/levels.json';

const { width, height } = Dimensions.get('window');

const HiddenObjectScreen = ({ route, navigation }) => {
  const { levelId } = route.params;
  const level = levelsData.levels.find((l) => l.id === levelId);

  const [foundObjects, setFoundObjects] = useState([]);

  useEffect(() => {
    if (level) {
      setFoundObjects([]);
    }
  }, [level]);

  const handleObjectClick = (objectName) => {
    if (level.objectsToFind.includes(objectName) && !foundObjects.includes(objectName)) {
      setFoundObjects([...foundObjects, objectName]);
      Alert.alert('Found!', `You found the ${objectName}!`);

      if (foundObjects.length + 1 === level.objectsToFind.length) {
        Alert.alert('Level Complete!', 'You found all hidden objects!');
        navigation.goBack();
      }
    } else if (foundObjects.includes(objectName)) {
      Alert.alert('Already Found', `You already found the ${objectName}.`);
    } else {
      Alert.alert('Wrong Object', 'That's not a hidden object for this level.');
    }
  };

  if (!level) {
    return (
      <View style={styles.container}>
        <Text>Level not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.levelTitle}>{level.name}</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `https://via.placeholder.com/600x400.png?text=${level.image}`,
          }} // Placeholder image
          style={styles.sceneImage}
        />
        {/* Conceptual: Overlay touchable areas for hidden objects */}
        <TouchableOpacity
          style={[styles.hiddenObjectArea, { top: 50, left: 50, width: 80, height: 80 }]} // Example area for 'book'
          onPress={() => handleObjectClick('book')}
        >
          <Text style={styles.hiddenObjectText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.hiddenObjectArea, { top: 150, left: 200, width: 100, height: 50 }]} // Example area for 'magnifying_glass'
          onPress={() => handleObjectClick('magnifying_glass')}
        >
          <Text style={styles.hiddenObjectText}>Magnifying Glass</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.objectsToFindTitle}>Objects to Find:</Text>
      <View style={styles.objectsToFindContainer}>
        {level.objectsToFind.map((objectName, index) => (
          <Text
            key={index}
            style={[styles.objectText, foundObjects.includes(objectName) && styles.foundObjectText]}
          >
            {objectName.replace(/_/g, ' ')}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    width: width - 40,
    height: (width - 40) * (400 / 600), // Maintain aspect ratio of placeholder
    position: 'relative',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sceneImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  hiddenObjectArea: {
    position: 'absolute',
    backgroundColor: 'rgba(255,0,0,0.3)', // Visual aid for conceptual areas
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenObjectText: {
    color: 'white',
    fontWeight: 'bold',
  },
  objectsToFindTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  objectsToFindContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  objectText: {
    fontSize: 16,
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  foundObjectText: {
    textDecorationLine: 'line-through',
    color: 'gray',
    backgroundColor: '#d4edda',
  },
});

export default HiddenObjectScreen;
