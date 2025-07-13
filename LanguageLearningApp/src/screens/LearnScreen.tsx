import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

// Mock data for categories
const categories = [
  {
    id: '1',
    name: 'Beginner',
    description: 'Start your language journey with basic vocabulary',
    icon: 'school',
    color: '#4361EE',
    lessons: 15,
    progress: 40,
  },
  {
    id: '2',
    name: 'Intermediate',
    description: 'Build on your knowledge with more complex concepts',
    icon: 'book',
    color: '#4CC9F0',
    lessons: 20,
    progress: 25,
  },
  {
    id: '3',
    name: 'Advanced',
    description: 'Master the language with advanced lessons',
    icon: 'trophy',
    color: '#F9C74F',
    lessons: 25,
    progress: 10,
  },
  {
    id: '4',
    name: 'Travel',
    description: 'Essential phrases for your next trip',
    icon: 'airplane',
    color: '#F94144',
    lessons: 10,
    progress: 75,
  },
  {
    id: '5',
    name: 'Business',
    description: 'Professional language for the workplace',
    icon: 'briefcase',
    color: '#90BE6D',
    lessons: 18,
    progress: 5,
  },
  {
    id: '6',
    name: 'Conversation',
    description: 'Practice real-life conversations',
    icon: 'chatbubbles',
    color: '#7209B7',
    lessons: 12,
    progress: 60,
  },
];

const LearnScreen: React.FC<ScreenProps<'Learn'>> = ({ navigation }) => {
  const { colors } = useTheme();

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('Quiz', { categoryId: item.id, categoryName: item.name })}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
        <View style={styles.lessonInfo}>
          <Text style={[styles.lessonCount, { color: colors.primary }]}>
            {item.lessons} lessons
          </Text>
          <Text style={[styles.progressText, { color: colors.primary }]}>
            {item.progress}% complete
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${item.progress}%`,
                backgroundColor: item.color,
              }
            ]} 
          />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Learn</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose a category to start learning
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.8,
  },
  lessonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lessonCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default LearnScreen;
