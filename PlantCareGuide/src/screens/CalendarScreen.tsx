import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
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
  useTheme,
  IconButton,
  Portal,
  Dialog,
  SegmentedButtons,
} from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { PlantCareGuideContext } from '../context/PlantCareGuideContext';
import { CareTask, CareSchedule, CareSession, CalendarEvent } from '../types';

const CalendarScreen: React.FC = () => {
  const theme = useTheme();
  const { state, actions } = useContext(PlantCareGuideContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { careTasks, careSchedules, careSessions, calendarEvents } = state;

  // Prepare calendar data
  const calendarData = useMemo(() => {
    const marked: any = {};
    const events: any = {};

    // Mark dates with tasks
    careTasks.forEach(task => {
      if (task.dueDate) {
        const date = task.dueDate.split('T')[0];
        if (!marked[date]) {
          marked[date] = { marked: true, dotColor: theme.colors.primary };
        }
        if (!events[date]) events[date] = [];
        events[date].push({
          type: 'task',
          data: task,
          color: theme.colors.primary,
        });
      }
    });

    // Mark dates with scheduled events
    careSchedules.forEach(schedule => {
      const date = schedule.nextDueDate.split('T')[0];
      if (!marked[date]) {
        marked[date] = { marked: true, dotColor: theme.colors.secondary };
      }
      if (!events[date]) events[date] = [];
      events[date].push({
        type: 'schedule',
        data: schedule,
        color: theme.colors.secondary,
      });
    });

    // Mark dates with completed sessions
    careSessions.forEach(session => {
      const date = session.date.split('T')[0];
      if (!marked[date]) {
        marked[date] = { marked: true, dotColor: theme.colors.tertiary };
      }
      if (!events[date]) events[date] = [];
      events[date].push({
        type: 'session',
        data: session,
        color: theme.colors.tertiary,
      });
    });

    // Mark dates with calendar events
    calendarEvents.forEach(event => {
      const date = event.date.split('T')[0];
      if (!marked[date]) {
        marked[date] = { marked: true, dotColor: theme.colors.error };
      }
      if (!events[date]) events[date] = [];
      events[date].push({
        type: 'event',
        data: event,
        color: theme.colors.error,
      });
    });

    return { marked, events };
  }, [careTasks, careSchedules, careSessions, calendarEvents, theme.colors]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    const date = selectedDate;
    return calendarData.events[date] || [];
  }, [selectedDate, calendarData.events]);

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

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'task') {
        await actions.deleteCareTask(itemToDelete.data.id);
      } else if (itemToDelete.type === 'schedule') {
        await actions.deleteCareSchedule(itemToDelete.data.id);
      } else if (itemToDelete.type === 'session') {
        await actions.deleteCareSession(itemToDelete.data.id);
      } else if (itemToDelete.type === 'event') {
        await actions.deleteCalendarEvent(itemToDelete.data.id);
      }
      setDeleteDialogVisible(false);
      setItemToDelete(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'watering': return 'water';
      case 'fertilizing': return 'leaf';
      case 'pruning': return 'scissors-cutting';
      case 'repotting': return 'flower-pot';
      case 'pest_control': return 'bug';
      default: return 'calendar';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'watering': return theme.colors.primary;
      case 'fertilizing': return theme.colors.secondary;
      case 'pruning': return theme.colors.tertiary;
      case 'repotting': return theme.colors.error;
      case 'pest_control': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const renderEventItem = (event: any) => {
    const { type, data, color } = event;
    
    return (
      <Card key={`${type}-${data.id}`} style={styles.eventCard}>
        <Card.Content>
          <View style={styles.eventHeader}>
            <Avatar.Icon
              size={40}
              icon={getEventIcon(data.type || type)}
              style={{ backgroundColor: color }}
            />
            <View style={styles.eventDetails}>
              <Title>{data.title}</Title>
              <Paragraph>{data.plantName || 'General'}</Paragraph>
              {type === 'task' && data.dueDate && (
                <Paragraph>📅 Due: {new Date(data.dueDate).toLocaleDateString()}</Paragraph>
              )}
              {type === 'schedule' && (
                <Paragraph>🔄 {data.frequency} • Next: {new Date(data.nextDueDate).toLocaleDateString()}</Paragraph>
              )}
              {type === 'session' && (
                <Paragraph>✅ Completed: {new Date(data.date).toLocaleDateString()}</Paragraph>
              )}
              {type === 'event' && (
                <Paragraph>📅 {new Date(data.date).toLocaleDateString()}</Paragraph>
              )}
            </View>
            <IconButton
              icon="dots-vertical"
              onPress={() => {
                setItemToDelete(event);
                setDeleteDialogVisible(true);
              }}
            />
          </View>

          {data.notes && (
            <Paragraph style={styles.notesText}>
              📝 {data.notes}
            </Paragraph>
          )}

          <View style={styles.eventStats}>
            <Chip mode="outlined" style={{ backgroundColor: color + '20' }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Chip>
            {data.type && (
              <Chip mode="outlined" style={{ backgroundColor: getEventColor(data.type) + '20' }}>
                {data.type.replace('_', ' ')}
              </Chip>
            )}
            {type === 'task' && data.completed && (
              <Chip mode="outlined" icon="check" style={{ backgroundColor: theme.colors.primary + '20' }}>
                Completed
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Avatar.Icon
        size={80}
        icon="calendar-blank"
        style={{ backgroundColor: theme.colors.outline }}
      />
      <Title style={styles.emptyTitle}>No Events Today</Title>
      <Paragraph style={styles.emptyText}>
        {selectedDate === new Date().toISOString().split('T')[0]
          ? 'No events scheduled for today. Add some care tasks or schedules!'
          : `No events scheduled for ${new Date(selectedDate).toLocaleDateString()}.`
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
              { value: 'calendar', label: 'Calendar', icon: 'calendar' },
              { value: 'list', label: 'List', icon: 'format-list-bulleted' },
            ]}
          />
        </Card.Content>
      </Card>

      {viewMode === 'calendar' ? (
        <>
          {/* Calendar */}
          <Card style={styles.calendarCard}>
            <Card.Content>
              <Calendar
                current={selectedDate}
                onDayPress={handleDateSelect}
                markedDates={{
                  ...calendarData.marked,
                  [selectedDate]: {
                    ...calendarData.marked[selectedDate],
                    selected: true,
                    selectedColor: theme.colors.primary,
                  },
                }}
                theme={{
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.colors.primary,
                  dayTextColor: theme.colors.onSurface,
                  textDisabledColor: theme.colors.outline,
                  arrowColor: theme.colors.primary,
                  monthTextColor: theme.colors.onSurface,
                  indicatorColor: theme.colors.primary,
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13,
                }}
              />
            </Card.Content>
          </Card>

          {/* Selected Date Events */}
          <Card style={styles.eventsCard}>
            <Card.Content>
              <Title>Events for {new Date(selectedDate).toLocaleDateString()}</Title>
              <ScrollView
                style={styles.eventsList}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map(renderEventItem)
                ) : (
                  renderEmptyState()
                )}
              </ScrollView>
            </Card.Content>
          </Card>
        </>
      ) : (
        /* List View */
        <ScrollView
          style={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Upcoming Tasks */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title>Upcoming Tasks</Title>
              {careTasks
                .filter(task => !task.completed && task.dueDate)
                .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                .slice(0, 5)
                .map(task => renderEventItem({
                  type: 'task',
                  data: task,
                  color: getEventColor(task.type),
                }))}
              {careTasks.filter(task => !task.completed).length === 0 && (
                <Paragraph style={styles.emptyText}>No upcoming tasks</Paragraph>
              )}
            </Card.Content>
          </Card>

          {/* Active Schedules */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title>Active Schedules</Title>
              {careSchedules
                .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
                .slice(0, 5)
                .map(schedule => renderEventItem({
                  type: 'schedule',
                  data: schedule,
                  color: getEventColor(schedule.type),
                }))}
              {careSchedules.length === 0 && (
                <Paragraph style={styles.emptyText}>No active schedules</Paragraph>
              )}
            </Card.Content>
          </Card>

          {/* Recent Sessions */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title>Recent Care Sessions</Title>
              {careSessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(session => renderEventItem({
                  type: 'session',
                  data: session,
                  color: getEventColor(session.type),
                }))}
              {careSessions.length === 0 && (
                <Paragraph style={styles.emptyText}>No recent sessions</Paragraph>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      )}

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Event</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete this event? This action cannot be undone.
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
  calendarCard: {
    marginBottom: 16,
  },
  eventsCard: {
    marginBottom: 16,
  },
  eventsList: {
    maxHeight: 300,
  },
  listContainer: {
    flex: 1,
  },
  sectionCard: {
    marginBottom: 16,
  },
  eventCard: {
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventDetails: {
    marginLeft: 12,
    flex: 1,
  },
  notesText: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
  },
  eventStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
    fontStyle: 'italic',
  },
});

export default CalendarScreen; 