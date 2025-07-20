import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
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
  Searchbar,
  FAB,
  Menu,
  Divider,
  useTheme,
  IconButton,
  Portal,
  Dialog,
  SegmentedButtons,
} from 'react-native-paper';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { CareTask, CareSchedule, CareSession } from '../types';

const CareScreen: React.FC = () => {
  const theme = useTheme();
  const { state, actions } = useContext(PlantCareGuideContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'tasks' | 'schedules' | 'history'>('tasks');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { careTasks, careSchedules, careSessions, plants } = state;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return careTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.plantName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || task.type === filterType;
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      // Sort by due date, then by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [careTasks, searchQuery, filterType]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return careSchedules.filter(schedule => {
      const matchesSearch = schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          schedule.plantName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || schedule.type === filterType;
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
  }, [careSchedules, searchQuery, filterType]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return careSessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.plantName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || session.type === filterType;
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [careSessions, searchQuery, filterType]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await actions.fetchAllData();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await actions.completeCareTask(taskId);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      if (viewMode === 'tasks') {
        await actions.deleteCareTask(itemToDelete.id);
      } else if (viewMode === 'schedules') {
        await actions.deleteCareSchedule(itemToDelete.id);
      } else if (viewMode === 'history') {
        await actions.deleteCareSession(itemToDelete.id);
      }
      setDeleteDialogVisible(false);
      setItemToDelete(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'watering': return 'water';
      case 'fertilizing': return 'leaf';
      case 'pruning': return 'scissors-cutting';
      case 'repotting': return 'flower-pot';
      case 'pest_control': return 'bug';
      default: return 'leaf';
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'watering': return theme.colors.primary;
      case 'fertilizing': return theme.colors.secondary;
      case 'pruning': return theme.colors.tertiary;
      case 'repotting': return theme.colors.error;
      case 'pest_control': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const renderTaskItem = ({ item }: { item: CareTask }) => (
    <Card style={[
      styles.taskCard,
      item.completed && styles.completedTask,
      isOverdue(item.dueDate!) && !item.completed && styles.overdueTask
    ]}>
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <Avatar.Icon
              size={40}
              icon={getTaskIcon(item.type)}
              style={{ backgroundColor: getTaskColor(item.type) }}
            />
            <View style={styles.taskDetails}>
              <Title style={item.completed ? styles.completedText : undefined}>
                {item.title}
              </Title>
              <Paragraph>{item.plantName}</Paragraph>
              {item.dueDate && (
                <Paragraph style={[
                  styles.dueDate,
                  isOverdue(item.dueDate) && !item.completed && styles.overdueText
                ]}>
                  📅 {new Date(item.dueDate).toLocaleDateString()}
                  {isOverdue(item.dueDate) && !item.completed && ' (Overdue)'}
                </Paragraph>
              )}
            </View>
          </View>
          <View style={styles.taskActions}>
            {!item.completed && (
              <IconButton
                icon="check"
                onPress={() => handleCompleteTask(item.id)}
                style={styles.completeButton}
              />
            )}
            <Menu
              visible={menuVisible === item.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(item.id)}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setMenuVisible(null);
                  // Navigate to edit task
                }}
                title="Edit Task"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(null);
                  setItemToDelete(item);
                  setDeleteDialogVisible(true);
                }}
                title="Delete Task"
                leadingIcon="delete"
              />
            </Menu>
          </View>
        </View>

        {item.notes && (
          <Paragraph style={styles.notesText}>
            📝 {item.notes}
          </Paragraph>
        )}

        <View style={styles.taskStats}>
          <Chip mode="outlined" style={{ backgroundColor: getTaskColor(item.type) + '20' }}>
            {item.type}
          </Chip>
          {item.completed && (
            <Chip mode="outlined" icon="check" style={{ backgroundColor: theme.colors.primary + '20' }}>
              Completed
            </Chip>
          )}
          {item.priority && (
            <Chip mode="outlined" style={{ backgroundColor: theme.colors.error + '20' }}>
              {item.priority}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderScheduleItem = ({ item }: { item: CareSchedule }) => (
    <Card style={styles.scheduleCard}>
      <Card.Content>
        <View style={styles.scheduleHeader}>
          <Avatar.Icon
            size={40}
            icon={getTaskIcon(item.type)}
            style={{ backgroundColor: getTaskColor(item.type) }}
          />
          <View style={styles.scheduleDetails}>
            <Title>{item.title}</Title>
            <Paragraph>{item.plantName}</Paragraph>
            <Paragraph>🔄 {item.frequency} • Next: {new Date(item.nextDueDate).toLocaleDateString()}</Paragraph>
          </View>
          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(item.id)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(null);
                // Navigate to edit schedule
              }}
              title="Edit Schedule"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(null);
                setItemToDelete(item);
                setDeleteDialogVisible(true);
              }}
              title="Delete Schedule"
              leadingIcon="delete"
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSessionItem = ({ item }: { item: CareSession }) => (
    <Card style={styles.sessionCard}>
      <Card.Content>
        <View style={styles.sessionHeader}>
          <Avatar.Icon
            size={40}
            icon={getTaskIcon(item.type)}
            style={{ backgroundColor: getTaskColor(item.type) }}
          />
          <View style={styles.sessionDetails}>
            <Title>{item.title}</Title>
            <Paragraph>{item.plantName}</Paragraph>
            <Paragraph>📅 {new Date(item.date).toLocaleDateString()}</Paragraph>
            {item.duration && (
              <Paragraph>⏱️ {item.duration} minutes</Paragraph>
            )}
          </View>
          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(item.id)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(null);
                // Navigate to session details
              }}
              title="View Details"
              leadingIcon="information"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(null);
                setItemToDelete(item);
                setDeleteDialogVisible(true);
              }}
              title="Delete Session"
              leadingIcon="delete"
            />
          </Menu>
        </View>

        {item.notes && (
          <Paragraph style={styles.notesText}>
            📝 {item.notes}
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Avatar.Icon
        size={80}
        icon={viewMode === 'tasks' ? 'checkbox-blank-outline' : viewMode === 'schedules' ? 'calendar' : 'history'}
        style={{ backgroundColor: theme.colors.outline }}
      />
      <Title style={styles.emptyTitle}>
        No {viewMode === 'tasks' ? 'Tasks' : viewMode === 'schedules' ? 'Schedules' : 'History'} Found
      </Title>
      <Paragraph style={styles.emptyText}>
        {searchQuery || filterType !== 'all'
          ? 'Try adjusting your search or filters'
          : `No ${viewMode} yet. Create your first ${viewMode.slice(0, -1)} to get started!`
        }
      </Paragraph>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* View Mode Selector */}
      <Card style={styles.viewModeCard}>
        <Card.Content>
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode}
            buttons={[
              { value: 'tasks', label: 'Tasks', icon: 'checkbox-blank-outline' },
              { value: 'schedules', label: 'Schedules', icon: 'calendar' },
              { value: 'history', label: 'History', icon: 'history' },
            ]}
          />
        </Card.Content>
      </Card>

      {/* Search and Filters */}
      <Card style={styles.searchCard}>
        <Card.Content>
          <Searchbar
            placeholder={`Search ${viewMode}...`}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          
          <View style={styles.filterContainer}>
            <View style={styles.filterChips}>
              {['all', 'watering', 'fertilizing', 'pruning', 'repotting', 'pest_control'].map((type) => (
                <Chip
                  key={type}
                  selected={filterType === type}
                  onPress={() => setFilterType(type)}
                  style={styles.filterChip}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </Chip>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* List */}
      <FlatList
        data={
          viewMode === 'tasks' ? filteredTasks :
          viewMode === 'schedules' ? filteredSchedules :
          filteredSessions
        }
        renderItem={
          viewMode === 'tasks' ? renderTaskItem :
          viewMode === 'schedules' ? renderScheduleItem :
          renderSessionItem
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {/* Navigate to add item based on viewMode */}}
      />

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete {viewMode.slice(0, -1)}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete this {viewMode.slice(0, -1)}? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteItem} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  viewModeCard: {
    marginBottom: 16,
  },
  searchCard: {
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: 80, // Space for FAB
  },
  taskCard: {
    marginBottom: 12,
  },
  completedTask: {
    opacity: 0.6,
  },
  overdueTask: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  taskDetails: {
    marginLeft: 12,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  overdueText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#4caf50',
  },
  taskStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  notesText: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
  },
  scheduleCard: {
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleDetails: {
    marginLeft: 12,
    flex: 1,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sessionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CareScreen; 