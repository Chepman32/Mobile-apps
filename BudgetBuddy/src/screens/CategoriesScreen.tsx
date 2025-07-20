import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  List,
  IconButton,
  Chip,
  Portal,
  Dialog,
  TextInput,
  useTheme
} from 'react-native-paper';

export default function CategoriesScreen({ navigation }: any) {
  const theme = useTheme();
  
  // Mock data - would come from context
  const categories = [];
  const transactions = [];
  
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editColor, setEditColor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    // Check if category has transactions
    const categoryTransactions = transactions.filter(t => t.categoryId === selectedCategory.id);
    if (categoryTransactions.length > 0) {
      Alert.alert(
        'Cannot Delete Category',
        `This category has ${categoryTransactions.length} transaction(s). Please move or delete these transactions first.`,
        [{ text: 'OK' }]
      );
      setDeleteDialogVisible(false);
      return;
    }
    
    try {
      setLoading(true);
      // await deleteCategory(selectedCategory.id);
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
      // await updateCategory(selectedCategory.id, {
      //   name: editName.trim(),
      //   icon: editIcon || selectedCategory.icon,
      //   color: editColor || selectedCategory.color,
      // });
      setEditDialogVisible(false);
      Alert.alert('Success', 'Category updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStats = (categoryId) => {
    const categoryTransactions = transactions.filter(t => t.categoryId === categoryId);
    const totalTransactions = categoryTransactions.length;
    const totalIncome = categoryTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = categoryTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netAmount = totalIncome - totalExpenses;
    
    return {
      totalTransactions,
      totalIncome,
      totalExpenses,
      netAmount
    };
  };

  const getCategoryColor = (color) => {
    return color || theme.colors.primary;
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditIcon(category.icon);
    setEditColor(category.color);
    setEditDialogVisible(true);
  };

  const openDeleteDialog = (category) => {
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
            Manage your transaction categories and view their statistics.
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
                      Total Transactions
                    </Text>
                    <Text variant="titleMedium" style={styles.statNumber}>
                      {stats.totalTransactions}
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Income
                    </Text>
                    <Text variant="titleMedium" style={[styles.statNumber, { color: '#00AA00' }]}>
                      ${stats.totalIncome.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Expenses
                    </Text>
                    <Text variant="titleMedium" style={[styles.statNumber, { color: '#FF4444' }]}>
                      ${stats.totalExpenses.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Net
                    </Text>
                    <Text variant="titleMedium" style={[
                      styles.statNumber,
                      { color: stats.netAmount >= 0 ? '#00AA00' : '#FF4444' }
                    ]}>
                      ${stats.netAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Category Tags */}
                <View style={styles.categoryTags}>
                  <Chip
                    mode="outlined"
                    style={[
                      styles.typeChip,
                      { borderColor: getCategoryColor(category.color) }
                    ]}
                    textStyle={{ color: getCategoryColor(category.color) }}
                  >
                    {category.type.toUpperCase()}
                  </Chip>
                  
                  {category.isDefault && (
                    <Chip mode="outlined" style={styles.tag}>
                      Default
                    </Chip>
                  )}
                </View>

                {/* View Transactions Button */}
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Transactions', { categoryId: category.id })}
                  style={styles.viewTransactionsButton}
                  disabled={stats.totalTransactions === 0}
                >
                  View Transactions ({stats.totalTransactions})
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
                {categories.filter(cat => cat.type === 'income').length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Income Categories
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {categories.filter(cat => cat.type === 'expense').length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Expense Categories
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
              label="Icon (Emoji)"
              value={editIcon}
              onChangeText={setEditIcon}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="📁"
              maxLength={2}
            />
            <TextInput
              label="Color (Hex)"
              value={editColor}
              onChangeText={setEditColor}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="#FF6B6B"
              maxLength={7}
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
  categoryTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    marginBottom: 4,
  },
  tag: {
    marginBottom: 4,
  },
  viewTransactionsButton: {
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
