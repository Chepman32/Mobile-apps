
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'animationStudio.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnimationListScreen = ({ navigation }) => {
  const [animations, setAnimations] = useState([]);

  const loadAnimations = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS animations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, frames TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM animations',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyAnimations = [
                  { name: 'Bouncing Ball', frames: JSON.stringify(['frame1', 'frame2', 'frame3']), isPremium: 0 },
                  { name: 'Walking Cycle', frames: JSON.stringify(['frameA', 'frameB', 'frameC']), isPremium: 0 },
                  { name: 'Explosion Effect', frames: JSON.stringify(['exp1', 'exp2', 'exp3', 'exp4']), isPremium: 1 },
                ];
                dummyAnimations.forEach(a => {
                  tx.executeSql(
                    'INSERT INTO animations (name, frames, isPremium) VALUES (?, ?, ?)',
                    [a.name, a.frames, a.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting animation', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM animations',
                [],
                (_, { rows: allRows }) => {
                  const loadedAnimations = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedAnimations.push({ ...allRows.item(i), frames: JSON.parse(allRows.item(i).frames) });
                  }
                  setAnimations(loadedAnimations);
                },
                (tx, error) => console.error('Error fetching animations', error)
              );
            },
            (tx, error) => console.error('Error checking animations', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadAnimations();
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnimations();
    });
    return unsubscribe;
  }, [navigation, loadAnimations]);

  const createAnimation = () => {
    Alert.prompt(
      'New Animation',
      'Enter animation name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO animations (name, frames, isPremium) VALUES (?, ?, ?)',
                  [name, JSON.stringify(['Frame 1']), 0],
                  (_, result) => {
                    navigation.navigate('AnimationEditor', { animationId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding animation', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleAnimationPress = (animation) => {
    if (animation.isPremium) {
      Alert.alert(
        'Premium Animation',
        'This animation is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('AnimationEditor', { animationId: animation.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium animation tools, AI features, etc.'
    );
  };

  const renderAnimationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.animationItem, item.isPremium ? styles.premiumAnimationItem : null]}
      onPress={() => handleAnimationPress(item)}
    >
      <Text style={styles.animationName}>{item.name}</Text>
      <Text style={styles.animationFrames}>{item.frames.length} frames</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={animations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAnimationItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No animations found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createAnimation}>
        <Text style={styles.buttonText}>Create New Animation</Text>
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
  animationItem: {
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
  premiumAnimationItem: {
    backgroundColor: '#ffe0b2',
  },
  animationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  animationFrames: {
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

export default AnimationListScreen;
