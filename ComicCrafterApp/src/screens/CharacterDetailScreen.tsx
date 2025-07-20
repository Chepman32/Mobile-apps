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
import { Character } from '../types';

const CharacterDetailScreen: React.FC = () => {
  const theme = useTheme();
  const { state, updateCharacter, deleteCharacter, loadCharacters } = useAppContext();
  const { characters, loading } = state;

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Mock character data - in real app this would come from navigation params
  const [character, setCharacter] = useState<Character>({
    id: '1',
    name: 'Hero',
    description: 'Brave protagonist with a strong sense of justice',
    appearance: 'Tall, muscular, confident pose, wears a red cape',
    personality: 'Courageous, determined, selfless, always helps others',
    expressions: ['determined', 'happy', 'angry', 'sad', 'surprised', 'confident'],
    poses: ['heroic', 'fighting', 'thinking', 'running', 'flying', 'landing'],
    colorScheme: '#FF6B6B',
    isCustom: false,
  });

  const [formData, setFormData] = useState({
    name: character.name,
    description: character.description,
    appearance: character.appearance,
    personality: character.personality,
    colorScheme: character.colorScheme,
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  const handleUpdateCharacter = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Character name is required');
      return;
    }

    try {
      await updateCharacter(character.id, formData);
      setCharacter({ ...character, ...formData });
      setEditDialogVisible(false);
      Alert.alert('Success', 'Character updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update character');
    }
  };

  const handleDeleteCharacter = async () => {
    if (!character.isCustom) {
      Alert.alert('Error', 'Default characters cannot be deleted');
      return;
    }

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
              setDeleteDialogVisible(false);
              // Navigate back
            } catch (error) {
              Alert.alert('Error', 'Failed to delete character');
            }
          },
        },
      ]
    );
  };

  const getExpressionIcon = (expression: string) => {
    switch (expression) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'surprised': return '😲';
      case 'determined': return '😤';
      case 'confident': return '😎';
      default: return '😐';
    }
  };

  const getPoseIcon = (pose: string) => {
    switch (pose) {
      case 'heroic': return '🦸';
      case 'fighting': return '⚔️';
      case 'thinking': return '🤔';
      case 'running': return '🏃';
      case 'flying': return '🦅';
      case 'landing': return '🛬';
      default: return '👤';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Character Header */}
      <Surface style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={100}
            label={character.name.charAt(0)}
            style={[styles.characterIcon, { backgroundColor: character.colorScheme }]}
          />
          <View style={styles.headerInfo}>
            <Title style={styles.characterTitle}>{character.name}</Title>
            <Paragraph style={styles.characterDescription}>
              {character.description}
            </Paragraph>
            <View style={styles.headerTags}>
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
            {character.isCustom && (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  setDeleteDialogVisible(true);
                }}
                title="Delete"
                leadingIcon="delete"
                titleStyle={{ color: theme.colors.error }}
              />
            )}
            <Menu.Item
              onPress={() => setMenuVisible(false)}
              title="Duplicate"
              leadingIcon="content-copy"
            />
          </Menu>
        </View>
      </Surface>

      {/* Character Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Details</Title>
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Appearance</Text>
            <Text style={styles.detailText}>{character.appearance}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Personality</Text>
            <Text style={styles.detailText}>{character.personality}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Color Scheme</Text>
            <View style={styles.colorSection}>
              <View style={[styles.colorPreview, { backgroundColor: character.colorScheme }]} />
              <Text style={styles.colorText}>{character.colorScheme}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Expressions */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Expressions</Title>
            <Button mode="outlined" icon="plus" size="small">
              Add
            </Button>
          </View>
          <View style={styles.expressionsGrid}>
            {character.expressions.map((expression) => (
              <Surface key={expression} style={styles.expressionCard}>
                <View style={styles.expressionContent}>
                  <Text style={styles.expressionIcon}>
                    {getExpressionIcon(expression)}
                  </Text>
                  <Text style={styles.expressionName}>{expression}</Text>
                </View>
              </Surface>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Poses */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Poses</Title>
            <Button mode="outlined" icon="plus" size="small">
              Add
            </Button>
          </View>
          <View style={styles.posesGrid}>
            {character.poses.map((pose) => (
              <Surface key={pose} style={styles.poseCard}>
                <View style={styles.poseContent}>
                  <Text style={styles.poseIcon}>
                    {getPoseIcon(pose)}
                  </Text>
                  <Text style={styles.poseName}>{pose}</Text>
                </View>
              </Surface>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Usage Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Usage Statistics</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Comics Used</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Total Appearances</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Favorite Expression</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>Favorite Pose</Text>
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
              icon="pencil"
              style={styles.actionButton}
              onPress={() => setEditDialogVisible(true)}
            >
              Edit Character
            </Button>
            <Button
              mode="outlined"
              icon="content-copy"
              style={styles.actionButton}
              onPress={() => {/* Duplicate character */}}
            >
              Duplicate
            </Button>
            <Button
              mode="outlined"
              icon="share"
              style={styles.actionButton}
              onPress={() => {/* Share character */}}
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
            <Button onPress={handleUpdateCharacter}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Character</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete "{character.name}"? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteCharacter} textColor={theme.colors.error}>
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
  characterIcon: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  characterTitle: {
    marginBottom: 4,
  },
  characterDescription: {
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
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    marginVertical: 8,
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  colorText: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expressionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expressionCard: {
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    minWidth: '30%',
  },
  expressionContent: {
    alignItems: 'center',
  },
  expressionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  expressionName: {
    fontSize: 12,
    textAlign: 'center',
  },
  posesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  poseCard: {
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    minWidth: '30%',
  },
  poseContent: {
    alignItems: 'center',
  },
  poseIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  poseName: {
    fontSize: 12,
    textAlign: 'center',
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
    textAlign: 'center',
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
});

export default CharacterDetailScreen; 