
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'animationStudio.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AnimationEditorScreen = ({ route }) => {
  const { animationId } = route.params;
  const [animation, setAnimation] = useState(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [frameContent, setFrameContent] = useState('');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM animations WHERE id = ?',
        [animationId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedAnimation = { ...rows.item(0), frames: JSON.parse(rows.item(0).frames) };
            setAnimation(loadedAnimation);
            setFrameContent(loadedAnimation.frames[currentFrameIndex] || '');
          }
        },
        (tx, error) => console.error('Error fetching animation', error)
      );
    });
  }, [animationId, currentFrameIndex]);

  const saveAnimation = () => {
    if (!animation) return;

    const updatedFrames = [...animation.frames];
    updatedFrames[currentFrameIndex] = frameContent;

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE animations SET frames = ? WHERE id = ?',
        [JSON.stringify(updatedFrames), animationId],
        () => Alert.alert('Success', 'Animation saved!'),
        (tx, error) => console.error('Error saving animation', error)
      );
    });
  };

  const addFrame = () => {
    if (!animation) return;
    const updatedFrames = [...animation.frames, 'New Frame'];
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE animations SET frames = ? WHERE id = ?',
        [JSON.stringify(updatedFrames), animationId],
        () => {
          setAnimation({ ...animation, frames: updatedFrames });
          setCurrentFrameIndex(updatedFrames.length - 1);
          setFrameContent('New Frame');
        },
        (tx, error) => console.error('Error adding frame', error)
      );
    });
  };

  const deleteFrame = () => {
    if (!animation || animation.frames.length <= 1) {
      Alert.alert('Error', 'Cannot delete the last frame.');
      return;
    }
    Alert.alert(
      'Delete Frame',
      'Are you sure you want to delete this frame?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
            const updatedFrames = animation.frames.filter((_, index) => index !== currentFrameIndex);
            db.transaction((tx) => {
              tx.executeSql(
                'UPDATE animations SET frames = ? WHERE id = ?',
                [JSON.stringify(updatedFrames), animationId],
                () => {
                  setAnimation({ ...animation, frames: updatedFrames });
                  setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1));
                  setFrameContent(updatedFrames[Math.max(0, currentFrameIndex - 1)] || '');
                },
                (tx, error) => console.error('Error deleting frame', error)
              );
            });
          }
        },
      ],
      { cancelable: true }
    );
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered motion and timing assistance. (Conceptual)'
    );
    // In a real app, an AI model would suggest animation movements or timing.
  };

  if (!animation) {
    return (
      <View style={styles.container}>
        <Text>Loading animation...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.animationName}>{animation.name}</Text>
      <Text style={styles.frameCounter}>Frame {currentFrameIndex + 1} of {animation.frames.length}</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Frame content..."
        multiline
        value={frameContent}
        onChangeText={setFrameContent}
        onBlur={saveAnimation} // Save on blur
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentFrameIndex(Math.min(animation.frames.length - 1, currentFrameIndex + 1))}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={addFrame}>
        <Text style={styles.buttonText}>Add Frame</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={deleteFrame}>
        <Text style={styles.buttonText}>Delete Frame</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Suggestion</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Premium animation tools and AI features available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  animationName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  frameCounter: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  textArea: {
    height: 250,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default AnimationEditorScreen;
