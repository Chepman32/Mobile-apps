
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import modelsData from '../data/models.json';

const ModelViewScreen = ({ route }) => {
  const { modelId } = route.params;
  const model = modelsData.models.find((m) => m.id === modelId);

  if (!model) {
    return (
      <View style={styles.container}>
        <Text>Model not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.modelName}>{model.name}</Text>
      <Text style={styles.modelDescription}>{model.description}</Text>
      <View style={styles.placeholder3D}>
        <Text style={styles.placeholderText}>
          {`Placeholder for 3D Animation of ${model.name}`}
        </Text>
        <Text style={styles.placeholderText}>
          (Requires native 3D rendering library like SceneKit/Filament or a React Native 3D library)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modelDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  placeholder3D: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
});

export default ModelViewScreen;
