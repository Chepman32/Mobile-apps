import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

const HomeScreen: React.FC<ScreenProps<'Home'>> = ({ navigation }) => {
  const { colors } = useTheme();

  const categories = [
    { id: '1', name: 'Beginner', icon: 'school', color: colors.primary },
    { id: '2', name: 'Intermediate', icon: 'book', color: colors.success },
    { id: '3', name: 'Advanced', icon: 'trophy', color: colors.warning },
    { id: '4', name: 'Travel', icon: 'airplane', color: colors.info },
  ];

  const recentLessons = [
    { id: '101', title: 'Greetings', progress: 75, category: 'Beginner' },
    { id: '102', title: 'Food & Dining', progress: 45, category: 'Beginner' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Welcome Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello, Learner!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            What would you like to learn today?
          </Text>
        </View>
        <TouchableOpacity style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categories Section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Learn', { categoryId: category.id })}
          >
            <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
              <Ionicons name={category.icon as any} size={24} color={category.color} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Learning */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
      {recentLessons.map((lesson) => (
        <TouchableOpacity
          key={lesson.id}
          style={[styles.lessonCard, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Quiz', { 
            categoryId: '1', 
            categoryName: lesson.category 
          })}
        >
          <View style={styles.lessonInfo}>
            <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
            <Text style={[styles.lessonCategory, { color: colors.textSecondary }]}>
              {lesson.category}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${lesson.progress}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {lesson.progress}%
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Practice')}
        >
          <Ionicons name="barbell" size={24} color="white" />
          <Text style={styles.actionButtonText}>Practice</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.success }]}
          onPress={() => navigation.navigate('Quiz', { categoryId: '1', categoryName: 'Quick Quiz' })}
        >
          <Ionicons name="flash" size={24} color="white" />
          <Text style={styles.actionButtonText}>Quick Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  lessonCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonInfo: {
    marginBottom: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonCategory: {
    fontSize: 14,
    opacity: 0.8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default HomeScreen;
