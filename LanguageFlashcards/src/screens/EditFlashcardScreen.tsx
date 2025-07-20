import React, { useState, useEffect } from 'react';
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
import { Flashcard, Deck } from '../types';

const EditFlashcardScreen: React.FC = () => {
  const { state, updateFlashcard, deleteFlashcard } = useLanguageFlashcards();
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  
  const flashcardId = route.params?.flashcardId;
  const flashcard = state.flashcards.find(f => f.id === flashcardId);
  const deck = flashcard ? state.decks.find(d => d.id === flashcard.deckId) : null;

  const [formData, setFormData] = useState({
    front: '',
    back: '',
    pronunciation: '',
    notes: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: [] as string[],
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (flashcard) {
      setFormData({
        front: flashcard.front,
        back: flashcard.back,
        pronunciation: flashcard.pronunciation || '',
        notes: flashcard.notes || '',
        difficulty: flashcard.difficulty,
        tags: flashcard.tags || [],
      });
    }
  }, [flashcard]);

  const handleSave = async () => {
    if (!flashcard) return;

    if (!formData.front.trim() || !formData.back.trim()) {
      Alert.alert('Validation Error', 'Front and back text are required');
      return;
    }

    try {
      await updateFlashcard(flashcard.id, {
        front: formData.front.trim(),
        back: formData.back.trim(),
        pronunciation: formData.pronunciation.trim(),
        notes: formData.notes.trim(),
        difficulty: formData.difficulty,
        tags: formData.tags,
      });

      Alert.alert('Success', 'Flashcard updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update flashcard');
    }
  };

  const handleDelete = async () => {
    if (!flashcard) return;

    try {
      await deleteFlashcard(flashcard.id);
      setShowDeleteDialog(false);
      Alert.alert('Success', 'Flashcard deleted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete flashcard');
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return theme.colors.secondary;
      case 'medium': return theme.colors.primary;
      case 'hard': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  if (!flashcard || !deck) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorText}>
              Flashcard not found
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
          title="Edit Flashcard"
          subtitle={deck.name}
        />
        <Card.Content>
          <View style={styles.flashcardInfo}>
            <View style={styles.flashcardIcon}>
              <Ionicons name="card" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.flashcardDetails}>
              <Text variant="bodyMedium" style={styles.flashcardDescription}>
                Edit the details of your flashcard
              </Text>
              <Chip mode="outlined" compact style={styles.difficultyChip}>
                {flashcard.difficulty}
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
            style={styles.input}
          />
          <TextInput
            label="Back (Answer)"
            value={formData.back}
            onChangeText={(text) => setFormData({ ...formData, back: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
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
        <Card.Title title="Card Statistics" />
        <Card.Content>
          <List.Item
            title="Total Reviews"
            description="Number of times this card has been reviewed"
            left={(props) => <List.Icon {...props} icon="refresh" />}
            right={() => (
              <Text variant="titleMedium">{flashcard.totalReviews}</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Correct Reviews"
            description="Number of correct responses"
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            right={() => (
              <Text variant="titleMedium">{flashcard.correctReviews}</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Accuracy"
            description="Percentage of correct responses"
            left={(props) => <List.Icon {...props} icon="target" />}
            right={() => (
              <Text variant="titleMedium">
                {flashcard.totalReviews > 0 
                  ? ((flashcard.correctReviews / flashcard.totalReviews) * 100).toFixed(1)
                  : 0}%
              </Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Next Review"
            description="When this card will be reviewed next"
            left={(props) => <List.Icon {...props} icon="calendar" />}
            right={() => (
              <Text variant="titleMedium">
                {new Date(flashcard.nextReview).toLocaleDateString()}
              </Text>
            )}
          />
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
          >
            Save Changes
          </Button>
          <Button
            mode="outlined"
            icon="arrow-back"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
          >
            Cancel
          </Button>
          <Button
            mode="outlined"
            icon="delete"
            onPress={() => setShowDeleteDialog(true)}
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            textColor={theme.colors.error}
          >
            Delete Card
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Flashcard</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this flashcard? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDelete} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>

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
  difficultyChip: {
    alignSelf: 'flex-start',
  },
  input: {
    marginBottom: 16,
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
  divider: {
    marginVertical: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default EditFlashcardScreen; 