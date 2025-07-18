import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  Provider as PaperProvider,
  FAB,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  Portal,
  Modal,
  Button,
} from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage';
import { JournalEntry, JournalService } from './src/services/JournalService';
import { EncryptionService } from './src/services/EncryptionService';
import EntryEditor from './src/components/EntryEditor';
import EntryViewer from './src/components/EntryViewer';
import SettingsModal from './src/components/SettingsModal';
import theme from './src/theme';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, selectedTags]);

  const initializeApp = async () => {
    try {
      await JournalService.initialize();
      await loadEntries();
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert('Error', 'Failed to initialize the app. Please restart.');
    }
  };

  const loadEntries = async () => {
    try {
      const loadedEntries = await JournalService.getAllEntries();
      setEntries(loadedEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
      Alert.alert('Error', 'Failed to load journal entries.');
    }
  };

  const filterEntries = () => {
    let filtered = [...entries];

    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry =>
        selectedTags.every(tag => entry.tags.includes(tag))
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setFilteredEntries(filtered);
  };

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setShowEditor(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowEditor(true);
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowViewer(true);
  };

  const handleSaveEntry = async (entryData: Partial<JournalEntry>) => {
    try {
      if (selectedEntry) {
        await JournalService.updateEntry(selectedEntry.id, entryData);
      } else {
        await JournalService.createEntry(entryData);
      }
      await loadEntries();
      setShowEditor(false);
    } catch (error) {
      console.error('Failed to save entry:', error);
      Alert.alert('Error', 'Failed to save the entry.');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await JournalService.deleteEntry(entryId);
              await loadEntries();
              setShowViewer(false);
            } catch (error) {
              console.error('Failed to delete entry:', error);
              Alert.alert('Error', 'Failed to delete the entry.');
            }
          },
        },
      ]
    );
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    entries.forEach(entry => {
      entry.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const renderEntryItem = ({ item }: { item: JournalEntry }) => (
    <Card style={styles.entryCard} onPress={() => handleViewEntry(item)}>
      <Card.Content>
        <Title numberOfLines={1}>{item.title}</Title>
        <Paragraph numberOfLines={2}>{item.content.replace(/<[^>]*>/g, '')}</Paragraph>
        <View style={styles.entryMeta}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map(tag => (
              <Chip key={tag} style={styles.tagChip} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
            {item.tags.length > 3 && (
              <Chip style={styles.tagChip} textStyle={styles.tagText}>
                +{item.tags.length - 3}
              </Chip>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTagFilter = ({ item }: { item: string }) => (
    <Chip
      style={[
        styles.filterChip,
        selectedTags.includes(item) && styles.selectedFilterChip,
      ]}
      textStyle={[
        styles.filterChipText,
        selectedTags.includes(item) && styles.selectedFilterChipText,
      ]}
      onPress={() => toggleTag(item)}
    >
      {item}
    </Chip>
  );

  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Daily Journal</Text>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Text style={styles.settingsButton}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <Searchbar
          placeholder="Search entries..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {getAllTags().length > 0 && (
          <View style={styles.filtersSection}>
            <Text style={styles.filtersTitle}>Filter by tags:</Text>
            <FlatList
              horizontal
              data={getAllTags()}
              renderItem={renderTagFilter}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              style={styles.filtersList}
            />
          </View>
        )}

        <FlatList
          data={filteredEntries}
          renderItem={renderEntryItem}
          keyExtractor={item => item.id}
          style={styles.entriesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery || selectedTags.length > 0
                  ? 'No entries match your search'
                  : 'No journal entries yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Tap the + button to create your first entry'}
              </Text>
            </View>
          }
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleCreateEntry}
        />

        <Portal>
          <Modal
            visible={showEditor}
            onDismiss={() => setShowEditor(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <EntryEditor
              entry={selectedEntry}
              onSave={handleSaveEntry}
              onCancel={() => setShowEditor(false)}
            />
          </Modal>

          <Modal
            visible={showViewer}
            onDismiss={() => setShowViewer(false)}
            contentContainerStyle={styles.modalContainer}
          >
            {selectedEntry && (
              <EntryViewer
                entry={selectedEntry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                onClose={() => setShowViewer(false)}
              />
            )}
          </Modal>

          <Modal
            visible={showSettings}
            onDismiss={() => setShowSettings(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <SettingsModal onClose={() => setShowSettings(false)} />
          </Modal>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    fontSize: 24,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  filtersSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filtersList: {
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedFilterChip: {
    backgroundColor: '#6200ee',
  },
  filterChipText: {
    color: '#666',
  },
  selectedFilterChipText: {
    color: 'white',
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  entryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  entryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    marginLeft: 4,
    height: 24,
    backgroundColor: '#e3f2fd',
  },
  tagText: {
    fontSize: 10,
    color: '#1976d2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
});