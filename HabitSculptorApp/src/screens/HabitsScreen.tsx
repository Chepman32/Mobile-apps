import React, { useContext, useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SectionList, 
  TouchableOpacity, 
  TextInput, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { useTheme, themes } from '../context/ThemeContext';
import { Habit } from '../types';

// Define a type for the sections in SectionList
interface HabitSection {
  title: string;
  data: Habit[];
  icon: string;
  color: string;
}

const HabitsScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { habits, categories, loading, refreshData } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const filteredHabits = useMemo(() => {
    if (!searchQuery.trim()) return habits;
    
    const query = searchQuery.toLowerCase();
    return habits.filter(habit => 
      habit.name.toLowerCase().includes(query) ||
      (habit.description?.toLowerCase().includes(query) ?? false)
    );
  }, [habits, searchQuery]);

  const habitsByCategory = useMemo(() => {
    const result: HabitSection[] = [];
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    const habitsGrouped = new Map<string, any[]>();

    habitsGrouped.set('uncategorized', []);
    categories.forEach(cat => {
      habitsGrouped.set(cat.id, []);
    });

    filteredHabits.forEach(habit => {
      const categoryId = habit.category || 'uncategorized';
      if (habitsGrouped.has(categoryId)) {
        habitsGrouped.get(categoryId)?.push(habit);
      } else {
        habitsGrouped.get('uncategorized')?.push(habit);
      }
    });

    habitsGrouped.forEach((habitsInCategory, categoryId) => {
      if (habitsInCategory.length === 0) return;
      
      let title = 'Uncategorized';
      let icon = 'folder';
      let color = colors.subtext;
      
      if (categoryId !== 'uncategorized') {
        const category = categoryMap.get(categoryId);
        if (category) {
          title = category.name;
          icon = category.icon;
          color = category.color;
        }
      }
      
      const sortedHabits = [...habitsInCategory].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
      result.push({
        title,
        data: sortedHabits,
        icon,
        color,
      });
    });
    
    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredHabits, categories, colors.subtext]);

  const getFrequencyText = (frequency: string, daysOfWeek?: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    switch (frequency) {
      case 'daily':
        return 'Every day';
      case 'weekly':
        if (daysOfWeek?.length === 7) return 'Every day';
        if (daysOfWeek?.length === 5 && !daysOfWeek.includes(5) && !daysOfWeek.includes(6)) {
          return 'Weekdays';
        }
        if (daysOfWeek?.length === 2 && daysOfWeek.includes(0) && daysOfWeek.includes(6)) {
          return 'Weekends';
        }
        return daysOfWeek?.map(day => dayNames[day]).join(', ') || 'Custom';
      default:
        return 'Custom';
    }
  };

  const renderHabitItem = ({ item: habit }: { item: Habit }) => (
    <TouchableOpacity 
      style={styles.habitItem}
      onPress={() => navigation.navigate('HabitDetails', { habitId: habit.id })}
    >
      <View style={styles.habitInfo}>
        <View 
          style={[
            styles.habitIcon, 
            { backgroundColor: `${habit.color}20` }
          ]}
        >
          <Ionicons name={habit.icon as any} size={20} color={habit.color} />
        </View>
        <View>
          <Text style={styles.habitName} numberOfLines={1}>
            {habit.name}
          </Text>
          <Text style={styles.habitFrequency}>
            {getFrequencyText(habit.frequency, habit.daysOfWeek)}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title, icon, color } }: { section: HabitSection }) => (
    <View style={[styles.sectionHeader, { backgroundColor: `${color}15` }]}>
      <View style={[styles.sectionIcon, { backgroundColor: `${color}30` }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list" size={60} color={colors.subtext} />
      <Text style={styles.emptyStateTitle}>No habits yet</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery.trim() 
          ? 'No habits match your search.' 
          : 'Add your first habit to get started.'}
      </Text>
      {!searchQuery.trim() && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditHabit')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Habit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.subtext} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {habitsByCategory.length > 0 ? (
        <SectionList
          sections={habitsByCategory}
          keyExtractor={(item) => item.id}
          renderItem={renderHabitItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={<View style={styles.footer} />}
        />
      ) : (
        <ScrollView 
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        >
          {renderEmptyState()}
        </ScrollView>
      )}

      {habitsByCategory.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('AddEditHabit')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: typeof themes.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
    maxWidth: 200,
  },
  habitFrequency: {
    fontSize: 12,
    color: colors.subtext,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  footer: {
    height: 24,
  },
});

export default HabitsScreen;
