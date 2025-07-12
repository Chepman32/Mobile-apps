import React, { useContext, useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { RootStackParamList } from '../types';

const HabitDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'HabitDetails'>>();
  const navigation = useNavigation();
  const { habitId } = route.params;
  const { 
    getHabitById, 
    updateHabit, 
    deleteHabit, 
    todayProgress 
  } = useContext(AppContext);
  
  const [isDeleting, setIsDeleting] = useState(false);
  
  const habit = getHabitById(habitId);
  
  const isCompleted = useMemo(() => {
    return todayProgress.completedHabits.includes(habitId);
  }, [todayProgress.completedHabits, habitId]);
  
  const handleToggleComplete = () => {
    if (!habit) return;
    updateHabit(habit.id, {
      completionHistory: isCompleted 
        ? habit.completionHistory.filter(ch => ch.date !== new Date().toISOString().split('T')[0])
        : [...habit.completionHistory, { date: new Date().toISOString().split('T')[0], count: 1 }],
      currentStreak: isCompleted 
        ? Math.max(0, habit.currentStreak - 1) 
        : habit.currentStreak + 1,
      longestStreak: isCompleted 
        ? habit.longestStreak 
        : Math.max(habit.longestStreak, habit.currentStreak + 1)
    });
  };
  
  const handleEdit = () => {
    if (!habit) return;
    navigation.navigate('AddEditHabit', { habitId: habit.id });
  };
  
  const handleDelete = () => {
    if (!habit) return;
    
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteHabit(habit.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting habit:', error);
              Alert.alert('Error', 'Failed to delete habit. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };
  
  if (!habit) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Habit not found</Text>
      </View>
    );
  }
  
  // Calculate completion percentage for the current week
  const getWeekCompletion = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    const weekDays = Array(7).fill(0).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    
    const completedDays = weekDays.filter(date => 
      habit.completionHistory.some(ch => ch.date === date)
    ).length;
    
    return Math.round((completedDays / 7) * 100);
  };
  
  const weekCompletion = getWeekCompletion();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.habitHeader}>
          <View 
            style={[
              styles.habitIcon, 
              { backgroundColor: `${habit.color}20` }
            ]}
          >
            <Ionicons 
              name={habit.icon as any} 
              size={28} 
              color={habit.color} 
            />
          </View>
          <Text style={styles.habitName}>{habit.name}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habit.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habit.longestStreak}</Text>
            <Text style={styles.statLabel}>Record</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weekCompletion}%</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.detailText}>
            {habit.frequency === 'daily' 
              ? 'Every day' 
              : habit.frequency === 'weekly' 
                ? 'On selected days' 
                : 'Custom schedule'}
          </Text>
        </View>
        {habit.description && (
          <View style={styles.detailItem}>
            <Ionicons name="document-text" size={20} color="#666" />
            <Text style={styles.detailText}>{habit.description}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completion This Week</Text>
        <View style={styles.weekBar}>
          {Array(7).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (date.getDay() - i));
            const dateStr = date.toISOString().split('T')[0];
            const isCompleted = habit.completionHistory.some(ch => ch.date === dateStr);
            const dayName = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i];
            
            return (
              <View key={i} style={styles.dayContainer}>
                <View 
                  style={[
                    styles.dayDot,
                    isCompleted && { backgroundColor: habit.color }
                  ]} 
                />
                <Text style={styles.dayText}>{dayName}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.completeButton]}
          onPress={handleToggleComplete}
          disabled={isDeleting}
        >
          <Ionicons 
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.completeButtonText}>
            {isCompleted ? 'Completed Today' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.rowButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
            disabled={isDeleting}
          >
            <Ionicons name="create" size={20} color="#4a6fa5" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="#ff6b6b" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  habitIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6fa5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 10,
    color: '#555',
    fontSize: 15,
  },
  weekBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
  },
  dayText: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    padding: 20,
  },
  completeButton: {
    backgroundColor: '#4a6fa5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#f0f4f9',
    borderWidth: 1,
    borderColor: '#e0e6ed',
  },
  editButtonText: {
    color: '#4a6fa5',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#ffdddd',
  },
  deleteButtonText: {
    color: '#ff6b6b',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HabitDetailsScreen;
