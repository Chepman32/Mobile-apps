
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'digitalSculpting.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const SculptureEditorScreen = ({ route }) => {
  const { sculptureId } = route.params;
  const [sculpture, setSculpture] = useState(null);
  const [sculptureName, setSculptureName] = useState('');
  const [sculptureDescription, setSculptureDescription] = useState('');

  const [modelData, setModelData] = useState('Sphere(r=1)');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM sculptures WHERE id = ?',
        [sculptureId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedSculpture = rows.item(0);
            setSculpture(loadedSculpture);
            setSculptureName(loadedSculpture.name);
            setSculptureDescription(loadedSculpture.description);
            if (loadedSculpture.model_data) {
              setModelData(loadedSculpture.model_data);
            }
          }
        },
        (tx, error) => console.error('Error fetching sculpture', error)
      );
    });
  }, [sculptureId]);

  const saveSculpture = () => {
    if (!sculpture) return;

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE sculptures SET name = ?, description = ?, model_data = ? WHERE id = ?',
        [sculptureName, sculptureDescription, modelData, sculptureId],
        () => Alert.alert('Success', 'Sculpture saved!'),
        (tx, error) => console.error('Error saving sculpture', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-assisted form and detail generation. (Conceptual)'
    );
    // In a real app, an AI model would suggest sculpting forms or details.
  };

  const exportModel = async () => {
    Alert.alert(
      'Export Model',
      'Simulating 3D model export. (Conceptual: requires 3D model library)'
    );
    // In a real app, you'd export the 3D model data to a file (e.g., .obj, .gltf)
    const dummyModelContent = `// Dummy 3D Model Data\n${modelData}`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${sculptureName.replace(/\s/g, '_')}.obj`;
    try {
      await RNFS.writeFile(filePath, dummyModelContent, 'utf8');
      Alert.alert('Exported', `Model exported to ${filePath}`);
    } catch (error) {
      console.error('Error exporting model:', error);
      Alert.alert('Error', 'Failed to export model.');
    }
  };

  if (!sculpture) {
    return (
      <View style={styles.container}>
        <Text>Loading sculpture...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Sculpture Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Sculpture Name"
        value={sculptureName}
        onChangeText={setSculptureName}
        onBlur={saveSculpture} // Save on blur
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Sculpture Description"
        multiline
        value={sculptureDescription}
        onChangeText={setSculptureDescription}
        onBlur={saveSculpture} // Save on blur
      />

      <Text style={styles.label}>3D Model View (Conceptual):</Text>
      <View style={styles.modelViewerPlaceholder}>
        <Text style={styles.modelViewerText}>3D Model Viewer Here</Text>
        <Text style={styles.modelViewerText}>(Requires 3D rendering library)</Text>
        <Text style={styles.modelViewerText}>{modelData}</Text>
      </View>

      <Text style={styles.label}>Select Shape:</Text>
      <View style={styles.shapeSelectionContainer}>
        <TouchableOpacity style={styles.shapeButton} onPress={() => setModelData('Sphere(r=1)')}>
          <Text style={styles.buttonText}>Sphere</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shapeButton} onPress={() => setModelData('Cube(s=1)')}>
          <Text style={styles.buttonText}>Cube</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shapeButton} onPress={() => setModelData('Cylinder(r=1,h=2)')}>
          <Text style={styles.buttonText}>Cylinder</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Sculpting Suggestion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={exportModel}>
        <Text style={styles.buttonText}>Export 3D Model</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Premium sculpting tools and AI features available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  modelViewerPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  modelViewerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  shapeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shapeButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default SculptureEditorScreen;
