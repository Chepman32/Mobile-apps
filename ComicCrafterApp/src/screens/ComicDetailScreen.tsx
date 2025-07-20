import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
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
  Dialog,
  Portal,
  TextInput,
  SegmentedButtons,
  useTheme,
  IconButton,
  Menu,
  Divider,
  Text,
  Surface,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Comic, Panel } from '../types';

const ComicDetailScreen: React.FC = () => {
  const theme = useTheme();
  const { state, updateComic, deleteComic, loadComics } = useAppContext();
  const { comics, loading } = state;

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Mock comic data - in real app this would come from navigation params
  const [comic, setComic] = useState<Comic>({
    id: '1',
    title: 'Sample Comic',
    description: 'A sample comic for demonstration',
    genre: 'superhero',
    status: 'in-progress',
    panels: [
      {
        id: '1',
        type: 'action',
        content: 'Hero poses dramatically',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 150 },
        characters: ['hero'],
        speechBubbles: [],
        thoughtBubbles: [],
        soundEffects: [],
        narration: [],
        animations: [],
      },
      {
        id: '2',
        type: 'dialogue',
        content: 'Villain monologue',
        position: { x: 220, y: 0 },
        size: { width: 200, height: 150 },
        characters: ['villain'],
        speechBubbles: [],
        thoughtBubbles: [],
        soundEffects: [],
        narration: [],
        animations: [],
      },
    ],
    characters: ['hero', 'villain'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [formData, setFormData] = useState({
    title: comic.title,
    description: comic.description,
    genre: comic.genre,
    status: comic.status,
  });

  useEffect(() => {
    loadComics();
  }, []);

  const handleUpdateComic = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Comic title is required');
      return;
    }

    try {
      await updateComic(comic.id, formData);
      setComic({ ...comic, ...formData });
      setEditDialogVisible(false);
      Alert.alert('Success', 'Comic updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update comic');
    }
  };

  const handleDeleteComic = async () => {
    Alert.alert(
      'Delete Comic',
      `Are you sure you want to delete "${comic.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComic(comic.id);
              setDeleteDialogVisible(false);
              // Navigate back
            } catch (error) {
              Alert.alert('Error', 'Failed to delete comic');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'draft': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getGenreIcon = (genre: string) => {
    switch (genre) {
      case 'superhero': return '🦸';
      case 'slice-of-life': return '🏠';
      case 'sci-fi': return '🚀';
      case 'fantasy': return '🐉';
      case 'mystery': return '🔍';
      case 'comedy': return '😄';
      default: return '📚';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Comic Header */}
      <Surface style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={getGenreIcon(comic.genre)}
            style={styles.comicIcon}
          />
          <View style={styles.headerInfo}>
            <Title style={styles.comicTitle}>{comic.title}</Title>
            <Paragraph style={styles.comicDescription}>
              {comic.description}
            </Paragraph>
            <View style={styles.headerTags}>
              <Chip mode="outlined" compact>
                {comic.genre}
              </Chip>
              <Chip 
                mode="outlined" 
                compact
                textStyle={{ color: getStatusColor(comic.status) }}
              >
                {comic.status}
              </Chip>
            </View>
          </View>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                setEditDialogVisible(true);
              }}
              title="Edit"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                setDeleteDialogVisible(true);
              }}
              title="Delete"
              leadingIcon="delete"
              titleStyle={{ color: theme.colors.error }}
            />
            <Menu.Item
              onPress={() => setMenuVisible(false)}
              title="Share"
              leadingIcon="share"
            />
          </Menu>
        </View>
      </Surface>

      {/* Comic Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Statistics</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{comic.panels.length}</Text>
              <Text style={styles.statLabel}>Panels</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{comic.characters.length}</Text>
              <Text style={styles.statLabel}>Characters</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {comic.panels.reduce((sum, panel) => 
                  sum + panel.speechBubbles.length + panel.thoughtBubbles.length, 0
                )}
              </Text>
              <Text style={styles.statLabel}>Bubbles</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {comic.panels.reduce((sum, panel) => 
                  sum + panel.soundEffects.length, 0
                )}
              </Text>
              <Text style={styles.statLabel}>Sound Effects</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Panels */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Panels</Title>
            <Button mode="contained" icon="plus">
              Add Panel
            </Button>
          </View>
          {comic.panels.map((panel, index) => (
            <List.Item
              key={panel.id}
              title={`Panel ${index + 1}`}
              description={`${panel.type} • ${panel.content}`}
              left={(props) => (
                <List.Icon {...props} icon="image" />
              )}
              right={(props) => (
                <View {...props} style={styles.panelActions}>
                  <Chip mode="outlined" compact>
                    {panel.characters.length} chars
                  </Chip>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => {/* Edit panel */}}
                  />
                </View>
              )}
              style={styles.panelItem}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Characters */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Characters</Title>
            <Button mode="outlined" icon="plus">
              Add Character
            </Button>
          </View>
          {comic.characters.map((characterId) => (
            <List.Item
              key={characterId}
              title={characterId}
              description="Character in this comic"
              left={(props) => (
                <List.Icon {...props} icon="account" />
              )}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="eye"
                  size={20}
                  onPress={() => {/* View character details */}}
                />
              )}
              style={styles.characterItem}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Timeline */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Timeline</Title>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>
                  {new Date(comic.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.timelineText}>Comic created</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>
                  {new Date(comic.updatedAt).toLocaleDateString()}
                </Text>
                <Text style={styles.timelineText}>Last updated</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Actions</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="play"
              style={styles.actionButton}
              onPress={() => {/* Continue editing */}}
            >
              Continue Editing
            </Button>
            <Button
              mode="outlined"
              icon="eye"
              style={styles.actionButton}
              onPress={() => {/* Preview comic */}}
            >
              Preview
            </Button>
            <Button
              mode="outlined"
              icon="share"
              style={styles.actionButton}
              onPress={() => {/* Share comic */}}
            >
              Share
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Dialogs */}
      <Portal>
        {/* Edit Dialog */}
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Comic</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
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
            <Text style={styles.inputLabel}>Genre</Text>
            <SegmentedButtons
              value={formData.genre}
              onValueChange={(value) => setFormData({ ...formData, genre: value })}
              buttons={[
                { value: 'superhero', label: 'Superhero' },
                { value: 'slice-of-life', label: 'Slice of Life' },
                { value: 'sci-fi', label: 'Sci-Fi' },
              ]}
              style={styles.genreButtons}
            />
            <Text style={styles.inputLabel}>Status</Text>
            <SegmentedButtons
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              buttons={[
                { value: 'draft', label: 'Draft' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              style={styles.statusButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateComic}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Comic</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete "{comic.title}"? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteComic} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  comicIcon: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  comicTitle: {
    marginBottom: 4,
  },
  comicDescription: {
    marginBottom: 12,
    color: '#666',
  },
  headerTags: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  panelItem: {
    paddingVertical: 4,
  },
  panelActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterItem: {
    paddingVertical: 4,
  },
  timeline: {
    marginTop: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    marginRight: 16,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
  },
  timelineText: {
    fontSize: 14,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    minWidth: '30%',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreButtons: {
    marginBottom: 16,
  },
  statusButtons: {
    marginBottom: 8,
  },
});

export default ComicDetailScreen; 