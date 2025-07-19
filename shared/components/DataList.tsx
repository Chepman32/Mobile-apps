import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Chip,
  FAB,
  Portal,
  Modal,
  Button,
  IconButton,
} from 'react-native-paper';
import { BaseEntity } from '../services/DataService';
import { spacing, shadows } from '../theme/AppTheme';

export interface DataListColumn<T> {
  key: keyof T;
  title: string;
  render?: (item: T) => React.ReactNode;
  searchable?: boolean;
  sortable?: boolean;
}

export interface DataListAction<T> {
  icon: string;
  label: string;
  onPress: (item: T) => void;
  color?: string;
}

export interface DataListProps<T extends BaseEntity> {
  data: T[];
  columns: DataListColumn<T>[];
  actions?: DataListAction<T>[];
  onItemPress?: (item: T) => void;
  onRefresh?: () => Promise<void>;
  onAdd?: () => void;
  loading?: boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  showAddButton?: boolean;
  cardMode?: boolean;
  filters?: {
    key: keyof T;
    label: string;
    values: { label: string; value: any }[];
  }[];
}

export function DataList<T extends BaseEntity>({
  data,
  columns,
  actions = [],
  onItemPress,
  onRefresh,
  onAdd,
  loading = false,
  searchPlaceholder = 'Search...',
  emptyTitle = 'No items found',
  emptySubtitle = 'Add some items to get started',
  showAddButton = true,
  cardMode = true,
  filters = [],
}: DataListProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: any }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const searchableColumns = useMemo(
    () => columns.filter(col => col.searchable !== false),
    [columns]
  );

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        searchableColumns.some(col => {
          const value = item[col.key];
          return value && String(value).toLowerCase().includes(lowerQuery);
        })
      );
    }

    // Apply field filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filtered = filtered.filter(item => item[key as keyof T] === value);
      }
    });

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (aVal === bVal) return 0;
        
        const result = aVal < bVal ? -1 : 1;
        return sortOrder === 'asc' ? result : -result;
      });
    } else {
      // Default sort by creation date
      filtered.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return bDate - aDate;
      });
    }

    return filtered;
  }, [data, searchQuery, selectedFilters, sortBy, sortOrder, searchableColumns]);

  const handleSort = (column: DataListColumn<T>) => {
    if (!column.sortable) return;
    
    if (sortBy === column.key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column.key);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (filterKey: keyof T, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setSearchQuery('');
  };

  const renderListItem = ({ item }: { item: T }) => {
    if (cardMode) {
      return (
        <Card
          style={styles.card}
          onPress={() => onItemPress?.(item)}
          mode="elevated"
        >
          <Card.Content>
            {columns.map(col => (
              <View key={String(col.key)} style={styles.cardRow}>
                <Text variant="labelMedium" style={styles.cardLabel}>
                  {col.title}:
                </Text>
                <Text variant="bodyMedium" style={styles.cardValue}>
                  {col.render ? col.render(item) : String(item[col.key] || '')}
                </Text>
              </View>
            ))}
            {actions.length > 0 && (
              <View style={styles.cardActions}>
                {actions.map((action, index) => (
                  <IconButton
                    key={index}
                    icon={action.icon}
                    size={20}
                    iconColor={action.color}
                    onPress={() => action.onPress(item)}
                  />
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      );
    }

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => onItemPress?.(item)}
      >
        {columns.map(col => (
          <View key={String(col.key)} style={styles.listColumn}>
            <Text variant="bodyMedium">
              {col.render ? col.render(item) : String(item[col.key] || '')}
            </Text>
          </View>
        ))}
        {actions.length > 0 && (
          <View style={styles.listActions}>
            {actions.map((action, index) => (
              <IconButton
                key={index}
                icon={action.icon}
                size={20}
                iconColor={action.color}
                onPress={() => action.onPress(item)}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        {emptyTitle}
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        {emptySubtitle}
      </Text>
      {showAddButton && onAdd && (
        <Button mode="contained" onPress={onAdd} style={styles.emptyButton}>
          Add First Item
        </Button>
      )}
    </View>
  );

  const renderFilters = () => (
    <Portal>
      <Modal
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        contentContainerStyle={styles.filterModal}
      >
        <Text variant="headlineSmall" style={styles.filterTitle}>
          Filters
        </Text>
        
        {filters.map(filter => (
          <View key={String(filter.key)} style={styles.filterGroup}>
            <Text variant="labelLarge" style={styles.filterLabel}>
              {filter.label}
            </Text>
            <View style={styles.filterChips}>
              <Chip
                selected={!selectedFilters[filter.key]}
                onPress={() => handleFilterChange(filter.key, null)}
                style={styles.filterChip}
              >
                All
              </Chip>
              {filter.values.map(option => (
                <Chip
                  key={String(option.value)}
                  selected={selectedFilters[filter.key] === option.value}
                  onPress={() => handleFilterChange(filter.key, option.value)}
                  style={styles.filterChip}
                >
                  {option.label}
                </Chip>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.filterActions}>
          <Button onPress={clearFilters}>Clear All</Button>
          <Button mode="contained" onPress={() => setShowFilters(false)}>
            Apply
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={searchPlaceholder}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        {filters.length > 0 && (
          <IconButton
            icon="filter-variant"
            onPress={() => setShowFilters(true)}
            style={styles.filterButton}
          />
        )}
      </View>

      {/* Active Filters */}
      {Object.entries(selectedFilters).some(([_, value]) => value !== null) && (
        <View style={styles.activeFilters}>
          {Object.entries(selectedFilters).map(([key, value]) => {
            if (value === null || value === undefined) return null;
            const filter = filters.find(f => String(f.key) === key);
            const option = filter?.values.find(v => v.value === value);
            return (
              <Chip
                key={key}
                onClose={() => handleFilterChange(key as keyof T, null)}
                style={styles.activeFilterChip}
              >
                {filter?.label}: {option?.label || String(value)}
              </Chip>
            );
          })}
        </View>
      )}

      {/* Data List */}
      <FlatList
        data={filteredAndSortedData}
        renderItem={renderListItem}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          ) : undefined
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          filteredAndSortedData.length === 0 ? styles.emptyList : undefined
        }
      />

      {/* Add Button */}
      {showAddButton && onAdd && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={onAdd}
        />
      )}

      {/* Filter Modal */}
      {renderFilters()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchbar: {
    flex: 1,
  },
  filterButton: {
    marginLeft: spacing.sm,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  activeFilterChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  list: {
    flex: 1,
  },
  emptyList: {
    flex: 1,
  },
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.small,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardLabel: {
    flex: 1,
    fontWeight: '600',
  },
  cardValue: {
    flex: 2,
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listColumn: {
    flex: 1,
  },
  listActions: {
    flexDirection: 'row',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.7,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
  filterModal: {
    backgroundColor: 'white',
    margin: spacing.xl,
    padding: spacing.lg,
    borderRadius: 8,
  },
  filterTitle: {
    marginBottom: spacing.lg,
  },
  filterGroup: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    marginBottom: spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
}); 