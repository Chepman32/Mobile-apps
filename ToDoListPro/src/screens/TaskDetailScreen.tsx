import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Chip,
  IconButton,
  List,
  Divider,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
  useTheme
} from 'react-native-paper';
import { useTodo } from '../context/TodoContext';
import { Task, SubTask } from '../types';

export default function TaskDetailScreen({ route, navigation }: any) {
  const theme = useTheme();
  const { 
    getTaskById, 
    getCategoryById, 
    getProjectById,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    completeTask
  } = useTodo();
  
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [subtaskDialogVisible, setSubtaskDialogVisible] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = () => {
    const taskData = getTaskById(taskId);
    if (taskData) {
      setTask(taskData);
    } else {
      Alert.alert('Error', 'Task not found');
      navigation.goBack();
    }
  };

  const handleCompleteTask = async () => {
    if (!task) return;
    
    try {
      setLoading(true);
      await completeTask(task.id);
      loadTask();
      Alert.alert('Success', 'Task completed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    
    try {
      setLoading(true);
      await deleteTask(task.id);
      setDeleteDialogVisible(false);
      Alert.alert('Success', 'Task deleted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!task || !newSubtaskTitle.trim()) return;
    
    try {
      setLoading(true);
      await addSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setSubtaskDialogVisible(false);
      loadTask();
    } catch (error) {
      Alert.alert('Error', 'Failed to add subtask');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    if (!task) return;
    
    try {
      await updateSubtask(task.id, subtaskId, { completed: !completed });
      loadTask();
    } catch (error) {
      Alert.alert('Error', 'Failed to update subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!task) return;
    
    try {
      await deleteSubtask(task.id, subtaskId);
      loadTask();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete subtask');
    }
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
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Not set';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const category = getCategoryById(task.categoryId);
  const project = task.projectIds?.[0] ? getProjectById(task.projectIds[0]) : null;
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text variant="headlineSmall" style={styles.title}>
              {task.title}
            </Text>
            <IconButton
              icon="pencil"
              size={24}
              onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
            />
          </View>
          
          {task.description && (
            <Text variant="bodyMedium" style={styles.description}>
              {task.description}
            </Text>
          )}

          <View style={styles.statusRow}>
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
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          
          <View style={styles.actionButtons}>
            {task.status !== 'completed' && (
              <Button
                mode="contained"
                onPress={handleCompleteTask}
                loading={loading}
                style={styles.actionButton}
                icon="check"
              >
                Complete Task
              </Button>
            )}
            
            <Button
              mode="outlined"
              onPress={() => setSubtaskDialogVisible(true)}
              style={styles.actionButton}
              icon="plus"
            >
              Add Subtask
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => setDeleteDialogVisible(true)}
              style={[styles.actionButton, styles.deleteButton]}
              icon="delete"
              textColor={theme.colors.error}
            >
              Delete Task
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Task Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Task Details
          </Text>
          
          <List.Item
            title="Category"
            description={category?.name || 'Uncategorized'}
            left={props => (
              <List.Icon 
                {...props} 
                icon={() => <Text style={styles.listIcon}>{category?.icon || '📁'}</Text>}
              />
            )}
            onPress={() => category && navigation.navigate('CategoryDetail', { categoryId: category.id })}
          />
          
          {project && (
            <List.Item
              title="Project"
              description={project.name}
              left={props => (
                <List.Icon 
                  {...props} 
                  icon={() => <Text style={styles.listIcon}>{project.icon}</Text>}
                />
              )}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
            />
          )}
          
          <List.Item
            title="Due Date"
            description={formatDate(task.dueDate)}
            left={props => <List.Icon {...props} icon="calendar" />}
          />
          
          <List.Item
            title="Created"
            description={formatDate(task.createdAt)}
            left={props => <List.Icon {...props} icon="clock-outline" />}
          />
          
          {task.completedAt && (
            <List.Item
              title="Completed"
              description={formatDate(task.completedAt)}
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
          )}
          
          <List.Item
            title="Estimated Duration"
            description={formatDuration(task.estimatedDuration)}
            left={props => <List.Icon {...props} icon="timer-outline" />}
          />
          
          <List.Item
            title="Actual Duration"
            description={formatDuration(task.actualDuration)}
            left={props => <List.Icon {...props} icon="timer" />}
          />
        </Card.Content>
      </Card>

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.subtasksHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Subtasks
              </Text>
              <Chip mode="outlined">
                {completedSubtasks}/{totalSubtasks} completed
              </Chip>
            </View>
            
            {task.subtasks.map((subtask, index) => (
              <View key={subtask.id}>
                <List.Item
                  title={subtask.title}
                  titleStyle={subtask.completed ? styles.completedText : undefined}
                  left={props => (
                    <IconButton
                      {...props}
                      icon={subtask.completed ? "check-circle" : "circle-outline"}
                      iconColor={subtask.completed ? theme.colors.primary : theme.colors.outline}
                      onPress={() => handleToggleSubtask(subtask.id, subtask.completed)}
                    />
                  )}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="delete"
                      size={20}
                      onPress={() => handleDeleteSubtask(subtask.id)}
                    />
                  )}
                />
                {index < task.subtasks!.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Tags
            </Text>
            <View style={styles.tagsContainer}>
              {task.tags.map((tag, index) => (
                <Chip key={index} mode="outlined" style={styles.tag}>
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Notes */}
      {task.notes && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notes
            </Text>
            <Text variant="bodyMedium" style={styles.notes}>
              {task.notes}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleDeleteTask}
              loading={loading}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Subtask Dialog */}
      <Portal>
        <Dialog visible={subtaskDialogVisible} onDismiss={() => setSubtaskDialogVisible(false)}>
          <Dialog.Title>Add Subtask</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Subtask Title"
              value={newSubtaskTitle}
              onChangeText={setNewSubtaskTitle}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSubtaskDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleAddSubtask}
              loading={loading}
              disabled={!newSubtaskTitle.trim()}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    marginRight: 8,
  },
  priorityChip: {
    marginRight: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: '#FF4444',
  },
  listIcon: {
    fontSize: 20,
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginBottom: 4,
  },
  notes: {
    lineHeight: 20,
  },
}); 