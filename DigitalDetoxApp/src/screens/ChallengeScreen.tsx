import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
  Text,
  ActivityIndicator,
  Surface,
  useTheme,
  IconButton,
  Portal,
  Dialog,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, Challenge, Session } from '../types';

type ChallengeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Challenge'>;
type ChallengeScreenRouteProp = RouteProp<RootStackParamList, 'Challenge'>;

const { width } = Dimensions.get('window');

export default function ChallengeScreen() {
  const navigation = useNavigation<ChallengeScreenNavigationProp>();
  const route = useRoute<ChallengeScreenRouteProp>();
  const theme = useTheme();
  const { state, getChallenge, addSession, updateChallenge, deleteChallenge } = useAppContext();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    durationMinutes: 0,
    category: 'focus' as const,
    difficulty: 'easy' as const,
    icon: '',
    color: '#4CAF50',
    tips: [''],
    benefits: [''],
  });

  const { challengeId } = route.params;

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const challengeData = await getChallenge(challengeId);
      if (challengeData) {
        setChallenge(challengeData);
        setEditForm({
          name: challengeData.name,
          description: challengeData.description,
          durationMinutes: challengeData.durationMinutes,
          category: challengeData.category,
          difficulty: challengeData.difficulty,
          icon: challengeData.icon,
          color: challengeData.color,
          tips: challengeData.tips,
          benefits: challengeData.benefits,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load challenge details');
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    if (!challenge) return;

    try {
      const session = {
        challengeId: challenge.id,
        challenge,
        startedAt: new Date().toISOString(),
        completed: false,
        duration: 0,
        interruptions: 0,
        moodBefore: 3,
        moodAfter: 3,
      };

      await addSession(session);
      navigation.navigate('ActiveSession', { challengeId: challenge.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to start session');
    }
  };

  const handleEditChallenge = async () => {
    if (!challenge) return;

    try {
      await updateChallenge(challenge.id, {
        ...editForm,
        updatedAt: new Date().toISOString(),
      });
      setShowEditDialog(false);
      await loadChallenge();
      Alert.alert('Success', 'Challenge updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update challenge');
    }
  };

  const handleDeleteChallenge = async () => {
    if (!challenge) return;

    try {
      await deleteChallenge(challenge.id);
      setShowDeleteDialog(false);
      navigation.goBack();
      Alert.alert('Success', 'Challenge deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete challenge');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'focus': return '🎯';
      case 'social': return '📱';
      case 'gaming': return '🎮';
      case 'entertainment': return '📺';
      case 'productivity': return '⚡';
      case 'custom': return '🔧';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Challenge not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Challenge Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <Avatar.Text
              size={80}
              label={challenge.icon}
              style={{ backgroundColor: challenge.color }}
            />
            <View style={styles.headerText}>
              <Title style={styles.challengeTitle}>{challenge.name}</Title>
              <Paragraph style={styles.challengeDescription}>
                {challenge.description}
              </Paragraph>
              <View style={styles.challengeMeta}>
                <Chip
                  mode="outlined"
                  style={[styles.metaChip, { borderColor: getDifficultyColor(challenge.difficulty) }]}
                >
                  {challenge.difficulty}
                </Chip>
                <Chip mode="outlined" style={styles.metaChip}>
                  {challenge.durationMinutes} min
                </Chip>
                <Chip mode="outlined" style={styles.metaChip}>
                  {challenge.category}
                </Chip>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.actionCard}>
        <Card.Content>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="play"
              onPress={startSession}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              Start Session
            </Button>
            {challenge.isCustom && (
              <>
                <Button
                  mode="outlined"
                  icon="pencil"
                  onPress={() => setShowEditDialog(true)}
                  style={styles.actionButton}
                  contentStyle={styles.buttonContent}
                >
                  Edit
                </Button>
                <Button
                  mode="outlined"
                  icon="delete"
                  onPress={() => setShowDeleteDialog(true)}
                  style={[styles.actionButton, { borderColor: theme.colors.error }]}
                  textColor={theme.colors.error}
                  contentStyle={styles.buttonContent}
                >
                  Delete
                </Button>
              </>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Tips Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Tips for Success</Title>
          <List.Section>
            {challenge.tips.map((tip, index) => (
              <List.Item
                key={index}
                title={tip}
                left={() => <List.Icon icon="lightbulb" />}
                titleNumberOfLines={3}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>

      {/* Benefits Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Benefits</Title>
          <List.Section>
            {challenge.benefits.map((benefit, index) => (
              <List.Item
                key={index}
                title={benefit}
                left={() => <List.Icon icon="check-circle" />}
                titleNumberOfLines={3}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>

      {/* Statistics */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title>Your Progress</Title>
          <View style={styles.statsGrid}>
            <Surface style={styles.statItem}>
              <Text style={styles.statValue}>
                {state.sessions.filter(s => s.challengeId === challenge.id).length}
              </Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </Surface>
            <Surface style={styles.statItem}>
              <Text style={styles.statValue}>
                {state.sessions
                  .filter(s => s.challengeId === challenge.id)
                  .reduce((sum, s) => sum + s.duration, 0)} min
              </Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </Surface>
            <Surface style={styles.statItem}>
              <Text style={styles.statValue}>
                {state.sessions.filter(s => s.challengeId === challenge.id && s.completed).length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </Surface>
          </View>
        </Card.Content>
      </Card>

      {/* Edit Dialog */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Edit Challenge</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={editForm.description}
              onChangeText={(text) => setEditForm({ ...editForm, description: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <TextInput
              label="Duration (minutes)"
              value={editForm.durationMinutes.toString()}
              onChangeText={(text) => setEditForm({ ...editForm, durationMinutes: parseInt(text) || 0 })}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Icon"
              value={editForm.icon}
              onChangeText={(text) => setEditForm({ ...editForm, icon: text })}
              style={styles.input}
            />
            <TextInput
              label="Color (hex)"
              value={editForm.color}
              onChangeText={(text) => setEditForm({ ...editForm, color: text })}
              style={styles.input}
            />
            <SegmentedButtons
              value={editForm.category}
              onValueChange={(value) => setEditForm({ ...editForm, category: value as any })}
              buttons={[
                { value: 'focus', label: 'Focus' },
                { value: 'social', label: 'Social' },
                { value: 'gaming', label: 'Gaming' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'productivity', label: 'Productivity' },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={editForm.difficulty}
              onValueChange={(value) => setEditForm({ ...editForm, difficulty: value as any })}
              buttons={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
                { value: 'expert', label: 'Expert' },
              ]}
              style={styles.segmentedButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onPress={handleEditChallenge}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Dialog */}
      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Challenge</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete "{challenge.name}"? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeleteChallenge} textColor={theme.colors.error}>
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
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  challengeTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    marginBottom: 12,
  },
  challengeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  actionCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContent: {
    height: 48,
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    elevation: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
});
