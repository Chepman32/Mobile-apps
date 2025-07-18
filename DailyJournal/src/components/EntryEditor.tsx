import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  Chip,
  Text,
  SegmentedButtons,
  Card,
} from 'react-native-paper';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { JournalEntry } from '../services/JournalService';

interface EntryEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: Partial<JournalEntry>) => Promise<void>;
  onCancel: () => void;
}

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '🥳', label: 'Excited' },
];

const WEATHER_OPTIONS = [
  { emoji: '☀️', label: 'Sunny' },
  { emoji: '☁️', label: 'Cloudy' },
  { emoji: '🌧️', label: 'Rainy' },
  { emoji: '❄️', label: 'Snowy' },
  { emoji: '⛈️', label: 'Stormy' },
  { emoji: '🌤️', label: 'Partly Cloudy' },
];

export default function EntryEditor({ entry, onSave, onCancel }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [mood, setMood] = useState(entry?.mood || '');
  const [weather, setWeather] = useState(entry?.weather || '');
  const [location, setLocation] = useState(entry?.location || '');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const richText = React.useRef<RichEditor>(null);

  useEffect(() => {
    if (entry && richText.current) {
      richText.current.setContentHTML(entry.content);
    }
  }, [entry]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your entry');
      return;
    }

    setIsSaving(true);
    try {
      const entryData: Partial<JournalEntry> = {
        title: title.trim(),
        content,
        tags,
        mood,
        weather,
        location: location.trim(),
      };

      await onSave(entryData);
    } catch (error) {
      console.error('Failed to save entry:', error);
      Alert.alert('Error', 'Failed to save the entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    const tagToAdd = newTag.trim().toLowerCase();
    if (tagToAdd && !tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleContentChange = (html: string) => {
    setContent(html);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <View style={styles.editorContainer}>
            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.heading1,
                actions.heading2,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.keyboard,
              ]}
              style={styles.richToolbar}
            />
            <RichEditor
              ref={richText}
              style={styles.richEditor}
              placeholder="Write your thoughts here..."
              onChange={handleContentChange}
              initialContentHTML={content}
            />
          </View>
        );

      case 'mood':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            <View style={styles.moodGrid}>
              {MOODS.map((moodOption) => (
                <Chip
                  key={moodOption.label}
                  selected={mood === moodOption.label}
                  onPress={() => setMood(mood === moodOption.label ? '' : moodOption.label)}
                  style={[
                    styles.moodChip,
                    mood === moodOption.label && styles.selectedChip,
                  ]}
                  textStyle={styles.moodChipText}
                >
                  {moodOption.emoji} {moodOption.label}
                </Chip>
              ))}
            </View>
          </View>
        );

      case 'details':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Weather</Text>
            <View style={styles.weatherGrid}>
              {WEATHER_OPTIONS.map((weatherOption) => (
                <Chip
                  key={weatherOption.label}
                  selected={weather === weatherOption.label}
                  onPress={() => setWeather(weather === weatherOption.label ? '' : weatherOption.label)}
                  style={[
                    styles.weatherChip,
                    weather === weatherOption.label && styles.selectedChip,
                  ]}
                  textStyle={styles.weatherChipText}
                >
                  {weatherOption.emoji} {weatherOption.label}
                </Chip>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Location</Text>
            <TextInput
              mode="outlined"
              placeholder="Where are you?"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />

            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                mode="outlined"
                placeholder="Add a tag"
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={addTag}
                style={styles.tagInput}
              />
              <Button
                mode="contained"
                onPress={addTag}
                disabled={!newTag.trim()}
                style={styles.addTagButton}
              >
                Add
              </Button>
            </View>
            
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map(tag => (
                  <Chip
                    key={tag}
                    onClose={() => removeTag(tag)}
                    style={styles.tag}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={onCancel} />
        <Appbar.Content title={entry ? 'Edit Entry' : 'New Entry'} />
        <Appbar.Action 
          icon="check" 
          onPress={handleSave}
          disabled={isSaving}
        />
      </Appbar.Header>

      <View style={styles.content}>
        <TextInput
          mode="outlined"
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
          placeholder="Give your entry a title..."
        />

        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'content', label: 'Content' },
            { value: 'mood', label: 'Mood' },
            { value: 'details', label: 'Details' },
          ]}
          style={styles.segmentedButtons}
        />

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderTabContent()}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving || !title.trim()}
            style={styles.saveButton}
          >
            {entry ? 'Update' : 'Save'}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    minHeight: 300,
  },
  richToolbar: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  richEditor: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    minHeight: 250,
  },
  tabContent: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  moodChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#6200ee',
  },
  moodChipText: {
    fontSize: 12,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  weatherChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  weatherChipText: {
    fontSize: 12,
  },
  input: {
    marginBottom: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    minWidth: 80,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 0.45,
  },
  saveButton: {
    flex: 0.45,
  },
});