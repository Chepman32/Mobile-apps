
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList, TextInput } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'memoryPalace.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PalaceDetailScreen = ({ route }) => {
  const { palaceId, palaceName } = route.params;
  const [palace, setPalace] = useState(null);
  const [memories, setMemories] = useState([]);
  const [newMemoryText, setNewMemoryText] = useState('');

  const loadPalaceAndMemories = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM palaces WHERE id = ?',
        [palaceId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setPalace(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching palace', error)
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS memories (id INTEGER PRIMARY KEY AUTOINCREMENT, palaceId INTEGER, text TEXT, dueDate TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM memories WHERE palaceId = ? ORDER BY dueDate ASC',
            [palaceId],
            (_, { rows }) => {
              const loadedMemories = [];
              for (let i = 0; i < rows.length; i++) {
                loadedMemories.push(rows.item(i));
              }
              setMemories(loadedMemories);
            },
            (tx, error) => console.error('Error fetching memories', error)
          );
        },
        (tx, error) => console.error('Error creating memories table', error)
      );
    });
  }, [palaceId]);

  useEffect(() => {
    loadPalaceAndMemories();
  }, [loadPalaceAndMemories]);

  const addMemory = () => {
    if (!newMemoryText.trim()) {
      Alert.alert('Error', 'Memory text cannot be empty.');
      return;
    }

    // Simplified Spaced Repetition: set due date for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toISOString().split('T')[0];

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO memories (palaceId, text, dueDate) VALUES (?, ?, ?)',
        [palaceId, newMemoryText, dueDate],
        () => {
          setNewMemoryText('');
          loadPalaceAndMemories();
          Alert.alert('Memory Added', 'Memory added to your palace. Review it tomorrow!');
        },
        (tx, error) => console.error('Error adding memory', error)
      );
    });
  };

  const markMemoryReviewed = (memoryId) => {
    // Simulate SRS update: set next due date further in future
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 7); // Review in 7 days
    const dueDate = nextDueDate.toISOString().split('T')[0];

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE memories SET dueDate = ? WHERE id = ?',
        [dueDate, memoryId],
        () => {
          loadPalaceAndMemories();
          Alert.alert('Memory Reviewed', 'Good job! See you in 7 days.');
        },
        (tx, error) => console.error('Error updating memory', error)
      );
    });
  };

  if (!palace) {
    return (
      <View style={styles.container}>
        <Text>Loading palace details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.palaceName}>{palace.name}</Text>
      {palace.photoUri && (
        <Image source={{ uri: palace.photoUri }} style={styles.palaceImage} />
      )}

      <Text style={styles.sectionTitle}>Add New Memory:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter information to remember..."
        value={newMemoryText}
        onChangeText={setNewMemoryText}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={addMemory}>
        <Text style={styles.addButtonText}>Add Memory</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Memories in this Palace:</Text>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.memoryItem}>
            <Text style={styles.memoryText}>{item.text}</Text>
            <Text style={styles.memoryDueDate}>Review Date: {item.dueDate}</Text>
            <TouchableOpacity style={styles.reviewButton} onPress={() => markMemoryReviewed(item.id)}>
              <Text style={styles.reviewButtonText}>Mark Reviewed</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No memories added to this palace yet.</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  palaceName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  palaceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memoryItem: {
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
  memoryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  memoryDueDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  reviewButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default PalaceDetailScreen;
