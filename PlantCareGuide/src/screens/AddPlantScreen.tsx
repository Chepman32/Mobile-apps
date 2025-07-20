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
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { Plant, PlantCategory, LightRequirement, WaterNeed, SoilType } from '../types';

export default function AddPlantScreen({ navigation, route }: any) {
  const theme = useTheme();
  const { state, dispatch } = useContext(PlantCareGuideContext);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    categoryId: '',
    description: '',
    lightRequirement: 'medium' as LightRequirement,
    waterNeed: 'moderate' as WaterNeed,
    soilType: 'well-draining' as SoilType,
    temperatureRange: '',
    humidityRange: '',
    growthRate: 'medium',
    maxHeight: '',
    maxSpread: '',
    bloomTime: '',
    careDifficulty: 'medium',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plant name is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.temperatureRange.trim()) {
      newErrors.temperatureRange = 'Temperature range is required';
    }

    if (!formData.humidityRange.trim()) {
      newErrors.humidityRange = 'Humidity range is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newPlant: Plant = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        scientificName: formData.scientificName.trim(),
        categoryId: formData.categoryId,
        description: formData.description.trim(),
        lightRequirement: formData.lightRequirement,
        waterNeed: formData.waterNeed,
        soilType: formData.soilType,
        temperatureRange: formData.temperatureRange.trim(),
        humidityRange: formData.humidityRange.trim(),
        growthRate: formData.growthRate,
        maxHeight: formData.maxHeight ? parseFloat(formData.maxHeight) : undefined,
        maxSpread: formData.maxSpread ? parseFloat(formData.maxSpread) : undefined,
        bloomTime: formData.bloomTime.trim(),
        careDifficulty: formData.careDifficulty,
        notes: formData.notes.trim(),
        imageUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await dispatch({ type: 'ADD_PLANT', payload: newPlant });
      
      Alert.alert(
        'Success',
        'Plant added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = state.categories.find(c => c.id === formData.categoryId);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Add New Plant
          </Text>

          <TextInput
            label="Plant Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={!!errors.name}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>

          <TextInput
            label="Scientific Name"
            value={formData.scientificName}
            onChangeText={(text) => setFormData({ ...formData, scientificName: text })}
            style={styles.input}
          />

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Category *
          </Text>
          <View style={styles.chipContainer}>
            {state.categories.map((category) => (
              <Chip
                key={category.id}
                selected={formData.categoryId === category.id}
                onPress={() => setFormData({ ...formData, categoryId: category.id })}
                style={styles.chip}
                mode="outlined"
              >
                {category.name}
              </Chip>
            ))}
          </View>
          <HelperText type="error" visible={!!errors.categoryId}>
            {errors.categoryId}
          </HelperText>

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Light Requirement
          </Text>
          <SegmentedButtons
            value={formData.lightRequirement}
            onValueChange={(value) => setFormData({ ...formData, lightRequirement: value as LightRequirement })}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            style={styles.segmentedButton}
          />

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Water Need
          </Text>
          <SegmentedButtons
            value={formData.waterNeed}
            onValueChange={(value) => setFormData({ ...formData, waterNeed: value as WaterNeed })}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'high', label: 'High' },
            ]}
            style={styles.segmentedButton}
          />

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Soil Type
          </Text>
          <SegmentedButtons
            value={formData.soilType}
            onValueChange={(value) => setFormData({ ...formData, soilType: value as SoilType })}
            buttons={[
              { value: 'well-draining', label: 'Well-draining' },
              { value: 'moisture-retaining', label: 'Moisture-retaining' },
              { value: 'sandy', label: 'Sandy' },
              { value: 'loamy', label: 'Loamy' },
            ]}
            style={styles.segmentedButton}
          />

          <TextInput
            label="Temperature Range *"
            value={formData.temperatureRange}
            onChangeText={(text) => setFormData({ ...formData, temperatureRange: text })}
            placeholder="e.g., 65-75°F"
            error={!!errors.temperatureRange}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.temperatureRange}>
            {errors.temperatureRange}
          </HelperText>

          <TextInput
            label="Humidity Range *"
            value={formData.humidityRange}
            onChangeText={(text) => setFormData({ ...formData, humidityRange: text })}
            placeholder="e.g., 40-60%"
            error={!!errors.humidityRange}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.humidityRange}>
            {errors.humidityRange}
          </HelperText>

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Growth Rate
          </Text>
          <SegmentedButtons
            value={formData.growthRate}
            onValueChange={(value) => setFormData({ ...formData, growthRate: value })}
            buttons={[
              { value: 'slow', label: 'Slow' },
              { value: 'medium', label: 'Medium' },
              { value: 'fast', label: 'Fast' },
            ]}
            style={styles.segmentedButton}
          />

          <TextInput
            label="Max Height (inches)"
            value={formData.maxHeight}
            onChangeText={(text) => setFormData({ ...formData, maxHeight: text })}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Max Spread (inches)"
            value={formData.maxSpread}
            onChangeText={(text) => setFormData({ ...formData, maxSpread: text })}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Bloom Time"
            value={formData.bloomTime}
            onChangeText={(text) => setFormData({ ...formData, bloomTime: text })}
            placeholder="e.g., Spring, Summer"
            style={styles.input}
          />

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Care Difficulty
          </Text>
          <SegmentedButtons
            value={formData.careDifficulty}
            onValueChange={(value) => setFormData({ ...formData, careDifficulty: value })}
            buttons={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
            style={styles.segmentedButton}
          />

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
            style={styles.input}
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
          Save Plant
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
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
  segmentedButton: {
    marginBottom: 16,
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
}); 