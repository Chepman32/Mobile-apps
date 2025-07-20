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
import { useTodo } from '../context/TodoContext';
import { Category } from '../types';

const CATEGORY_ICONS = [
  '🏠', '💼', '🎯', '📚', '💪', '🍎', '💰', '🎨', '🎵', '🏃‍♂️',
  '🧘‍♀️', '✈️', '🏠', '🎮', '📱', '💻', '📝', '📅', '⏰', '⭐',
  '🔥', '💡', '🎉', '🎁', '📦', '🛒', '🏥', '🎓', '💎', '🌟'
];

const CATEGORY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A9CCE3', '#F9E79F', '#D5A6BD', '#A3E4D7', '#FAD7A0'
];

export default function AddCategoryScreen({ navigation }: any) {
  const theme = useTheme();
  const { addCategory, categories } = useTodo();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏠');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [isDefault, setIsDefault] = useState(false);
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  
  const [iconDialogVisible, setIconDialogVisible] = useState(false);
  const [colorDialogVisible, setColorDialogVisible] = useState(false);
  const [parentDialogVisible, setParentDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    // Check if category name already exists
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingCategory) {
      Alert.alert('Error', 'A category with this name already exists');
      return;
    }

    try {
      setLoading(true);
      
      const newCategory: Partial<Category> = {
        name: name.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
        isDefault,
        parentId,
        sortOrder: categories.length + 1,
      };

      await addCategory(newCategory);
      
      Alert.alert(
        'Success', 
        'Category created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setDescription('');
    setSelectedIcon('🏠');
    setSelectedColor('#FF6B6B');
    setIsDefault(false);
    setParentId(undefined);
  };

  const parentCategories = categories.filter(cat => !cat.parentId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            🏷️ Add Category
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Create custom categories to organize your tasks effectively.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Basic Information
          </Text>
          
          <TextInput
            label="Category Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            maxLength={50}
            right={<TextInput.Affix text={`${name.length}/50`} />}
          />

          <TextInput
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            maxLength={200}
            right={<TextInput.Affix text={`${description.length}/200`} />}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Appearance
          </Text>

          <View style={styles.iconSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Icon
            </Text>
            <Button
              mode="outlined"
              onPress={() => setIconDialogVisible(true)}
              style={styles.iconButton}
              icon={() => <Text style={styles.iconText}>{selectedIcon}</Text>}
            >
              Select Icon
            </Button>
          </View>

          <View style={styles.colorSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Color
            </Text>
            <Button
              mode="outlined"
              onPress={() => setColorDialogVisible(true)}
              style={[styles.colorButton, { backgroundColor: selectedColor }]}
              textColor="white"
            >
              Select Color
            </Button>
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Organization
          </Text>

          <View style={styles.parentSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Parent Category (Optional)
            </Text>
            <Button
              mode="outlined"
              onPress={() => setParentDialogVisible(true)}
              style={styles.parentButton}
            >
              {parentId 
                ? parentCategories.find(cat => cat.id === parentId)?.name || 'Select Parent'
                : 'Select Parent Category'
              }
            </Button>
            {parentId && (
              <Button
                mode="text"
                onPress={() => setParentId(undefined)}
                style={styles.clearButton}
              >
                Clear Parent
              </Button>
            )}
          </View>

          <View style={styles.defaultSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Default Category
            </Text>
            <SegmentedButtons
              value={isDefault ? 'yes' : 'no'}
              onValueChange={value => setIsDefault(value === 'yes')}
              buttons={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
              style={styles.segmentedButton}
            />
          </View>

          {isDefault && (
            <Card style={[styles.warningCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Card.Content>
                <Text variant="bodySmall" style={styles.warningText}>
                  ⚠️ Default categories are automatically assigned to new tasks when no specific category is selected.
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
          disabled={!name.trim() || loading}
          style={styles.submitButton}
        >
          Create Category
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

      {/* Icon Selection Dialog */}
      <Portal>
        <Dialog visible={iconDialogVisible} onDismiss={() => setIconDialogVisible(false)}>
          <Dialog.Title>Select Icon</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.iconGrid}>
              {CATEGORY_ICONS.map((icon, index) => (
                <IconButton
                  key={index}
                  icon={() => <Text style={styles.gridIcon}>{icon}</Text>}
                  size={40}
                  onPress={() => {
                    setSelectedIcon(icon);
                    setIconDialogVisible(false);
                  }}
                  style={[
                    styles.iconGridItem,
                    selectedIcon === icon && { backgroundColor: theme.colors.primaryContainer }
                  ]}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIconDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Color Selection Dialog */}
      <Portal>
        <Dialog visible={colorDialogVisible} onDismiss={() => setColorDialogVisible(false)}>
          <Dialog.Title>Select Color</Dialog.Title>
          <Dialog.Content>
            <View style={styles.colorGrid}>
              {CATEGORY_COLORS.map((color, index) => (
                <IconButton
                  key={index}
                  icon="circle"
                  size={40}
                  iconColor={color}
                  onPress={() => {
                    setSelectedColor(color);
                    setColorDialogVisible(false);
                  }}
                  style={[
                    styles.colorGridItem,
                    selectedColor === color && { backgroundColor: theme.colors.primaryContainer }
                  ]}
                />
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setColorDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Parent Category Selection Dialog */}
      <Portal>
        <Dialog visible={parentDialogVisible} onDismiss={() => setParentDialogVisible(false)}>
          <Dialog.Title>Select Parent Category</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <List.Item
                title="No Parent"
                description="Top-level category"
                onPress={() => {
                  setParentId(undefined);
                  setParentDialogVisible(false);
                }}
                left={props => <List.Icon {...props} icon="folder-outline" />}
              />
              {parentCategories.map(category => (
                <List.Item
                  key={category.id}
                  title={category.name}
                  description={category.description}
                  onPress={() => {
                    setParentId(category.id);
                    setParentDialogVisible(false);
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
            <Button onPress={() => setParentDialogVisible(false)}>Cancel</Button>
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
  iconSection: {
    marginBottom: 16,
  },
  iconButton: {
    marginTop: 8,
  },
  iconText: {
    fontSize: 20,
  },
  colorSection: {
    marginBottom: 16,
  },
  colorButton: {
    marginTop: 8,
  },
  parentSection: {
    marginBottom: 16,
  },
  parentButton: {
    marginTop: 8,
  },
  clearButton: {
    marginTop: 8,
  },
  defaultSection: {
    marginBottom: 16,
  },
  segmentedButton: {
    marginTop: 8,
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
  iconGrid: {
    maxHeight: 300,
  },
  iconGridItem: {
    margin: 4,
  },
  gridIcon: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxHeight: 300,
  },
  colorGridItem: {
    margin: 4,
  },
  listIcon: {
    fontSize: 20,
  },
}); 