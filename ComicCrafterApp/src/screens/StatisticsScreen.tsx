import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Surface,
  useTheme,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const StatisticsScreen: React.FC = () => {
  const theme = useTheme();
  const { state, loadStatistics, loadComics, loadCharacters } = useAppContext();
  const { statistics, comics, characters, loading } = state;

  useEffect(() => {
    loadStatistics();
    loadComics();
    loadCharacters();
  }, []);

  if (loading && !statistics) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!statistics) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>No statistics available</Text>
      </View>
    );
  }

  // Chart data
  const genreData = Object.entries(statistics.genreStats).map(([genre, count]) => ({
    name: genre,
    population: count,
    color: getGenreColor(genre),
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2, 4, 3, 6, 5, 8], // Mock data - would be real monthly stats
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const progressData = {
    labels: ['Comics', 'Panels', 'Characters'],
    data: [
      statistics.totalComics / Math.max(statistics.totalComics, 1),
      statistics.totalPanels / Math.max(statistics.totalPanels, 1),
      statistics.totalCharacters / Math.max(statistics.totalCharacters, 1),
    ],
  };

  function getGenreColor(genre: string): string {
    const colors = {
      superhero: '#FF6B6B',
      'slice-of-life': '#4ECDC4',
      'sci-fi': '#45B7D1',
      fantasy: '#96CEB4',
      mystery: '#FFEAA7',
      comedy: '#DDA0DD',
    };
    return colors[genre as keyof typeof colors] || '#999';
  }

  return (
    <ScrollView style={styles.container}>
      {/* Overview Cards */}
      <View style={styles.overviewGrid}>
        <Surface style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="book" size={24} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{statistics.totalComics}</Text>
            <Text style={styles.statLabel}>Total Comics</Text>
          </View>
        </Surface>

        <Surface style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="grid" size={24} color={theme.colors.secondary} />
            <Text style={styles.statNumber}>{statistics.totalPanels}</Text>
            <Text style={styles.statLabel}>Total Panels</Text>
          </View>
        </Surface>

        <Surface style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="people" size={24} color={theme.colors.tertiary} />
            <Text style={styles.statNumber}>{statistics.totalCharacters}</Text>
            <Text style={styles.statLabel}>Characters</Text>
          </View>
        </Surface>

        <Surface style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{statistics.completedComics}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </Surface>
      </View>

      {/* Progress Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Your Progress</Title>
          <View style={styles.chartContainer}>
            <BarChart
              data={{
                labels: progressData.labels,
                datasets: [
                  {
                    data: progressData.data,
                  },
                ],
              }}
              width={width - 64}
              height={200}
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7,
              }}
              style={styles.chart}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Genre Distribution */}
      {genreData.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Genre Distribution</Title>
            <View style={styles.chartContainer}>
              <PieChart
                data={genreData}
                width={width - 64}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
            <View style={styles.genreLegend}>
              {genreData.map((item) => (
                <Chip
                  key={item.name}
                  style={[styles.genreChip, { backgroundColor: item.color + '20' }]}
                  textStyle={{ color: item.color }}
                >
                  {item.name} ({item.population})
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Monthly Activity */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Monthly Activity</Title>
          <View style={styles.chartContainer}>
            <LineChart
              data={monthlyData}
              width={width - 64}
              height={200}
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: theme.colors.primary,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Detailed Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Detailed Statistics</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Average Comics/Month</Text>
              <Text style={styles.statValue}>
                {Math.round(statistics.averageComicsPerMonth * 10) / 10}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Custom Characters</Text>
              <Text style={styles.statValue}>{statistics.customCharacters}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Completion Rate</Text>
              <Text style={styles.statValue}>
                {statistics.totalComics > 0 
                  ? Math.round((statistics.completedComics / statistics.totalComics) * 100)
                  : 0}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Avg Panels/Comic</Text>
              <Text style={styles.statValue}>
                {statistics.totalComics > 0 
                  ? Math.round(statistics.totalPanels / statistics.totalComics)
                  : 0}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      {statistics.recentActivity.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Activity</Title>
            {statistics.recentActivity.map((comic, index) => (
              <View key={comic.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="book-outline" size={16} color={theme.colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{comic.title}</Text>
                  <Text style={styles.activitySubtitle}>
                    {comic.panels.length} panels • {comic.genre} • {comic.status}
                  </Text>
                </View>
                <Text style={styles.activityDate}>
                  {new Date(comic.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Tips */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>💡 Tips to Improve</Title>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>
              • Try different genres to expand your creativity
            </Text>
            <Text style={styles.tipText}>
              • Complete more comics to increase your completion rate
            </Text>
            <Text style={styles.tipText}>
              • Create custom characters for unique stories
            </Text>
            <Text style={styles.tipText}>
              • Aim for consistent monthly activity
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  genreLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  genreChip: {
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  statItem: {
    width: '50%',
    paddingVertical: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
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

export default StatisticsScreen; 