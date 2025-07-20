import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  FAB,
  Chip,
  ProgressBar,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useLanguageLearner } from '../context/LanguageLearnerContext';
import { RootStackParamList, Lesson, Vocabulary } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { state, calculateStats } = useLanguageLearner();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showAddLessonDialog, setShowAddLessonDialog] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonCategory, setNewLessonCategory] = useState('beginner');

  const completedLessons = state.lessons.filter(lesson => lesson.completed);
  const learnedVocabulary = state.vocabulary.filter(vocab => vocab.learned);

  useEffect(() => {
    calculateStats();
  }, [state.lessons, state.vocabulary, state.progress]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getWeeklyProgress = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayProgress = state.progress.filter(p => p.date === dateStr);
      const lessonsCompleted = dayProgress.filter(p => p.type === 'lesson' && p.completed).length;
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        lessons: lessonsCompleted,
      });
    }
    return weekData;
  };

  const getCategoryBreakdown = () => {
    const categories = {};
    state.lessons.forEach(lesson => {
      if (!categories[lesson.category]) {
        categories[lesson.category] = 0;
      }
      categories[lesson.category]++;
    });
    
    return Object.entries(categories).map(([category, count]) => ({
      name: category,
      count: count as number,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const weeklyData = getWeeklyProgress();
  const categoryData = getCategoryBreakdown();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Stats */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Icon name="book-open" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.completedLessons}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Lessons Completed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="translate" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.learnedVocabulary}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Words Learned
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="fire" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.currentStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Day Streak
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Lessons */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Recent Lessons
            </Title>
            {state.lessons.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="plus-circle" size={64} color={theme.colors.outline} />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No lessons yet. Start your language learning journey!
                </Text>
              </View>
            ) : (
              state.lessons.slice(0, 3).map(lesson => (
                <Card
                  key={lesson.id}
                  style={[
                    styles.lessonCard,
                    {
                      backgroundColor: lesson.completed ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <View style={styles.lessonHeader}>
                      <View style={styles.lessonInfo}>
                        <Icon name="book-open-variant" size={24} color={theme.colors.primary} />
                        <View style={styles.lessonText}>
                          <Text style={[styles.lessonTitle, { color: theme.colors.onSurface }]}>
                            {lesson.title}
                          </Text>
                          <Text style={[styles.lessonDescription, { color: theme.colors.onSurfaceVariant }]}>
                            {lesson.description}
                          </Text>
                        </View>
                      </View>
                      <Chip
                        mode={lesson.completed ? 'flat' : 'outlined'}
                        selected={lesson.completed}
                        style={styles.completionChip}
                      >
                        {lesson.completed ? 'Completed' : lesson.difficulty}
                      </Chip>
                    </View>
                    
                    <View style={styles.lessonProgress}>
                      <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                        Progress: {Math.round(lesson.progress)}%
                      </Text>
                      <ProgressBar
                        progress={lesson.progress / 100}
                        color={theme.colors.primary}
                        style={styles.progressBar}
                      />
                    </View>
                    
                    <View style={styles.lessonTags}>
                      <Chip mode="outlined" compact>
                        {lesson.category}
                      </Chip>
                      <Chip mode="outlined" compact>
                        {lesson.difficulty}
                      </Chip>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Weekly Progress Chart */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Weekly Progress
            </Title>
            <LineChart
              data={{
                labels: weeklyData.map(d => d.date),
                datasets: [
                  {
                    data: weeklyData.map(d => d.lessons),
                  },
                ],
              }}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Category Breakdown */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Lesson Categories
            </Title>
            <PieChart
              data={categoryData}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quick Actions
            </Title>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="book-open"
                onPress={() => navigation.navigate('Lesson', { lessonId: 'new' })}
                style={styles.actionButton}
              >
                Start Lesson
              </Button>
              <Button
                mode="outlined"
                icon="translate"
                onPress={() => navigation.navigate('Vocabulary')}
                style={styles.actionButton}
              >
                Vocabulary
              </Button>
              <Button
                mode="outlined"
                icon="chart-line"
                onPress={() => navigation.navigate('Progress')}
                style={styles.actionButton}
              >
                Progress
              </Button>
              <Button
                mode="outlined"
                icon="cog"
                onPress={() => navigation.navigate('Settings')}
                style={styles.actionButton}
              >
                Settings
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Lesson', { lessonId: 'new' })}
      />

      {/* Add Lesson Dialog */}
      <Portal>
        <Dialog visible={showAddLessonDialog} onDismiss={() => setShowAddLessonDialog(false)}>
          <Dialog.Title>Quick Add Lesson</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Lesson Title"
              value={newLessonTitle}
              onChangeText={setNewLessonTitle}
              mode="outlined"
              style={styles.dialogInput}
            />
            <SegmentedButtons
              value={newLessonCategory}
              onValueChange={setNewLessonCategory}
              buttons={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              style={styles.segmentedButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddLessonDialog(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={() => {
                if (newLessonTitle.trim()) {
                  // Add lesson logic here
                  setShowAddLessonDialog(false);
                  setNewLessonTitle('');
                }
              }}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  lessonCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonText: {
    marginLeft: 12,
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lessonDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  completionChip: {
    marginLeft: 8,
  },
  lessonProgress: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  lessonTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
}); 