import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { 
  Text, 
  Card, 
  SegmentedButtons,
  useTheme
} from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { useTodo } from '../context/TodoContext';
import { Task, CategoryStats, ProductivityData, PriorityDistribution } from '../types';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen({ navigation }: any) {
  const theme = useTheme();
  const { 
    tasks,
    categoryStats,
    productivityData,
    priorityDistribution,
    summary
  } = useTodo();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [chartType, setChartType] = useState<'productivity' | 'categories' | 'priorities' | 'timeline'>('productivity');

  const getProductivityData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          data: last7Days.map(date => {
            const dayTasks = tasks.filter(task => 
              task.createdAt?.startsWith(date) || task.completedAt?.startsWith(date)
            );
            return dayTasks.length;
          }),
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const getCategoryData = () => {
    if (!categoryStats || categoryStats.length === 0) {
      return {
        labels: ['No Data'],
        data: [1]
      };
    }

    return {
      labels: categoryStats.map(stat => stat.categoryName),
      data: categoryStats.map(stat => stat.totalTasks)
    };
  };

  const getPriorityData = () => {
    if (!priorityDistribution) {
      return {
        labels: ['Low', 'Medium', 'High', 'Urgent'],
        data: [0, 0, 0, 0]
      };
    }

    return {
      labels: ['Low', 'Medium', 'High', 'Urgent'],
      data: [
        priorityDistribution.low,
        priorityDistribution.medium,
        priorityDistribution.high,
        priorityDistribution.urgent
      ]
    };
  };

  const getTimelineData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return {
      labels: last30Days.map((_, index) => 
        index % 5 === 0 ? new Date(last30Days[index]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
      ),
      datasets: [
        {
          data: last30Days.map(date => {
            const dayTasks = tasks.filter(task => task.createdAt?.startsWith(date));
            return dayTasks.length;
          }),
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: last30Days.map(date => {
            const dayTasks = tasks.filter(task => task.completedAt?.startsWith(date));
            return dayTasks.length;
          }),
          color: (opacity = 1) => `rgba(76, 205, 196, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const getCompletionRate = () => {
    if (!summary) return 0;
    return summary.completionRate / 100;
  };

  const getProductivityScore = () => {
    if (!summary) return 0;
    return summary.productivityScore / 100;
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.onSurface,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary
    }
  };

  const pieChartConfig = {
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.onSurface,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            📊 Analytics
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Track your productivity and task completion patterns.
          </Text>
        </Card.Content>
      </Card>

      {/* Time Range Selector */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Time Range
          </Text>
          <SegmentedButtons
            value={timeRange}
            onValueChange={value => setTimeRange(value as any)}
            buttons={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'quarter', label: 'Quarter' },
              { value: 'year', label: 'Year' }
            ]}
            style={styles.segmentedButton}
          />
        </Card.Content>
      </Card>

      {/* Summary Metrics */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📈 Summary Metrics
          </Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={styles.metricNumber}>
                {summary?.totalTasks || 0}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Total Tasks
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={styles.metricNumber}>
                {summary?.completedTasks || 0}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Completed
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={styles.metricNumber}>
                {summary?.completionRate || 0}%
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Completion Rate
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={styles.metricNumber}>
                {summary?.productivityScore || 0}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Productivity Score
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Progress Charts */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🎯 Progress Overview
          </Text>
          
          <View style={styles.progressCharts}>
            <View style={styles.progressChart}>
              <Text variant="bodyMedium" style={styles.chartTitle}>
                Completion Rate
              </Text>
              <ProgressChart
                data={{
                  data: [getCompletionRate()]
                }}
                width={screenWidth - 80}
                height={80}
                strokeWidth={8}
                radius={32}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(76, 205, 196, ${opacity})`,
                }}
                hideLegend={false}
              />
            </View>
            
            <View style={styles.progressChart}>
              <Text variant="bodyMedium" style={styles.chartTitle}>
                Productivity Score
              </Text>
              <ProgressChart
                data={{
                  data: [getProductivityScore()]
                }}
                width={screenWidth - 80}
                height={80}
                strokeWidth={8}
                radius={32}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                }}
                hideLegend={false}
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Chart Type Selector */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Chart Type
          </Text>
          <SegmentedButtons
            value={chartType}
            onValueChange={value => setChartType(value as any)}
            buttons={[
              { value: 'productivity', label: 'Productivity' },
              { value: 'categories', label: 'Categories' },
              { value: 'priorities', label: 'Priorities' },
              { value: 'timeline', label: 'Timeline' }
            ]}
            style={styles.segmentedButton}
          />
        </Card.Content>
      </Card>

      {/* Charts */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {chartType === 'productivity' && '📈 Productivity Trend'}
            {chartType === 'categories' && '📊 Category Distribution'}
            {chartType === 'priorities' && '🎯 Priority Distribution'}
            {chartType === 'timeline' && '📅 Task Timeline'}
          </Text>
          
          {chartType === 'productivity' && (
            <LineChart
              data={getProductivityData()}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
          
          {chartType === 'categories' && (
            <BarChart
              data={getCategoryData()}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
            />
          )}
          
          {chartType === 'priorities' && (
            <PieChart
              data={getPriorityData().labels.map((label, index) => ({
                name: label,
                population: getPriorityData().data[index],
                color: ['#00AA00', '#FFAA00', '#FF8800', '#FF4444'][index],
                legendFontColor: theme.colors.onSurface,
                legendFontSize: 12
              }))}
              width={screenWidth - 40}
              height={220}
              chartConfig={pieChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          )}
          
          {chartType === 'timeline' && (
            <LineChart
              data={getTimelineData()}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withDots={false}
            />
          )}
        </Card.Content>
      </Card>

      {/* Category Performance */}
      {categoryStats && categoryStats.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📊 Category Performance
            </Text>
            
            {categoryStats.map((stat, index) => (
              <View key={stat.categoryId} style={styles.categoryStat}>
                <View style={styles.categoryHeader}>
                  <Text variant="bodyMedium" style={styles.categoryName}>
                    {stat.categoryName}
                  </Text>
                  <Text variant="bodySmall" style={styles.categoryRate}>
                    {stat.completionRate}% complete
                  </Text>
                </View>
                
                <View style={styles.categoryDetails}>
                  <Text variant="bodySmall">
                    Total: {stat.totalTasks} | 
                    Completed: {stat.completedTasks} | 
                    Pending: {stat.pendingTasks}
                  </Text>
                </View>
                
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${stat.completionRate}%`,
                        backgroundColor: theme.colors.primary
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </Card.Content>
      </Card>

      {/* Productivity Insights */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            💡 Productivity Insights
          </Text>
          
          <View style={styles.insightItem}>
            <Text variant="bodyMedium" style={styles.insightTitle}>
              🎯 Best Performing Day
            </Text>
            <Text variant="bodySmall" style={styles.insightText}>
              {(() => {
                const dayStats = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                  const dayTasks = tasks.filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate.getDay() === index;
                  });
                  return { day, count: dayTasks.length };
                });
                const bestDay = dayStats.reduce((a, b) => a.count > b.count ? a : b);
                return `${bestDay.day} (${bestDay.count} tasks)`;
              })()}
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Text variant="bodyMedium" style={styles.insightTitle}>
              ⏱️ Average Completion Time
            </Text>
            <Text variant="bodySmall" style={styles.insightText}>
              {summary?.averageCompletionTime || 0} days
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Text variant="bodyMedium" style={styles.insightTitle}>
              📈 Productivity Trend
            </Text>
            <Text variant="bodySmall" style={styles.insightText}>
              {(() => {
                const recentTasks = tasks.filter(task => {
                  const taskDate = new Date(task.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return taskDate > weekAgo;
                });
                const olderTasks = tasks.filter(task => {
                  const taskDate = new Date(task.createdAt);
                  const twoWeeksAgo = new Date();
                  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return taskDate > twoWeeksAgo && taskDate <= weekAgo;
                });
                
                const recentAvg = recentTasks.length / 7;
                const olderAvg = olderTasks.length / 7;
                const change = ((recentAvg - olderAvg) / olderAvg * 100).toFixed(1);
                
                if (recentAvg > olderAvg) {
                  return `📈 Up ${change}% from last week`;
                } else if (recentAvg < olderAvg) {
                  return `📉 Down ${Math.abs(change)}% from last week`;
                } else {
                  return `➡️ Stable compared to last week`;
                }
              })()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  segmentedButton: {
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  metricNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  progressCharts: {
    gap: 16,
  },
  progressChart: {
    alignItems: 'center',
  },
  chartTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryStat: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontWeight: 'bold',
  },
  categoryRate: {
    opacity: 0.7,
  },
  categoryDetails: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  insightItem: {
    marginBottom: 16,
  },
  insightTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  insightText: {
    opacity: 0.7,
  },
}); 