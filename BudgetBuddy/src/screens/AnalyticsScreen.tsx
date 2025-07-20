import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { 
  Text, 
  Card, 
  SegmentedButtons,
  useTheme
} from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen({ navigation }: any) {
  const theme = useTheme();
  
  // Mock data - would come from context
  const transactions = [];
  const categories = [];
  const budgets = [];
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [chartType, setChartType] = useState<'spending' | 'income' | 'categories' | 'budgets'>('spending');

  const getSpendingData = () => {
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
            const dayTransactions = transactions.filter(t => 
              t.date === date && t.type === 'expense'
            );
            return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
          }),
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const getIncomeData = () => {
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
            const dayTransactions = transactions.filter(t => 
              t.date === date && t.type === 'income'
            );
            return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
          }),
          color: (opacity = 1) => `rgba(76, 205, 196, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const getCategoryData = () => {
    const categorySpending = categories.map(category => {
      const categoryTransactions = transactions.filter(t => 
        t.categoryId === category.id && t.type === 'expense'
      );
      const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        amount: totalAmount,
        color: category.color
      };
    }).filter(cat => cat.amount > 0);

    if (categorySpending.length === 0) {
      return {
        labels: ['No Data'],
        data: [1]
      };
    }

    return {
      labels: categorySpending.map(cat => cat.name),
      data: categorySpending.map(cat => cat.amount)
    };
  };

  const getBudgetData = () => {
    if (!budgets || budgets.length === 0) {
      return {
        labels: ['No Budgets'],
        data: [1]
      };
    }

    return {
      labels: budgets.map(budget => budget.name),
      data: budgets.map(budget => {
        const budgetTransactions = transactions.filter(t => 
          t.categoryId === budget.categoryId && t.type === 'expense'
        );
        const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
        return (spent / budget.amount) * 100;
      })
    };
  };

  const getFinancialSummary = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate
    };
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

  const summary = getFinancialSummary();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            📊 Analytics
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Track your financial patterns and spending habits.
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

      {/* Financial Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            💰 Financial Summary
          </Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={[styles.metricNumber, { color: '#00AA00' }]}>
                ${summary.totalIncome.toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Total Income
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={[styles.metricNumber, { color: '#FF4444' }]}>
                ${summary.totalExpenses.toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Total Expenses
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={[
                styles.metricNumber, 
                { color: summary.netIncome >= 0 ? '#00AA00' : '#FF4444' }
              ]}>
                ${summary.netIncome.toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Net Income
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text variant="headlineSmall" style={[styles.metricNumber, { color: '#4ECDC4' }]}>
                {summary.savingsRate.toFixed(1)}%
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Savings Rate
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Progress Charts */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📈 Financial Progress
          </Text>
          
          <View style={styles.progressCharts}>
            <View style={styles.progressChart}>
              <Text variant="bodyMedium" style={styles.chartTitle}>
                Income vs Expenses
              </Text>
              <ProgressChart
                data={{
                  data: [summary.totalIncome > 0 ? summary.totalExpenses / summary.totalIncome : 0]
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
            
            <View style={styles.progressChart}>
              <Text variant="bodyMedium" style={styles.chartTitle}>
                Savings Rate
              </Text>
              <ProgressChart
                data={{
                  data: [summary.savingsRate / 100]
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
              { value: 'spending', label: 'Spending' },
              { value: 'income', label: 'Income' },
              { value: 'categories', label: 'Categories' },
              { value: 'budgets', label: 'Budgets' }
            ]}
            style={styles.segmentedButton}
          />
        </Card.Content>
      </Card>

      {/* Charts */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {chartType === 'spending' && '📉 Daily Spending'}
            {chartType === 'income' && '📈 Daily Income'}
            {chartType === 'categories' && '📊 Category Spending'}
            {chartType === 'budgets' && '🎯 Budget Progress'}
          </Text>
          
          {chartType === 'spending' && (
            <LineChart
              data={getSpendingData()}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
          
          {chartType === 'income' && (
            <LineChart
              data={getIncomeData()}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
          
          {chartType === 'categories' && (
            <PieChart
              data={getCategoryData().labels.map((label, index) => ({
                name: label,
                population: getCategoryData().data[index],
                color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5],
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
          
          {chartType === 'budgets' && (
            <BarChart
              data={getBudgetData()}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
            />
          )}
        </Card.Content>
      </Card>

      {/* Spending Insights */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            💡 Financial Insights
          </Text>
          
          <View style={styles.insightItem}>
            <Text variant="bodyMedium" style={styles.insightTitle}>
              💰 Top Spending Category
            </Text>
            <Text variant="bodySmall" style={styles.insightText}>
              {(() => {
                const categorySpending = categories.map(category => {
                  const categoryTransactions = transactions.filter(t => 
                    t.categoryId === category.id && t.type === 'expense'
                  );
                  const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                  return { name: category.name, amount: totalAmount };
                }).filter(cat => cat.amount > 0);
                
                if (categorySpending.length === 0) return 'No spending data available';
                
                const topCategory = categorySpending.reduce((a, b) => a.amount > b.amount ? a : b);
                return `${topCategory.name} ($${topCategory.amount.toLocaleString()})`;
              })()}
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Text variant="bodyMedium" style={styles.insightTitle}>
              📅 Best Saving Day
            </Text>
            <Text variant="bodySmall" style={styles.insightText}>
              {(() => {
                const dayStats = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                  const dayTransactions = transactions.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate.getDay() === index && t.type === 'expense';
                  });
                  const totalSpent = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
                  return { day, spent: totalSpent };
                });
                
                const bestDay = dayStats.reduce((a, b) => a.spent < b.spent ? a : b);
                return `${bestDay.day} ($${bestDay.spent.toLocaleString()})`;
              })()}
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Text variant="bodyMedium" style={styles.insightTitle}>
              🎯 Budget Status
            </Text>
            <Text variant="bodySmall" style={styles.insightText}>
              {(() => {
                if (budgets.length === 0) return 'No budgets set';
                
                const activeBudgets = budgets.filter(b => b.isActive);
                if (activeBudgets.length === 0) return 'No active budgets';
                
                const budgetStatus = activeBudgets.map(budget => {
                  const budgetTransactions = transactions.filter(t => 
                    t.categoryId === budget.categoryId && t.type === 'expense'
                  );
                  const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
                  const percentage = (spent / budget.amount) * 100;
                  return `${budget.name}: ${percentage.toFixed(1)}%`;
                });
                
                return budgetStatus.join(', ');
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
