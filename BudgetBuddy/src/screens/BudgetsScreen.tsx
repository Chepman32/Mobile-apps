import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  List,
  IconButton,
  Chip,
  Portal,
  Dialog,
  TextInput,
  ProgressBar,
  useTheme
} from 'react-native-paper';

export default function BudgetsScreen({ navigation }: any) {
  const theme = useTheme();
  
  // Mock data - would come from context
  const budgets = [];
  const categories = [];
  const transactions = [];
  
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteBudget = async () => {
    if (!selectedBudget) return;
    
    try {
      setLoading(true);
      // await deleteBudget(selectedBudget.id);
      setDeleteDialogVisible(false);
      Alert.alert('Success', 'Budget deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBudget = async () => {
    if (!selectedBudget || !editName.trim() || !editAmount.trim()) return;
    
    try {
      setLoading(true);
      // await updateBudget(selectedBudget.id, {
      //   name: editName.trim(),
      //   amount: parseFloat(editAmount),
      // });
      setEditDialogVisible(false);
      Alert.alert('Success', 'Budget updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update budget');
    } finally {
      setLoading(false);
    }
  };

  const getBudgetProgress = (budget) => {
    const budgetTransactions = transactions.filter(t => 
      t.categoryId === budget.categoryId && t.type === 'expense'
    );
    const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const remaining = budget.amount - spent;
    
    return {
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      isOverBudget: percentage > 100
    };
  };

  const getBudgetColor = (percentage) => {
    if (percentage >= 100) return '#FF4444';
    if (percentage >= 80) return '#FF8800';
    if (percentage >= 60) return '#FFAA00';
    return '#00AA00';
  };

  const formatPeriod = (period) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No end date';
    return new Date(dateString).toLocaleDateString();
  };

  const openEditDialog = (budget) => {
    setSelectedBudget(budget);
    setEditName(budget.name);
    setEditAmount(budget.amount.toString());
    setEditDialogVisible(true);
  };

  const openDeleteDialog = (budget) => {
    setSelectedBudget(budget);
    setDeleteDialogVisible(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            📋 Budgets
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Track your spending limits and budget progress.
          </Text>
        </Card.Content>
      </Card>

      {/* Add Budget Button */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddBudget')}
            icon="plus"
            style={styles.addButton}
          >
            Add New Budget
          </Button>
        </Card.Content>
      </Card>

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No budgets created yet. Create your first budget to start tracking your spending!
            </Text>
          </Card.Content>
        </Card>
      ) : (
        budgets.map(budget => {
          const category = categories.find(cat => cat.id === budget.categoryId);
          const progress = getBudgetProgress(budget);
          
          return (
            <Card key={budget.id} style={styles.budgetCard}>
              <Card.Content>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetInfo}>
                    <Text variant="titleMedium" style={styles.budgetName}>
                      {budget.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.budgetCategory}>
                      {category?.name || 'Uncategorized'}
                    </Text>
                  </View>
                  
                  <View style={styles.budgetActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => openEditDialog(budget)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => openDeleteDialog(budget)}
                      iconColor={theme.colors.error}
                    />
                  </View>
                </View>

                {/* Budget Details */}
                <View style={styles.budgetDetails}>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Budget Amount:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      ${budget.amount.toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Period:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {formatPeriod(budget.period)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Start Date:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {formatDate(budget.startDate)}
                    </Text>
                  </View>
                  
                  {budget.endDate && (
                    <View style={styles.detailRow}>
                      <Text variant="bodySmall" style={styles.detailLabel}>
                        End Date:
                      </Text>
                      <Text variant="bodySmall" style={styles.detailValue}>
                        {formatDate(budget.endDate)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Progress Section */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text variant="bodyMedium" style={styles.progressTitle}>
                      Progress
                    </Text>
                    <Text variant="bodySmall" style={[
                      styles.progressPercentage,
                      { color: getBudgetColor(progress.percentage) }
                    ]}>
                      {progress.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  
                  <ProgressBar
                    progress={progress.percentage / 100}
                    color={getBudgetColor(progress.percentage)}
                    style={styles.progressBar}
                  />
                  
                  <View style={styles.progressStats}>
                    <View style={styles.progressStat}>
                      <Text variant="bodySmall" style={styles.statLabel}>
                        Spent
                      </Text>
                      <Text variant="titleSmall" style={[styles.statValue, { color: '#FF4444' }]}>
                        ${progress.spent.toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={styles.progressStat}>
                      <Text variant="bodySmall" style={styles.statLabel}>
                        Remaining
                      </Text>
                      <Text variant="titleSmall" style={[
                        styles.statValue,
                        { color: progress.remaining >= 0 ? '#00AA00' : '#FF4444' }
                      ]}>
                        ${Math.abs(progress.remaining).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Budget Tags */}
                <View style={styles.budgetTags}>
                  <Chip
                    mode="outlined"
                    style={[
                      styles.statusChip,
                      { borderColor: budget.isActive ? '#00AA00' : '#666666' }
                    ]}
                    textStyle={{ color: budget.isActive ? '#00AA00' : '#666666' }}
                  >
                    {budget.isActive ? 'Active' : 'Inactive'}
                  </Chip>
                  
                  {progress.isOverBudget && (
                    <Chip
                      mode="outlined"
                      style={[styles.statusChip, { borderColor: '#FF4444' }]}
                      textStyle={{ color: '#FF4444' }}
                    >
                      Over Budget
                    </Chip>
                  )}
                  
                  {progress.percentage >= budget.alertThreshold && !progress.isOverBudget && (
                    <Chip
                      mode="outlined"
                      style={[styles.statusChip, { borderColor: '#FF8800' }]}
                      textStyle={{ color: '#FF8800' }}
                    >
                      Alert Threshold
                    </Chip>
                  )}
                </View>

                {/* View Transactions Button */}
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Transactions', { categoryId: budget.categoryId })}
                  style={styles.viewTransactionsButton}
                >
                  View Transactions
                </Button>
              </Card.Content>
            </Card>
          );
        })
      )}

      {/* Summary Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📊 Budget Summary
          </Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {budgets.length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Total Budgets
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {budgets.filter(b => b.isActive).length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Active Budgets
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                {budgets.filter(b => {
                  const progress = getBudgetProgress(b);
                  return progress.isOverBudget;
                }).length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Over Budget
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall" style={styles.summaryNumber}>
                ${budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Total Budget
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Edit Budget Dialog */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Budget</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Budget Name"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
              style={styles.dialogInput}
              maxLength={50}
            />
            <TextInput
              label="Budget Amount"
              value={editAmount}
              onChangeText={setEditAmount}
              mode="outlined"
              style={styles.dialogInput}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleEditBudget}
              loading={loading}
              disabled={!editName.trim() || !editAmount.trim()}
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Budget Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Budget</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{selectedBudget?.name}"? 
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleDeleteBudget}
              loading={loading}
              textColor={theme.colors.error}
            >
              Delete
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
  addButton: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  budgetCard: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  budgetCategory: {
    opacity: 0.7,
  },
  budgetActions: {
    flexDirection: 'row',
  },
  budgetDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    opacity: 0.7,
  },
  detailValue: {
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  budgetTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusChip: {
    marginBottom: 4,
  },
  viewTransactionsButton: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
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
  dialogInput: {
    marginBottom: 16,
  },
});
