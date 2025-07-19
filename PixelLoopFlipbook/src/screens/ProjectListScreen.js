
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectListScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);

  const loadProjects = useCallback(async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('animationProjects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, []);

  useEffect(() => {
    loadProjects();
    const unsubscribe = navigation.addListener('focus', () => {
      loadProjects();
    });
    return unsubscribe;
  }, [navigation, loadProjects]);

  const createNewProject = async () => {
    const newProject = {
      id: Date.now().toString(),
      name: `New Project ${projects.length + 1}`,
      frames: [], // Array of base64 image data or paths
      frameLimit: 50, // Default free limit
      exportLimit: '720p', // Default free export limit
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    await AsyncStorage.setItem('animationProjects', JSON.stringify(updatedProjects));
    navigation.navigate('AnimationEditor', { projectId: newProject.id });
  };

  const handleProjectPress = (projectId) => {
    navigation.navigate('AnimationEditor', { projectId });
  };

  const purchasePro = () => {
    Alert.alert(
      'Animator Pro',
      'In a real app, this would initiate an in-app purchase to unlock all limits.'
    );
    // For demonstration, let's simulate unlocking pro features
    AsyncStorage.setItem('isProUser', 'true');
    Alert.alert('Pro Unlocked!', 'You now have unlimited frames and 4K export!');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectItem}
            onPress={() => handleProjectPress(item.id)}
          >
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDetails}>{item.frames.length} frames</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No animation projects yet. Create one!</Text>
        }
      />
      <TouchableOpacity style={styles.createButton} onPress={createNewProject}>
        <Text style={styles.createButtonText}>Create New Project</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.proButton} onPress={purchasePro}>
        <Text style={styles.proButtonText}>Unlock Animator Pro</Text>
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
  projectItem: {
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
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  projectDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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
  proButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  proButtonText: {
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

export default ProjectListScreen;
