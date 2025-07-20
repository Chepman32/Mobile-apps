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
import { ScanSession, Scan } from '../types';

const { width } = Dimensions.get('window');

const ScanSessionScreen: React.FC = () => {
  const { state } = useContext(AppContext);
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  
  const sessionId = route.params?.sessionId;
  const session = state.sessions.find(s => s.id === sessionId);

  const sessionData = useMemo(() => {
    if (!session) return null;

    const sessionScans = state.scans.filter(scan => session.scanIds.includes(scan.id));
    const successfulScans = sessionScans.filter(scan => scan.status === 'successful');
    const successRate = sessionScans.length > 0 ? (successfulScans.length / sessionScans.length) * 100 : 0;
    
    const averageAccuracy = successfulScans.length > 0 
      ? successfulScans.reduce((sum, scan) => sum + (scan.accuracy || 0), 0) / successfulScans.length 
      : 0;
    
    const totalProcessingTime = sessionScans.reduce((sum, scan) => sum + (scan.processingTime || 0), 0);
    const averageProcessingTime = sessionScans.length > 0 ? totalProcessingTime / sessionScans.length : 0;

    // Calculate session duration
    const sessionStart = new Date(session.startTime);
    const sessionEnd = session.endTime ? new Date(session.endTime) : new Date();
    const sessionDuration = (sessionEnd.getTime() - sessionStart.getTime()) / 1000; // in seconds

    // Group scans by subject
    const scansBySubject = sessionScans.reduce((acc, scan) => {
      const subject = state.subjects.find(s => s.id === scan.subjectId);
      const subjectName = subject?.name || 'Unknown';
      
      if (!acc[subjectName]) {
        acc[subjectName] = {
          name: subjectName,
          count: 0,
          successful: 0,
          totalAccuracy: 0,
        };
      }
      
      acc[subjectName].count++;
      if (scan.status === 'successful') {
        acc[subjectName].successful++;
        acc[subjectName].totalAccuracy += scan.accuracy || 0;
      }
      
      return acc;
    }, {} as Record<string, any>);

    const subjectBreakdown = Object.values(scansBySubject).map(subject => ({
      name: subject.name,
      count: subject.count,
      successRate: subject.count > 0 ? (subject.successful / subject.count) * 100 : 0,
      averageAccuracy: subject.successful > 0 ? subject.totalAccuracy / subject.successful : 0,
    }));

    // Timeline data for chart
    const timelineData = sessionScans
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((scan, index) => ({
        index: index + 1,
        accuracy: scan.accuracy || 0,
        processingTime: scan.processingTime || 0,
        status: scan.status,
      }));

    return {
      session,
      totalScans: sessionScans.length,
      successfulScans: successfulScans.length,
      successRate,
      averageAccuracy,
      averageProcessingTime,
      totalProcessingTime,
      sessionDuration,
      subjectBreakdown,
      timelineData,
      sessionScans,
    };
  }, [session, state.scans, state.subjects, sessionId]);

  if (!sessionData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorText}>
              Session not found
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title 
          title={`Session ${sessionData.session.id.slice(0, 8)}`}
          subtitle={`${new Date(sessionData.session.startTime).toLocaleDateString()}`}
        />
        <Card.Content>
          <View style={styles.sessionInfo}>
            <View style={styles.sessionIcon}>
              <Ionicons name="timer" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.sessionDetails}>
              <Text variant="bodyMedium" style={styles.sessionDescription}>
                Started at {new Date(sessionData.session.startTime).toLocaleTimeString()}
              </Text>
              {sessionData.session.endTime && (
                <Text variant="bodyMedium" style={styles.sessionDescription}>
                  Ended at {new Date(sessionData.session.endTime).toLocaleTimeString()}
                </Text>
              )}
              <Text variant="bodyMedium" style={styles.sessionDuration}>
                Duration: {formatDuration(sessionData.sessionDuration)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Session Statistics" />
        <Card.Content>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {sessionData.totalScans}
              </Text>
              <Text variant="bodySmall">Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {sessionData.successfulScans}
              </Text>
              <Text variant="bodySmall">Successful</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {sessionData.successRate.toFixed(1)}%
              </Text>
              <Text variant="bodySmall">Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {sessionData.averageAccuracy.toFixed(1)}%
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
            description={`${sessionData.successfulScans} out of ${sessionData.totalScans} scans successful`}
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            right={() => (
              <View style={styles.metricValue}>
                <Text variant="titleMedium">{sessionData.successRate.toFixed(1)}%</Text>
                <ProgressBar 
                  progress={sessionData.successRate / 100} 
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
                <Text variant="titleMedium">{sessionData.averageAccuracy.toFixed(1)}%</Text>
                <ProgressBar 
                  progress={sessionData.averageAccuracy / 100} 
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
              <Text variant="titleMedium">{sessionData.averageProcessingTime.toFixed(2)}s</Text>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Total Processing Time"
            description="Total time spent processing"
            left={(props) => <List.Icon {...props} icon="timer" />}
            right={() => (
              <Text variant="titleMedium">{formatDuration(sessionData.totalProcessingTime)}</Text>
            )}
          />
        </Card.Content>
      </Card>

      {sessionData.timelineData.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Accuracy Timeline" />
          <Card.Content>
            <LineChart
              data={{
                labels: sessionData.timelineData.map((_, index) => (index + 1).toString()),
                datasets: [{
                  data: sessionData.timelineData.map(d => d.accuracy),
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

      {sessionData.subjectBreakdown.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Subject Breakdown" />
          <Card.Content>
            {sessionData.subjectBreakdown.map((subject, index) => (
              <View key={subject.name}>
                <List.Item
                  title={subject.name}
                  description={`${subject.count} scans`}
                  left={(props) => <List.Icon {...props} icon="book" />}
                  right={() => (
                    <View style={styles.subjectMetrics}>
                      <Text variant="bodySmall" style={styles.accuracyText}>
                        {subject.averageAccuracy.toFixed(1)}%
                      </Text>
                      <Chip 
                        mode="outlined" 
                        compact 
                        textStyle={{ fontSize: 10 }}
                      >
                        {subject.successRate.toFixed(0)}%
                      </Chip>
                    </View>
                  )}
                />
                {index < sessionData.subjectBreakdown.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Title title="Session Scans" />
        <Card.Content>
          {sessionData.sessionScans.length > 0 ? (
            sessionData.sessionScans
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((scan, index) => (
                <View key={scan.id}>
                  <List.Item
                    title={`Scan ${scan.id.slice(0, 8)}`}
                    description={`${new Date(scan.createdAt).toLocaleTimeString()} - ${scan.processingTime?.toFixed(2)}s`}
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
                      navigation.navigate('Result' as never, { scanId: scan.id } as never);
                    }}
                  />
                  {index < sessionData.sessionScans.length - 1 && <Divider />}
                </View>
              ))
          ) : (
            <Text variant="bodyMedium" style={styles.noDataText}>
              No scans in this session
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
              navigation.navigate('Camera' as never);
            }}
            style={styles.actionButton}
          >
            Start New Session
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
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sessionIcon: {
    marginRight: 16,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionDescription: {
    marginBottom: 4,
  },
  sessionDuration: {
    fontWeight: 'bold',
    marginTop: 8,
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
  subjectMetrics: {
    alignItems: 'flex-end',
  },
  accuracyText: {
    marginBottom: 4,
  },
  scanDetails: {
    alignItems: 'flex-end',
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

export default ScanSessionScreen; 