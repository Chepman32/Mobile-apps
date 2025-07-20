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
import { usePocketPolyglotCLI } from '../context/PocketPolyglotCLIContext';
import { RootStackParamList, Translation, DictionaryEntry } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { state, calculateStats } = usePocketPolyglotCLI();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickTranslateDialog, setShowQuickTranslateDialog] = useState(false);
  const [quickTranslateText, setQuickTranslateText] = useState('');
  const [quickTranslateSourceLang, setQuickTranslateSourceLang] = useState('en');
  const [quickTranslateTargetLang, setQuickTranslateTargetLang] = useState('es');

  const recentTranslations = state.translations.slice(0, 5);
  const learnedWords = state.flashcards.filter(card => card.learned);

  useEffect(() => {
    calculateStats();
  }, [state.translations, state.conversations, state.flashcards, state.progress]);

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
      const translations = dayProgress.filter(p => p.type === 'translation').length;
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        translations,
      });
    }
    return weekData;
  };

  const getLanguageBreakdown = () => {
    const languages = {};
    state.translations.forEach(translation => {
      const lang = translation.targetLanguage;
      if (!languages[lang]) {
        languages[lang] = 0;
      }
      languages[lang]++;
    });
    
    return Object.entries(languages).map(([language, count]) => ({
      name: language,
      count: count as number,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
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
  const languageData = getLanguageBreakdown();

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
              placeholder="Search translations, words, or phrases..."
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
                <Icon name="translate" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalTranslations}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Translations
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="chat" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalConversations}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Conversations
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="cards" size={32} color={theme.colors.primary} />
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
                icon="book-open"
                onPress={() => navigation.navigate('Dictionary')}
                style={styles.actionButton}
              >
                Dictionary
              </Button>
              <Button
                mode="outlined"
                icon="chat"
                onPress={() => navigation.navigate('Conversation')}
                style={styles.actionButton}
              >
                Conversation
              </Button>
              <Button
                mode="outlined"
                icon="cards"
                onPress={() => navigation.navigate('Flashcards')}
                style={styles.actionButton}
              >
                Flashcards
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Translations */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Recent Translations
            </Title>
            {recentTranslations.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="translate" size={64} color={theme.colors.outline} />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No translations yet. Start translating!
                </Text>
              </View>
            ) : (
              recentTranslations.map(translation => (
                <Card
                  key={translation.id}
                  style={[
                    styles.translationCard,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <View style={styles.translationHeader}>
                      <View style={styles.translationInfo}>
                        <Icon name="translate" size={24} color={theme.colors.primary} />
                        <View style={styles.translationText}>
                          <Text style={[styles.translationOriginal, { color: theme.colors.onSurface }]}>
                            {translation.originalText}
                          </Text>
                          <Text style={[styles.translationTranslated, { color: theme.colors.onSurfaceVariant }]}>
                            {translation.translatedText}
                          </Text>
                        </View>
                      </View>
                      <Chip
                        mode="outlined"
                        compact
                        style={styles.languageChip}
                      >
                        {translation.sourceLanguage} → {translation.targetLanguage}
                      </Chip>
                    </View>
                    
                    <View style={styles.translationFooter}>
                      <Text style={[styles.translationDate, { color: theme.colors.onSurfaceVariant }]}>
                        {new Date(translation.createdAt).toLocaleDateString()}
                      </Text>
                      <View style={styles.translationActions}>
                        <Icon 
                          name={translation.isFavorite ? "heart" : "heart-outline"} 
                          size={20} 
                          color={theme.colors.primary} 
                        />
                        <Icon name="share" size={20} color={theme.colors.primary} />
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
              Weekly Translations
            </Title>
            <LineChart
              data={{
                labels: weeklyData.map(d => d.date),
                datasets: [
                  {
                    data: weeklyData.map(d => d.translations),
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

        {/* Language Breakdown */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Languages Used
            </Title>
            <PieChart
              data={languageData}
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

        {/* CLI Features */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              CLI Features
            </Title>
            <View style={styles.cliFeatures}>
              <View style={styles.cliFeature}>
                <Icon name="terminal" size={24} color={theme.colors.primary} />
                <View style={styles.cliFeatureText}>
                  <Text style={[styles.cliFeatureTitle, { color: theme.colors.onSurface }]}>
                    Command Line Interface
                  </Text>
                  <Text style={[styles.cliFeatureDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Access translations via command line
                  </Text>
                </View>
              </View>
              <View style={styles.cliFeature}>
                <Icon name="code-braces" size={24} color={theme.colors.primary} />
                <View style={styles.cliFeatureText}>
                  <Text style={[styles.cliFeatureTitle, { color: theme.colors.onSurface }]}>
                    API Integration
                  </Text>
                  <Text style={[styles.cliFeatureDescription, { color: theme.colors.onSurfaceVariant }]}>
                    RESTful API for developers
                  </Text>
                </View>
              </View>
              <View style={styles.cliFeature}>
                <Icon name="database" size={24} color={theme.colors.primary} />
                <View style={styles.cliFeatureText}>
                  <Text style={[styles.cliFeatureTitle, { color: theme.colors.onSurface }]}>
                    Local Database
                  </Text>
                  <Text style={[styles.cliFeatureDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Offline storage and sync
                  </Text>
                </View>
              </View>
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
  translationCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  translationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  translationText: {
    marginLeft: 12,
    flex: 1,
  },
  translationOriginal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  translationTranslated: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  languageChip: {
    marginLeft: 8,
  },
  translationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  translationDate: {
    fontSize: 12,
  },
  translationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  cliFeatures: {
    gap: 16,
  },
  cliFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cliFeatureText: {
    marginLeft: 12,
    flex: 1,
  },
  cliFeatureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cliFeatureDescription: {
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