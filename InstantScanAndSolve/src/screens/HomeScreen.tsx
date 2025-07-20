import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  FAB,
  Chip,
  ProgressBar,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
  Searchbar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useInstantScanAndSolve } from '../context/InstantScanAndSolveContext';
import { RootStackParamList, ScanResult, SolveProblem } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { state, calculateStats } = useInstantScanAndSolve();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickScanDialog, setShowQuickScanDialog] = useState(false);
  const [quickScanType, setQuickScanType] = useState<'math' | 'text' | 'object'>('math');

  const recentScans = state.scanResults.slice(0, 5);
  const successfulScans = state.scanResults.filter(scan => scan.successful);

  useEffect(() => {
    calculateStats();
  }, [state.scanResults, state.solveProblems]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getWeeklyStats = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayScans = state.scanResults.filter(s => s.createdAt.includes(dateStr));
      const scans = dayScans.length;
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        scans,
      });
    }
    return weekData;
  };

  const getScanTypeBreakdown = () => {
    const types = {};
    state.scanResults.forEach(scan => {
      if (!types[scan.type]) {
        types[scan.type] = 0;
      }
      types[scan.type]++;
    });
    
    return Object.entries(types).map(([type, count]) => ({
      name: type,
      count: count as number,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const weeklyData = getWeeklyStats();
  const typeData = getScanTypeBreakdown();

  const scanModes = [
    {
      id: 'math',
      name: 'Math Problems',
      description: 'Scan and solve mathematical equations',
      icon: 'calculator',
      color: '#ff5722',
    },
    {
      id: 'text',
      name: 'Text Recognition',
      description: 'Extract text from images and documents',
      icon: 'text-recognition',
      color: '#2196f3',
    },
    {
      id: 'object',
      name: 'Object Detection',
      description: 'Identify objects and their properties',
      icon: 'eye',
      color: '#4caf50',
    },
    {
      id: 'document',
      name: 'Document Scanner',
      description: 'Scan and process documents',
      icon: 'file-document',
      color: '#9c27b0',
    },
  ];

  const handleQuickScan = () => {
    navigation.navigate('Camera', { mode: quickScanType });
    setShowQuickScanDialog(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Searchbar
              placeholder="Search scans, problems, or solutions..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              icon="magnify"
            />
          </Card.Content>
        </Card>

        {/* Header Stats */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Icon name="camera" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalScans}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Scans
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="check-circle" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.successfulScans}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Successful
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="lightbulb" size={32} color={theme.colors.primary} />
                <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
                  {state.userProfile.stats.totalSolves}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Problems Solved
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Scan Modes */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Scan Modes
            </Title>
            <View style={styles.scanModes}>
              {scanModes.map(mode => (
                <Card
                  key={mode.id}
                  style={[
                    styles.scanModeCard,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: mode.color,
                    },
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <View style={styles.scanModeHeader}>
                      <Icon name={mode.icon} size={32} color={mode.color} />
                      <View style={styles.scanModeText}>
                        <Text style={[styles.scanModeTitle, { color: theme.colors.onSurface }]}>
                          {mode.name}
                        </Text>
                        <Text style={[styles.scanModeDescription, { color: theme.colors.onSurfaceVariant }]}>
                          {mode.description}
                        </Text>
                      </View>
                    </View>
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate('Camera', { mode: mode.id as any })}
                      style={[styles.scanModeButton, { backgroundColor: mode.color }]}
                    >
                      Start Scan
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quick Actions
            </Title>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="camera"
                onPress={() => setShowQuickScanDialog(true)}
                style={styles.actionButton}
              >
                Quick Scan
              </Button>
              <Button
                mode="outlined"
                icon="history"
                onPress={() => navigation.navigate('History')}
                style={styles.actionButton}
              >
                History
              </Button>
              <Button
                mode="outlined"
                icon="heart"
                onPress={() => navigation.navigate('Favorites')}
                style={styles.actionButton}
              >
                Favorites
              </Button>
              <Button
                mode="outlined"
                icon="cog"
                onPress={() => navigation.navigate('Settings')}
                style={styles.actionButton}
              >
                Settings
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Scans */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Recent Scans
            </Title>
            {recentScans.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="camera" size={64} color={theme.colors.outline} />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No scans yet. Start scanning problems!
                </Text>
              </View>
            ) : (
              recentScans.map(scan => (
                <Card
                  key={scan.id}
                  style={[
                    styles.scanCard,
                    {
                      backgroundColor: scan.successful ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <View style={styles.scanHeader}>
                      <View style={styles.scanInfo}>
                        <Icon name="camera" size={24} color={theme.colors.primary} />
                        <View style={styles.scanText}>
                          <Text style={[styles.scanType, { color: theme.colors.onSurface }]}>
                            {scan.type.toUpperCase()} Scan
                          </Text>
                          <Text style={[styles.scanText, { color: theme.colors.onSurfaceVariant }]}>
                            {scan.extractedText.substring(0, 50)}...
                          </Text>
                        </View>
                      </View>
                      <Chip
                        mode={scan.successful ? 'flat' : 'outlined'}
                        selected={scan.successful}
                        style={styles.successChip}
                      >
                        {scan.successful ? 'Success' : 'Failed'}
                      </Chip>
                    </View>
                    
                    <View style={styles.scanFooter}>
                      <Text style={[styles.scanDate, { color: theme.colors.onSurfaceVariant }]}>
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </Text>
                      <View style={styles.scanActions}>
                        <Icon name="heart-outline" size={20} color={theme.colors.primary} />
                        <Icon name="share" size={20} color={theme.colors.primary} />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Weekly Progress Chart */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Weekly Scans
            </Title>
            <LineChart
              data={{
                labels: weeklyData.map(d => d.date),
                datasets: [
                  {
                    data: weeklyData.map(d => d.scans),
                  },
                ],
              }}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Scan Type Breakdown */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Scan Types
            </Title>
            <PieChart
              data={typeData}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {/* Offline Status */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.offlineStatus}>
              <Icon name="wifi" size={24} color={theme.colors.primary} />
              <View style={styles.offlineText}>
                <Text style={[styles.offlineTitle, { color: theme.colors.onSurface }]}>
                  Offline Mode Available
                </Text>
                <Text style={[styles.offlineDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Process scans offline with saved models
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Offline')}
                compact
              >
                View
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="camera"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowQuickScanDialog(true)}
      />

      {/* Quick Scan Dialog */}
      <Portal>
        <Dialog visible={showQuickScanDialog} onDismiss={() => setShowQuickScanDialog(false)}>
          <Dialog.Title>Quick Scan</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Choose scan mode for quick scanning:
            </Text>
            <SegmentedButtons
              value={quickScanType}
              onValueChange={setQuickScanType}
              buttons={[
                { value: 'math', label: 'Math' },
                { value: 'text', label: 'Text' },
                { value: 'object', label: 'Object' },
              ]}
              style={styles.segmentedButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowQuickScanDialog(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={handleQuickScan}
            >
              Start Scan
            </Button>
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
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  searchBar: {
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scanModes: {
    gap: 12,
  },
  scanModeCard: {
    marginBottom: 12,
    borderWidth: 2,
  },
  scanModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanModeText: {
    marginLeft: 12,
    flex: 1,
  },
  scanModeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanModeDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  scanModeButton: {
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  scanCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scanInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  scanText: {
    marginLeft: 12,
    flex: 1,
  },
  scanType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  successChip: {
    marginLeft: 8,
  },
  scanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanDate: {
    fontSize: 12,
  },
  scanActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  offlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    flex: 1,
    marginLeft: 12,
  },
  offlineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  offlineDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
});
