import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Checkbox,
  TextInput,
  useTheme,
  IconButton,
  FAB,
  SegmentedButtons,
  Portal,
  Dialog,
  List,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { ShoppingList, ShoppingItem, Recipe } from '../types';

const ShoppingScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, actions } = useRecipeVault();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('active');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showGenerateListDialog, setShowGenerateListDialog] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', category: '' });

  const { shoppingLists, recipes } = state;

  const onRefresh = async () => {
    setRefreshing(true);
    await actions.fetchAllData();
    setRefreshing(false);
  };

  const activeLists = shoppingLists.filter(list => !list.isCompleted);
  const completedLists = shoppingLists.filter(list => list.isCompleted);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      quantity: parseFloat(newItem.quantity) || 1,
      unit: newItem.unit.trim() || 'piece',
      category: newItem.category.trim() || 'Other',
      isChecked: false,
      notes: '',
    };

    // Add to the first active list or create a new one
    if (activeLists.length > 0) {
      const updatedList = {
        ...activeLists[0],
        items: [...activeLists[0].items, item],
      };
      await actions.updateShoppingList(updatedList);
    } else {
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: 'Shopping List',
        items: [item],
        isCompleted: false,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      };
      await actions.addShoppingList(newList);
    }

    setNewItem({ name: '', quantity: '', unit: '', category: '' });
    setShowAddItemDialog(false);
  };

  const handleToggleItem = async (listId: string, itemId: string) => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );

    await actions.updateShoppingList({
      ...list,
      items: updatedItems,
    });
  };

  const handleDeleteItem = async (listId: string, itemId: string) => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.filter(item => item.id !== itemId);
    await actions.updateShoppingList({
      ...list,
      items: updatedItems,
    });
  };

  const handleCompleteList = async (listId: string) => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) return;

    await actions.updateShoppingList({
      ...list,
      isCompleted: true,
    });
  };

  const handleGenerateFromRecipes = async (selectedRecipes: Recipe[]) => {
    const allIngredients: { [key: string]: { amount: number; unit: string } } = {};

    selectedRecipes.forEach(recipe => {
      recipe.ingredients?.forEach(ingredient => {
        const key = `${ingredient.name}-${ingredient.unit}`;
        if (allIngredients[key]) {
          allIngredients[key].amount += ingredient.amount;
        } else {
          allIngredients[key] = {
            amount: ingredient.amount,
            unit: ingredient.unit,
          };
        }
      });
    });

    const items: ShoppingItem[] = Object.entries(allIngredients).map(([name, details]) => ({
      id: Date.now().toString() + Math.random(),
      name: name.split('-')[0],
      quantity: details.amount,
      unit: details.unit,
      category: 'Ingredients',
      isChecked: false,
      notes: '',
    }));

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: `Shopping List - ${new Date().toLocaleDateString()}`,
      items,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };

    await actions.addShoppingList(newList);
    setShowGenerateListDialog(false);
  };

  const renderShoppingList = (list: ShoppingList) => (
    <Card key={list.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.listHeader}>
          <View style={styles.listInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {list.name}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {list.items.length} items • {new Date(list.dateCreated).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.listActions}>
            {!list.isCompleted && (
              <IconButton
                icon="check"
                size={20}
                onPress={() => handleCompleteList(list.id)}
              />
            )}
            <IconButton
              icon="delete"
              size={20}
              onPress={() => actions.deleteShoppingList(list.id)}
            />
          </View>
        </View>

        {list.items.length > 0 ? (
          list.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Checkbox
                status={item.isChecked ? 'checked' : 'unchecked'}
                onPress={() => handleToggleItem(list.id, item.id)}
              />
              <View style={styles.itemInfo}>
                <Text
                  variant="bodyMedium"
                  style={[
                    { color: theme.colors.onSurface },
                    item.isChecked && { textDecorationLine: 'line-through' }
                  ]}
                >
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {item.quantity} {item.unit}
                  {item.notes && ` • ${item.notes}`}
                </Text>
              </View>
              <Chip
                mode="outlined"
                compact
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              >
                {item.category}
              </Chip>
              {!list.isCompleted && (
                <IconButton
                  icon="delete"
                  size={16}
                  onPress={() => handleDeleteItem(list.id, item.id)}
                />
              )}
            </View>
          ))
        ) : (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            No items in this list
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  const renderActiveLists = () => (
    <View>
      {activeLists.length > 0 ? (
        activeLists.map(renderShoppingList)
      ) : (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.emptyState}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                No Active Shopping Lists
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Create your first shopping list to get started
              </Text>
              <Button
                mode="contained"
                onPress={() => setShowAddItemDialog(true)}
                style={{ marginTop: 16 }}
              >
                Create List
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderCompletedLists = () => (
    <View>
      {completedLists.length > 0 ? (
        completedLists.map(renderShoppingList)
      ) : (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.emptyState}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                No Completed Lists
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Completed shopping lists will appear here
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          Shopping Lists
        </Text>
        <View style={styles.headerActions}>
          <Button
            mode="contained-tonal"
            icon="plus"
            onPress={() => setShowGenerateListDialog(true)}
          >
            Generate
          </Button>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => setShowAddItemDialog(true)}
          >
            Add Item
          </Button>
        </View>
      </View>

      {/* View Mode Toggle */}
      <SegmentedButtons
        value={viewMode}
        onValueChange={setViewMode}
        buttons={[
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {viewMode === 'active' && renderActiveLists()}
        {viewMode === 'completed' && renderCompletedLists()}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddItemDialog(true)}
      />

      {/* Add Item Dialog */}
      <Portal>
        <Dialog
          visible={showAddItemDialog}
          onDismiss={() => setShowAddItemDialog(false)}
        >
          <Dialog.Title>Add Shopping Item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Item Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              mode="outlined"
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                label="Quantity"
                value={newItem.quantity}
                onChangeText={(text) => setNewItem({ ...newItem, quantity: text })}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Unit"
                value={newItem.unit}
                onChangeText={(text) => setNewItem({ ...newItem, unit: text })}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
            </View>
            <TextInput
              label="Category"
              value={newItem.category}
              onChangeText={(text) => setNewItem({ ...newItem, category: text })}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddItemDialog(false)}>Cancel</Button>
            <Button onPress={handleAddItem}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Generate List Dialog */}
      <Portal>
        <Dialog
          visible={showGenerateListDialog}
          onDismiss={() => setShowGenerateListDialog(false)}
        >
          <Dialog.Title>Generate Shopping List from Recipes</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              Select recipes to generate a shopping list with all ingredients:
            </Text>
            {recipes.map((recipe) => (
              <List.Item
                key={recipe.id}
                title={recipe.title}
                description={`${recipe.prepTime} min • ${recipe.difficulty}`}
                left={(props) => (
                  <Checkbox
                    {...props}
                    status="unchecked"
                    onPress={() => {
                      // TODO: Implement recipe selection
                    }}
                  />
                )}
                style={styles.recipeItem}
              />
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowGenerateListDialog(false)}>Cancel</Button>
            <Button onPress={() => handleGenerateFromRecipes(recipes.slice(0, 3))}>
              Generate List
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentedButtons: {
    margin: 16,
    marginTop: 0,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listInfo: {
    flex: 1,
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  recipeItem: {
    paddingVertical: 4,
  },
});

export default ShoppingScreen; 