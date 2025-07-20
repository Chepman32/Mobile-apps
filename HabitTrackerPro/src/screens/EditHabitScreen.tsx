import React, { useState, useEffect } from 'react';
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
  useTheme,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitTrackerPro } from '../context/HabitTrackerProContext';
import { RootStackParamList, Habit } from '../types';

type EditHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditHabit'>;
type EditHabitScreenRouteProp = RouteProp<RootStackParamList, 'EditHabit'>;

export default function EditHabitScreen() {
  const navigation = useNavigation<EditHabitScreenNavigationProp>();
  const route = useRoute<EditHabitScreenRouteProp>();
  const theme = useTheme();
  const { state, updateHabit } = useHabitTrackerPro();

  const habit = state.habits.find(h => h.id === route.params.habitId);

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
    reminderDays: [1, 2, 3, 4, 5, 6, 7],
    notes: '',
    isActive: true,
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        targetCount: habit.targetCount,
        priority: habit.priority,
        color: habit.color,
        icon: habit.icon,
        tags: habit.tags,
        reminderTime: habit.reminderTime || '09:00',
        reminderDays: habit.reminderDays,
        notes: habit.notes,
        isActive: habit.isActive,
      });
    }
  }, [habit]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (!habit) {
      Alert.alert('Error', 'Habit not found');
      return;
    }

    const updatedHabit: Habit = {
      ...habit,
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
      isActive: formData.isActive,
      updatedAt: new Date().toISOString(),
    };

    updateHabit(updatedHabit);
    Alert.alert('Success', 'Habit updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              Habit not found
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Edit Habit
            </Title>
            
            <TextInput
              label="Habit Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
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

            <TextInput
              label="Notes"
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
            />

            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              icon="content-save"
            >
              Save Changes
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 32,
  },
}); 