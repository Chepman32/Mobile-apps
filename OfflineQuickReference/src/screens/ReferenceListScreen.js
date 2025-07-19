
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import SearchBar from 'react-native-search-bar';

const db = SQLite.openDatabase(
  { name: 'reference.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ReferenceListScreen = ({ navigation }) => {
  const [references, setReferences] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadReferences = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS references (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, category TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM references',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyReferences = [
                  { title: 'React Native Basics', content: 'React Native is a framework for building native apps using React.', category: 'Programming', isPremium: 0 },
                  { title: 'Python Cheatsheet', content: 'Common Python commands and syntax.', category: 'Programming', isPremium: 0 },
                  { title: 'Advanced Calculus Formulas', content: 'Complex calculus formulas and theorems.', category: 'Math', isPremium: 1 },
                ];
                dummyReferences.forEach(ref => {
                  tx.executeSql(
                    'INSERT INTO references (title, content, category, isPremium) VALUES (?, ?, ?, ?)',
                    [ref.title, ref.content, ref.category, ref.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting reference', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM references',
                [],
                (_, { rows: allRows }) => {
                  const loadedReferences = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedReferences.push(allRows.item(i));
                  }
                  setReferences(loadedReferences);
                },
                (tx, error) => console.error('Error fetching references', error)
              );
            },
            (tx, error) => console.error('Error checking references', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadReferences();
    const unsubscribe = navigation.addListener('focus', () => {
      loadReferences();
    });
    return unsubscribe;
  }, [navigation, loadReferences]);

  const handleReferencePress = (reference) => {
    if (reference.isPremium) {
      Alert.alert(
        'Premium Content',
        'This reference material is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase Premium', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('ReferenceDetail', { referenceId: reference.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium reference materials and advanced search.'
    );
  };

  const filteredReferences = references.filter(ref =>
    ref.title.toLowerCase().includes(searchText.toLowerCase()) ||
    ref.content.toLowerCase().includes(searchText.toLowerCase()) ||
    ref.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderReferenceItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.referenceItem, item.isPremium ? styles.premiumReferenceItem : null]}
      onPress={() => handleReferencePress(item)}
    >
      <Text style={styles.referenceTitle}>{item.title}</Text>
      <Text style={styles.referenceCategory}>{item.category}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search References"
        onChangeText={setSearchText}
        value={searchText}
        onSearchButtonPress={() => {}}
        onCancelButtonPress={() => setSearchText('')}
      />
      <FlatList
        data={filteredReferences}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReferenceItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No reference materials found.</Text>}
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
  referenceItem: {
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
  premiumReferenceItem: {
    backgroundColor: '#ffe0b2',
  },
  referenceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  referenceCategory: {
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

export default ReferenceListScreen;
