import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  FAB,
  Chip,
  ProgressBar,
  IconButton,
  Banner,
  List,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PieChart } from 'react-native-chart-kit';
import { useTodo } from '../context/TodoContext';
import { RootStackParamList } from '../../App';
import { Task } from '../types';
import { spacing } from '../../../shared/theme/AppTheme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    summary,
    categoryStats,
    priorityDistribution,
    tasks,
    alerts,
    loading,
    getCategoryById,
    getOverdueTasks,
    getDueTodayTasks,
    getUpcomingTasks,
    completeTask,
    refreshData,
  } = useTodo();

  const overdueTasks = getOverdueTasks();
  const dueTodayTasks = getDueTodayTasks();
  const upcomingTasks = getUpcomingTasks(7);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#2196F3';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'fire';
      case 'high': return 'arrow-up';
      case 'medium': return 'minus';
      case 'low': return 'arrow-down';
      default: return 'help-circle';
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const renderSummaryCard = () => {
    if (!summary) return null;

    const completionColor = summary.completionRate >= 80 ? '#4CAF50' : 
                           summary.completionRate >= 60 ? '#FF9800' : '#F44336';

    return (
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.summaryTitle}>
            Daily Overview
          </Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Total Tasks</Text>
              <Text variant="headlineSmall" style={styles.summaryValue}>
                {summary.totalTasks}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Completed</Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: '#4CAF50' }]}>
                {summary.completedTasks}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>In Progress</Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: '#2196F3' }]}>
                {summary.inProgressTasks}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Overdue</Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: '#F44336' }]}>
                {summary.overdueTasks}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text variant="bodyMedium">Completion Rate</Text>
              <Text variant="bodyMedium" style={{ color: completionColor }}>
                {summary.completionRate.toFixed(1)}%
              </Text>
            </View>
            <ProgressBar
              progress={summary.completionRate / 100}
              color={completionColor}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.productivitySection}>
            <Text variant="bodyMedium">Productivity Score</Text>
            <Text variant="headlineSmall" style={[styles.productivityScore, { color: completionColor }]}>
              {summary.productivityScore.toFixed(0)}/100
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderAlertsCard = () => {
    if (alerts.length === 0 && overdueTasks.length === 0) return null;

    return (
      <Card style={styles.alertsCard}>
        <Card.Content>
          <View style={styles.alertsHeader}>
            <Text variant="titleMedium">Alerts & Reminders</Text>
            <Chip icon="alert" size="small">
              {overdueTasks.length + alerts.length}
            </Chip>
          </View>
          
          {overdueTasks.slice(0, 3).map(task => (
            <Banner
              key={task.id}
              visible={true}
              icon="clock-alert"
              style={[styles.alertBanner, { backgroundColor: '#FFEBEE' }]}
              actions={[{
                label: 'Complete',
                onPress: () => handleCompleteTask(task.id),
              }]}
            >
              <Text variant="bodyMedium">
                "{task.title}" is overdue
              </Text>
            </Banner>
          ))}
          
          {alerts.slice(0, 2).map(alert => (
            <Banner
              key={alert.id}
              visible={true}
              icon={alert.severity === 'error' ? 'alert-circle' : 'alert'}
              style={[
                styles.alertBanner,
                { backgroundColor: alert.severity === 'error' ? '#FFEBEE' : '#FFF3E0' }
              ]}
            >
              <Text variant="bodyMedium">
                {alert.message}
              </Text>
            </Banner>
          ))}
          
          {(overdueTasks.length + alerts.length) > 5 && (
            <Text variant="bodySmall" style={styles.moreAlerts}>
              +{(overdueTasks.length + alerts.length) - 5} more alerts
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderPriorityChart = () => {
    if (!priorityDistribution) return null;

    const total = priorityDistribution.low + priorityDistribution.medium + 
                  priorityDistribution.high + priorityDistribution.urgent;
    
    if (total === 0) return null;

    const chartData = [
      {
        name: 'Urgent',
        population: priorityDistribution.urgent,
        color: '#F44336',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'High',
        population: priorityDistribution.high,
        color: '#FF9800',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Medium',
        population: priorityDistribution.medium,
        color: '#2196F3',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Low',
        population: priorityDistribution.low,
        color: '#4CAF50',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
    ].filter(item => item.population > 0);

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            Tasks by Priority
          </Text>
          
          <PieChart
            data={chartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card.Content>
      </Card>
    );
  };

  const renderTaskList = (title: string, taskList: Task[], emptyMessage: string) => {
    return (
      <Card style={styles.tasksCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.tasksTitle}>
            {title}
          </Text>
          
          {taskList.length === 0 ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              {emptyMessage}
            </Text>
          ) : (
            taskList.slice(0, 5).map(task => {
              const category = getCategoryById(task.categoryId);
              
              return (
                <List.Item
                  key={task.id}
                  title={task.title}
                  description={category?.name}
                  left={() => (
                    <IconButton
                      icon={getPriorityIcon(task.priority)}
                      iconColor={getPriorityColor(task.priority)}
                      size={20}
                    />
                  )}
                  right={() => (
                    <View style={styles.taskActions}>
                      {task.dueDate && (
                        <Text variant="bodySmall" style={styles.dueDate}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                      <IconButton
                        icon="check"
                        size={20}
                        onPress={() => handleCompleteTask(task.id)}
                      />
                    </View>
                  )}
                  onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                  style={styles.taskItem}
                />
              );
            })
          )}
          
          {taskList.length > 5 && (
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Tasks')}
              style={styles.viewAllButton}
            >
              View All ({taskList.length})
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderQuickActions = () => (
    <Card style={styles.quickActionsCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.quickActionsTitle}>
          Quick Actions
        </Text>
        
        <View style={styles.quickActionsGrid}>
          <Button
            mode="contained-tonal"
            icon="plus"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AddTask')}
          >
            Add Task
          </Button>
          
          <Button
            mode="contained-tonal"
            icon="view-list"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Tasks')}
          >
            All Tasks
          </Button>
          
          <Button
            mode="contained-tonal"
            icon="chart-pie"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Analytics')}
          >
            Analytics
          </Button>
          
          <Button
            mode="contained-tonal"
            icon="tag-multiple"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Categories')}
          >
            Categories
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading your tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {renderSummaryCard()}
        {renderAlertsCard()}
        {renderQuickActions()}
        {renderPriorityChart()}
        {renderTaskList('Due Today', dueTodayTasks, 'No tasks due today. Great job!')}
        {renderTaskList('Upcoming (Next 7 Days)', upcomingTasks, 'No upcoming tasks. You\'re all caught up!')}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        label="Add Task"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    margin: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryTitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  productivitySection: {
    alignItems: 'center',
  },
  productivityScore: {
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  alertsCard: {
    margin: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertBanner: {
    marginBottom: spacing.xs,
  },
  moreAlerts: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: spacing.sm,
  },
  quickActionsCard: {
    margin: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  quickActionsTitle: {
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    marginBottom: spacing.sm,
  },
  chartCard: {
    margin: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  chartTitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  tasksCard: {
    margin: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  tasksTitle: {
    marginBottom: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginVertical: spacing.lg,
  },
  taskItem: {
    paddingVertical: spacing.xs,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    opacity: 0.7,
    marginRight: spacing.sm,
  },
  viewAllButton: {
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
}); 