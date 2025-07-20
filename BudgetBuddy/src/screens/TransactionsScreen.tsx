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

export default function TransactionsScreen({ navigation, route }: any) {
  const theme = useTheme();
  
  // Mock data - would come from context
  const transactions = [];
  const categories = [];
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list');
  const [loading, setLoading] = useState(false);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(query) ||
        transaction.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.categoryId === categoryFilter);
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          const categoryA = categories.find(cat => cat.id === a.categoryId);
          const categoryB = categories.find(cat => cat.id === b.categoryId);
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
  }, [transactions, searchQuery, typeFilter, categoryFilter, sortBy, sortOrder]);

  const handleDeleteTransaction = async (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // await deleteTransaction(transactionId);
              Alert.alert('Success', 'Transaction deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getTypeColor = (type: 'income' | 'expense') => {
    return type === 'income' ? '#00AA00' : '#FF4444';
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '📁';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || theme.colors.primary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const symbol = type === 'income' ? '+' : '-';
    return `${symbol}$${Math.abs(amount).toLocaleString()}`;
  };

  const getStatsSummary = () => {
    const totalTransactions = filteredTransactions.length;
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netAmount = totalIncome - totalExpenses;

    return {
      totalTransactions,
      totalIncome,
      totalExpenses,
      netAmount
    };
  };

  const stats = getStatsSummary();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              💰 Transactions
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Track and manage your income and expenses.
            </Text>
          </Card.Content>
        </Card>

        {/* Search */}
        <Card style={styles.card}>
          <Card.Content>
            <Searchbar
              placeholder="Search transactions..."
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
              Type
            </Text>
            <SegmentedButtons
              value={typeFilter}
              onValueChange={value => setTypeFilter(value as any)}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' }
              ]}
              style={styles.segmentedButton}
            />
            
            <Text variant="bodyMedium" style={styles.filterLabel}>
              Category
            </Text>
            <SegmentedButtons
              value={categoryFilter}
              onValueChange={value => setCategoryFilter(value)}
              buttons={[
                { value: 'all', label: 'All' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name }))
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
                  { value: 'date', label: 'Date' },
                  { value: 'amount', label: 'Amount' },
                  { value: 'description', label: 'Description' },
                  { value: 'category', label: 'Category' }
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

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No transactions match your current filters.'
                  : 'No transactions recorded yet. Add your first transaction to get started!'
                }
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredTransactions.map(transaction => {
            const category = categories.find(cat => cat.id === transaction.categoryId);
            
            return (
              <Card key={transaction.id} style={styles.transactionCard}>
                <Card.Content>
                  <View style={styles.transactionHeader}>
                    <View style={styles.transactionInfo}>
                      <Text variant="titleMedium" style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      {viewMode === 'list' && (
                        <Text variant="bodySmall" style={styles.transactionCategory}>
                          {category?.name || 'Uncategorized'}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.transactionActions}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => navigation.navigate('EditTransaction', { transactionId: transaction.id })}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => handleDeleteTransaction(transaction.id)}
                        iconColor={theme.colors.error}
                      />
                    </View>
                  </View>

                  {viewMode === 'list' && (
                    <>
                      <View style={styles.transactionDetails}>
                        <View style={styles.detailRow}>
                          <Text variant="bodySmall" style={styles.detailLabel}>
                            Category:
                          </Text>
                          <Text variant="bodySmall" style={styles.detailValue}>
                            {category?.name || 'Uncategorized'}
                          </Text>
                        </View>
                        
                        <View style={styles.detailRow}>
                          <Text variant="bodySmall" style={styles.detailLabel}>
                            Date:
                          </Text>
                          <Text variant="bodySmall" style={styles.detailValue}>
                            {formatDate(transaction.date)}
                          </Text>
                        </View>
                        
                        {transaction.recurring && (
                          <View style={styles.detailRow}>
                            <Text variant="bodySmall" style={styles.detailLabel}>
                              Recurring:
                            </Text>
                            <Text variant="bodySmall" style={styles.detailValue}>
                              {transaction.recurring.frequency}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.transactionTags}>
                        <Chip
                          mode="outlined"
                          textStyle={{ color: getTypeColor(transaction.type) }}
                          style={[styles.typeChip, { borderColor: getTypeColor(transaction.type) }]}
                        >
                          {transaction.type.toUpperCase()}
                        </Chip>
                        
                        {transaction.tags && transaction.tags.map((tag, index) => (
                          <Chip key={index} mode="outlined" style={styles.tag}>
                            {tag}
                          </Chip>
                        ))}
                      </View>
                    </>
                  )}

                  <View style={styles.amountContainer}>
                    <Text 
                      variant="titleLarge" 
                      style={[
                        styles.amount,
                        { color: getTypeColor(transaction.type) }
                      ]}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </Text>
                  </View>
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
                  {stats.totalTransactions}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Total Transactions
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={[styles.summaryNumber, { color: '#00AA00' }]}>
                  +${stats.totalIncome.toLocaleString()}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Total Income
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={[styles.summaryNumber, { color: '#FF4444' }]}>
                  -${stats.totalExpenses.toLocaleString()}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Total Expenses
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text variant="headlineSmall" style={[
                  styles.summaryNumber, 
                  { color: stats.netAmount >= 0 ? '#00AA00' : '#FF4444' }
                ]}>
                  {stats.netAmount >= 0 ? '+' : ''}${stats.netAmount.toLocaleString()}
                </Text>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Net Amount
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
        onPress={() => navigation.navigate('AddTransaction')}
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
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionCategory: {
    opacity: 0.7,
  },
  transactionActions: {
    flexDirection: 'row',
  },
  transactionDetails: {
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
  transactionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  typeChip: {
    marginBottom: 4,
  },
  tag: {
    marginBottom: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  amount: {
    fontWeight: 'bold',
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
