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
  useTheme
} from 'react-native-paper';

export default function AddTransactionScreen({ navigation }: any) {
  const theme = useTheme();
  
  // Mock data - would come from context
  const categories = [];
  
  // Form fields
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  // Dialog states
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [tagDialogVisible, setTagDialogVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a transaction description');
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
      
      const newTransaction = {
        description: description.trim(),
        amount: parseFloat(amount),
        type,
        categoryId,
        date,
        tags: tags.length > 0 ? tags : undefined,
        notes: notes.trim() || undefined,
      };

      // await addTransaction(newTransaction);
      
      Alert.alert(
        'Success', 
        'Transaction added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDescription('');
    setAmount('');
    setType('expense');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setTags([]);
    setNotes('');
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    if (tags.includes(newTag.trim())) {
      Alert.alert('Error', 'Tag already exists');
      return;
    }
    
    setTags([...tags, newTag.trim()]);
    setNewTag('');
    setTagDialogVisible(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getTypeColor = (type: 'income' | 'expense') => {
    return type === 'income' ? '#00AA00' : '#FF4444';
  };

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            ➕ Add Transaction
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Record a new income or expense transaction.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Basic Information
          </Text>
          
          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            maxLength={100}
            right={<TextInput.Affix text={`${description.length}/100`} />}
          />

          <TextInput
            label="Amount *"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            right={<TextInput.Affix text="$" />}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Transaction Type
          </Text>

          <SegmentedButtons
            value={type}
            onValueChange={value => setType(value as 'income' | 'expense')}
            buttons={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' }
            ]}
            style={styles.segmentedButton}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Classification
          </Text>

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

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Date & Time
          </Text>

          <TextInput
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            mode="outlined"
            style={styles.input}
            placeholder="2024-12-31"
            keyboardType="numeric"
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Organization
          </Text>

          <View style={styles.tagsSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Tags
            </Text>
            <Button
              mode="outlined"
              onPress={() => setTagDialogVisible(true)}
              style={styles.addTagButton}
              icon="plus"
            >
              Add Tag
            </Button>
            
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    onClose={() => handleRemoveTag(tag)}
                    style={styles.tag}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            maxLength={500}
            right={<TextInput.Affix text={`${notes.length}/500`} />}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={!description.trim() || !amount.trim() || !categoryId || loading}
          style={styles.submitButton}
        >
          Add Transaction
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
                .filter(cat => cat.type === type || cat.type === 'both')
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

      {/* Add Tag Dialog */}
      <Portal>
        <Dialog visible={tagDialogVisible} onDismiss={() => setTagDialogVisible(false)}>
          <Dialog.Title>Add Tag</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tag Name"
              value={newTag}
              onChangeText={setNewTag}
              mode="outlined"
              autoFocus
              maxLength={20}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTagDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
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
  tagsSection: {
    marginBottom: 16,
  },
  addTagButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginBottom: 4,
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
