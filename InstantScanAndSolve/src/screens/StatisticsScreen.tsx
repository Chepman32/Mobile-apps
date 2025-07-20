import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  SegmentedButtons,
  List,
  Chip,
  Divider,
} from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

import { AppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const StatisticsScreen: React.FC = () => {
  const { state } = useContext(AppContext);
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const statistics = useMemo(() => {
    const scans = state.scans;
    const subjects = state.subjects;
    const sessions = state.sessions;

    // Calculate basic stats
    const totalScans = scans.length;
    const successfulScans = scans.filter(scan => scan.status === 'successful').length;
    const successRate = totalScans > 0 ? (successfulScans / totalScans) * 100 : 0;

    // Calculate average accuracy
    const accuracySum = scans.reduce((sum, scan) => sum + (scan.accuracy || 0), 0);
    const averageAccuracy = totalScans > 0 ? accuracySum / totalScans : 0;

    // Calculate scan duration stats
    const durations = scans.map(scan => scan.processingTime || 0);
    const averageDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    // Most scanned subjects
    const subjectCounts = scans.reduce((acc, scan) => {
      const subjectId = scan.subjectId;
      acc[subjectId] = (acc[subjectId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSubjects = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([subjectId, count]) => {
        const subject = subjects.find(s => s.id === subjectId);
        return { name: subject?.name || 'Unknown', count };
      });

    // Daily scan counts for the selected period
    const now = new Date();
    const periodDays = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const dailyData = Array.from({ length: periodDays }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (periodDays - 1 - i));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayScans = scans.filter(scan => {
        const scanDate = new Date(scan.createdAt);
        return scanDate >= dayStart && scanDate <= dayEnd;
      }).length;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayScans,
      };
    });

    // Subject distribution for pie chart
    const subjectDistribution = subjects.map(subject => {
      const count = scans.filter(scan => scan.subjectId === subject.id).length;
      return {
        name: subject.name,
        count,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      };
    }).filter(item => item.count > 0);

    return {
      totalScans,
      successfulScans,
      successRate,
      averageAccuracy,
      averageDuration,
      topSubjects,
      dailyData,
      subjectDistribution,
    };
  }, [state.scans, state.subjects, state.sessions, selectedPeriod]);

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 27, 31, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const pieChartData = statistics.subjectDistribution.map(item => ({
    name: item.name,
    population: item.count,
    color: item.color,
    legendFontColor: theme.colors.onSurface,
    legendFontSize: 12,
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title="Overview" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {statistics.totalScans}
              </Text>
              <Text variant="bodySmall">Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {statistics.successfulScans}
              </Text>
              <Text variant="bodySmall">Successful</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {statistics.successRate.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {statistics.averageAccuracy.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Avg Accuracy</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Scan Activity" />
        <Card.Content>
          <View style={styles.periodSelector}>
            <SegmentedButtons
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
              buttons={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
          </View>
          
          {statistics.dailyData.length > 0 && (
            <LineChart
              data={{
                labels: statistics.dailyData.map(d => d.date),
                datasets: [{
                  data: statistics.dailyData.map(d => d.count),
                }],
              }}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Subject Distribution" />
        <Card.Content>
          {pieChartData.length > 0 ? (
            <PieChart
              data={pieChartData}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No scan data available
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Top Subjects" />
        <Card.Content>
          {statistics.topSubjects.length > 0 ? (
            statistics.topSubjects.map((subject, index) => (
              <View key={index}>
                <List.Item
                  title={subject.name}
                  description={`${subject.count} scans`}
                  left={(props) => (
                    <View style={styles.rankContainer}>
                      <Text variant="titleMedium" style={styles.rankNumber}>
                        {index + 1}
                      </Text>
                    </View>
                  )}
                  right={() => (
                    <Chip mode="outlined" compact>
                      {subject.count}
                    </Chip>
                  )}
                />
                {index < statistics.topSubjects.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No subjects scanned yet
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Performance Metrics" />
        <Card.Content>
          <List.Item
            title="Average Processing Time"
            description={`${statistics.averageDuration.toFixed(2)} seconds`}
            left={(props) => <List.Icon {...props} icon="clock" />}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Average Accuracy"
            description={`${statistics.averageAccuracy.toFixed(1)}%`}
            left={(props) => <List.Icon {...props} icon="target" />}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Success Rate"
            description={`${statistics.successRate.toFixed(1)}%`}
            left={(props) => <List.Icon {...props} icon="check-circle" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Recent Activity" />
        <Card.Content>
          {state.scans.slice(-5).reverse().map((scan, index) => (
            <View key={scan.id}>
              <List.Item
                title={subjects.find(s => s.id === scan.subjectId)?.name || 'Unknown Subject'}
                description={`${new Date(scan.createdAt).toLocaleDateString()} - ${scan.status}`}
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon={scan.status === 'successful' ? 'check-circle' : 'alert-circle'} 
                    color={scan.status === 'successful' ? theme.colors.primary : theme.colors.error}
                  />
                )}
                right={() => (
                  <Text variant="bodySmall">
                    {scan.accuracy ? `${scan.accuracy.toFixed(1)}%` : 'N/A'}
                  </Text>
                )}
              />
              {index < Math.min(5, state.scans.length) - 1 && <Divider />}
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
    marginVertical: 8,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  periodSelector: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    marginVertical: 20,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  divider: {
    marginVertical: 8,
  },
});

export default StatisticsScreen; 