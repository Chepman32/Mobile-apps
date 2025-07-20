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
  Searchbar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useLingoOnTheGo } from '../context/LingoOnTheGoContext';
import { RootStackParamList, Phrase, Translation } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { state, calculateStats } = useLingoOnTheGo();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickTranslateDialog, setShowQuickTranslateDialog] = useState(false);
  const [quickTranslateText, setQuickTranslateText] = useState('');
  const [quickTranslateSourceLang, setQuickTranslateSourceLang] = useState('en');
  const [quickTranslateTargetLang, setQuickTranslateTargetLang] = useState('es');

  const recentPhrases = state.phrases.slice(0, 5);
  const learnedPhrases = state.phrases.filter(phrase => phrase.learned);

  useEffect(() => {
    calculateStats();
  }, [state.phrases, state.translations, state.vocabulary, state.progress]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getWeeklyStats = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayProgress = state.progress.filter(p => p.date === dateStr);
      const phrases = dayProgress.filter(p => p.type === 'phrase').length;
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        phrases,
      });
    }
    return weekData;
  };

  const getCategoryBreakdown = () => {
    const categories = {};
    state.phrases.forEach(phrase => {
      if (!categories[phrase.category]) {
        categories[phrase.category] = 0;
      }
      categories[phrase.category]++;
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
    color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
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

  const weeklyData = getWeeklyStats();
  const categoryData = getCategoryBreakdown();

  const phraseCategories = [
    {
      id: 'greetings',
      name: 'Greetings',
      description: 'Basic greetings and introductions',
      icon: 'hand-wave',
      color: '#3f51b5',
    },
    {
      id: 'food',
      name: 'Food & Dining',
      description: 'Restaurant and food-related phrases',
      icon: 'food-fork-drink',
      color: '#ff9800',
    },
    {
      id: 'travel',
      name: 'Travel',
      description: 'Transportation and travel phrases',
      icon: 'airplane',
      color: '#4caf50',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      description: 'Shopping and commerce phrases',
      icon: 'shopping',
      color: '#9c27b0',
    },
  ];

  const handleQuickTranslate = () => {
    if (quickTranslateText.trim()) {
      // Mock translation - in real app, this would call translation API
      const mockTranslation: Translation = {
        id: Date.now().toString(),
        originalText: quickTranslateText,
        translatedText: `[Translated: ${quickTranslateText}]`,
        sourceLanguage: quickTranslateSourceLang,
        targetLanguage: quickTranslateTargetLang,
        confidence: 0.95,
        pronunciation: '',
        alternatives: [],
        context: '',
        tags: [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to translations and navigate to translation screen
      // This would be handled by the context
      setShowQuickTranslateDialog(false);
      setQuickTranslateText('');
      navigation.navigate('Translation', { text: quickTranslateText });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Searchbar
              placeholder="Search phrases, translations, or vocabulary..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              icon="translate"
            />
          </Card.Content>
        </Card>

        {/* Header Stats */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Icon name="format-quote" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalPhrases}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Phrases
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="translate" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalTranslations}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Translations
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="book-open" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.learnedWords}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Words Learned
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Phrase Categories */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Phrase Categories
            </Title>
            <View style={styles.phraseCategories}>
              {phraseCategories.map(category => (
                <Card
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: category.color,
                    },
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <View style={styles.categoryHeader}>
                      <Icon name={category.icon} size={32} color={category.color} />
                      <View style={styles.categoryText}>
                        <Text style={[styles.categoryTitle, { color: theme.colors.onSurface }]}>
                          {category.name}
                        </Text>
                        <Text style={[styles.categoryDescription, { color: theme.colors.onSurfaceVariant }]}>
                          {category.description}
                        </Text>
                      </View>
                    </View>
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate('Phrasebook', { category: category.id })}
                      style={[styles.categoryButton, { backgroundColor: category.color }]}
                    >
                      View Phrases
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </View>
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
                icon="translate"
                onPress={() => setShowQuickTranslateDialog(true)}
                style={styles.actionButton}
              >
                Quick Translate
              </Button>
              <Button
                mode="outlined"
                icon="format-quote"
                onPress={() => navigation.navigate('Phrasebook')}
                style={styles.actionButton}
              >
                Phrasebook
              </Button>
              <Button
                mode="outlined"
                icon="play-circle"
                onPress={() => navigation.navigate('Practice')}
                style={styles.actionButton}
              >
                Practice
              </Button>
              <Button
                mode="outlined"
                icon="book-open"
                onPress={() => navigation.navigate('Vocabulary')}
                style={styles.actionButton}
              >
                Vocabulary
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Phrases */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Recent Phrases
            </Title>
            {recentPhrases.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="format-quote" size={64} color={theme.colors.outline} />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No phrases yet. Start learning!
                </Text>
              </View>
            ) : (
              recentPhrases.map(phrase => (
                <Card
                  key={phrase.id}
                  style={[
                    styles.phraseCard,
                    {
                      backgroundColor: phrase.learned ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <View style={styles.phraseHeader}>
                      <View style={styles.phraseInfo}>
                        <Icon name="format-quote" size={24} color={theme.colors.primary} />
                        <View style={styles.phraseText}>
                          <Text style={[styles.phraseOriginal, { color: theme.colors.onSurface }]}>
                            {phrase.text}
                          </Text>
                          <Text style={[styles.phraseTranslation, { color: theme.colors.onSurfaceVariant }]}>
                            {phrase.translation}
                          </Text>
                        </View>
                      </View>
                      <Chip
                        mode={phrase.learned ? 'flat' : 'outlined'}
                        selected={phrase.learned}
                        style={styles.learnedChip}
                      >
                        {phrase.learned ? 'Learned' : phrase.difficulty}
                      </Chip>
                    </View>
                    
                    <View style={styles.phraseFooter}>
                      <Text style={[styles.phraseCategory, { color: theme.colors.onSurfaceVariant }]}>
                        {phrase.category}
                      </Text>
                      <View style={styles.phraseActions}>
                        <Icon 
                          name={phrase.isFavorite ? "heart" : "heart-outline"} 
                          size={20} 
                          color={theme.colors.primary} 
                        />
                        <Icon name="volume-high" size={20} color={theme.colors.primary} />
                      </View>
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
              Weekly Phrases
            </Title>
            <LineChart
              data={{
                labels: weeklyData.map(d => d.date),
                datasets: [
                  {
                    data: weeklyData.map(d => d.phrases),
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
              Phrase Categories
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

        {/* Offline Status */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.offlineStatus}>
              <Icon name="wifi" size={24} color={theme.colors.primary} />
              <View style={styles.offlineText}>
                <Text style={[styles.offlineTitle, { color: theme.colors.onSurface }]}>
                  Offline Mode Available
                </Text>
                <Text style={[styles.offlineDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Access your saved phrases and translations offline
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Offline')}
                compact
              >
                View
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowQuickTranslateDialog(true)}
      />

      {/* Quick Translate Dialog */}
      <Portal>
        <Dialog visible={showQuickTranslateDialog} onDismiss={() => setShowQuickTranslateDialog(false)}>
          <Dialog.Title>Quick Translate</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Text to translate"
              value={quickTranslateText}
              onChangeText={setQuickTranslateText}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
            <View style={styles.languageSelector}>
              <Text style={styles.languageLabel}>From:</Text>
              <SegmentedButtons
                value={quickTranslateSourceLang}
                onValueChange={setQuickTranslateSourceLang}
                buttons={[
                  { value: 'en', label: 'EN' },
                  { value: 'es', label: 'ES' },
                  { value: 'fr', label: 'FR' },
                  { value: 'de', label: 'DE' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
            <View style={styles.languageSelector}>
              <Text style={styles.languageLabel}>To:</Text>
              <SegmentedButtons
                value={quickTranslateTargetLang}
                onValueChange={setQuickTranslateTargetLang}
                buttons={[
                  { value: 'es', label: 'ES' },
                  { value: 'en', label: 'EN' },
                  { value: 'fr', label: 'FR' },
                  { value: 'de', label: 'DE' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowQuickTranslateDialog(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={handleQuickTranslate}
              disabled={!quickTranslateText.trim()}
            >
              Translate
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
  searchBar: {
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
  phraseCategories: {
    gap: 12,
  },
  categoryCard: {
    marginBottom: 12,
    borderWidth: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    marginLeft: 12,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  categoryButton: {
    marginTop: 8,
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
  phraseCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  phraseInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  phraseText: {
    marginLeft: 12,
    flex: 1,
  },
  phraseOriginal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phraseTranslation: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  learnedChip: {
    marginLeft: 8,
  },
  phraseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phraseCategory: {
    fontSize: 12,
  },
  phraseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  offlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    flex: 1,
    marginLeft: 12,
  },
  offlineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  offlineDescription: {
    fontSize: 14,
    marginTop: 2,
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
  languageSelector: {
    marginBottom: 16,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
});
