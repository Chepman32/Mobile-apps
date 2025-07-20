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
  Text,
  ActivityIndicator,
  useTheme,
  Searchbar,
  SegmentedButtons,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, Session, Challenge } from '../types';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

export default function HistoryScreen() {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const theme = useTheme();
  const { state, loadSessions, deleteSession } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const { sessions, challenges, loading } = state;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await loadSessions();
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1: return '😞';
      case 2: return '😐';
      case 3: return '😊';
      case 4: return '😄';
      case 5: return '🤩';
      default: return '😊';
    }
  };

  const getStatusColor = (completed: boolean) => {
    return completed ? theme.colors.primary : theme.colors.tertiary;
  };

  const getStatusText = (completed: boolean) => {
    return completed ? 'Completed' : 'In Progress';
  };

  const filterSessions = () => {
    let filtered = sessions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus === 'completed') {
      filtered = filtered.filter(session => session.completed);
    } else if (filterStatus === 'in-progress') {
      filtered = filtered.filter(session => !session.completed);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(session => session.challenge.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(session => session.challenge.difficulty === selectedDifficulty);
    }

    return filtered;
  };

  const sortSessions = (sessionsToSort: Session[]) => {
    switch (sortBy) {
      case 'date':
        return sessionsToSort.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      case 'duration':
        return sessionsToSort.sort((a, b) => b.duration - a.duration);
      case 'name':
        return sessionsToSort.sort((a, b) => a.challenge.name.localeCompare(b.challenge.name));
      case 'difficulty':
        return sessionsToSort.sort((a, b) => {
          const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
          return difficultyOrder[a.challenge.difficulty] - difficultyOrder[b.challenge.difficulty];
        });
      default:
        return sessionsToSort;
    }
  };

  const getFilteredAndSortedSessions = () => {
    const filtered = filterSessions();
    return sortSessions(filtered);
  };

  const getCategoryOptions = () => {
    const categories = ['all', ...new Set(challenges.map(c => c.category))];
    return categories.map(category => ({
      value: category,
      label: category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1),
    }));
  };

  const getDifficultyOptions = () => {
    const difficulties = ['all', 'easy', 'medium', 'hard', 'expert'];
    return difficulties.map(difficulty => ({
      value: difficulty,
      label: difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    }));
  };

  const getStats = () => {
    const filteredSessions = getFilteredAndSortedSessions();
    const totalSessions = filteredSessions.length;
    const completedSessions = filteredSessions.filter(s => s.completed).length;
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const averageDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;

    return {
      totalSessions,
      completedSessions,
      totalMinutes,
      averageDuration,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
    };
  };

  const stats = getStats();
  const filteredSessions = getFilteredAndSortedSessions();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search and Filter Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Searchbar
            placeholder="Search sessions..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <View style={styles.filterRow}>
            <SegmentedButtons
              value={filterStatus}
              onValueChange={setFilterStatus}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'completed', label: 'Completed' },
                { value: 'in-progress', label: 'In Progress' },
              ]}
              style={styles.filterButtons}
            />
            
            <Button
              mode="outlined"
              icon="filter"
              onPress={() => setShowFilterDialog(true)}
              style={styles.filterButton}
            >
              Filter
            </Button>
          </View>

          <SegmentedButtons
            value={sortBy}
            onValueChange={setSortBy}
            buttons={[
              { value: 'date', label: 'Date' },
              { value: 'duration', label: 'Duration' },
              { value: 'name', label: 'Name' },
              { value: 'difficulty', label: 'Difficulty' },
            ]}
            style={styles.sortButtons}
          />
        </Card.Content>
      </Card>

      {/* Statistics */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Session Statistics</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedSessions}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatDuration(stats.totalMinutes)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(stats.completionRate)}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Sessions List */}
      <ScrollView
        style={styles.sessionsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session, index) => (
            <Card key={session.id} style={styles.sessionCard}>
              <Card.Content>
                <View style={styles.sessionHeader}>
                  <Avatar.Text
                    size={50}
                    label={session.challenge.icon}
                    style={{ backgroundColor: session.challenge.color }}
                  />
                  <View style={styles.sessionInfo}>
                    <Title style={styles.sessionTitle}>{session.challenge.name}</Title>
                    <Paragraph style={styles.sessionDescription}>
                      {session.challenge.description}
                    </Paragraph>
                    <View style={styles.sessionMeta}>
                      <Chip mode="outlined" style={styles.metaChip}>
                        {session.challenge.difficulty}
                      </Chip>
                      <Chip mode="outlined" style={styles.metaChip}>
                        {session.challenge.category}
                      </Chip>
                      <Chip
                        mode="flat"
                        style={[styles.statusChip, { backgroundColor: getStatusColor(session.completed) }]}
                      >
                        {getStatusText(session.completed)}
                      </Chip>
                    </View>
                  </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.sessionDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Started:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(session.startedAt)} at {formatTime(session.startedAt)}
                    </Text>
                  </View>
                  
                  {session.completedAt && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Completed:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(session.completedAt)} at {formatTime(session.completedAt)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{formatDuration(session.duration)}</Text>
                  </View>

                  {session.interruptions > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Interruptions:</Text>
                      <Text style={styles.detailValue}>{session.interruptions}</Text>
                    </View>
                  )}

                  {session.moodAfter && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Mood:</Text>
                      <Text style={styles.detailValue}>
                        {getMoodEmoji(session.moodAfter)} ({session.moodAfter}/5)
                      </Text>
                    </View>
                  )}

                  {session.notes && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Notes:</Text>
                      <Text style={styles.detailValue}>{session.notes}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.sessionActions}>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('Session', { sessionId: session.id })}
                    style={styles.actionButton}
                  >
                    View Details
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleDeleteSession(session.id)}
                    style={[styles.actionButton, { borderColor: theme.colors.error }]}
                    textColor={theme.colors.error}
                  >
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No sessions found</Text>
              <Paragraph style={styles.emptyDescription}>
                {searchQuery || filterStatus !== 'all' || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your first detox session to see it here'}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Filter Dialog */}
      <Portal>
        <Dialog visible={showFilterDialog} onDismiss={() => setShowFilterDialog(false)}>
          <Dialog.Title>Filter Sessions</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogLabel}>Category</Text>
            <SegmentedButtons
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              buttons={getCategoryOptions()}
              style={styles.dialogButtons}
            />
            
            <Text style={styles.dialogLabel}>Difficulty</Text>
            <SegmentedButtons
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
              buttons={getDifficultyOptions()}
              style={styles.dialogButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}>
              Clear All
            </Button>
            <Button onPress={() => setShowFilterDialog(false)}>Done</Button>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  searchbar: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButtons: {
    flex: 1,
  },
  filterButton: {
    marginLeft: 8,
  },
  sortButtons: {
    marginTop: 8,
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sessionsList: {
    flex: 1,
    marginHorizontal: 16,
  },
  sessionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sessionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  statusChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  sessionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyCard: {
    marginTop: 32,
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#666',
  },
  dialogLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  dialogButtons: {
    marginBottom: 16,
  },
});

