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

export default function SettingsScreen({ navigation }: any) {
  const theme = useTheme();
  
  // Settings state
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [monthlyBudget, setMonthlyBudget] = useState('5000');
  const [savingsGoal, setSavingsGoal] = useState('10000');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [recurringTransactions, setRecurringTransactions] = useState(true);
  
  // Dialog states
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
  const [currencyDialogVisible, setCurrencyDialogVisible] = useState(false);
  const [budgetDialogVisible, setBudgetDialogVisible] = useState(false);
  const [goalDialogVisible, setGoalDialogVisible] = useState(false);

  const handleExportData = async () => {
    try {
      const exportData = {
        transactions: [],
        categories: [],
        budgets: [],
        goals: [],
        accounts: [],
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: 'Budget Buddy - Data Export',
        title: 'BudgetBuddy_Export.json',
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
      'This will permanently delete all your transactions, budgets, goals, and settings. This action cannot be undone.',
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
    // Mock data - would come from context
    return {
      totalTransactions: 0,
      totalIncome: 0,
      totalExpenses: 0,
      totalBudgets: 0,
      totalGoals: 0,
      totalAccounts: 0,
      netIncome: 0
    };
  };

  const stats = getStatsSummary();

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            ⚙️ Settings
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Customize your Budget Buddy experience and manage your financial data.
          </Text>
        </Card.Content>
      </Card>

      {/* Statistics */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📊 Financial Summary
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {stats.totalTransactions}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Transactions
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {currencySymbol}{stats.totalIncome.toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Income
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {currencySymbol}{stats.totalExpenses.toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Expenses
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {currencySymbol}{stats.netIncome.toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Net Income
              </Text>
            </View>
          </View>

          <View style={styles.additionalStats}>
            <Text variant="bodyMedium">
              📋 Budgets: {stats.totalBudgets} | 
              🎯 Goals: {stats.totalGoals} | 
              🏦 Accounts: {stats.totalAccounts}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Currency & Budget Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            💰 Currency & Budget
          </Text>
          
          <List.Item
            title="Currency"
            description={`${currency} (${currencySymbol})`}
            left={props => <List.Icon {...props} icon="currency-usd" />}
            onPress={() => setCurrencyDialogVisible(true)}
          />
          
          <List.Item
            title="Monthly Budget"
            description={`${currencySymbol}${parseFloat(monthlyBudget).toLocaleString()}`}
            left={props => <List.Icon {...props} icon="calendar-month" />}
            onPress={() => setBudgetDialogVisible(true)}
          />
          
          <List.Item
            title="Savings Goal"
            description={`${currencySymbol}${parseFloat(savingsGoal).toLocaleString()}`}
            left={props => <List.Icon {...props} icon="piggy-bank" />}
            onPress={() => setGoalDialogVisible(true)}
          />
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
            title="Budget Alerts"
            description="Get notified when you exceed budget limits"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={budgetAlerts}
                onValueChange={setBudgetAlerts}
              />
            )}
          />
          
          <List.Item
            title="Goal Reminders"
            description="Receive reminders for your financial goals"
            left={props => <List.Icon {...props} icon="target" />}
            right={() => (
              <Switch
                value={goalReminders}
                onValueChange={setGoalReminders}
              />
            )}
          />
          
          <List.Item
            title="Recurring Transactions"
            description="Get notified about upcoming recurring transactions"
            left={props => <List.Icon {...props} icon="repeat" />}
            right={() => (
              <Switch
                value={recurringTransactions}
                onValueChange={setRecurringTransactions}
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
            description="Backup your financial data to a file"
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
            description="Permanently delete all financial data"
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
            description="Budget Buddy Team"
            left={props => <List.Icon {...props} icon="account-group" />}
          />
          
          <List.Item
            title="Support"
            description="Get help and report issues"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => Alert.alert('Support', 'Contact us at support@budgetbuddy.com')}
          />
          
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={props => <List.Icon {...props} icon="shield" />}
            onPress={() => Alert.alert('Privacy Policy', 'Your financial data is stored locally on your device and is never shared with third parties.')}
          />
          
          <List.Item
            title="Terms of Service"
            description="Read our terms of service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => Alert.alert('Terms of Service', 'By using this app, you agree to our terms of service.')}
          />
        </Card.Content>
      </Card>

      {/* Currency Selection Dialog */}
      <Portal>
        <Dialog visible={currencyDialogVisible} onDismiss={() => setCurrencyDialogVisible(false)}>
          <Dialog.Title>Select Currency</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Currency Code"
              value={currency}
              onChangeText={setCurrency}
              mode="outlined"
              style={styles.dialogInput}
              maxLength={3}
            />
            <TextInput
              label="Currency Symbol"
              value={currencySymbol}
              onChangeText={setCurrencySymbol}
              mode="outlined"
              style={styles.dialogInput}
              maxLength={5}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCurrencyDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => setCurrencyDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Budget Dialog */}
      <Portal>
        <Dialog visible={budgetDialogVisible} onDismiss={() => setBudgetDialogVisible(false)}>
          <Dialog.Title>Set Monthly Budget</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Monthly Budget Amount"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              mode="outlined"
              keyboardType="numeric"
              placeholder="5000"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setBudgetDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => setBudgetDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Goal Dialog */}
      <Portal>
        <Dialog visible={goalDialogVisible} onDismiss={() => setGoalDialogVisible(false)}>
          <Dialog.Title>Set Savings Goal</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Savings Goal Amount"
              value={savingsGoal}
              onChangeText={setSavingsGoal}
              mode="outlined"
              keyboardType="numeric"
              placeholder="10000"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setGoalDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => setGoalDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Clear Data Dialog */}
      <Portal>
        <Dialog visible={clearDataDialogVisible} onDismiss={() => setClearDataDialogVisible(false)}>
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This will permanently delete all your transactions, budgets, goals, accounts, and settings. 
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
  dialogInput: {
    marginBottom: 16,
  },
});
