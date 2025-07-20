import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  TextInput, 
  Button, 
  SegmentedButtons,
  Chip,
  IconButton,
  Portal,
  Dialog,
  List,
  Switch,
  useTheme
} from 'react-native-paper';

export default function AddBudgetScreen({ navigation }: any) {
  const theme = useTheme();
  
  // Mock data - would come from context
  const categories = [];
  
  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [isActive, setIsActive] = useState(true);
  
  // Dialog states
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a budget name');
      return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!categoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      setLoading(true);
      
      const newBudget = {
        name: name.trim(),
        categoryId,
        amount: parseFloat(amount),
        period,
        startDate,
        endDate: endDate || undefined,
        alertThreshold: parseInt(alertThreshold),
        isActive,
      };

      // await addBudget(newBudget);
      
      Alert.alert(
        'Success', 
        'Budget created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setCategoryId('');
    setAmount('');
    setPeriod('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setAlertThreshold('80');
    setIsActive(true);
  };

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            📋 Add Budget
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Create a new budget to track your spending limits.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Basic Information
          </Text>
          
          <TextInput
            label="Budget Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            maxLength={50}
            right={<TextInput.Affix text={`${name.length}/50`} />}
          />

          <View style={styles.categorySection}>
            <Text variant="bodyMedium" style={styles.label}>
              Category *
            </Text>
            <Button
              mode="outlined"
              onPress={() => setCategoryDialogVisible(true)}
              style={styles.selectionButton}
              icon={() => selectedCategory ? (
                <Text style={styles.buttonIcon}>{selectedCategory.icon}</Text>
              ) : undefined}
            >
              {selectedCategory ? selectedCategory.name : 'Select Category'}
            </Button>
          </View>

          <TextInput
            label="Budget Amount *"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            right={<TextInput.Affix text="$" />}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Budget Period
          </Text>

          <SegmentedButtons
            value={period}
            onValueChange={value => setPeriod(value as 'weekly' | 'monthly' | 'yearly')}
            buttons={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ]}
            style={styles.segmentedButton}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Date Range
          </Text>

          <TextInput
            label="Start Date (YYYY-MM-DD) *"
            value={startDate}
            onChangeText={setStartDate}
            mode="outlined"
            style={styles.input}
            placeholder="2024-01-01"
            keyboardType="numeric"
          />

          <TextInput
            label="End Date (YYYY-MM-DD) - Optional"
            value={endDate}
            onChangeText={setEndDate}
            mode="outlined"
            style={styles.input}
            placeholder="2024-12-31"
            keyboardType="numeric"
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Alert Settings
          </Text>

          <TextInput
            label="Alert Threshold (%)"
            value={alertThreshold}
            onChangeText={setAlertThreshold}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            placeholder="80"
            right={<TextInput.Affix text="%" />}
          />

          <View style={styles.activeSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Active Budget
            </Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
            />
          </View>

          {parseInt(alertThreshold) > 0 && (
            <Card style={[styles.warningCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Card.Content>
                <Text variant="bodySmall" style={styles.warningText}>
                  ⚠️ You will be notified when you reach {alertThreshold}% of your budget limit.
                </Text>
              </Card.Content>
            </Card>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={!name.trim() || !amount.trim() || !categoryId || loading}
          style={styles.submitButton}
        >
          Create Budget
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleReset}
          disabled={loading}
          style={styles.resetButton}
        >
          Reset Form
        </Button>
      </View>

      {/* Category Selection Dialog */}
      <Portal>
        <Dialog visible={categoryDialogVisible} onDismiss={() => setCategoryDialogVisible(false)}>
          <Dialog.Title>Select Category</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              {categories
                .filter(cat => cat.type === 'expense' || cat.type === 'both')
                .map(category => (
                  <List.Item
                    key={category.id}
                    title={category.name}
                    onPress={() => {
                      setCategoryId(category.id);
                      setCategoryDialogVisible(false);
                    }}
                    left={props => (
                      <List.Icon 
                        {...props} 
                        icon={() => <Text style={styles.listIcon}>{category.icon}</Text>}
                      />
                    )}
                  />
                ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCategoryDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  categorySection: {
    marginBottom: 16,
  },
  selectionButton: {
    marginTop: 8,
  },
  segmentedButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  activeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningCard: {
    marginTop: 8,
  },
  warningText: {
    opacity: 0.8,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  submitButton: {
    marginBottom: 8,
  },
  resetButton: {
    marginBottom: 16,
  },
  buttonIcon: {
    fontSize: 16,
  },
  listIcon: {
    fontSize: 20,
  },
});
