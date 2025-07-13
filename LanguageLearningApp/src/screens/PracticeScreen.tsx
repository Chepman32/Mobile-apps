import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

// Mock data for practice activities
const practiceActivities = [
  {
    id: '1',
    title: 'Flashcards',
    description: 'Learn new words with interactive flashcards',
    icon: 'albums',
    color: '#4361EE',
    type: 'flashcards',
  },
  {
    id: '2',
    title: 'Listening',
    description: 'Improve your listening comprehension',
    icon: 'headset',
    color: '#4CC9F0',
    type: 'listening',
  },
  {
    id: '3',
    title: 'Speaking',
    description: 'Practice your pronunciation',
    icon: 'mic',
    color: '#F9C74F',
    type: 'speaking',
  },
  {
    id: '4',
    title: 'Writing',
    description: 'Practice writing in your target language',
    icon: 'create',
    color: '#90BE6D',
    type: 'writing',
  },
  {
    id: '5',
    title: 'Grammar',
    description: 'Master grammar rules and structures',
    icon: 'school',
    color: '#F94144',
    type: 'grammar',
  },
  {
    id: '6',
    title: 'Daily Challenge',
    description: 'Test your skills with today\'s challenge',
    icon: 'trophy',
    color: '#7209B7',
    type: 'challenge',
  },
];

// Mock data for practice history
const practiceHistory = [
  { id: '1', activity: 'Flashcards', date: 'Today', score: '8/10' },
  { id: '2', activity: 'Listening', date: 'Yesterday', score: '7/10' },
  { id: '3', activity: 'Speaking', date: '2 days ago', score: '9/10' },
];

const PracticeScreen: React.FC<ScreenProps<'Practice'>> = ({ navigation }) => {
  const { colors } = useTheme();

  const renderActivity = ({ item }) => (
    <TouchableOpacity
      style={[styles.activityCard, { backgroundColor: colors.card }]}
      onPress={() => handleActivityPress(item.type)}
    >
      <View style={[styles.activityIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={[styles.activityTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const handleActivityPress = (type: string) => {
    // In a real app, this would navigate to the specific practice activity
    navigation.navigate('Quiz', { 
      categoryId: 'practice', 
      categoryName: type.charAt(0).toUpperCase() + type.slice(1)
    });
  };

  const renderHistoryItem = (item) => (
    <View key={item.id} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
      <View>
        <Text style={[styles.historyActivity, { color: colors.text }]}>{item.activity}</Text>
        <Text style={[styles.historyDate, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      <Text style={[styles.historyScore, { color: colors.primary }]}>{item.score}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Practice</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Improve your language skills with daily practice
            </Text>
          </View>
          <Image
            source={require('@assets/images/practice-hero.png')}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        {/* Daily Goal */}
        <View style={[styles.goalCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.goalTitle}>Daily Goal</Text>
          <View style={styles.goalProgressContainer}>
            <View style={styles.goalProgress}>
              <View style={[styles.goalProgressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.goalText}>13/20 minutes</Text>
          </View>
          <Text style={styles.goalSubtitle}>Complete more exercises to reach your goal!</Text>
        </View>

        {/* Practice Activities */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Practice Activities
        </Text>
        
        <View style={styles.activitiesContainer}>
          {practiceActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[styles.activityCard, { backgroundColor: colors.card }]}
              onPress={() => handleActivityPress(activity.type)}
            >
              <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                <Ionicons name={activity.icon} size={24} color={activity.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                  {activity.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Practice History */}
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.historyList, { backgroundColor: colors.card }]}>
            {practiceHistory.map((item) => renderHistoryItem(item))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  headerImage: {
    width: 100,
    height: 100,
  },
  goalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  goalProgressContainer: {
    marginBottom: 8,
  },
  goalProgress: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  goalText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  goalSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  activitiesContainer: {
    marginBottom: 24,
  },
  activityCard: {
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
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    opacity: 0.8,
  },
  historyContainer: {
    marginBottom: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyList: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyActivity: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    opacity: 0.8,
  },
  historyScore: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PracticeScreen;
