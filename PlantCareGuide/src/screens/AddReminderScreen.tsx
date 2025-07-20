import React, { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  SegmentedButtons,
  Chip,
  HelperText,
  useTheme,
  Switch,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { Reminder, ReminderType } from '../types';

export default function AddReminderScreen({ navigation, route }: any) {
  const theme = useTheme();
  const { state, dispatch } = useContext(PlantCareGuideContext);
  const [loading, setLoading] = useState(false);
  
  const { plantId } = route.params;
  const plant = state.plants.find(p => p.id === plantId);
  
  const [formData, setFormData] = useState({
    title: '',
    reminderType: 'watering' as ReminderType,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    frequency: 'once',
    interval: '1',
    notes: '',
    enabled: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Reminder title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (formData.frequency !== 'once' && !formData.interval.trim()) {
      newErrors.interval = 'Interval is required for recurring reminders';
    }

    if (formData.frequency !== 'once' && (isNaN(parseInt(formData.interval)) || parseInt(formData.interval) < 1)) {
      newErrors.interval = 'Interval must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !plant) return;

    setLoading(true);
    try {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        plantId: plantId,
        title: formData.title.trim(),
        reminderType: formData.reminderType,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        frequency: formData.frequency,
        interval: formData.frequency !== 'once' ? parseInt(formData.interval) : undefined,
        notes: formData.notes.trim(),
        enabled: formData.enabled,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      await dispatch({ type: 'ADD_REMINDER', payload: newReminder });
      
      Alert.alert(
        'Success',
        'Reminder added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getReminderTypeIcon = (type: ReminderType) => {
    switch (type) {
      case 'watering': return '💧';
      case 'fertilizing': return '🌱';
      case 'pruning': return '✂️';
      case 'repotting': return '🪴';
      case 'pest-control': return '🐛';
      case 'disease-treatment': return '🏥';
      case 'light-adjustment': return '☀️';
      case 'temperature-control': return '🌡️';
      case 'harvesting': return '🌾';
      case 'other': return '📝';
      default: return '📝';
    }
  };

  const getReminderTypeDescription = (type: ReminderType) => {
    switch (type) {
      case 'watering': return 'Water the plant';
      case 'fertilizing': return 'Add fertilizer or nutrients';
      case 'pruning': return 'Trim or cut back growth';
      case 'repotting': return 'Move to a new pot or container';
      case 'pest-control': return 'Check for and treat pests';
      case 'disease-treatment': return 'Treat plant diseases';
      case 'light-adjustment': return 'Adjust light conditions';
      case 'temperature-control': return 'Adjust temperature';
      case 'harvesting': return 'Harvest fruits, vegetables, or herbs';
      case 'other': return 'Other care activities';
      default: return 'Care reminder';
    }
  };

  if (!plant) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Plant Not Found
            </Text>
            <Text variant="bodyMedium" style={styles.message}>
              The plant you're looking for doesn't exist or has been deleted.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Add Reminder
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {plant.name}
          </Text>

          <TextInput
            label="Reminder Title *"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            error={!!errors.title}
            style={styles.input}
            placeholder="e.g., Water Monstera, Fertilize Snake Plant"
          />
          <HelperText type="error" visible={!!errors.title}>
            {errors.title}
          </HelperText>

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Reminder Type
          </Text>
          <View style={styles.reminderTypeContainer}>
            {(['watering', 'fertilizing', 'pruning', 'repotting', 'pest-control', 'disease-treatment', 'light-adjustment', 'temperature-control', 'harvesting', 'other'] as ReminderType[]).map((type) => (
              <Chip
                key={type}
                selected={formData.reminderType === type}
                onPress={() => setFormData({ ...formData, reminderType: type })}
                style={styles.reminderTypeChip}
                mode="outlined"
                icon={() => <Text style={styles.reminderTypeIcon}>{getReminderTypeIcon(type)}</Text>}
              >
                {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Chip>
            ))}
          </View>
          <Text variant="bodySmall" style={styles.description}>
            {getReminderTypeDescription(formData.reminderType)}
          </Text>

          <TextInput
            label="Date *"
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            error={!!errors.date}
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />
          <HelperText type="error" visible={!!errors.date}>
            {errors.date}
          </HelperText>

          <TextInput
            label="Time *"
            value={formData.time}
            onChangeText={(text) => setFormData({ ...formData, time: text })}
            error={!!errors.time}
            style={styles.input}
            placeholder="HH:MM"
          />
          <HelperText type="error" visible={!!errors.time}>
            {errors.time}
          </HelperText>

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Frequency
          </Text>
          <SegmentedButtons
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            buttons={[
              { value: 'once', label: 'Once' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ]}
            style={styles.segmentedButton}
          />

          {formData.frequency !== 'once' && (
            <>
              <TextInput
                label="Interval *"
                value={formData.interval}
                onChangeText={(text) => setFormData({ ...formData, interval: text })}
                error={!!errors.interval}
                keyboardType="numeric"
                style={styles.input}
                placeholder="e.g., 2 for every 2 days/weeks/months"
              />
              <HelperText type="error" visible={!!errors.interval}>
                {errors.interval}
              </HelperText>
              <Text variant="bodySmall" style={styles.intervalHelp}>
                {formData.frequency === 'daily' && `Every ${formData.interval} day(s)`}
                {formData.frequency === 'weekly' && `Every ${formData.interval} week(s)`}
                {formData.frequency === 'monthly' && `Every ${formData.interval} month(s)`}
              </Text>
            </>
          )}

          <View style={styles.switchContainer}>
            <Text variant="bodyMedium">Enabled</Text>
            <Switch
              value={formData.enabled}
              onValueChange={(value) => setFormData({ ...formData, enabled: value })}
            />
          </View>

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Additional notes or instructions for this reminder..."
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
        >
          Save Reminder
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  reminderTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  reminderTypeChip: {
    margin: 4,
  },
  reminderTypeIcon: {
    fontSize: 16,
  },
  description: {
    marginBottom: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  segmentedButton: {
    marginBottom: 16,
  },
  intervalHelp: {
    marginBottom: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
}); 