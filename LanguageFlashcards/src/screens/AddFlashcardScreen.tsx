import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  TextInput,
  Button,
  SegmentedButtons,
  Chip,
  List,
  Divider,
  Dialog,
  Portal,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';
import { Deck } from '../types';

const AddFlashcardScreen: React.FC = () => {
  const { state, createFlashcard } = useLanguageFlashcards();
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  
  const deckId = route.params?.deckId;
  const deck = state.decks.find(d => d.id === deckId);

  const [formData, setFormData] = useState({
    front: '',
    back: '',
    pronunciation: '',
    notes: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: [] as string[],
  });

  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSave = async () => {
    if (!deckId) {
      Alert.alert('Error', 'No deck selected');
      return;
    }

    if (!formData.front.trim() || !formData.back.trim()) {
      Alert.alert('Validation Error', 'Front and back text are required');
      return;
    }

    try {
      await createFlashcard({
        deckId,
        front: formData.front.trim(),
        back: formData.back.trim(),
        pronunciation: formData.pronunciation.trim(),
        notes: formData.notes.trim(),
        difficulty: formData.difficulty,
        tags: formData.tags,
      });

      Alert.alert('Success', 'Flashcard created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create flashcard');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleReset = () => {
    setFormData({
      front: '',
      back: '',
      pronunciation: '',
      notes: '',
      difficulty: 'medium',
      tags: [],
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return theme.colors.secondary;
      case 'medium': return theme.colors.primary;
      case 'hard': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  if (!deck) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorText}>
              Deck not found
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title 
          title="Add New Flashcard"
          subtitle={deck.name}
        />
        <Card.Content>
          <View style={styles.flashcardInfo}>
            <View style={styles.flashcardIcon}>
              <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.flashcardDetails}>
              <Text variant="bodyMedium" style={styles.flashcardDescription}>
                Create a new flashcard for this deck
              </Text>
              <Chip mode="outlined" compact style={styles.deckChip}>
                {deck.language}
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Card Content" />
        <Card.Content>
          <TextInput
            label="Front (Question)"
            value={formData.front}
            onChangeText={(text) => setFormData({ ...formData, front: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Enter the question or word"
            style={styles.input}
          />
          <TextInput
            label="Back (Answer)"
            value={formData.back}
            onChangeText={(text) => setFormData({ ...formData, back: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Enter the answer or translation"
            style={styles.input}
          />
          <TextInput
            label="Pronunciation (Optional)"
            value={formData.pronunciation}
            onChangeText={(text) => setFormData({ ...formData, pronunciation: text })}
            mode="outlined"
            placeholder="e.g., oh-lah"
            style={styles.input}
          />
          <TextInput
            label="Notes (Optional)"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Additional notes or context"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Difficulty" />
        <Card.Content>
          <Text variant="bodySmall" style={styles.sectionDescription}>
            Set the difficulty level for this card
          </Text>
          <SegmentedButtons
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value as 'easy' | 'medium' | 'hard' })}
            buttons={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Tags" />
        <Card.Content>
          <Text variant="bodySmall" style={styles.sectionDescription}>
            Add tags to help organize your cards
          </Text>
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                mode="outlined"
                onClose={() => handleRemoveTag(tag)}
                style={styles.tag}
              >
                {tag}
              </Chip>
            ))}
          </View>
          <Button
            mode="outlined"
            icon="plus"
            onPress={() => setShowTagsDialog(true)}
            style={styles.addTagButton}
          >
            Add Tag
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Preview" />
        <Card.Content>
          <View style={styles.previewContainer}>
            <View style={styles.previewCard}>
              <Text variant="titleMedium" style={styles.previewLabel}>Front</Text>
              <Text variant="bodyMedium" style={styles.previewText}>
                {formData.front || 'Enter front text...'}
              </Text>
              {formData.pronunciation && (
                <Text variant="bodySmall" style={styles.previewPronunciation}>
                  [{formData.pronunciation}]
                </Text>
              )}
            </View>
            <View style={styles.previewCard}>
              <Text variant="titleMedium" style={styles.previewLabel}>Back</Text>
              <Text variant="bodyMedium" style={styles.previewText}>
                {formData.back || 'Enter back text...'}
              </Text>
            </View>
            <View style={styles.previewTags}>
              {formData.tags.map((tag, index) => (
                <Chip key={index} mode="outlined" compact style={styles.previewTag}>
                  {tag}
                </Chip>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Actions" />
        <Card.Content>
          <Button
            mode="contained"
            icon="content-save"
            onPress={handleSave}
            style={styles.actionButton}
            disabled={!formData.front.trim() || !formData.back.trim()}
          >
            Create Flashcard
          </Button>
          <Button
            mode="outlined"
            icon="refresh"
            onPress={handleReset}
            style={styles.actionButton}
          >
            Reset Form
          </Button>
          <Button
            mode="outlined"
            icon="arrow-back"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
          >
            Cancel
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={showTagsDialog} onDismiss={() => setShowTagsDialog(false)}>
          <Dialog.Title>Add Tag</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tag Name"
              value={newTag}
              onChangeText={setNewTag}
              mode="outlined"
              placeholder="Enter tag name"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowTagsDialog(false)}>Cancel</Button>
            <Button onPress={handleAddTag}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  flashcardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flashcardIcon: {
    marginRight: 16,
  },
  flashcardDetails: {
    flex: 1,
  },
  flashcardDescription: {
    marginBottom: 8,
  },
  deckChip: {
    alignSelf: 'flex-start',
  },
  input: {
    marginBottom: 16,
  },
  sectionDescription: {
    marginBottom: 12,
    opacity: 0.7,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  addTagButton: {
    marginTop: 8,
  },
  previewContainer: {
    marginVertical: 8,
  },
  previewCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  previewLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewText: {
    marginBottom: 4,
  },
  previewPronunciation: {
    fontStyle: 'italic',
    opacity: 0.7,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewTag: {
    marginRight: 8,
    marginBottom: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default AddFlashcardScreen; 