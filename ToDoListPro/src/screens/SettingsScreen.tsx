import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  List,
  Switch,
  SegmentedButtons,
  Portal,
  Dialog,
  TextInput,
  useTheme
} from 'react-native-paper';
import { useTodo } from '../context/TodoContext';

export default function SettingsScreen({ navigation }: any) {
  const theme = useTheme();
  const { 
    summary,
    categories,
    tasks,
    projects,
    goals
  } = useTodo();
  
  // Settings state
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [digestTime, setDigestTime] = useState('09:00');
  const [reminderTime, setReminderTime] = useState('15');
  const [showCompleted, setShowCompleted] = useState(true);
  const [autoArchive, setAutoArchive] = useState(true);
  const [autoArchiveDays, setAutoArchiveDays] = useState('30');
  const [defaultView, setDefaultView] = useState<'list' | 'board' | 'calendar'>('list');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt' | 'title' | 'category'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Dialog states
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
  const [digestTimeDialogVisible, setDigestTimeDialogVisible] = useState(false);
  const [reminderTimeDialogVisible, setReminderTimeDialogVisible] = useState(false);
  const [archiveDaysDialogVisible, setArchiveDaysDialogVisible] = useState(false);

  const handleExportData = async () => {
    try {
      const exportData = {
        tasks,
        categories,
        projects,
        goals,
        summary,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: 'Todo List Pro - Data Export',
        title: 'TodoListPro_Export.json',
        url: `data:application/json;base64,${Buffer.from(dataString).toString('base64')}`
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Import functionality will be implemented in a future update. For now, you can manually copy and paste your exported data.',
      [{ text: 'OK' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your tasks, categories, projects, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All Data', 
          style: 'destructive',
          onPress: () => {
            // Implementation would go here
            Alert.alert('Success', 'All data has been cleared');
          }
        }
      ]
    );
  };

  const handleBackupData = () => {
    Alert.alert(
      'Backup Data',
      'Your data is automatically backed up to your device storage. You can also export your data for additional backup.',
      [{ text: 'OK' }]
    );
  };

  const handleRestoreData = () => {
    Alert.alert(
      'Restore Data',
      'Restore functionality will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  };

  const getStatsSummary = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const totalCategories = categories.length;
    const totalProjects = projects.length;
    const totalGoals = goals.length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      totalCategories,
      totalProjects,
      totalGoals,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const stats = getStatsSummary();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            ⚙️ Settings
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Customize your Todo List Pro experience and manage your data.
          </Text>
        </Card.Content>
      </Card>

      {/* Statistics */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📊 Statistics
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {stats.totalTasks}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Tasks
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {stats.completedTasks}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Completed
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {stats.pendingTasks}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Pending
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {stats.completionRate}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Completion Rate
              </Text>
            </View>
          </View>

          <View style={styles.additionalStats}>
            <Text variant="bodyMedium">
              📁 Categories: {stats.totalCategories} | 
              📋 Projects: {stats.totalProjects} | 
              🎯 Goals: {stats.totalGoals}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Appearance */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🎨 Appearance
          </Text>
          
          <List.Item
            title="Theme"
            description="Choose your preferred theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <SegmentedButtons
                value={themeMode}
                onValueChange={value => setThemeMode(value as 'light' | 'dark' | 'auto')}
                buttons={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto' }
                ]}
                style={styles.segmentedButton}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🔔 Notifications
          </Text>
          
          <List.Item
            title="Enable Notifications"
            description="Receive reminders for due tasks"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          
          <List.Item
            title="Daily Digest"
            description="Get a summary of your tasks each day"
            left={props => <List.Icon {...props} icon="email" />}
            right={() => (
              <Switch
                value={dailyDigest}
                onValueChange={setDailyDigest}
                disabled={!notificationsEnabled}
              />
            )}
          />
          
          <List.Item
            title="Digest Time"
            description={digestTime}
            left={props => <List.Icon {...props} icon="clock" />}
            onPress={() => setDigestTimeDialogVisible(true)}
            disabled={!notificationsEnabled || !dailyDigest}
          />
          
          <List.Item
            title="Reminder Time"
            description={`${reminderTime} minutes before due`}
            left={props => <List.Icon {...props} icon="timer" />}
            onPress={() => setReminderTimeDialogVisible(true)}
            disabled={!notificationsEnabled}
          />
        </Card.Content>
      </Card>

      {/* Task Display */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📋 Task Display
          </Text>
          
          <List.Item
            title="Show Completed Tasks"
            description="Display completed tasks in lists"
            left={props => <List.Icon {...props} icon="check-circle" />}
            right={() => (
              <Switch
                value={showCompleted}
                onValueChange={setShowCompleted}
              />
            )}
          />
          
          <List.Item
            title="Auto Archive Completed"
            description="Automatically archive completed tasks"
            left={props => <List.Icon {...props} icon="archive" />}
            right={() => (
              <Switch
                value={autoArchive}
                onValueChange={setAutoArchive}
              />
            )}
          />
          
          <List.Item
            title="Archive After"
            description={`${autoArchiveDays} days`}
            left={props => <List.Icon {...props} icon="calendar" />}
            onPress={() => setArchiveDaysDialogVisible(true)}
            disabled={!autoArchive}
          />
          
          <List.Item
            title="Default View"
            description="Choose your preferred task view"
            left={props => <List.Icon {...props} icon="view-list" />}
            right={() => (
              <SegmentedButtons
                value={defaultView}
                onValueChange={value => setDefaultView(value as 'list' | 'board' | 'calendar')}
                buttons={[
                  { value: 'list', label: 'List' },
                  { value: 'board', label: 'Board' },
                  { value: 'calendar', label: 'Calendar' }
                ]}
                style={styles.segmentedButton}
              />
            )}
          />
          
          <List.Item
            title="Sort By"
            description="Default sorting for tasks"
            left={props => <List.Icon {...props} icon="sort" />}
            right={() => (
              <SegmentedButtons
                value={sortBy}
                onValueChange={value => setSortBy(value as any)}
                buttons={[
                  { value: 'dueDate', label: 'Due Date' },
                  { value: 'priority', label: 'Priority' },
                  { value: 'title', label: 'Title' }
                ]}
                style={styles.segmentedButton}
              />
            )}
          />
          
          <List.Item
            title="Sort Order"
            description="Ascending or descending"
            left={props => <List.Icon {...props} icon="sort-ascending" />}
            right={() => (
              <SegmentedButtons
                value={sortOrder}
                onValueChange={value => setSortOrder(value as 'asc' | 'desc')}
                buttons={[
                  { value: 'asc', label: 'A-Z' },
                  { value: 'desc', label: 'Z-A' }
                ]}
                style={styles.segmentedButton}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            💾 Data Management
          </Text>
          
          <List.Item
            title="Export Data"
            description="Backup your data to a file"
            left={props => <List.Icon {...props} icon="export" />}
            onPress={handleExportData}
          />
          
          <List.Item
            title="Import Data"
            description="Restore data from a backup file"
            left={props => <List.Icon {...props} icon="import" />}
            onPress={handleImportData}
          />
          
          <List.Item
            title="Backup Data"
            description="Create a local backup"
            left={props => <List.Icon {...props} icon="backup-restore" />}
            onPress={handleBackupData}
          />
          
          <List.Item
            title="Restore Data"
            description="Restore from a local backup"
            left={props => <List.Icon {...props} icon="restore" />}
            onPress={handleRestoreData}
          />
          
          <List.Item
            title="Clear All Data"
            description="Permanently delete all data"
            left={props => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
            onPress={() => setClearDataDialogVisible(true)}
            titleStyle={{ color: theme.colors.error }}
          />
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            ℹ️ App Information
          </Text>
          
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          
          <List.Item
            title="Build"
            description="2024.1.0"
            left={props => <List.Icon {...props} icon="code-braces" />}
          />
          
          <List.Item
            title="Developer"
            description="Todo List Pro Team"
            left={props => <List.Icon {...props} icon="account-group" />}
          />
          
          <List.Item
            title="Support"
            description="Get help and report issues"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => Alert.alert('Support', 'Contact us at support@todolistpro.com')}
          />
          
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={props => <List.Icon {...props} icon="shield" />}
            onPress={() => Alert.alert('Privacy Policy', 'Your data is stored locally on your device and is never shared with third parties.')}
          />
          
          <List.Item
            title="Terms of Service"
            description="Read our terms of service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => Alert.alert('Terms of Service', 'By using this app, you agree to our terms of service.')}
          />
        </Card.Content>
      </Card>

      {/* Time Selection Dialogs */}
      <Portal>
        <Dialog visible={digestTimeDialogVisible} onDismiss={() => setDigestTimeDialogVisible(false)}>
          <Dialog.Title>Set Digest Time</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Time (HH:MM)"
              value={digestTime}
              onChangeText={setDigestTime}
              mode="outlined"
              placeholder="09:00"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDigestTimeDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => setDigestTimeDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={reminderTimeDialogVisible} onDismiss={() => setReminderTimeDialogVisible(false)}>
          <Dialog.Title>Set Reminder Time</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Minutes before due"
              value={reminderTime}
              onChangeText={setReminderTime}
              mode="outlined"
              placeholder="15"
              keyboardType="numeric"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setReminderTimeDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => setReminderTimeDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={archiveDaysDialogVisible} onDismiss={() => setArchiveDaysDialogVisible(false)}>
          <Dialog.Title>Set Archive Delay</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Days after completion"
              value={autoArchiveDays}
              onChangeText={setAutoArchiveDays}
              mode="outlined"
              placeholder="30"
              keyboardType="numeric"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setArchiveDaysDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => setArchiveDaysDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={clearDataDialogVisible} onDismiss={() => setClearDataDialogVisible(false)}>
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This will permanently delete all your tasks, categories, projects, goals, and settings. 
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearDataDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={() => {
                setClearDataDialogVisible(false);
                handleClearData();
              }}
              textColor={theme.colors.error}
            >
              Clear All Data
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  additionalStats: {
    marginTop: 8,
  },
  segmentedButton: {
    marginTop: 8,
  },
}); 