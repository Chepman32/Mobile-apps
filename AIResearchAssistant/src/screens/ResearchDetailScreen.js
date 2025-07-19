
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'researchAssistant.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ResearchDetailScreen = ({ route }) => {
  const { researchId } = route.params;
  const [research, setResearch] = useState(null);
  const [attachedDocuments, setAttachedDocuments] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM research_projects WHERE id = ?',
        [researchId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setResearch(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching research', error)
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT, researchId INTEGER, uri TEXT, name TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM documents WHERE researchId = ?',
            [researchId],
            (_, { rows }) => {
              const loadedDocs = [];
              for (let i = 0; i < rows.length; i++) {
                loadedDocs.push(rows.item(i));
              }
              setAttachedDocuments(loadedDocs);
            },
            (tx, error) => console.error('Error fetching documents', error)
          );
        },
        (tx, error) => console.error('Error creating documents table', error)
      );
    });
  }, [researchId]);

  const attachDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const newDoc = res[0];

      // Copy file to app's local storage (conceptual)
      const destPath = `${RNFS.DocumentDirectoryPath}/${newDoc.name}`;
      await RNFS.copyFile(newDoc.uri, destPath);

      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO documents (researchId, uri, name) VALUES (?, ?, ?)',
          [researchId, destPath, newDoc.name],
          () => {
            Alert.alert('Success', `Document ${newDoc.name} attached!`);
            setAttachedDocuments([...attachedDocuments, { uri: destPath, name: newDoc.name }]);
          },
          (tx, error) => console.error('Error attaching document', error)
        );
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Document picker error:', err);
        Alert.alert('Error', 'Failed to pick document.');
      }
    }
  };

  const getAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered insights and connections. (Conceptual)'
    );
    // In a real app, an AI model would analyze research content and suggest insights.
  };

  if (!research) {
    return (
      <View style={styles.container}>
        <Text>Loading research details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.researchTitle}>{research.title}</Text>
      <Text style={styles.researchDescription}>{research.description}</Text>

      <TouchableOpacity style={styles.button} onPress={getAISuggestion}>
        <Text style={styles.buttonText}>Get AI Insights</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Attached Documents:</Text>
      {attachedDocuments.length > 0 ? (
        attachedDocuments.map((doc, index) => (
          <Text key={index} style={styles.documentItem}>• {doc.name}</Text>
        ))
      ) : (
        <Text style={styles.emptyText}>No documents attached yet.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={attachDocument}>
        <Text style={styles.buttonText}>Attach Document</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Collaboration tools and advanced export features available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  researchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  researchDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  documentItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default ResearchDetailScreen;
