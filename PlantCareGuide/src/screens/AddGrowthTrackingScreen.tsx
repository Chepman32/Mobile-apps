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
  HelperText,
  useTheme,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { GrowthTracking } from '../types';

export default function AddGrowthTrackingScreen({ navigation, route }: any) {
  const theme = useTheme();
  const { state, dispatch } = useContext(PlantCareGuideContext);
  const [loading, setLoading] = useState(false);
  
  const { plantId } = route.params;
  const plant = state.plants.find(p => p.id === plantId);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    spread: '',
    leafCount: '',
    flowerCount: '',
    fruitCount: '',
    healthScore: 'good',
    observations: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.height.trim() && !formData.spread.trim() && !formData.leafCount.trim() && !formData.flowerCount.trim() && !formData.fruitCount.trim()) {
      newErrors.measurements = 'At least one measurement is required';
    }

    if (formData.height && isNaN(parseFloat(formData.height))) {
      newErrors.height = 'Height must be a valid number';
    }

    if (formData.spread && isNaN(parseFloat(formData.spread))) {
      newErrors.spread = 'Spread must be a valid number';
    }

    if (formData.leafCount && isNaN(parseInt(formData.leafCount))) {
      newErrors.leafCount = 'Leaf count must be a valid number';
    }

    if (formData.flowerCount && isNaN(parseInt(formData.flowerCount))) {
      newErrors.flowerCount = 'Flower count must be a valid number';
    }

    if (formData.fruitCount && isNaN(parseInt(formData.fruitCount))) {
      newErrors.fruitCount = 'Fruit count must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !plant) return;

    setLoading(true);
    try {
      const newGrowthTracking: GrowthTracking = {
        id: Date.now().toString(),
        plantId: plantId,
        date: new Date(formData.date).toISOString(),
        height: formData.height ? parseFloat(formData.height) : undefined,
        spread: formData.spread ? parseFloat(formData.spread) : undefined,
        leafCount: formData.leafCount ? parseInt(formData.leafCount) : undefined,
        flowerCount: formData.flowerCount ? parseInt(formData.flowerCount) : undefined,
        fruitCount: formData.fruitCount ? parseInt(formData.fruitCount) : undefined,
        healthScore: formData.healthScore,
        observations: formData.observations.trim(),
        imageUrl: formData.imageUrl.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      await dispatch({ type: 'ADD_GROWTH_TRACKING', payload: newGrowthTracking });
      
      Alert.alert(
        'Success',
        'Growth tracking record added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add growth tracking record. Please try again.');
    } finally {
      setLoading(false);
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
            Add Growth Tracking
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {plant.name}
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

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Measurements
          </Text>
          <Text variant="bodySmall" style={styles.description}>
            Record at least one measurement to track growth
          </Text>

          <TextInput
            label="Height (inches)"
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            keyboardType="numeric"
            error={!!errors.height}
            style={styles.input}
            placeholder="e.g., 12.5"
          />
          <HelperText type="error" visible={!!errors.height}>
            {errors.height}
          </HelperText>

          <TextInput
            label="Spread (inches)"
            value={formData.spread}
            onChangeText={(text) => setFormData({ ...formData, spread: text })}
            keyboardType="numeric"
            error={!!errors.spread}
            style={styles.input}
            placeholder="e.g., 8.0"
          />
          <HelperText type="error" visible={!!errors.spread}>
            {errors.spread}
          </HelperText>

          <TextInput
            label="Leaf Count"
            value={formData.leafCount}
            onChangeText={(text) => setFormData({ ...formData, leafCount: text })}
            keyboardType="numeric"
            error={!!errors.leafCount}
            style={styles.input}
            placeholder="e.g., 15"
          />
          <HelperText type="error" visible={!!errors.leafCount}>
            {errors.leafCount}
          </HelperText>

          <TextInput
            label="Flower Count"
            value={formData.flowerCount}
            onChangeText={(text) => setFormData({ ...formData, flowerCount: text })}
            keyboardType="numeric"
            error={!!errors.flowerCount}
            style={styles.input}
            placeholder="e.g., 3"
          />
          <HelperText type="error" visible={!!errors.flowerCount}>
            {errors.flowerCount}
          </HelperText>

          <TextInput
            label="Fruit Count"
            value={formData.fruitCount}
            onChangeText={(text) => setFormData({ ...formData, fruitCount: text })}
            keyboardType="numeric"
            error={!!errors.fruitCount}
            style={styles.input}
            placeholder="e.g., 2"
          />
          <HelperText type="error" visible={!!errors.fruitCount}>
            {errors.fruitCount}
          </HelperText>

          <HelperText type="error" visible={!!errors.measurements}>
            {errors.measurements}
          </HelperText>

          <Text variant="bodyMedium" style={styles.sectionTitle}>
            Health Assessment
          </Text>
          <SegmentedButtons
            value={formData.healthScore}
            onValueChange={(value) => setFormData({ ...formData, healthScore: value })}
            buttons={[
              { value: 'excellent', label: 'Excellent' },
              { value: 'good', label: 'Good' },
              { value: 'fair', label: 'Fair' },
              { value: 'poor', label: 'Poor' },
            ]}
            style={styles.segmentedButton}
          />

          <TextInput
            label="Observations"
            value={formData.observations}
            onChangeText={(text) => setFormData({ ...formData, observations: text })}
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Describe the plant's appearance, any changes, issues, or notable observations..."
          />

          <TextInput
            label="Image URL (optional)"
            value={formData.imageUrl}
            onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
            style={styles.input}
            placeholder="https://example.com/image.jpg"
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
          Save Growth Record
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
  description: {
    marginBottom: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  input: {
    marginBottom: 8,
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
  message: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
}); 