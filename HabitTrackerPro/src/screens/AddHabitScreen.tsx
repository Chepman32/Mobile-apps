import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  SegmentedButtons,
  Chip,
  Switch,
  useTheme,
  Portal,
  Dialog,
  List,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';
import { RootStackParamList } from '../types';

type AddHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddHabit'>;

const habitCategories = [
  { id: 'health', name: 'Health & Fitness', icon: 'heart-pulse', color: '#ff6b6b' },
  { id: 'productivity', name: 'Productivity', icon: 'briefcase', color: '#4ecdc4' },
  { id: 'learning', name: 'Learning', icon: 'book-open', color: '#45b7d1' },
  { id: 'personal', name: 'Personal', icon: 'account', color: '#96ceb4' },
  { id: 'social', name: 'Social', icon: 'account-group', color: '#feca57' },
  { id: 'creative', name: 'Creative', icon: 'palette', color: '#ff9ff3' },
  { id: 'financial', name: 'Financial', icon: 'wallet', color: '#54a0ff' },
  { id: 'spiritual', name: 'Spiritual', icon: 'meditation', color: '#5f27cd' },
];

const habitIcons = [
  { name: 'run', label: 'Running' },
  { name: 'dumbbell', label: 'Exercise' },
  { name: 'book-open-variant', label: 'Reading' },
  { name: 'meditation', label: 'Meditation' },
  { name: 'water', label: 'Hydration' },
  { name: 'food-apple', label: 'Healthy Eating' },
  { name: 'sleep', label: 'Sleep' },
  { name: 'brain', label: 'Learning' },
  { name: 'music', label: 'Music' },
  { name: 'pencil', label: 'Writing' },
  { name: 'camera', label: 'Photography' },
  { name: 'heart', label: 'Self Care' },
];

export default function AddHabitScreen() {
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const theme = useTheme();
  const { addHabit } = useHabitTrackerPro();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    targetCount: 1,
    priority: 'medium' as 'low' | 'medium' | 'high',
    color: '#6200ee',
    icon: 'target',
    tags: [] as string[],
    reminderTime: '09:00',
    reminderDays: [1, 2, 3, 4, 5, 6, 7], // All days
    notes: '',
  });

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [newTag, setNewTag] = useState('');

  const colors = [
    '#6200ee', '#03dac4', '#ff6b6b', '#4ecdc4', '#45b7d1',
    '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
  ];

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (formData.targetCount < 1) {
      Alert.alert('Error', 'Target count must be at least 1');
      return;
    }

    const habitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      frequency: formData.frequency,
      targetCount: formData.targetCount,
      priority: formData.priority,
      color: formData.color,
      icon: formData.icon,
      tags: formData.tags,
      reminderTime: formData.reminderTime,
      reminderDays: formData.reminderDays,
      notes: formData.notes.trim(),
    };

    addHabit(habitData);
    Alert.alert('Success', 'Habit created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const toggleReminderDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.includes(day)
        ? prev.reminderDays.filter(d => d !== day)
        : [...prev.reminderDays, day],
    }));
  };

  const getDayName = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day - 1];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Basic Information */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Basic Information
            </Title>
            
            <TextInput
              label="Habit Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Morning Exercise"
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="Describe your habit..."
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Category
            </Text>
            <View style={styles.categoriesContainer}>
              {habitCategories.map(category => (
                <Chip
                  key={category.id}
                  selected={formData.category === category.id}
                  onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  style={styles.categoryChip}
                  icon={() => <Icon name={category.icon} size={16} color={category.color} />}
                >
                  {category.name}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Habit Settings */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Habit Settings
            </Title>

            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Frequency
            </Text>
            <SegmentedButtons
              value={formData.frequency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}
              buttons={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Target Count"
              value={formData.targetCount.toString()}
              onChangeText={(text) => {
                const count = parseInt(text) || 1;
                setFormData(prev => ({ ...prev, targetCount: count }));
              }}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Priority
            </Text>
            <SegmentedButtons
              value={formData.priority}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
              buttons={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Visual Customization */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Visual Customization
            </Title>

            <View style={styles.customizationRow}>
              <View style={styles.customizationItem}>
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                  Icon
                </Text>
                <Button
                  mode="outlined"
                  icon={formData.icon}
                  onPress={() => setShowIconPicker(true)}
                  style={styles.customizationButton}
                >
                  Select Icon
                </Button>
              </View>

              <View style={styles.customizationItem}>
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                  Color
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowColorPicker(true)}
                  style={[styles.customizationButton, { borderColor: formData.color }]}
                >
                  <View style={[styles.colorPreview, { backgroundColor: formData.color }]} />
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Tags */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Tags
            </Title>

            <View style={styles.tagInputContainer}>
              <TextInput
                label="Add Tag"
                value={newTag}
                onChangeText={setNewTag}
                mode="outlined"
                style={styles.tagInput}
                placeholder="Enter tag..."
              />
              <Button mode="contained" onPress={addTag} style={styles.addTagButton}>
                Add
              </Button>
            </View>

            <View style={styles.tagsContainer}>
              {formData.tags.map(tag => (
                <Chip
                  key={tag}
                  onClose={() => removeTag(tag)}
                  style={styles.tagChip}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Reminders */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Reminders
            </Title>

            <Button
              mode="outlined"
              icon="bell"
              onPress={() => setShowReminderDialog(true)}
              style={styles.reminderButton}
            >
              Configure Reminders
            </Button>

            {formData.reminderDays.length > 0 && (
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderText, { color: theme.colors.onSurfaceVariant }]}>
                  Reminder set for {formData.reminderTime} on{' '}
                  {formData.reminderDays.map(day => getDayName(day)).join(', ')}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Notes */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Notes
            </Title>

            <TextInput
              label="Additional Notes"
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="Any additional notes about this habit..."
              multiline
              numberOfLines={4}
            />
          </Card.Content>
        </Card>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            icon="content-save"
          >
            Create Habit
          </Button>
        </View>
      </ScrollView>

      {/* Icon Picker Dialog */}
      <Portal>
        <Dialog visible={showIconPicker} onDismiss={() => setShowIconPicker(false)}>
          <Dialog.Title>Select Icon</Dialog.Title>
          <Dialog.Content>
            <View style={styles.iconGrid}>
              {habitIcons.map(icon => (
                <Button
                  key={icon.name}
                  mode={formData.icon === icon.name ? 'contained' : 'outlined'}
                  icon={icon.name}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, icon: icon.name }));
                    setShowIconPicker(false);
                  }}
                  style={styles.iconButton}
                >
                  {icon.label}
                </Button>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowIconPicker(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Color Picker Dialog */}
      <Portal>
        <Dialog visible={showColorPicker} onDismiss={() => setShowColorPicker(false)}>
          <Dialog.Title>Select Color</Dialog.Title>
          <Dialog.Content>
            <View style={styles.colorGrid}>
              {colors.map(color => (
                <Button
                  key={color}
                  mode={formData.color === color ? 'contained' : 'outlined'}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, color }));
                    setShowColorPicker(false);
                  }}
                  style={[styles.colorButton, { borderColor: color }]}
                >
                  <View style={[styles.colorPreview, { backgroundColor: color }]} />
                </Button>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowColorPicker(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Reminder Dialog */}
      <Portal>
        <Dialog visible={showReminderDialog} onDismiss={() => setShowReminderDialog(false)}>
          <Dialog.Title>Configure Reminders</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Reminder Time"
              value={formData.reminderTime}
              onChangeText={(text) => setFormData(prev => ({ ...prev, reminderTime: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="09:00"
            />

            <Text style={[styles.label, { color: theme.colors.onSurface, marginTop: 16 }]}>
              Reminder Days
            </Text>
            <View style={styles.daysContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <Chip
                  key={day}
                  selected={formData.reminderDays.includes(day)}
                  onPress={() => toggleReminderDay(day)}
                  style={styles.dayChip}
                >
                  {getDayName(day)}
                </Chip>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowReminderDialog(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  customizationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customizationItem: {
    flex: 1,
    marginRight: 8,
  },
  customizationButton: {
    marginTop: 8,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    marginBottom: 8,
  },
  reminderButton: {
    marginBottom: 16,
  },
  reminderInfo: {
    marginTop: 8,
  },
  reminderText: {
    fontSize: 14,
  },
  saveContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    paddingVertical: 8,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    marginBottom: 8,
    minWidth: '45%',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    marginBottom: 8,
    minWidth: '30%',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayChip: {
    marginBottom: 8,
  },
}); 