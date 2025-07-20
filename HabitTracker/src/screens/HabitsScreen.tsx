import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Chip,
  IconButton,
  FAB,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabit } from '../context/HabitContext';
import { Habit } from '../types';

export default function HabitsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    habits,
    selectedDate,
    markHabitComplete,
    markHabitIncomplete,
    getHabitStats,
  } = useHabit();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredHabits = useMemo(() => {
    let data = habits;
    if (filter === 'active') data = data.filter(h => h.isActive);
    if (filter === 'inactive') data = data.filter(h => !h.isActive);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(h => h.name.toLowerCase().includes(q) || h.tags.some(t => t.toLowerCase().includes(q)));
    }
    return data.sort((a,b)=>a.name.localeCompare(b.name));
  }, [habits, filter, searchQuery]);

  const toggleHabit = async (habit: Habit) => {
    try {
      const stats = getHabitStats(habit.id);
      const completedToday = stats?.lastCompleted === selectedDate.toISOString().split('T')[0];
      if (completedToday) {
        await markHabitIncomplete(habit.id, selectedDate);
      } else {
        await markHabitComplete(habit.id, selectedDate);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to toggle habit');
    }
  };

  const renderHabitItem = ({ item }: { item: Habit }) => {
    const stats = getHabitStats(item.id);
    const completedToday = stats?.lastCompleted === selectedDate.toISOString().split('T')[0];

    return (
      <Card style={styles.card} onPress={() => navigation.navigate('HabitDetail' as never, { habitId: item.id } as never)}>
        <Card.Title
          title={item.name}
          subtitle={item.description}
          left={(props) => (
            <Icon {...props} name={item.icon || 'check-circle'} color={item.color || theme.colors.primary} size={32} />
          )}
          right={() => (
            <IconButton
              icon={completedToday ? 'check-circle' : 'checkbox-blank-circle-outline'}
              iconColor={completedToday ? '#10b981' : theme.colors.outline}
              onPress={() => toggleHabit(item)}
            />
          )}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search habits"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
        />
        <View style={styles.filterRow}>
          {['all','active','inactive'].map(t => (
            <Chip
              key={t}
              style={styles.chip}
              selected={filter===t}
              onPress={() => setFilter(t as any)}
            >
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={item=>item.id}
        renderItem={renderHabitItem}
        contentContainerStyle={styles.list}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddHabit' as never)}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1 },
  searchSection:{ padding:16 },
  searchbar:{ marginBottom:8 },
  filterRow:{ flexDirection:'row', flexWrap:'wrap' },
  chip:{ marginRight:8, marginBottom:4 },
  list:{ paddingHorizontal:16, paddingBottom:80 },
  card:{ marginBottom:12 },
  fab:{ position:'absolute', right:16, bottom:16, backgroundColor:'#6366f1' },
}); 