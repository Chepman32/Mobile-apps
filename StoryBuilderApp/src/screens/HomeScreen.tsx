import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const categoryIcons: Record<string, string> = {
  '1': '👋', // Greetings
  '2': '✈️', // Travel
  '3': '🍽️', // Food & Dining
  '4': '🛍️', // Shopping
  '5': '🆘', // Emergency
  '6': '🏨', // Accommodation
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { categories, loading, refreshCategories } = useAppContext();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    refreshCategories();
  }, []);

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate('Category', { 
        categoryId: item.id, 
        categoryName: item.name 
      })}
    >
      <Text style={styles.categoryIcon}>{categoryIcons[item.id] || '📁'}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.phraseCount}>{item.count} phrases</Text>
    </TouchableOpacity>
  );

  if (loading && categories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Category</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={refreshCategories}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: colors.text,
  },
  list: {
    padding: 8,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: '40%',
    maxWidth: '45%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
  },
  phraseCount: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 4,
  },
});

export default HomeScreen;
