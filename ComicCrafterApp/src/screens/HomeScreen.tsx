import React, { useEffect } from 'react';
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
  Surface,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { state, loadComics, loadStatistics, loadUserProfile, loadAchievements } = useAppContext();
  const { comics, statistics, userProfile, achievements, loading } = state;

  useEffect(() => {
    loadComics();
    loadStatistics();
    loadUserProfile();
    loadAchievements();
  }, []);

  const onRefresh = async () => {
    await Promise.all([
      loadComics(),
      loadStatistics(),
      loadUserProfile(),
      loadAchievements(),
    ]);
  };

  const recentComics = comics.slice(0, 3);
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const recentAchievements = unlockedAchievements.slice(0, 2);

  if (loading && comics.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <Surface style={styles.welcomeSection}>
        <View style={styles.welcomeHeader}>
          <Avatar.Text 
            size={60} 
            label={userProfile?.username?.charAt(0) || 'C'} 
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.welcomeText}>
            <Title>Welcome back!</Title>
            <Paragraph>
              {userProfile?.username || 'Comic Creator'}
            </Paragraph>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics?.totalComics || 0}</Text>
            <Text style={styles.statLabel}>Comics</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics?.totalPanels || 0}</Text>
            <Text style={styles.statLabel}>Panels</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statistics?.totalCharacters || 0}</Text>
            <Text style={styles.statLabel}>Characters</Text>
          </View>
        </View>
      </Surface>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.quickActions}>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => {/* Navigate to create comic */}}
              style={styles.actionButton}
            >
              New Comic
            </Button>
            <Button
              mode="outlined"
              icon="account-plus"
              onPress={() => {/* Navigate to create character */}}
              style={styles.actionButton}
            >
              New Character
            </Button>
            <Button
              mode="outlined"
              icon="grid"
              onPress={() => {/* Navigate to templates */}}
              style={styles.actionButton}
            >
              Browse Templates
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Comics */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Recent Comics</Title>
            <Button mode="text" onPress={() => {/* Navigate to all comics */}}>
              View All
            </Button>
          </View>
          {recentComics.length > 0 ? (
            recentComics.map((comic) => (
              <List.Item
                key={comic.id}
                title={comic.title}
                description={`${comic.panels.length} panels • ${comic.genre}`}
                left={(props) => (
                  <List.Icon {...props} icon="book-open-variant" />
                )}
                right={(props) => (
                  <Chip 
                    {...props} 
                    mode="outlined" 
                    compact
                    textStyle={{ fontSize: 10 }}
                  >
                    {comic.status}
                  </Chip>
                )}
                onPress={() => {/* Navigate to comic detail */}}
                style={styles.listItem}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color={theme.colors.outline} />
              <Text style={styles.emptyText}>No comics yet</Text>
              <Text style={styles.emptySubtext}>Create your first comic to get started</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Achievements */}
      {recentAchievements.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Recent Achievements</Title>
              <Button mode="text" onPress={() => {/* Navigate to achievements */}}>
                View All
              </Button>
            </View>
            {recentAchievements.map((achievement) => (
              <List.Item
                key={achievement.id}
                title={achievement.name}
                description={achievement.description}
                left={(props) => (
                  <List.Icon {...props} icon="trophy" color={theme.colors.primary} />
                )}
                style={styles.listItem}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Statistics Overview */}
      {statistics && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Your Progress</Title>
            <View style={styles.progressGrid}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>
                  {statistics.completedComics}
                </Text>
                <Text style={styles.progressLabel}>Completed</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>
                  {statistics.customCharacters}
                </Text>
                <Text style={styles.progressLabel}>Custom Characters</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>
                  {Math.round(statistics.averageComicsPerMonth * 10) / 10}
                </Text>
                <Text style={styles.progressLabel}>Avg/Month</Text>
              </View>
            </View>
            
            {Object.keys(statistics.genreStats).length > 0 && (
              <View style={styles.genreSection}>
                <Text style={styles.genreTitle}>Favorite Genres</Text>
                <View style={styles.genreChips}>
                  {Object.entries(statistics.genreStats)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([genre, count]) => (
                      <Chip key={genre} style={styles.genreChip}>
                        {genre} ({count})
                      </Chip>
                    ))}
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Tips Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>💡 Tips</Title>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>
              • Use templates to get started quickly
            </Text>
            <Text style={styles.tipText}>
              • Create custom characters for unique stories
            </Text>
            <Text style={styles.tipText}>
              • Experiment with different panel layouts
            </Text>
            <Text style={styles.tipText}>
              • Save your work regularly
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  welcomeSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    marginLeft: 16,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '30%',
  },
  listItem: {
    paddingVertical: 4,
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
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  genreSection: {
    marginTop: 16,
  },
  genreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  tipsList: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default HomeScreen;
