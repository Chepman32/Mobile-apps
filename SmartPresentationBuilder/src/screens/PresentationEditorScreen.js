
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'presentationBuilder.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PresentationEditorScreen = ({ route }) => {
  const { presentationId } = route.params;
  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideContent, setSlideContent] = useState('');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM presentations WHERE id = ?',
        [presentationId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedPresentation = { ...rows.item(0), slides: JSON.parse(rows.item(0).slides) };
            setPresentation(loadedPresentation);
            setSlideContent(loadedPresentation.slides[currentSlideIndex] || '');
          }
        },
        (tx, error) => console.error('Error fetching presentation', error)
      );
    });
  }, [presentationId, currentSlideIndex]);

  const savePresentation = () => {
    if (!presentation) return;

    const updatedSlides = [...presentation.slides];
    updatedSlides[currentSlideIndex] = slideContent;

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE presentations SET slides = ? WHERE id = ?',
        [JSON.stringify(updatedSlides), presentationId],
        () => Alert.alert('Success', 'Presentation saved!'),
        (tx, error) => console.error('Error saving presentation', error)
      );
    });
  };

  const addSlide = () => {
    if (!presentation) return;
    const updatedSlides = [...presentation.slides, 'New Slide'];
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE presentations SET slides = ? WHERE id = ?',
        [JSON.stringify(updatedSlides), presentationId],
        () => {
          setPresentation({ ...presentation, slides: updatedSlides });
          setCurrentSlideIndex(updatedSlides.length - 1);
          setSlideContent('New Slide');
        },
        (tx, error) => console.error('Error adding slide', error)
      );
    });
  };

  const deleteSlide = () => {
    if (!presentation || presentation.slides.length <= 1) {
      Alert.alert('Error', 'Cannot delete the last slide.');
      return;
    }
    Alert.alert(
      'Delete Slide',
      'Are you sure you want to delete this slide?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
            const updatedSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);
            db.transaction((tx) => {
              tx.executeSql(
                'UPDATE presentations SET slides = ? WHERE id = ?',
                [JSON.stringify(updatedSlides), presentationId],
                () => {
                  setPresentation({ ...presentation, slides: updatedSlides });
                  setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
                  setSlideContent(updatedSlides[Math.max(0, currentSlideIndex - 1)] || '');
                },
                (tx, error) => console.error('Error deleting slide', error)
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
      'Simulating AI-assisted content generation. (Conceptual)'
    );
    // In a real app, an AI model would suggest content for the slide.
  };

  if (!presentation) {
    return (
      <View style={styles.container}>
        <Text>Loading presentation...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.presentationTitle}>{presentation.title}</Text>
      <Text style={styles.slideCounter}>Slide {currentSlideIndex + 1} of {presentation.slides.length}</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Slide content..."
        multiline
        value={slideContent}
        onChangeText={setSlideContent}
        onBlur={savePresentation} // Save on blur
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentSlideIndex(Math.min(presentation.slides.length - 1, currentSlideIndex + 1))}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={addSlide}>
        <Text style={styles.buttonText}>Add Slide</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={deleteSlide}>
        <Text style={styles.buttonText}>Delete Slide</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Suggestion</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Premium templates and advanced AI features available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  presentationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  slideCounter: {
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

export default PresentationEditorScreen;
