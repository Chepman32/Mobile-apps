
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoryListScreen = ({ navigation }) => {
  const [stories, setStories] = useState([]);

  const loadStories = useCallback(async () => {
    try {
      const storedStories = await AsyncStorage.getItem('stories');
      if (storedStories) {
        setStories(JSON.parse(storedStories));
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  }, []);

  useEffect(() => {
    loadStories();
    const unsubscribe = navigation.addListener('focus', () => {
      loadStories();
    });
    return unsubscribe;
  }, [navigation, loadStories]);

  const createNewStory = async () => {
    const newStory = {
      id: Date.now().toString(),
      title: `New Story ${stories.length + 1}`,
      nodes: [{ id: 'start', text: 'The story begins...', choices: [] }],
      currentNodeId: 'start',
    };

    const updatedStories = [...stories, newStory];
    setStories(updatedStories);
    await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
    navigation.navigate('StoryEditor', { storyId: newStory.id });
  };

  const handleStoryPress = (storyId) => {
    navigation.navigate('StoryEditor', { storyId });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium themes, styles, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.storyItem}
            onPress={() => handleStoryPress(item.id)}
          >
            <Text style={styles.storyName}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No stories yet. Create one!</Text>
        }
      />
      <TouchableOpacity style={styles.createButton} onPress={createNewStory}>
        <Text style={styles.createButtonText}>Create New Story</Text>
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
  storyItem: {
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
  storyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
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

export default StoryListScreen;
