import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  FAB,
  Searchbar,
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
  useTheme,
  ActivityIndicator,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Character } from '../types';

const CharactersScreen: React.FC = () => {
  const theme = useTheme();
  const { state, loadCharacters, createCharacter, updateCharacter, deleteCharacter } = useAppContext();
  const { characters, loading } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    appearance: '',
    personality: '',
    colorScheme: '#FF6B6B',
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  const onRefresh = async () => {
    await loadCharacters();
  };

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'custom') return matchesSearch && character.isCustom;
    if (filterType === 'default') return matchesSearch && !character.isCustom;
    
    return matchesSearch;
  });

  const handleCreateCharacter = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Character name is required');
      return;
    }

    try {
      await createCharacter({
        ...formData,
        expressions: ['happy', 'sad', 'angry', 'surprised'],
        poses: ['standing', 'sitting', 'walking', 'running'],
        isCustom: true,
      });
      setCreateDialogVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to create character');
    }
  };

  const handleEditCharacter = async () => {
    if (!selectedCharacter || !formData.name.trim()) {
      Alert.alert('Error', 'Character name is required');
      return;
    }

    try {
      await updateCharacter(selectedCharacter.id, formData);
      setEditDialogVisible(false);
      setSelectedCharacter(null);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to update character');
    }
  };

  const handleDeleteCharacter = async (character: Character) => {
    Alert.alert(
      'Delete Character',
      `Are you sure you want to delete "${character.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCharacter(character.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete character');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      appearance: '',
      personality: '',
      colorScheme: '#FF6B6B',
    });
  };

  const openEditDialog = (character: Character) => {
    setSelectedCharacter(character);
    setFormData({
      name: character.name,
      description: character.description,
      appearance: character.appearance,
      personality: character.personality,
      colorScheme: character.colorScheme,
    });
    setEditDialogVisible(true);
  };

  if (loading && characters.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {/* Search and Filter */}
        <Card style={styles.card}>
          <Card.Content>
            <Searchbar
              placeholder="Search characters..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />
            <SegmentedButtons
              value={filterType}
              onValueChange={setFilterType}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'custom', label: 'Custom' },
                { value: 'default', label: 'Default' },
              ]}
              style={styles.filterButtons}
            />
          </Card.Content>
        </Card>

        {/* Characters List */}
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map((character) => (
            <Card key={character.id} style={styles.characterCard}>
              <Card.Content>
                <View style={styles.characterHeader}>
                  <View style={styles.characterInfo}>
                    <Avatar.Text
                      size={50}
                      label={character.name.charAt(0)}
                      style={{ backgroundColor: character.colorScheme }}
                    />
                    <View style={styles.characterDetails}>
                      <Title>{character.name}</Title>
                      <Paragraph numberOfLines={2}>
                        {character.description}
                      </Paragraph>
                      <View style={styles.characterTags}>
                        <Chip mode="outlined" compact>
                          {character.isCustom ? 'Custom' : 'Default'}
                        </Chip>
                        <Chip mode="outlined" compact>
                          {character.expressions.length} expressions
                        </Chip>
                        <Chip mode="outlined" compact>
                          {character.poses.length} poses
                        </Chip>
                      </View>
                    </View>
                  </View>
                  <Menu
                    visible={menuVisible === character.id}
                    onDismiss={() => setMenuVisible(null)}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        onPress={() => setMenuVisible(character.id)}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        setMenuVisible(null);
                        openEditDialog(character);
                      }}
                      title="Edit"
                      leadingIcon="pencil"
                    />
                    {character.isCustom && (
                      <Menu.Item
                        onPress={() => {
                          setMenuVisible(null);
                          handleDeleteCharacter(character);
                        }}
                        title="Delete"
                        leadingIcon="delete"
                        titleStyle={{ color: theme.colors.error }}
                      />
                    )}
                    <Menu.Item
                      onPress={() => setMenuVisible(null)}
                      title="View Details"
                      leadingIcon="eye"
                    />
                  </Menu>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={theme.colors.outline} />
                <Text style={styles.emptyText}>
                  {searchQuery || filterType !== 'all' 
                    ? 'No characters match your search' 
                    : 'No characters yet'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery || filterType !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Create your first character to get started'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setCreateDialogVisible(true)}
      />

      {/* Create Character Dialog */}
      <Portal>
        <Dialog visible={createDialogVisible} onDismiss={() => setCreateDialogVisible(false)}>
          <Dialog.Title>Create New Character</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <TextInput
              label="Appearance"
              value={formData.appearance}
              onChangeText={(text) => setFormData({ ...formData, appearance: text })}
              multiline
              numberOfLines={2}
              style={styles.input}
            />
            <TextInput
              label="Personality"
              value={formData.personality}
              onChangeText={(text) => setFormData({ ...formData, personality: text })}
              multiline
              numberOfLines={2}
              style={styles.input}
            />
            <TextInput
              label="Color Scheme"
              value={formData.colorScheme}
              onChangeText={(text) => setFormData({ ...formData, colorScheme: text })}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCreateDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleCreateCharacter}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Edit Character Dialog */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Character</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <TextInput
              label="Appearance"
              value={formData.appearance}
              onChangeText={(text) => setFormData({ ...formData, appearance: text })}
              multiline
              numberOfLines={2}
              style={styles.input}
            />
            <TextInput
              label="Personality"
              value={formData.personality}
              onChangeText={(text) => setFormData({ ...formData, personality: text })}
              multiline
              numberOfLines={2}
              style={styles.input}
            />
            <TextInput
              label="Color Scheme"
              value={formData.colorScheme}
              onChangeText={(text) => setFormData({ ...formData, colorScheme: text })}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleEditCharacter}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  searchbar: {
    marginBottom: 16,
  },
  filterButtons: {
    marginBottom: 8,
  },
  characterCard: {
    margin: 16,
    marginTop: 8,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  characterInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  characterDetails: {
    flex: 1,
    marginLeft: 16,
  },
  characterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 16,
  },
});

export default CharactersScreen; 