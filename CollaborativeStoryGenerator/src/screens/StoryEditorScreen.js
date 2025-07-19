
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Canvas, Rect, Text as SkiaText, useFont } from '@shopify/react-native-skia';
import PDFDocument from 'react-native-pdf';

const StoryEditorScreen = ({ route, navigation }) => {
  const { storyId } = route.params;
  const [story, setStory] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [newChoiceText, setNewChoiceText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');

  const loadStory = useCallback(async () => {
    const storedStories = await AsyncStorage.getItem('stories');
    const stories = storedStories ? JSON.parse(storedStories) : [];
    const currentStory = stories.find(s => s.id === storyId);
    if (currentStory) {
      setStory(currentStory);
      const currentNode = currentStory.nodes.find(node => node.id === currentStory.currentNodeId);
      if (currentNode) {
        setCurrentText(currentNode.text);
      }
    }
  }, [storyId]);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  const updateStory = async (updatedStory) => {
    const storedStories = await AsyncStorage.getItem('stories');
    let stories = storedStories ? JSON.parse(storedStories) : [];
    const storyIndex = stories.findIndex(s => s.id === storyId);
    if (storyIndex !== -1) {
      stories[storyIndex] = updatedStory;
      await AsyncStorage.setItem('stories', JSON.stringify(stories));
      setStory(updatedStory);
    }
  };

  const handleTextChange = (text) => {
    setCurrentText(text);
    if (story) {
      const updatedNodes = story.nodes.map(node =>
        node.id === story.currentNodeId ? { ...node, text: text } : node
      );
      updateStory({ ...story, nodes: updatedNodes });
    }
  };

  const addChoice = () => {
    if (!newChoiceText.trim()) {
      Alert.alert('Error', 'Choice text cannot be empty.');
      return;
    }
    if (story) {
      const newChoiceId = `choice_${Date.now()}`;
      const newBranchNodeId = `node_${Date.now()}`;

      const updatedNodes = story.nodes.map(node => {
        if (node.id === story.currentNodeId) {
          return {
            ...node,
            choices: [...node.choices, { text: newChoiceText, nextNodeId: newBranchNodeId }]
          };
        }
        return node;
      });

      updatedNodes.push({
        id: newBranchNodeId,
        text: `You chose: ${newChoiceText}. What happens next?`,
        choices: []
      });

      updateStory({ ...story, nodes: updatedNodes });
      setNewChoiceText('');
    }
  };

  const navigateToNode = (nextNodeId) => {
    if (story) {
      updateStory({ ...story, currentNodeId: nextNodeId });
      const nextNode = story.nodes.find(node => node.id === nextNodeId);
      if (nextNode) {
        setCurrentText(nextNode.text);
      }
    }
  };

  const generateAISuggestion = () => {
    // Placeholder for TensorFlow.js text generation model
    Alert.alert(
      'AI Suggestion',
      'Simulating AI text generation. In a real app, a local ML model would provide suggestions.'
    );
    setAiSuggestion('The ancient forest whispered secrets of forgotten times...');
  };

  const generateIllustration = () => {
    // Placeholder for Skia-based illustration generation
    Alert.alert(
      'Generate Illustration',
      'Simulating AI illustration generation using Skia. This would create a visual based on the story text.'
    );
  };

  const exportToPDF = async () => {
    // Placeholder for PDF generation
    Alert.alert(
      'Export to PDF',
      'Simulating PDF export. In a real app, this would generate a PDF of the story.'
    );
    // Example of how react-native-pdf might be used (conceptual)
    // const source = { uri: 'bundle-assets://pdf/sample.pdf', cache: true };
    // <PDFDocument source={source} />
  };

  if (!story) {
    return (
      <View style={styles.container}>
        <Text>Loading story...</Text>
      </View>
    );
  }

  const currentNode = story.nodes.find(node => node.id === story.currentNodeId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.storyTitle}>{story.title}</Text>

      <Text style={styles.sectionTitle}>Current Scene:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={currentText}
        onChangeText={handleTextChange}
      />

      <TouchableOpacity style={styles.aiButton} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>Get AI Suggestion</Text>
      </TouchableOpacity>
      {aiSuggestion ? <Text style={styles.aiSuggestionText}>{aiSuggestion}</Text> : null}

      <TouchableOpacity style={styles.aiButton} onPress={generateIllustration}>
        <Text style={styles.buttonText}>Generate Illustration</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Add New Choice:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter choice text..."
        value={newChoiceText}
        onChangeText={setNewChoiceText}
      />
      <TouchableOpacity style={styles.addButton} onPress={addChoice}>
        <Text style={styles.buttonText}>Add Choice</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Choices:</Text>
      {currentNode?.choices.length > 0 ? (
        currentNode.choices.map((choice, index) => (
          <TouchableOpacity key={index} style={styles.choiceButton} onPress={() => navigateToNode(choice.nextNodeId)}>
            <Text style={styles.choiceButtonText}>{choice.text}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>No choices yet. Add one!</Text>
      )}

      <TouchableOpacity style={styles.exportButton} onPress={exportToPDF}>
        <Text style={styles.buttonText}>Export Story to PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
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
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  choiceButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  aiButton: {
    backgroundColor: '#6f42c1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  aiSuggestionText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 15,
  },
  exportButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default StoryEditorScreen;
