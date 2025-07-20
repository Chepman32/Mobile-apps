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
import { CareLog, CareType } from '../types';

export default function AddCareLogScreen({ navigation, route }: any) {
  const theme = useTheme();
  const { state, dispatch } = useContext(PlantCareGuideContext);
  const [loading, setLoading] = useState(false);
  
  const { plantId } = route.params;
  const plant = state.plants.find(p => p.id === plantId);
  
  const [formData, setFormData] = useState({
    careType: 'watering' as CareType,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    notes: '',
    amount: '',
    fertilizerType: '',
    pestIssue: '',
    treatmentApplied: '',
    weatherConditions: '',
    plantHealth: 'good',
    completed: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (formData.careType === 'fertilizing' && !formData.fertilizerType.trim()) {
      newErrors.fertilizerType = 'Fertilizer type is required for fertilizing';
    }

    if (formData.careType === 'pest-control' && !formData.pestIssue.trim()) {
      newErrors.pestIssue = 'Pest issue is required for pest control';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !plant) return;

    setLoading(true);
    try {
      const newCareLog: CareLog = {
        id: Date.now().toString(),
        plantId: plantId,
        careType: formData.careType,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        notes: formData.notes.trim(),
        amount: formData.amount.trim() || undefined,
        fertilizerType: formData.fertilizerType.trim() || undefined,
        pestIssue: formData.pestIssue.trim() || undefined,
        treatmentApplied: formData.treatmentApplied.trim() || undefined,
        weatherConditions: formData.weatherConditions.trim() || undefined,
        plantHealth: formData.plantHealth,
        completed: formData.completed,
        createdAt: new Date().toISOString(),
      };

      await dispatch({ type: 'ADD_CARE_LOG', payload: newCareLog });
      
      Alert.alert(
        'Success',
        'Care log added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add care log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCareTypeIcon = (type: CareType) => {
    switch (type) {
      case 'watering': return '💧';
      case 'fertilizing': return '🌱';
      case 'pruning': return '✂️';
      case 'repotting': return '🪴';
      case 'pest-control': return '🐛';
      case 'disease-treatment': return '🏥';
      case 'light-adjustment': return '☀️';
      case 'temperature-control': return '🌡️';
      case 'other': return '📝';
      default: return '📝';
    }
  };

  const getCareTypeDescription = (type: CareType) => {
    switch (type) {
      case 'watering': return 'Watering the plant';
      case 'fertilizing': return 'Adding fertilizer or nutrients';
      case 'pruning': return 'Trimming or cutting back growth';
      case 'repotting': return 'Moving to a new pot or container';
      case 'pest-control': return 'Treating pest infestations';
      case 'disease-treatment': return 'Treating plant diseases';
      case 'light-adjustment': return 'Changing light conditions';
      case 'temperature-control': return 'Adjusting temperature';
      case 'other': return 'Other care activities';
      default: return 'Care activity';
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
            Add Care Log
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {plant.name}
          </Text>

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Care Type
          </Text>
          <View style={styles.careTypeContainer}>
            {(['watering', 'fertilizing', 'pruning', 'repotting', 'pest-control', 'disease-treatment', 'light-adjustment', 'temperature-control', 'other'] as CareType[]).map((type) => (
              <Chip
                key={type}
                selected={formData.careType === type}
                onPress={() => setFormData({ ...formData, careType: type })}
                style={styles.careTypeChip}
                mode="outlined"
                icon={() => <Text style={styles.careTypeIcon}>{getCareTypeIcon(type)}</Text>}
              >
                {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Chip>
            ))}
          </View>
          <Text variant="bodySmall" style={styles.description}>
            {getCareTypeDescription(formData.careType)}
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

          {formData.careType === 'watering' && (
            <TextInput
              label="Amount (optional)"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              style={styles.input}
              placeholder="e.g., 1 cup, 500ml"
            />
          )}

          {formData.careType === 'fertilizing' && (
            <>
              <TextInput
                label="Fertilizer Type *"
                value={formData.fertilizerType}
                onChangeText={(text) => setFormData({ ...formData, fertilizerType: text })}
                error={!!errors.fertilizerType}
                style={styles.input}
                placeholder="e.g., NPK 10-10-10, Organic"
              />
              <HelperText type="error" visible={!!errors.fertilizerType}>
                {errors.fertilizerType}
              </HelperText>
            </>
          )}

          {formData.careType === 'pest-control' && (
            <>
              <TextInput
                label="Pest Issue *"
                value={formData.pestIssue}
                onChangeText={(text) => setFormData({ ...formData, pestIssue: text })}
                error={!!errors.pestIssue}
                style={styles.input}
                placeholder="e.g., Aphids, Spider mites"
              />
              <HelperText type="error" visible={!!errors.pestIssue}>
                {errors.pestIssue}
              </HelperText>
            </>
          )}

          {(formData.careType === 'pest-control' || formData.careType === 'disease-treatment') && (
            <TextInput
              label="Treatment Applied"
              value={formData.treatmentApplied}
              onChangeText={(text) => setFormData({ ...formData, treatmentApplied: text })}
              style={styles.input}
              placeholder="e.g., Neem oil, Fungicide"
            />
          )}

          <TextInput
            label="Weather Conditions"
            value={formData.weatherConditions}
            onChangeText={(text) => setFormData({ ...formData, weatherConditions: text })}
            style={styles.input}
            placeholder="e.g., Sunny, 75°F, 60% humidity"
          />

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Plant Health
          </Text>
          <SegmentedButtons
            value={formData.plantHealth}
            onValueChange={(value) => setFormData({ ...formData, plantHealth: value })}
            buttons={[
              { value: 'excellent', label: 'Excellent' },
              { value: 'good', label: 'Good' },
              { value: 'fair', label: 'Fair' },
              { value: 'poor', label: 'Poor' },
            ]}
            style={styles.segmentedButton}
          />

          <View style={styles.switchContainer}>
            <Text variant="bodyMedium">Completed</Text>
            <Switch
              value={formData.completed}
              onValueChange={(value) => setFormData({ ...formData, completed: value })}
            />
          </View>

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Additional observations, tips, or notes..."
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
          Save Care Log
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
  careTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  careTypeChip: {
    margin: 4,
  },
  careTypeIcon: {
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