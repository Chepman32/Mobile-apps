
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'presentationBuilder.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PresentationListScreen = ({ navigation }) => {
  const [presentations, setPresentations] = useState([]);

  const loadPresentations = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS presentations (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, slides TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM presentations',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyPresentations = [
                  { title: 'Quarterly Report', slides: JSON.stringify(['Intro', 'Data', 'Conclusion']), isPremium: 0 },
                  { title: 'Product Launch', slides: JSON.stringify(['Vision', 'Features', 'Marketing']), isPremium: 0 },
                  { title: 'Investor Pitch', slides: JSON.stringify(['Problem', 'Solution', 'Market', 'Team', 'Ask']), isPremium: 1 },
                ];
                dummyPresentations.forEach(p => {
                  tx.executeSql(
                    'INSERT INTO presentations (title, slides, isPremium) VALUES (?, ?, ?)',
                    [p.title, p.slides, p.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting presentation', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM presentations',
                [],
                (_, { rows: allRows }) => {
                  const loadedPresentations = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedPresentations.push({ ...allRows.item(i), slides: JSON.parse(allRows.item(i).slides) });
                  }
                  setPresentations(loadedPresentations);
                },
                (tx, error) => console.error('Error fetching presentations', error)
              );
            },
            (tx, error) => console.error('Error checking presentations', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadPresentations();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPresentations();
    });
    return unsubscribe;
  }, [navigation, loadPresentations]);

  const createPresentation = () => {
    Alert.prompt(
      'New Presentation',
      'Enter presentation title:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (title) => {
            if (title) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO presentations (title, slides, isPremium) VALUES (?, ?, ?)',
                  [title, JSON.stringify(['New Slide']), 0],
                  (_, result) => {
                    navigation.navigate('PresentationEditor', { presentationId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding presentation', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handlePresentationPress = (presentation) => {
    if (presentation.isPremium) {
      Alert.alert(
        'Premium Presentation',
        'This presentation template is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('PresentationEditor', { presentationId: presentation.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium templates, AI features, etc.'
    );
  };

  const renderPresentationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.presentationItem, item.isPremium ? styles.premiumPresentationItem : null]}
      onPress={() => handlePresentationPress(item)}
    >
      <Text style={styles.presentationTitle}>{item.title}</Text>
      <Text style={styles.presentationSlides}>{item.slides.length} slides</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={presentations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPresentationItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No presentations found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createPresentation}>
        <Text style={styles.buttonText}>Create New Presentation</Text>
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
  presentationItem: {
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
  premiumPresentationItem: {
    backgroundColor: '#ffe0b2',
  },
  presentationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  presentationSlides: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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

export default PresentationListScreen;
