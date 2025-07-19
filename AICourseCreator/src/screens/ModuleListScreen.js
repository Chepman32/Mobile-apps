import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Button } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'courseCreator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ModuleListScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [modules, setModules] = useState([]);
  const [moduleTitle, setModuleTitle] = useState('');

  const loadModules = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS modules (id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER, title TEXT, content TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM modules WHERE course_id = ?',
            [courseId],
            (_, { rows }) => {
              const loadedModules = [];
              for (let i = 0; i < rows.length; i++) {
                loadedModules.push(rows.item(i));
              }
              setModules(loadedModules);
            }
          );
        }
      );
    });
  }, [courseId]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const addModule = () => {
    if (moduleTitle) {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO modules (course_id, title, content) VALUES (?, ?, ?)',
          [courseId, moduleTitle, ''],
          () => {
            setModuleTitle('');
            loadModules();
          }
        );
      });
    }
  };

  const deleteModule = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM modules WHERE id = ?', [id], () => {
        loadModules();
      });
    });
  };

  const renderModuleItem = ({ item }) => (
    <View style={styles.moduleItem}>
        <Text style={styles.moduleTitle}>{item.title}</Text>
      <TouchableOpacity onPress={() => deleteModule(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.addModuleContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Module Title"
          value={moduleTitle}
          onChangeText={setModuleTitle}
        />
        <Button title="Add Module" onPress={addModule} />
      </View>
      <FlatList
        data={modules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderModuleItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No modules found. Create one!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  addModuleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  moduleItem: {
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
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default ModuleListScreen;
