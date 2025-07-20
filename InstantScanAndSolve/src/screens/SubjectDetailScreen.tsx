import React, { useContext, useMemo } from 'react';
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
  List,
  Chip,
  Divider,
  Button,
  ProgressBar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useRoute, useNavigation } from '@react-navigation/native';

import { AppContext } from '../context/AppContext';
import { Subject, Scan } from '../types';

const { width } = Dimensions.get('window');

const SubjectDetailScreen: React.FC = () => {
  const { state } = useContext(AppContext);
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  
  const subjectId = route.params?.subjectId;
  const subject = state.subjects.find(s => s.id === subjectId);

  const subjectData = useMemo(() => {
    if (!subject) return null;

    const subjectScans = state.scans.filter(scan => scan.subjectId === subjectId);
    const successfulScans = subjectScans.filter(scan => scan.status === 'successful');
    const successRate = subjectScans.length > 0 ? (successfulScans.length / subjectScans.length) * 100 : 0;
    
    const averageAccuracy = successfulScans.length > 0 
      ? successfulScans.reduce((sum, scan) => sum + (scan.accuracy || 0), 0) / successfulScans.length 
      : 0;
    
    const averageProcessingTime = subjectScans.length > 0
      ? subjectScans.reduce((sum, scan) => sum + (scan.processingTime || 0), 0) / subjectScans.length
      : 0;

    // Group scans by date for chart
    const scansByDate = subjectScans.reduce((acc, scan) => {
      const date = new Date(scan.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          count: 0,
          accuracy: 0,
          successful: 0,
        };
      }
      acc[date].count++;
      if (scan.status === 'successful') {
        acc[date].successful++;
        acc[date].accuracy += scan.accuracy || 0;
      }
      return acc;
    }, {} as Record<string, any>);

    const chartData = Object.values(scansByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: item.count,
        accuracy: item.successful > 0 ? item.accuracy / item.successful : 0,
      }));

    // Recent scans
    const recentScans = subjectScans
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return {
      subject,
      totalScans: subjectScans.length,
      successfulScans: successfulScans.length,
      successRate,
      averageAccuracy,
      averageProcessingTime,
      chartData,
      recentScans,
    };
  }, [subject, state.scans, subjectId]);

  if (!subjectData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorText}>
              Subject not found
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return theme.colors.primary;
      case 'failed': return theme.colors.error;
      case 'processing': return theme.colors.secondary;
      default: return theme.colors.outline;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      case 'processing': return 'time';
      default: return 'help-circle';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title 
          title={subjectData.subject.name}
          subtitle={subjectData.subject.description}
        />
        <Card.Content>
          <View style={styles.subjectInfo}>
            <View style={styles.subjectIcon}>
              <Ionicons name="book" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.subjectDetails}>
              <Text variant="bodyMedium" style={styles.subjectDescription}>
                {subjectData.subject.description}
              </Text>
              <View style={styles.subjectTags}>
                <Chip mode="outlined" compact style={styles.tag}>
                  {subjectData.subject.category}
                </Chip>
                <Chip mode="outlined" compact style={styles.tag}>
                  {subjectData.subject.difficulty}
                </Chip>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Statistics" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {subjectData.totalScans}
              </Text>
              <Text variant="bodySmall">Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {subjectData.successfulScans}
              </Text>
              <Text variant="bodySmall">Successful</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {subjectData.successRate.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {subjectData.averageAccuracy.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Avg Accuracy</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Performance Metrics" />
        <Card.Content>
          <List.Item
            title="Success Rate"
            description={`${subjectData.successfulScans} out of ${subjectData.totalScans} scans successful`}
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            right={() => (
              <View style={styles.metricValue}>
                <Text variant="titleMedium">{subjectData.successRate.toFixed(1)}%</Text>
                <ProgressBar 
                  progress={subjectData.successRate / 100} 
                  color={theme.colors.primary}
                  style={styles.metricProgress}
                />
              </View>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Average Accuracy"
            description="Accuracy of successful scans"
            left={(props) => <List.Icon {...props} icon="target" />}
            right={() => (
              <View style={styles.metricValue}>
                <Text variant="titleMedium">{subjectData.averageAccuracy.toFixed(1)}%</Text>
                <ProgressBar 
                  progress={subjectData.averageAccuracy / 100} 
                  color={theme.colors.secondary}
                  style={styles.metricProgress}
                />
              </View>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Average Processing Time"
            description="Time to process each scan"
            left={(props) => <List.Icon {...props} icon="clock" />}
            right={() => (
              <Text variant="titleMedium">{subjectData.averageProcessingTime.toFixed(2)}s</Text>
            )}
          />
        </Card.Content>
      </Card>

      {subjectData.chartData.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Scan Activity" />
          <Card.Content>
            <LineChart
              data={{
                labels: subjectData.chartData.map(d => d.date),
                datasets: [{
                  data: subjectData.chartData.map(d => d.count),
                }],
              }}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Title title="Recent Scans" />
        <Card.Content>
          {subjectData.recentScans.length > 0 ? (
            subjectData.recentScans.map((scan, index) => (
              <View key={scan.id}>
                <List.Item
                  title={`Scan ${scan.id.slice(0, 8)}`}
                  description={`${new Date(scan.createdAt).toLocaleDateString()} - ${scan.processingTime?.toFixed(2)}s`}
                  left={(props) => (
                    <List.Icon 
                      {...props} 
                      icon={getStatusIcon(scan.status)} 
                      color={getStatusColor(scan.status)}
                    />
                  )}
                  right={() => (
                    <View style={styles.scanDetails}>
                      {scan.accuracy && (
                        <Text variant="bodySmall" style={styles.accuracyText}>
                          {scan.accuracy.toFixed(1)}%
                        </Text>
                      )}
                      <Chip 
                        mode="outlined" 
                        compact 
                        textStyle={{ fontSize: 10 }}
                        style={{ borderColor: getStatusColor(scan.status) }}
                      >
                        {scan.status}
                      </Chip>
                    </View>
                  )}
                  onPress={() => {
                    // Navigate to scan detail or result screen
                    navigation.navigate('Result' as never, { scanId: scan.id } as never);
                  }}
                />
                {index < subjectData.recentScans.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No scans for this subject yet
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Actions" />
        <Card.Content>
          <Button
            mode="contained"
            icon="camera"
            onPress={() => {
              navigation.navigate('Camera' as never, { subjectId } as never);
            }}
            style={styles.actionButton}
          >
            Scan This Subject
          </Button>
          <Button
            mode="outlined"
            icon="chart-line"
            onPress={() => {
              navigation.navigate('Statistics' as never);
            }}
            style={styles.actionButton}
          >
            View All Statistics
          </Button>
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
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subjectIcon: {
    marginRight: 16,
  },
  subjectDetails: {
    flex: 1,
  },
  subjectDescription: {
    marginBottom: 12,
  },
  subjectTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    marginRight: 8,
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
  metricValue: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  metricProgress: {
    width: 60,
    height: 4,
    marginTop: 4,
  },
  divider: {
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  scanDetails: {
    alignItems: 'flex-end',
  },
  accuracyText: {
    marginBottom: 4,
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    marginVertical: 20,
  },
  actionButton: {
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default SubjectDetailScreen; 