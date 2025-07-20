import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
  ActivityIndicator,
  Text,
  useTheme,
  SegmentedButtons,
  Searchbar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { usePlantCareGuide } from '../context/PlantCareGuideContext';
import { RootStackParamList } from '../types/navigation';
import { PlantCareTips, TroubleshootingTip, PlantCategory } from '../types';

type TipsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function TipsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<TipsScreenNavigationProp>();
  const { state, loadReferenceData } = usePlantCareGuide();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tips' | 'troubleshooting' | 'categories'>('tips');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await loadReferenceData();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getFilteredTips = () => {
    let tips = state.plantCareTips;

    // Filter by search query
    if (searchQuery) {
      tips = tips.filter(tip => 
        tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      tips = tips.filter(tip => tip.category === filterCategory);
    }

    // Filter by difficulty
    if (filterDifficulty !== 'all') {
      tips = tips.filter(tip => tip.difficulty === filterDifficulty);
    }

    return tips;
  };

  const getFilteredTroubleshooting = () => {
    let troubleshooting = state.troubleshootingTips;

    // Filter by search query
    if (searchQuery) {
      troubleshooting = troubleshooting.filter(tip => 
        tip.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.solution.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return troubleshooting;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.primary;
      case 'intermediate': return theme.colors.secondary;
      case 'advanced': return '#FF9800';
      default: return theme.colors.outline;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'star';
      case 'intermediate': return 'star-half';
      case 'advanced': return 'star-outline';
      default: return 'help-circle';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'watering': return 'water';
      case 'light': return 'white-balance-sunny';
      case 'soil': return 'soil';
      case 'fertilizing': return 'leaf';
      case 'repotting': return 'flower-pot';
      case 'pruning': return 'scissors-cutting';
      case 'pest-control': return 'bug';
      case 'propagation': return 'sprout';
      default: return 'leaf';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'watering': return theme.colors.primary;
      case 'light': return '#FF9800';
      case 'soil': return '#8D6E63';
      case 'fertilizing': return theme.colors.secondary;
      case 'repotting': return '#9C27B0';
      case 'pruning': return '#E91E63';
      case 'pest-control': return theme.colors.error;
      case 'propagation': return '#4CAF50';
      default: return theme.colors.outline;
    }
  };

  const filteredTips = getFilteredTips();
  const filteredTroubleshooting = getFilteredTroubleshooting();

  if (state.loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading plant care tips...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'tips' | 'troubleshooting' | 'categories')}
          buttons={[
            { value: 'tips', label: 'Care Tips' },
            { value: 'troubleshooting', label: 'Troubleshooting' },
            { value: 'categories', label: 'Categories' },
          ]}
          style={styles.tabButtons}
        />
      </View>

      {/* Search and Filters */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search tips..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        {activeTab === 'tips' && (
          <View style={styles.filterContainer}>
            <SegmentedButtons
              value={filterCategory}
              onValueChange={setFilterCategory}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'Watering', label: 'Watering' },
                { value: 'Light', label: 'Light' },
                { value: 'Soil', label: 'Soil' },
                { value: 'Fertilizing', label: 'Fertilizing' },
              ]}
              style={styles.filterButtons}
            />
            
            <SegmentedButtons
              value={filterDifficulty}
              onValueChange={setFilterDifficulty}
              buttons={[
                { value: 'all', label: 'All Levels' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              style={styles.difficultyButtons}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'tips' && (
          <>
            {filteredTips.length === 0 ? (
              <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content style={styles.emptyContent}>
                  <Ionicons 
                    name="book-outline" 
                    size={64} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Title style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                    No tips found
                  </Title>
                  <Paragraph style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                    {searchQuery || filterCategory !== 'all' || filterDifficulty !== 'all'
                      ? 'No tips match your filters. Try adjusting your search.'
                      : 'Plant care tips will appear here as you add them.'
                    }
                  </Paragraph>
                </Card.Content>
              </Card>
            ) : (
              filteredTips.map((tip) => (
                <Card key={tip.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                  <Card.Content>
                    <View style={styles.tipHeader}>
                      <Avatar.Icon
                        size={50}
                        icon={getCategoryIcon(tip.category)}
                        style={{ backgroundColor: getCategoryColor(tip.category) }}
                      />
                      <View style={styles.tipInfo}>
                        <Title style={{ color: theme.colors.onSurface }}>
                          {tip.title}
                        </Title>
                        <View style={styles.tipMeta}>
                          <Chip
                            mode="outlined"
                            textStyle={{ fontSize: 10 }}
                            style={{ marginRight: 8 }}
                          >
                            {tip.category}
                          </Chip>
                          <Chip
                            mode="outlined"
                            textStyle={{ fontSize: 10 }}
                            style={{ 
                              marginRight: 8,
                              borderColor: getDifficultyColor(tip.difficulty),
                            }}
                          >
                            {tip.difficulty}
                          </Chip>
                        </View>
                      </View>
                    </View>
                    
                    <Paragraph style={[styles.tipContent, { color: theme.colors.onSurfaceVariant }]}>
                      {tip.content}
                    </Paragraph>
                    
                    {tip.tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {tip.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            mode="outlined"
                            textStyle={{ fontSize: 10 }}
                            style={{ marginRight: 8, marginBottom: 4 }}
                          >
                            {tag}
                          </Chip>
                        ))}
                      </View>
                    )}
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}

        {activeTab === 'troubleshooting' && (
          <>
            {filteredTroubleshooting.length === 0 ? (
              <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content style={styles.emptyContent}>
                  <Ionicons 
                    name="bug-outline" 
                    size={64} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Title style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                    No troubleshooting guides found
                  </Title>
                  <Paragraph style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                    {searchQuery
                      ? 'No troubleshooting guides match your search.'
                      : 'Troubleshooting guides will appear here as you add them.'
                    }
                  </Paragraph>
                </Card.Content>
              </Card>
            ) : (
              filteredTroubleshooting.map((tip) => (
                <Card key={tip.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                  <Card.Content>
                    <Title style={{ color: theme.colors.onSurface }}>
                      {tip.symptom}
                    </Title>
                    
                    <View style={styles.troubleshootingSection}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                        Cause:
                      </Text>
                      <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                        {tip.cause}
                      </Paragraph>
                    </View>
                    
                    <View style={styles.troubleshootingSection}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
                        Solution:
                      </Text>
                      <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                        {tip.solution}
                      </Paragraph>
                    </View>
                    
                    <View style={styles.troubleshootingSection}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.tertiary }]}>
                        Prevention:
                      </Text>
                      <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                        {tip.prevention}
                      </Paragraph>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}

        {activeTab === 'categories' && (
          <>
            {state.plantCategories.length === 0 ? (
              <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content style={styles.emptyContent}>
                  <Ionicons 
                    name="folder-outline" 
                    size={64} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Title style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                    No plant categories found
                  </Title>
                  <Paragraph style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                    Plant categories will appear here as you add them.
                  </Paragraph>
                </Card.Content>
              </Card>
            ) : (
              state.plantCategories.map((category) => (
                <Card key={category.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                  <Card.Content>
                    <View style={styles.categoryHeader}>
                      <Avatar.Icon
                        size={50}
                        icon={category.icon}
                        style={{ backgroundColor: category.color }}
                      />
                      <View style={styles.categoryInfo}>
                        <Title style={{ color: theme.colors.onSurface }}>
                          {category.name}
                        </Title>
                        <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                          {category.description}
                        </Paragraph>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  tabContainer: {
    padding: 16,
  },
  tabButtons: {
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButtons: {
    marginBottom: 16,
  },
  difficultyButtons: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tipMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tipContent: {
    marginBottom: 16,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  troubleshootingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
  },
}); 