import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, Searchbar, FAB, Menu, Divider, List, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguageFlashcards } from '../context/LanguageFlashcardsContext';
import { Deck } from '../types';

const DecksScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, getDecks, deleteDeck, getFlashcardsByDeck } = useLanguageFlashcards();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'cards'>('name');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [deckStats, setDeckStats] = useState<{[key: string]: {dueCards: number, accuracy: number}}>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await getDecks();
    await loadDeckStats();
  };

  const loadDeckStats = async () => {
    const stats: {[key: string]: {dueCards: number, accuracy: number}} = {};
    
    for (const deck of state.decks) {
      const cards = await getFlashcardsByDeck(deck.id);
      const dueCards = cards.filter(card => {
        const nextReview = new Date(card.nextReview);
        return nextReview <= new Date();
      }).length;
      
      const totalReviews = cards.reduce((sum, card) => sum + card.totalReviews, 0);
      const correctReviews = cards.reduce((sum, card) => sum + card.correctReviews, 0);
      const accuracy = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;
      
      stats[deck.id] = { dueCards, accuracy };
    }
    
    setDeckStats(stats);
  };

  const filteredDecks = useMemo(() => {
    let filtered = state.decks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(deck =>
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.language.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(deck => deck.category === filterCategory);
    }

    // Language filter
    if (filterLanguage !== 'all') {
      filtered = filtered.filter(deck => deck.language === filterLanguage);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'cards':
          return b.cardCount - a.cardCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.decks, searchQuery, filterCategory, filterLanguage, sortBy]);

  const categories = useMemo(() => {
    const cats = [...new Set(state.decks.map(deck => deck.category))];
    return ['all', ...cats];
  }, [state.decks]);

  const languages = useMemo(() => {
    const langs = [...new Set(state.decks.map(deck => deck.language))];
    return ['all', ...langs];
  }, [state.decks]);

  const handleDeckPress = (deck: Deck) => {
    navigation.navigate('DeckDetails' as never, { deckId: deck.id } as never);
  };

  const handleEditDeck = (deck: Deck) => {
    setMenuVisible(null);
    navigation.navigate('EditDeck' as never, { deckId: deck.id } as never);
  };

  const handleDeleteDeck = async (deckId: string) => {
    setMenuVisible(null);
    const success = await deleteDeck(deckId);
    if (success) {
      await loadDeckStats();
    }
  };

  const handleAddCards = (deck: Deck) => {
    setMenuVisible(null);
    navigation.navigate('AddFlashcard' as never, { deckId: deck.id } as never);
  };

  const handleStudyDeck = (deck: Deck) => {
    setMenuVisible(null);
    navigation.navigate('StudySession' as never, { deckId: deck.id } as never);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getLanguageFlag = (language: string) => {
    // Simple emoji flags for common languages
    const flags: {[key: string]: string} = {
      'Spanish': '🇪🇸',
      'French': '🇫🇷',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'Russian': '🇷🇺',
      'Japanese': '🇯🇵',
      'Chinese': '🇨🇳',
      'Korean': '🇰🇷',
      'Arabic': '🇸🇦',
    };
    return flags[language] || '🌐';
  };

  const renderDeckCard = (deck: Deck) => {
    const stats = deckStats[deck.id] || { dueCards: 0, accuracy: 0 };
    const isDue = stats.dueCards > 0;

    return (
      <Card key={deck.id} style={styles.deckCard} onPress={() => handleDeckPress(deck)}>
        <Card.Content>
          <View style={styles.deckHeader}>
            <View style={styles.deckInfo}>
              <Text variant="titleMedium" style={styles.deckName}>
                {deck.name}
              </Text>
              <Text variant="bodyMedium" style={styles.deckDescription}>
                {deck.description}
              </Text>
              <View style={styles.deckMeta}>
                <Chip
                  icon={() => <Text style={styles.flagEmoji}>{getLanguageFlag(deck.language)}</Text>}
                  mode="outlined"
                  compact
                >
                  {deck.language}
                </Chip>
                <Chip
                  mode="outlined"
                  compact
                  textStyle={{ color: getDifficultyColor(deck.difficulty) }}
                >
                  {deck.difficulty}
                </Chip>
                <Chip mode="outlined" compact>
                  {deck.cardCount} cards
                </Chip>
              </View>
            </View>
            <Menu
              visible={menuVisible === deck.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(deck.id)}
                />
              }
            >
              <Menu.Item
                leadingIcon="school"
                onPress={() => handleStudyDeck(deck)}
                title="Study"
              />
              <Menu.Item
                leadingIcon="plus"
                onPress={() => handleAddCards(deck)}
                title="Add Cards"
              />
              <Menu.Item
                leadingIcon="pencil"
                onPress={() => handleEditDeck(deck)}
                title="Edit"
              />
              <Divider />
              <Menu.Item
                leadingIcon="delete"
                onPress={() => handleDeleteDeck(deck.id)}
                title="Delete"
                titleStyle={{ color: '#ef4444' }}
              />
            </Menu>
          </View>

          <View style={styles.deckStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#6b7280" />
              <Text variant="bodySmall" style={styles.statText}>
                {stats.dueCards} due
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="target" size={16} color="#6b7280" />
              <Text variant="bodySmall" style={styles.statText}>
                {stats.accuracy}% accuracy
              </Text>
            </View>
            {deck.lastStudied && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="calendar" size={16} color="#6b7280" />
                <Text variant="bodySmall" style={styles.statText}>
                  {new Date(deck.lastStudied).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          {isDue && (
            <View style={styles.dueIndicator}>
              <MaterialCommunityIcons name="alert-circle" size={16} color="#f59e0b" />
              <Text variant="bodySmall" style={styles.dueText}>
                {stats.dueCards} cards due for review
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search and Filters */}
        <View style={styles.header}>
          <Searchbar
            placeholder="Search decks..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            <Chip
              selected={filterCategory === 'all'}
              onPress={() => setFilterCategory('all')}
              style={styles.filterChip}
            >
              All Categories
            </Chip>
            {categories.slice(1).map(category => (
              <Chip
                key={category}
                selected={filterCategory === category}
                onPress={() => setFilterCategory(category)}
                style={styles.filterChip}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            <Chip
              selected={filterLanguage === 'all'}
              onPress={() => setFilterLanguage('all')}
              style={styles.filterChip}
            >
              All Languages
            </Chip>
            {languages.slice(1).map(language => (
              <Chip
                key={language}
                selected={filterLanguage === language}
                onPress={() => setFilterLanguage(language)}
                style={styles.filterChip}
              >
                {language}
              </Chip>
            ))}
          </ScrollView>

          <View style={styles.sortContainer}>
            <Text variant="bodySmall" style={styles.sortLabel}>Sort by:</Text>
            <Button
              mode={sortBy === 'name' ? 'contained' : 'outlined'}
              onPress={() => setSortBy('name')}
              compact
              style={styles.sortButton}
            >
              Name
            </Button>
            <Button
              mode={sortBy === 'recent' ? 'contained' : 'outlined'}
              onPress={() => setSortBy('recent')}
              compact
              style={styles.sortButton}
            >
              Recent
            </Button>
            <Button
              mode={sortBy === 'cards' ? 'contained' : 'outlined'}
              onPress={() => setSortBy('cards')}
              compact
              style={styles.sortButton}
            >
              Cards
            </Button>
          </View>
        </View>

        {/* Decks List */}
        <View style={styles.decksContainer}>
          {filteredDecks.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialCommunityIcons name="cards-outline" size={64} color="#9ca3af" />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No decks found
                </Text>
                <Text variant="bodyMedium" style={styles.emptyDescription}>
                  {searchQuery || filterCategory !== 'all' || filterLanguage !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first deck to get started'}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddDeck' as never)}
                  style={styles.emptyButton}
                  icon="plus"
                >
                  Create First Deck
                </Button>
              </Card.Content>
            </Card>
          ) : (
            filteredDecks.map(renderDeckCard)
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddDeck' as never)}
        label="Create Deck"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    marginBottom: 12,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sortLabel: {
    marginRight: 8,
    color: '#6b7280',
  },
  sortButton: {
    marginRight: 8,
  },
  decksContainer: {
    padding: 16,
    paddingTop: 0,
  },
  deckCard: {
    marginBottom: 12,
    elevation: 2,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deckInfo: {
    flex: 1,
  },
  deckName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1f2937',
  },
  deckDescription: {
    color: '#6b7280',
    marginBottom: 8,
  },
  deckMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  flagEmoji: {
    fontSize: 12,
  },
  deckStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#6b7280',
  },
  dueIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 4,
  },
  dueText: {
    color: '#92400e',
    fontWeight: '500',
  },
  emptyCard: {
    marginTop: 40,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#6b7280',
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#9ca3af',
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});

export default DecksScreen; 