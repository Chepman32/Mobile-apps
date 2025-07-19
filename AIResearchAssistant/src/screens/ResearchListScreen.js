
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'researchAssistant.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ResearchListScreen = ({ navigation }) => {
  const [researchProjects, setResearchProjects] = useState([]);

  const loadResearchProjects = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS research_projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM research_projects',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyProjects = [
                  { title: 'Quantum Computing Basics', description: 'Fundamental concepts of quantum computing.', isPremium: 0 },
                  { title: 'AI Ethics in Healthcare', description: 'Ethical considerations for AI in medical applications.', isPremium: 0 },
                  { title: 'Advanced Neuroscience Research', description: 'Cutting-edge research in brain science.', isPremium: 1 },
                ];
                dummyProjects.forEach(project => {
                  tx.executeSql(
                    'INSERT INTO research_projects (title, description, isPremium) VALUES (?, ?, ?)',
                    [project.title, project.description, project.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting project', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM research_projects',
                [],
                (_, { rows: allRows }) => {
                  const loadedProjects = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedProjects.push(allRows.item(i));
                  }
                  setResearchProjects(loadedProjects);
                },
                (tx, error) => console.error('Error fetching projects', error)
              );
            },
            (tx, error) => console.error('Error checking projects', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadResearchProjects();
    const unsubscribe = navigation.addListener('focus', () => {
      loadResearchProjects();
    });
    return unsubscribe;
  }, [navigation, loadResearchProjects]);

  const addResearchProject = () => {
    navigation.navigate('AddResearch');
  };

  const handleProjectPress = (project) => {
    if (project.isPremium) {
      Alert.alert(
        'Premium Research',
        'This research project is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('ResearchDetail', { researchId: project.id, researchTitle: project.title });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced AI analysis, export features, etc.'
    );
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.projectItem, item.isPremium ? styles.premiumProjectItem : null]}
      onPress={() => handleProjectPress(item)}
    >
      <Text style={styles.projectTitle}>{item.title}</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={researchProjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProjectItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No research projects found. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addResearchProject}>
        <Text style={styles.buttonText}>Add New Research</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  premiumProjectItem: {
    backgroundColor: '#ffe0b2',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
    marginTop: 5,
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

export default ResearchListScreen;
