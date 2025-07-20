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
  List,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { GrowthRecord, Plant } from '../types';

const AddGrowthRecordScreen: React.FC = () => {
  const theme = useTheme();
  const { state, actions } = useContext(PlantCareGuideContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [plantId, setPlantId] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [leafCount, setLeafCount] = useState('');
  const [notes, setNotes] = useState('');

  const { plants } = state;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!plantId) {
      newErrors.plantId = 'Please select a plant';
    }

    if (!height.trim() && !width.trim() && !leafCount.trim()) {
      newErrors.measurements = 'At least one measurement is required';
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

      const newRecord: Omit<GrowthRecord, 'id'> = {
        plantId,
        plantName: selectedPlant.name,
        date: new Date().toISOString(),
        height: height.trim() ? parseFloat(height) : undefined,
        width: width.trim() ? parseFloat(width) : undefined,
        leafCount: leafCount.trim() ? parseInt(leafCount) : undefined,
        notes: notes.trim() || undefined,
      };

      await actions.addGrowthRecord(newRecord);
      Alert.alert('Success', 'Growth record added successfully!');
      // Navigate back
    } catch (error) {
      Alert.alert('Error', 'Failed to add growth record');
    } finally {
      setLoading(false);
    }
  };

  const handlePlantSelect = (selectedPlantId: string) => {
    setPlantId(selectedPlantId);
    setErrors(prev => ({ ...prev, plantId: '' }));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <Card.Content>
          <Title>Add Growth Record</Title>

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

          {/* Measurements */}
          <Title style={styles.sectionTitle}>Measurements</Title>
          
          <TextInput
            label="Height (cm)"
            value={height}
            onChangeText={(text) => {
              setHeight(text);
              setErrors(prev => ({ ...prev, measurements: '' }));
            }}
            keyboardType="numeric"
            style={styles.input}
            placeholder="e.g., 25.5"
          />

          <TextInput
            label="Width (cm)"
            value={width}
            onChangeText={(text) => {
              setWidth(text);
              setErrors(prev => ({ ...prev, measurements: '' }));
            }}
            keyboardType="numeric"
            style={styles.input}
            placeholder="e.g., 15.2"
          />

          <TextInput
            label="Leaf Count"
            value={leafCount}
            onChangeText={(text) => {
              setLeafCount(text);
              setErrors(prev => ({ ...prev, measurements: '' }));
            }}
            keyboardType="numeric"
            style={styles.input}
            placeholder="e.g., 12"
          />

          {errors.measurements && <HelperText type="error">{errors.measurements}</HelperText>}

          {/* Notes */}
          <TextInput
            label="Observations (optional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Any observations about growth, health, or changes..."
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
            Add Growth Record
          </Button>
        </Card.Content>
      </Card>
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
  submitButton: {
    marginTop: 16,
  },
});

export default AddGrowthRecordScreen; 