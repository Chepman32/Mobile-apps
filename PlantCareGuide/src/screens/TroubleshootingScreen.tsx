import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Chip,
  Button,
  List,
  useTheme,
  SegmentedButtons,
  Accordion,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { TroubleshootingTip } from '../types';

export default function TroubleshootingScreen({ navigation }: any) {
  const theme = useTheme();
  const { state } = useContext(PlantCareGuideContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());

  const filteredTips = useMemo(() => {
    let filtered = state.troubleshootingTips;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tip =>
        tip.title.toLowerCase().includes(query) ||
        tip.description.toLowerCase().includes(query) ||
        tip.symptoms.toLowerCase().includes(query) ||
        tip.solutions.some(solution => solution.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tip => tip.category === selectedCategory);
    }

    // Severity filter
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(tip => tip.severity === selectedSeverity);
    }

    return filtered;
  }, [state.troubleshootingTips, searchQuery, selectedCategory, selectedSeverity]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'critical': return '#d32f2f';
      default: return '#666';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'watering': return '💧';
      case 'lighting': return '☀️';
      case 'pests': return '🐛';
      case 'diseases': return '🏥';
      case 'nutrients': return '🌱';
      case 'temperature': return '🌡️';
      case 'humidity': return '💨';
      case 'soil': return '🌍';
      case 'pruning': return '✂️';
      case 'repotting': return '🪴';
      default: return '❓';
    }
  };

  const toggleExpanded = (tipId: string) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded.has(tipId)) {
      newExpanded.delete(tipId);
    } else {
      newExpanded.add(tipId);
    }
    setExpandedTips(newExpanded);
  };

  const renderTipItem = ({ item: tip }: { item: TroubleshootingTip }) => {
    const isExpanded = expandedTips.has(tip.id);
    
    return (
      <Card style={styles.tipCard}>
        <Card.Content>
          <View style={styles.tipHeader}>
            <View style={styles.tipInfo}>
              <Text variant="titleMedium" style={styles.tipTitle}>
                {tip.title}
              </Text>
              <View style={styles.tipMeta}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(tip.category)}</Text>
                <Text variant="bodySmall" style={styles.category}>
                  {tip.category.replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
                <Text style={[styles.severityBadge, { backgroundColor: getSeverityColor(tip.severity) }]}>
                  {getSeverityIcon(tip.severity)} {tip.severity}
                </Text>
              </View>
            </View>
            <Button
              mode="text"
              onPress={() => toggleExpanded(tip.id)}
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </View>

          <Text variant="bodyMedium" style={styles.tipDescription}>
            {tip.description}
          </Text>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Symptoms
              </Text>
              <Text variant="bodyMedium" style={styles.symptoms}>
                {tip.symptoms}
              </Text>

              <Text variant="titleSmall" style={styles.sectionTitle}>
                Solutions
              </Text>
              {tip.solutions.map((solution, index) => (
                <View key={index} style={styles.solutionItem}>
                  <Text style={styles.solutionNumber}>{index + 1}.</Text>
                  <Text variant="bodyMedium" style={styles.solution}>
                    {solution}
                  </Text>
                </View>
              ))}

              {tip.prevention && (
                <>
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Prevention
                  </Text>
                  <Text variant="bodyMedium" style={styles.prevention}>
                    {tip.prevention}
                  </Text>
                </>
              )}

              {tip.additionalNotes && (
                <>
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Additional Notes
                  </Text>
                  <Text variant="bodyMedium" style={styles.notes}>
                    {tip.additionalNotes}
                  </Text>
                </>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const categories = ['watering', 'lighting', 'pests', 'diseases', 'nutrients', 'temperature', 'humidity', 'soil', 'pruning', 'repotting'];
  const severities = ['low', 'medium', 'high', 'critical'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search troubleshooting tips..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <Chip
          selected={selectedCategory === 'all'}
          onPress={() => setSelectedCategory('all')}
          style={styles.filterChip}
          mode="outlined"
        >
          All Categories
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.filterChip}
            mode="outlined"
          >
            {getCategoryIcon(category)} {category.replace(/\b\w/g, l => l.toUpperCase())}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <Chip
          selected={selectedSeverity === 'all'}
          onPress={() => setSelectedSeverity('all')}
          style={styles.filterChip}
          mode="outlined"
        >
          All Severity
        </Chip>
        {severities.map((severity) => (
          <Chip
            key={severity}
            selected={selectedSeverity === severity}
            onPress={() => setSelectedSeverity(severity)}
            style={styles.filterChip}
            mode="outlined"
          >
            {getSeverityIcon(severity)} {severity.replace(/\b\w/g, l => l.toUpperCase())}
          </Chip>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTips}
        renderItem={renderTipItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                No Tips Found
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Try adjusting your search or filters to find troubleshooting tips.
              </Text>
            </Card.Content>
          </Card>
        }
        ListHeaderComponent={
          <Text variant="titleMedium" style={styles.resultsCount}>
            {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''} found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchbar: {
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  resultsCount: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  tipCard: {
    marginBottom: 12,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 16,
  },
  category: {
    color: '#666',
    textTransform: 'capitalize',
  },
  severityBadge: {
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  tipDescription: {
    color: '#333',
    marginBottom: 8,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  symptoms: {
    color: '#333',
    marginBottom: 12,
  },
  solutionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  solutionNumber: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#666',
  },
  solution: {
    flex: 1,
    color: '#333',
  },
  prevention: {
    color: '#333',
    marginBottom: 12,
  },
  notes: {
    color: '#333',
    fontStyle: 'italic',
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 