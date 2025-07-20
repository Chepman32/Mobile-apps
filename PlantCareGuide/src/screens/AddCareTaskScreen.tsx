import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  HelperText,
  useTheme,
  SegmentedButtons,
  List,
  Chip,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { CareTask, Plant } from '../types';

const AddCareTaskScreen: React.FC = () => {
  const theme = useTheme();
  const { state, actions } = useContext(PlantCareGuideContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [plantId, setPlantId] = useState('');
  const [type, setType] = useState<'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest_control'>('watering');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');

  const { plants } = state;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!plantId) {
      newErrors.plantId = 'Please select a plant';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const selectedPlant = plants.find(p => p.id === plantId);
      if (!selectedPlant) {
        throw new Error('Selected plant not found');
      }

      const newTask: Omit<CareTask, 'id'> = {
        title: title.trim(),
        plantId,
        plantName: selectedPlant.name,
        type,
        priority,
        dueDate: dueDate?.toISOString() || undefined,
        notes: notes.trim() || undefined,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: undefined,
      };

      await actions.addCareTask(newTask);
      Alert.alert('Success', 'Care task added successfully!');
      // Navigate back
    } catch (error) {
      Alert.alert('Error', 'Failed to add care task');
    } finally {
      setLoading(false);
    }
  };

  const handlePlantSelect = (selectedPlantId: string) => {
    setPlantId(selectedPlantId);
    setErrors(prev => ({ ...prev, plantId: '' }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'watering': return 'water';
      case 'fertilizing': return 'leaf';
      case 'pruning': return 'scissors-cutting';
      case 'repotting': return 'flower-pot';
      case 'pest_control': return 'bug';
      default: return 'leaf';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return theme.colors.primary;
      case 'medium': return theme.colors.secondary;
      case 'high': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <Card.Content>
          <Title>Add Care Task</Title>

          {/* Task Title */}
          <TextInput
            label="Task Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors(prev => ({ ...prev, title: '' }));
            }}
            error={!!errors.title}
            style={styles.input}
            placeholder="e.g., Water the Monstera"
          />
          {errors.title && <HelperText type="error">{errors.title}</HelperText>}

          {/* Plant Selection */}
          <Title style={styles.sectionTitle}>Select Plant</Title>
          <ScrollView style={styles.plantList}>
            {plants.map((plant) => (
              <List.Item
                key={plant.id}
                title={plant.name}
                description={`${plant.species} • ${plant.location}`}
                left={(props) => (
                  <List.Icon {...props} icon="flower" />
                )}
                onPress={() => handlePlantSelect(plant.id)}
                style={[
                  styles.plantItem,
                  plantId === plant.id && styles.selectedPlant
                ]}
              />
            ))}
          </ScrollView>
          {errors.plantId && <HelperText type="error">{errors.plantId}</HelperText>}

          {/* Task Type */}
          <Title style={styles.sectionTitle}>Task Type</Title>
          <SegmentedButtons
            value={type}
            onValueChange={setType}
            buttons={[
              { value: 'watering', label: 'Water', icon: 'water' },
              { value: 'fertilizing', label: 'Fertilize', icon: 'leaf' },
              { value: 'pruning', label: 'Prune', icon: 'scissors-cutting' },
              { value: 'repotting', label: 'Repot', icon: 'flower-pot' },
              { value: 'pest_control', label: 'Pest Control', icon: 'bug' },
            ]}
            style={styles.segmentedButtons}
          />

          {/* Priority */}
          <Title style={styles.sectionTitle}>Priority</Title>
          <View style={styles.priorityContainer}>
            {(['low', 'medium', 'high'] as const).map((priorityLevel) => (
              <Chip
                key={priorityLevel}
                selected={priority === priorityLevel}
                onPress={() => setPriority(priorityLevel)}
                style={[
                  styles.priorityChip,
                  priority === priorityLevel && { backgroundColor: getPriorityColor(priorityLevel) + '20' }
                ]}
                textStyle={{ color: priority === priorityLevel ? getPriorityColor(priorityLevel) : undefined }}
              >
                {priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}
              </Chip>
            ))}
          </View>

          {/* Due Date */}
          <Title style={styles.sectionTitle}>Due Date (Optional)</Title>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            icon="calendar"
            style={styles.dateButton}
          >
            {dueDate ? dueDate.toLocaleDateString() : 'Select Date'}
          </Button>

          {/* Notes */}
          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Any additional notes about this task..."
          />

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            icon="plus"
          >
            Add Task
          </Button>
        </Card.Content>
      </Card>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  plantList: {
    maxHeight: 200,
    marginBottom: 8,
  },
  plantItem: {
    marginBottom: 4,
    borderRadius: 8,
  },
  selectedPlant: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  priorityChip: {
    marginHorizontal: 4,
  },
  dateButton: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default AddCareTaskScreen; 