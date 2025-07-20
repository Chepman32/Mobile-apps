import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  List,
  IconButton,
  Portal,
  Dialog,
  TextInput,
  Chip,
  useTheme
} from 'react-native-paper';
import { useTodo } from '../context/TodoContext';
import { Category } from '../types';

export default function CategoriesScreen({ navigation }: any) {
  const theme = useTheme();
  const { 
    categories,
    tasks,
    deleteCategory,
    updateCategory
  } = useTodo();
  
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    // Check if category has tasks
    const categoryTasks = tasks.filter(task => task.categoryId === selectedCategory.id);
    if (categoryTasks.length > 0) {
      Alert.alert(
        'Cannot Delete Category',
        `This category has ${categoryTasks.length} task(s). Please move or delete these tasks first.`,
        [{ text: 'OK' }]
      );
      setDeleteDialogVisible(false);
      return;
    }
    
    try {
      setLoading(true);
      await deleteCategory(selectedCategory.id);
      setDeleteDialogVisible(false);
      Alert.alert('Success', 'Category deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !editName.trim()) return;
    
    try {
      setLoading(true);
      await updateCategory(selectedCategory.id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      });
      setEditDialogVisible(false);
      Alert.alert('Success', 'Category updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStats = (categoryId: string) => {
    const categoryTasks = tasks.filter(task => task.categoryId === categoryId);
    const totalTasks = categoryTasks.length;
    const completedTasks = categoryTasks.filter(task => task.status === 'completed').length;
    const pendingTasks = categoryTasks.filter(task => task.status === 'pending').length;
    const inProgressTasks = categoryTasks.filter(task => task.status === 'in_progress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate
    };
  };

  const getCategoryColor = (color: string) => {
    return color || theme.colors.primary;
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setEditDialogVisible(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogVisible(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            📁 Categories
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Manage your task categories and view their statistics.
          </Text>
        </Card.Content>
      </Card>

      {/* Add Category Button */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddCategory')}
            icon="plus"
            style={styles.addButton}
          >
            Add New Category
          </Button>
        </Card.Content>
      </Card>

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No categories created yet. Create your first category to get started!
            </Text>
          </Card.Content>
        </Card>
      ) : (
        categories.map(category => {
          const stats = getCategoryStats(category.id);
          
          return (
            <Card key={category.id} style={styles.categoryCard}>
              <Card.Content>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryIcon, { fontSize: 24 }]}>
                      {category.icon}
                    </Text>
                    <View style={styles.categoryDetails}>
                      <Text variant="titleMedium" style={styles.categoryName}>
                        {category.name}
                      </Text>
                      {category.description && (
                        <Text variant="bodySmall" style={styles.categoryDescription}>
                          {category.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.categoryActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => openEditDialog(category)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => openDeleteDialog(category)}
                      iconColor={theme.colors.error}
                    />
                  </View>
                </View>

                {/* Category Stats */}
                <View style={styles.categoryStats}>
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Total Tasks
                    </Text>
                    <Text variant="titleMedium" style={styles.statNumber}>
                      {stats.totalTasks}
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Completed
                    </Text>
                    <Text variant="titleMedium" style={styles.statNumber}>
                      {stats.completedTasks}
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Pending
                    </Text>
                    <Text variant="titleMedium" style={styles.statNumber}>
                      {stats.pendingTasks}
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Completion Rate
                    </Text>
                    <Text variant="titleMedium" style={styles.statNumber}>
                      {stats.completionRate}%
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${stats.completionRate}%`,
                          backgroundColor: getCategoryColor(category.color)
                        }
                      ]} 
                    />
                  </View>
                </View>

                {/* Category Tags */}
                <View style={styles.categoryTags}>
                  {category.isDefault && (
                    <Chip mode="outlined" style={styles.tag}>
                      Default
                    </Chip>
                  )}
                  <Chip 
                    mode="outlined" 
                    style={[styles.tag, { borderColor: getCategoryColor(category.color) }]}
                    textStyle={{ color: getCategoryColor(category.color) }}
                  >
                    {category.color}
                  </Chip>
                </View>

                {/* View Tasks Button */}
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Tasks', { categoryId: category.id })}
                  style={styles.viewTasksButton}
                  disabled={stats.totalTasks === 0}
                >
                  View Tasks ({stats.totalTasks})
                </Button>
              </Card.Content>
            </Card>
          );
        })
      )}

      {/* Summary Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📊 Category Summary
          </Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {categories.length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Total Categories
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {categories.filter(cat => cat.isDefault).length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Default Categories
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {categories.filter(cat => cat.parentId).length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Subcategories
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {tasks.length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Total Tasks
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Edit Category Dialog */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
              style={styles.dialogInput}
              maxLength={50}
            />
            <TextInput
              label="Description (Optional)"
              value={editDescription}
              onChangeText={setEditDescription}
              mode="outlined"
              style={styles.dialogInput}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleEditCategory}
              loading={loading}
              disabled={!editName.trim()}
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Category Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Category</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{selectedCategory?.name}"? 
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleDeleteCategory}
              loading={loading}
              textColor={theme.colors.error}
            >
              Delete
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
  addButton: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    opacity: 0.7,
  },
  categoryActions: {
    flexDirection: 'row',
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  statNumber: {
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    marginBottom: 4,
  },
  viewTasksButton: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  summaryNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  dialogInput: {
    marginBottom: 16,
  },
}); 