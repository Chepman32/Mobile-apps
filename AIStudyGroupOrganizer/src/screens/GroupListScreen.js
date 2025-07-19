
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'studyGroupOrganizer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const GroupListScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);

  const loadGroups = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS study_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, subject TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM study_groups',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyGroups = [
                  { name: 'Calculus Study Group', subject: 'Math', isPremium: 0 },
                  { name: 'History Exam Prep', subject: 'History', isPremium: 0 },
                  { name: 'Advanced Physics Research', subject: 'Physics', isPremium: 1 },
                ];
                dummyGroups.forEach(group => {
                  tx.executeSql(
                    'INSERT INTO study_groups (name, subject, isPremium) VALUES (?, ?, ?)',
                    [group.name, group.subject, group.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting group', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM study_groups',
                [],
                (_, { rows: allRows }) => {
                  const loadedGroups = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedGroups.push(allRows.item(i));
                  }
                  setGroups(loadedGroups);
                },
                (tx, error) => console.error('Error fetching groups', error)
              );
            },
            (tx, error) => console.error('Error checking groups', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadGroups();
    const unsubscribe = navigation.addListener('focus', () => {
      loadGroups();
    });
    return unsubscribe;
  }, [navigation, loadGroups]);

  const createGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleGroupPress = (group) => {
    if (group.isPremium) {
      Alert.alert(
        'Premium Group',
        'This study group is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('GroupDetail', { groupId: group.id, groupName: group.name });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced scheduling, group analytics, etc.'
    );
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.groupItem, item.isPremium ? styles.premiumGroupItem : null]}
      onPress={() => handleGroupPress(item)}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupSubject}>{item.subject}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGroupItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No study groups found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createGroup}>
        <Text style={styles.buttonText}>Create New Group</Text>
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
  groupItem: {
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
  premiumGroupItem: {
    backgroundColor: '#ffe0b2',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  groupSubject: {
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

export default GroupListScreen;
