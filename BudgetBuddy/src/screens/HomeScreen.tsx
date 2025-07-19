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
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PieChart } from 'react-native-chart-kit';
import { useBudget } from '../context/BudgetContext';
import { RootStackParamList } from '../../App';
import { spacing } from '../../../shared/theme/AppTheme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    summary,
    categorySpending,
    transactions,
    alerts,
    loading,
    getCategoryById,
    refreshData,
  } = useBudget();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getPieChartData = () => {
    if (categorySpending.length === 0) {
      return {
        labels: ['No data'],
        datasets: [{
          data: [1],
          colors: ['#E0E0E0'],
        }],
      };
    }

    const topCategories = categorySpending.slice(0, 6);
    const otherAmount = categorySpending
      .slice(6)
      .reduce((sum, cat) => sum + cat.amount, 0);

    const data = [...topCategories];
    if (otherAmount > 0) {
      data.push({
        categoryId: 'other',
        categoryName: 'Other',
        amount: otherAmount,
        percentage: 0,
        transactionCount: 0,
      });
    }

    return {
      labels: data.map(cat => cat.categoryName),
      datasets: [{
        data: data.map(cat => cat.amount),
        colors: data.map((_, index) => {
          const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];
          return colors[index % colors.length];
        }),
      }],
    };
  };

  const renderSummaryCard = () => {
    if (!summary) return null;

    const savingsColor = summary.netIncome >= 0 ? '#4CAF50' : '#F44336';
    const budgetUsedPercentage = summary.totalBudget > 0 
      ? (summary.budgetUsed / summary.totalBudget) * 100 
      : 0;

    return (
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.summaryTitle}>
            Monthly Overview
          </Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Income</Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: '#4CAF50' }]}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Expenses</Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: '#F44336' }]}>
                {formatCurrency(summary.totalExpenses)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Net Income</Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: savingsColor }]}>
                {formatCurrency(summary.netIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Savings Rate</Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: savingsColor }]}>
                {summary.savingsRate.toFixed(1)}%
              </Text>
            </View>
          </View>

          {summary.totalBudget > 0 && (
            <View style={styles.budgetProgress}>
              <View style={styles.budgetHeader}>
                <Text variant="bodyMedium">Budget Used</Text>
                <Text variant="bodyMedium">
                  {formatCurrency(summary.budgetUsed)} / {formatCurrency(summary.totalBudget)}
                </Text>
              </View>
              <ProgressBar
                progress={budgetUsedPercentage / 100}
                color={budgetUsedPercentage > 80 ? '#F44336' : '#4CAF50'}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={styles.budgetPercentage}>
                {budgetUsedPercentage.toFixed(1)}% used
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderAlertsCard = () => {
    if (alerts.length === 0) return null;

    const unreadAlerts = alerts.filter(alert => !alert.read);
    
    return (
      <Card style={styles.alertsCard}>
        <Card.Content>
          <View style={styles.alertsHeader}>
            <Text variant="titleMedium">Alerts</Text>
            <Chip icon="alert" size="small">
              {unreadAlerts.length}
            </Chip>
          </View>
          
          {unreadAlerts.slice(0, 3).map(alert => (
            <Banner
              key={alert.id}
              visible={true}
              icon={alert.severity === 'error' ? 'alert-circle' : 'alert'}
              style={[
                styles.alertBanner,
                { backgroundColor: alert.severity === 'error' ? '#FFEBEE' : '#FFF3E0' }
              ]}
            >
              <Text variant="bodyMedium" style={styles.alertText}>
                {alert.message}
              </Text>
            </Banner>
          ))}
          
          {unreadAlerts.length > 3 && (
            <Text variant="bodySmall" style={styles.moreAlerts}>
              +{unreadAlerts.length - 3} more alerts
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderSpendingChart = () => {
    if (categorySpending.length === 0) return null;

    const chartData = getPieChartData();

    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            Spending by Category
          </Text>
          
          <PieChart
            data={chartData.labels.map((label, index) => ({
              name: label,
              population: chartData.datasets[0].data[index],
              color: chartData.datasets[0].colors![index],
              legendFontColor: '#333',
              legendFontSize: 12,
            }))}
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

  const renderRecentTransactions = () => {
    const recentTransactions = getRecentTransactions();

    if (recentTransactions.length === 0) {
      return (
        <Card style={styles.transactionsCard}>
          <Card.Content>
            <Text variant="titleMedium">Recent Transactions</Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No transactions yet. Add your first transaction!
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.transactionsCard}>
        <Card.Content>
          <View style={styles.transactionsHeader}>
            <Text variant="titleMedium">Recent Transactions</Text>
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Transactions')}
            >
              View All
            </Button>
          </View>
          
          {recentTransactions.map(transaction => {
            const category = getCategoryById(transaction.categoryId);
            const isIncome = transaction.type === 'income';
            
            return (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <IconButton
                    icon={category?.icon || 'help-circle'}
                    size={24}
                    iconColor={category?.color || '#666'}
                  />
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text variant="bodyMedium" style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text variant="bodySmall" style={styles.transactionCategory}>
                    {category?.name || 'Unknown Category'}
                  </Text>
                  <Text variant="bodySmall" style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
                
                <Text 
                  variant="bodyLarge" 
                  style={[
                    styles.transactionAmount,
                    { color: isIncome ? '#4CAF50' : '#F44336' }
                  ]}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </Text>
              </View>
            );
          })}
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
            onPress={() => navigation.navigate('AddTransaction')}
          >
            Add Transaction
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
            icon="wallet"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Budgets')}
          >
            Budgets
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
        <Text variant="bodyLarge">Loading your budget data...</Text>
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
        {renderSpendingChart()}
        {renderRecentTransactions()}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
        label="Add Transaction"
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
  budgetProgress: {
    marginTop: spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  budgetPercentage: {
    textAlign: 'center',
    marginTop: spacing.xs,
    opacity: 0.7,
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
  alertText: {
    fontSize: 14,
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
  transactionsCard: {
    margin: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  transactionIcon: {
    marginRight: spacing.sm,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  transactionCategory: {
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  transactionDate: {
    opacity: 0.5,
    fontSize: 12,
  },
  transactionAmount: {
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
}); 