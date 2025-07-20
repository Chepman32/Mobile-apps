import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Searchbar,
  SegmentedButtons,
  useTheme,
  ActivityIndicator,
  Surface,
  Text,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Template } from '../types';

const { width } = Dimensions.get('window');

const TemplatesScreen: React.FC = () => {
  const theme = useTheme();
  const { state, loadTemplates, getTemplatesByGenre } = useAppContext();
  const { templates, loading } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const genres = ['all', 'superhero', 'slice-of-life', 'sci-fi', 'fantasy', 'mystery', 'comedy'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    loadTemplates();
  }, []);

  const onRefresh = async () => {
    await loadTemplates();
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === 'all' || template.genre === selectedGenre;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesGenre && matchesDifficulty;
  });

  const getGenreIcon = (genre: string) => {
    switch (genre) {
      case 'superhero': return '🦸';
      case 'slice-of-life': return '🏠';
      case 'sci-fi': return '🚀';
      case 'fantasy': return '🐉';
      case 'mystery': return '🔍';
      case 'comedy': return '😄';
      default: return '📚';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#666';
    }
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to editor with template
    console.log('Using template:', template.name);
  };

  if (loading && templates.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {/* Search and Filters */}
        <Card style={styles.card}>
          <Card.Content>
            <Searchbar
              placeholder="Search templates..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />
            
            <Text style={styles.filterLabel}>Genre</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {genres.map((genre) => (
                <Chip
                  key={genre}
                  selected={selectedGenre === genre}
                  onPress={() => setSelectedGenre(genre)}
                  style={styles.filterChip}
                  textStyle={styles.filterChipText}
                >
                  {genre === 'all' ? 'All' : genre.replace('-', ' ')}
                </Chip>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Difficulty</Text>
            <SegmentedButtons
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
              buttons={difficulties.map(difficulty => ({
                value: difficulty,
                label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
              }))}
              style={styles.difficultyFilter}
            />
          </Card.Content>
        </Card>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <View style={styles.templatesGrid}>
            {filteredTemplates.map((template) => (
              <Card key={template.id} style={styles.templateCard}>
                <Card.Content>
                  <View style={styles.templateHeader}>
                    <Avatar.Text
                      size={60}
                      label={getGenreIcon(template.genre)}
                      style={styles.templateIcon}
                    />
                    <View style={styles.templateInfo}>
                      <Title numberOfLines={2}>{template.name}</Title>
                      <Paragraph numberOfLines={3} style={styles.templateDescription}>
                        {template.description}
                      </Paragraph>
                    </View>
                  </View>
                  
                  <View style={styles.templateDetails}>
                    <View style={styles.templateStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{template.panels.length}</Text>
                        <Text style={styles.statLabel}>Panels</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{template.characters.length}</Text>
                        <Text style={styles.statLabel}>Characters</Text>
                      </View>
                    </View>
                    
                    <View style={styles.templateTags}>
                      <Chip 
                        mode="outlined" 
                        compact
                        textStyle={{ color: getDifficultyColor(template.difficulty) }}
                      >
                        {template.difficulty}
                      </Chip>
                      <Chip mode="outlined" compact>
                        {template.genre}
                      </Chip>
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode="contained" 
                    onPress={() => handleUseTemplate(template)}
                    style={styles.useButton}
                  >
                    Use Template
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => {/* View template details */}}
                  >
                    Details
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.emptyState}>
                <Ionicons name="grid-outline" size={48} color={theme.colors.outline} />
                <Text style={styles.emptyText}>
                  {searchQuery || selectedGenre !== 'all' || selectedDifficulty !== 'all'
                    ? 'No templates match your filters' 
                    : 'No templates available'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery || selectedGenre !== 'all' || selectedDifficulty !== 'all'
                    ? 'Try adjusting your search or filters' 
                    : 'Templates will be available soon'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Template Categories Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Template Categories</Title>
            <View style={styles.categoryInfo}>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>🦸</Text>
                <View style={styles.categoryText}>
                  <Text style={styles.categoryTitle}>Superhero</Text>
                  <Text style={styles.categoryDescription}>
                    Epic adventures with heroes and villains
                  </Text>
                </View>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>🏠</Text>
                <View style={styles.categoryText}>
                  <Text style={styles.categoryTitle}>Slice of Life</Text>
                  <Text style={styles.categoryDescription}>
                    Everyday moments and emotions
                  </Text>
                </View>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>🚀</Text>
                <View style={styles.categoryText}>
                  <Text style={styles.categoryTitle}>Sci-Fi</Text>
                  <Text style={styles.categoryDescription}>
                    Futuristic and technological stories
                  </Text>
                </View>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>🐉</Text>
                <View style={styles.categoryText}>
                  <Text style={styles.categoryTitle}>Fantasy</Text>
                  <Text style={styles.categoryDescription}>
                    Magical worlds and creatures
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  searchbar: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
  },
  difficultyFilter: {
    marginBottom: 8,
  },
  templatesGrid: {
    paddingHorizontal: 16,
  },
  templateCard: {
    marginBottom: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  templateIcon: {
    marginRight: 16,
  },
  templateInfo: {
    flex: 1,
  },
  templateDescription: {
    marginTop: 4,
    color: '#666',
  },
  templateDetails: {
    marginBottom: 16,
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  templateTags: {
    flexDirection: 'row',
    gap: 8,
  },
  useButton: {
    flex: 1,
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  categoryInfo: {
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default TemplatesScreen; 