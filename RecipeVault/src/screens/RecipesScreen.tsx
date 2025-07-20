import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Avatar,
  Searchbar,
  SegmentedButtons,
  FAB,
  useTheme,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { Recipe, Cuisine, Category } from '../types';

const RecipesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, actions } = useRecipeVault();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCuisine, setFilterCuisine] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const { recipes, cuisines, categories } = state;

  const onRefresh = async () => {
    setRefreshing(true);
    await actions.fetchAllData();
    setRefreshing(false);
  };

  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCuisine = !filterCuisine || recipe.cuisine?.id === filterCuisine;
      const matchesDifficulty = !filterDifficulty || recipe.difficulty === filterDifficulty;
      const matchesCategory = !filterCategory || recipe.category?.id === filterCategory;

      return matchesSearch && matchesCuisine && matchesDifficulty && matchesCategory;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'prepTime':
          return a.prepTime - b.prepTime;
        case 'difficulty':
          return a.difficulty.localeCompare(b.difficulty);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'dateCreated':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [recipes, searchQuery, sortBy, filterCuisine, filterDifficulty, filterCategory]);

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <Card
      style={[styles.recipeCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id } as never)}
    >
      <Card.Content>
        <View style={styles.recipeHeader}>
          <View style={styles.recipeInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {item.description}
            </Text>
          </View>
          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(item.id)}
              />
            }
          >
            <Menu.Item
              leadingIcon="pencil"
              onPress={() => {
                setMenuVisible(null);
                navigation.navigate('EditRecipe', { recipeId: item.id } as never);
              }}
              title="Edit"
            />
            <Menu.Item
              leadingIcon="delete"
              onPress={() => {
                setMenuVisible(null);
                actions.deleteRecipe(item.id);
              }}
              title="Delete"
            />
            <Menu.Item
              leadingIcon="share"
              onPress={() => {
                setMenuVisible(null);
                // TODO: Implement share functionality
              }}
              title="Share"
            />
          </Menu>
        </View>

        <View style={styles.recipeDetails}>
          <View style={styles.recipeStats}>
            <Chip
              mode="outlined"
              compact
              style={{ backgroundColor: theme.colors.surfaceVariant }}
            >
              {item.prepTime} min
            </Chip>
            <Chip
              mode="outlined"
              compact
              style={{ backgroundColor: theme.colors.surfaceVariant }}
            >
              {item.difficulty}
            </Chip>
            {item.rating && (
              <Chip
                mode="outlined"
                compact
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              >
                ⭐ {item.rating.toFixed(1)}
              </Chip>
            )}
          </View>

          <View style={styles.recipeTags}>
            {item.cuisine && (
              <Chip
                mode="outlined"
                compact
                style={{ backgroundColor: theme.colors.primaryContainer }}
              >
                {item.cuisine.name}
              </Chip>
            )}
            {item.category && (
              <Chip
                mode="outlined"
                compact
                style={{ backgroundColor: theme.colors.secondaryContainer }}
              >
                {item.category.name}
              </Chip>
            )}
          </View>
        </View>

        {item.ingredients && item.ingredients.length > 0 && (
          <View style={styles.ingredientsPreview}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Ingredients: {item.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
              {item.ingredients.length > 3 && '...'}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderFilterSection = () => (
    <Card style={[styles.filterCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
          Sort by
        </Text>
        <SegmentedButtons
          value={sortBy}
          onValueChange={setSortBy}
          buttons={[
            { value: 'name', label: 'Name' },
            { value: 'prepTime', label: 'Time' },
            { value: 'difficulty', label: 'Difficulty' },
            { value: 'rating', label: 'Rating' },
            { value: 'dateCreated', label: 'Recent' },
          ]}
          style={styles.segmentedButtons}
        />

        <Divider style={{ marginVertical: 16 }} />

        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
          Filters
        </Text>

        {/* Cuisine Filter */}
        <View style={styles.filterRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Cuisine:
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              mode={filterCuisine === null ? 'flat' : 'outlined'}
              compact
              onPress={() => setFilterCuisine(null)}
              style={{ backgroundColor: filterCuisine === null ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
            >
              All
            </Chip>
            {cuisines.map((cuisine) => (
              <Chip
                key={cuisine.id}
                mode={filterCuisine === cuisine.id ? 'flat' : 'outlined'}
                compact
                onPress={() => setFilterCuisine(filterCuisine === cuisine.id ? null : cuisine.id)}
                style={{ backgroundColor: filterCuisine === cuisine.id ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              >
                {cuisine.name}
              </Chip>
            ))}
          </View>
        </View>

        {/* Difficulty Filter */}
        <View style={styles.filterRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Difficulty:
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              mode={filterDifficulty === null ? 'flat' : 'outlined'}
              compact
              onPress={() => setFilterDifficulty(null)}
              style={{ backgroundColor: filterDifficulty === null ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
            >
              All
            </Chip>
            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
              <Chip
                key={difficulty}
                mode={filterDifficulty === difficulty ? 'flat' : 'outlined'}
                compact
                onPress={() => setFilterDifficulty(filterDifficulty === difficulty ? null : difficulty)}
                style={{ backgroundColor: filterDifficulty === difficulty ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              >
                {difficulty}
              </Chip>
            ))}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Category:
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              mode={filterCategory === null ? 'flat' : 'outlined'}
              compact
              onPress={() => setFilterCategory(null)}
              style={{ backgroundColor: filterCategory === null ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
            >
              All
            </Chip>
            {categories.map((category) => (
              <Chip
                key={category.id}
                mode={filterCategory === category.id ? 'flat' : 'outlined'}
                compact
                onPress={() => setFilterCategory(filterCategory === category.id ? null : category.id)}
                style={{ backgroundColor: filterCategory === category.id ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              >
                {category.name}
              </Chip>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search recipes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        />
      </View>

      <FlatList
        data={filteredAndSortedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderFilterSection}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              No recipes found
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddRecipe' as never)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    elevation: 0,
  },
  filterCard: {
    margin: 16,
    marginTop: 0,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 80,
  },
  recipeCard: {
    margin: 16,
    marginTop: 0,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeDetails: {
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  recipeTags: {
    flexDirection: 'row',
    gap: 8,
  },
  ingredientsPreview: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RecipesScreen; 