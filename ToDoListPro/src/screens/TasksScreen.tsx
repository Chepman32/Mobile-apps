import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  List,
  IconButton,
  Chip,
  Searchbar,
  SegmentedButtons,
  FAB,
  useTheme
} from 'react-native-paper';
import { useTodo } from '../context/TodoContext';
import { Task, TaskFilters, TaskSortOptions } from '../types';

export default function TasksScreen({ navigation, route }: any) {
  const theme = useTheme();
  const { 
    tasks,
    categories,
    getCategoryById,
    getProjectById,
    completeTask,
    deleteTask
  } = useTodo();
  
  const { categoryId } = route.params || {};
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof TaskSortOptions['field']>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');
  const [loading, setLoading] = useState(false);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by category if specified
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === categoryId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          const categoryA = getCategoryById(a.categoryId);
          const categoryB = getCategoryById(b.categoryId);
          aValue = categoryA?.name || '';
          bValue = categoryB?.name || '';
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, categoryId, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await completeTask(taskId);
      Alert.alert('Success', 'Task completed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteTask(taskId);
              Alert.alert('Success', 'Task deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '#FF4444';
      case 'high': return '#FF8800';
      case 'medium': return '#FFAA00';
      case 'low': return '#00AA00';
      default: return '#666666';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return '#00AA00';
      case 'in_progress': return '#FFAA00';
      case 'pending': return '#666666';
      case 'cancelled': return '#FF4444';
      default: return '#666666';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date < today) {
      return `Overdue (${date.toLocaleDateString()})`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  const selectedCategory = categoryId ? getCategoryById(categoryId) : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              📋 Tasks
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {selectedCategory 
                ? `Tasks in ${selectedCategory.name}`
                : 'Manage and organize your tasks'
              }
            </Text>
          </Card.Content>
        </Card>

        {/* Search */}
        <Card style={styles.card}>
          <Card.Content>
            <Searchbar
              placeholder="Search tasks..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
          </Card.Content>
        </Card>

        {/* Filters */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Filters
            </Text>
            
            <Text variant="bodyMedium" style={styles.filterLabel}>
              Status
            </Text>
            <SegmentedButtons
              value={statusFilter}
              onValueChange={value => setStatusFilter(value as any)}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' }
              ]}
              style={styles.segmentedButton}
            />
            
            <Text variant="bodyMedium" style={styles.filterLabel}>
              Priority
            </Text>
            <SegmentedButtons
              value={priorityFilter}
              onValueChange={value => setPriorityFilter(value as any)}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
              style={styles.segmentedButton}
            />
          </Card.Content>
        </Card>

        {/* Sort Options */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Sort & View
            </Text>
            
            <View style={styles.sortRow}>
              <Text variant="bodyMedium" style={styles.sortLabel}>
                Sort by:
              </Text>
              <SegmentedButtons
                value={sortBy}
                onValueChange={value => setSortBy(value as any)}
                buttons={[
                  { value: 'dueDate', label: 'Due Date' },
                  { value: 'priority', label: 'Priority' },
                  { value: 'title', label: 'Title' },
                  { value: 'createdAt', label: 'Created' }
                ]}
                style={styles.segmentedButton}
              />
            </View>
            
            <View style={styles.viewRow}>
              <Text variant="bodyMedium" style={styles.viewLabel}>
                View:
              </Text>
              <SegmentedButtons
                value={viewMode}
                onValueChange={value => setViewMode(value as any)}
                buttons={[
                  { value: 'list', label: 'List' },
                  { value: 'compact', label: 'Compact' }
                ]}
                style={styles.segmentedButton}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No tasks match your current filters.'
                  : 'No tasks created yet. Create your first task to get started!'
                }
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredTasks.map(task => {
            const category = getCategoryById(task.categoryId);
            const project = task.projectIds?.[0] ? getProjectById(task.projectIds[0]) : null;
            const overdue = isOverdue(task);
            
            return (
              <Card key={task.id} style={styles.taskCard}>
                <Card.Content>
                  <View style={styles.taskHeader}>
                    <View style={styles.taskInfo}>
                      <Text variant="titleMedium" style={[
                        styles.taskTitle,
                        task.status === 'completed' && styles.completedText
                      ]}>
                        {task.title}
                      </Text>
                      {task.description && (
                        <Text variant="bodySmall" style={styles.taskDescription}>
                          {task.description}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.taskActions}>
                      {task.status !== 'completed' && (
                        <IconButton
                          icon="check"
                          size={20}
                          onPress={() => handleCompleteTask(task.id)}
                          disabled={loading}
                        />
                      )}
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => handleDeleteTask(task.id)}
                        iconColor={theme.colors.error}
                      />
                    </View>
                  </View>

                  {viewMode === 'list' && (
                    <>
                      <View style={styles.taskDetails}>
                        <View style={styles.detailRow}>
                          <Text variant="bodySmall" style={styles.detailLabel}>
                            Category:
                          </Text>
                          <Text variant="bodySmall" style={styles.detailValue}>
                            {category?.name || 'Uncategorized'}
                          </Text>
                        </View>
                        
                        {project && (
                          <View style={styles.detailRow}>
                            <Text variant="bodySmall" style={styles.detailLabel}>
                              Project:
                            </Text>
                            <Text variant="bodySmall" style={styles.detailValue}>
                              {project.name}
                            </Text>
                          </View>
                        )}
                        
                        <View style={styles.detailRow}>
                          <Text variant="bodySmall" style={styles.detailLabel}>
                            Due Date:
                          </Text>
                          <Text variant="bodySmall" style={[
                            styles.detailValue,
                            overdue && styles.overdueText
                          ]}>
                            {formatDate(task.dueDate)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.taskTags}>
                        <Chip
                          mode="outlined"
                          textStyle={{ color: getStatusColor(task.status) }}
                          style={[styles.statusChip, { borderColor: getStatusColor(task.status) }]}
                        >
                          {task.status.replace('_', ' ').toUpperCase()}
                        </Chip>
                        
                        <Chip
                          mode="outlined"
                          textStyle={{ color: getPriorityColor(task.priority) }}
                          style={[styles.priorityChip, { borderColor: getPriorityColor(task.priority) }]}
                        >
                          {task.priority.toUpperCase()}
                        </Chip>
                        
                        {task.tags && task.tags.map((tag, index) => (
                          <Chip key={index} mode="outlined" style={styles.tag}>
                            {tag}
                          </Chip>
                        ))}
                      </View>
                    </>
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}

        {/* Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📊 Summary
            </Text>
            
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={styles.summaryNumber}>
                  {filteredTasks.length}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Filtered Tasks
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={styles.summaryNumber}>
                  {filteredTasks.filter(t => t.status === 'completed').length}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Completed
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={styles.summaryNumber}>
                  {filteredTasks.filter(t => isOverdue(t)).length}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Overdue
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={styles.summaryNumber}>
                  {filteredTasks.filter(t => t.priority === 'urgent').length}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Urgent
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  searchBar: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
    marginTop: 16,
  },
  segmentedButton: {
    marginTop: 8,
  },
  sortRow: {
    marginBottom: 16,
  },
  sortLabel: {
    marginBottom: 8,
  },
  viewRow: {
    marginBottom: 8,
  },
  viewLabel: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    opacity: 0.7,
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskDetails: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    flex: 1,
  },
  overdueText: {
    color: '#FF4444',
    fontWeight: 'bold',
  },
  taskTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statusChip: {
    marginBottom: 4,
  },
  priorityChip: {
    marginBottom: 4,
  },
  tag: {
    marginBottom: 4,
  },
  summaryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  summaryNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 