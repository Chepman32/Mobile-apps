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
import { Template } from '../types';

const TemplateDetailScreen: React.FC = () => {
  const theme = useTheme();
  const { state, loadTemplates } = useAppContext();
  const { templates, loading } = state;

  const [useTemplateDialogVisible, setUseTemplateDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Mock template data - in real app this would come from navigation params
  const [template, setTemplate] = useState<Template>({
    id: '1',
    name: 'Superhero Adventure',
    description: 'Classic superhero comic template with epic battles and dramatic moments',
    thumbnail: '🦸',
    panels: [
      { id: '1', type: 'action', content: 'Hero poses dramatically' },
      { id: '2', type: 'dialogue', content: 'Villain monologue' },
      { id: '3', type: 'climax', content: 'Epic battle scene' },
      { id: '4', type: 'resolution', content: 'Hero saves the day' },
    ],
    characters: ['hero', 'villain', 'sidekick'],
    genre: 'superhero',
    difficulty: 'beginner',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: template.genre,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleUseTemplate = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Comic title is required');
      return;
    }

    try {
      // This would create a new comic based on the template
      console.log('Creating comic from template:', template.name);
      setUseTemplateDialogVisible(false);
      Alert.alert('Success', 'Comic created from template!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create comic from template');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
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

  const getPanelTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return '⚡';
      case 'dialogue': return '💬';
      case 'climax': return '🔥';
      case 'resolution': return '✨';
      case 'establishing': return '🏙️';
      case 'mystery': return '❓';
      default: return '📄';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Template Header */}
      <Surface style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={100}
            label={getGenreIcon(template.genre)}
            style={styles.templateIcon}
          />
          <View style={styles.headerInfo}>
            <Title style={styles.templateTitle}>{template.name}</Title>
            <Paragraph style={styles.templateDescription}>
              {template.description}
            </Paragraph>
            <View style={styles.headerTags}>
              <Chip mode="outlined" compact>
                {template.genre}
              </Chip>
              <Chip 
                mode="outlined" 
                compact
                textStyle={{ color: getDifficultyColor(template.difficulty) }}
              >
                {template.difficulty}
              </Chip>
              <Chip mode="outlined" compact>
                {template.panels.length} panels
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
                setUseTemplateDialogVisible(true);
              }}
              title="Use Template"
              leadingIcon="plus"
            />
            <Menu.Item
              onPress={() => setMenuVisible(false)}
              title="Preview"
              leadingIcon="eye"
            />
            <Menu.Item
              onPress={() => setMenuVisible(false)}
              title="Share"
              leadingIcon="share"
            />
          </Menu>
        </View>
      </Surface>

      {/* Template Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Template Overview</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{template.panels.length}</Text>
              <Text style={styles.statLabel}>Panels</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{template.characters.length}</Text>
              <Text style={styles.statLabel}>Characters</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {template.panels.filter(p => p.type === 'action').length}
              </Text>
              <Text style={styles.statLabel}>Action Scenes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {template.panels.filter(p => p.type === 'dialogue').length}
              </Text>
              <Text style={styles.statLabel}>Dialogue</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Panel Breakdown */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Panel Breakdown</Title>
          {template.panels.map((panel, index) => (
            <List.Item
              key={panel.id}
              title={`Panel ${index + 1}`}
              description={panel.content}
              left={(props) => (
                <View {...props} style={styles.panelIcon}>
                  <Text style={styles.panelTypeIcon}>
                    {getPanelTypeIcon(panel.type)}
                  </Text>
                </View>
              )}
              right={(props) => (
                <Chip {...props} mode="outlined" compact>
                  {panel.type}
                </Chip>
              )}
              style={styles.panelItem}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Required Characters */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Required Characters</Title>
          <View style={styles.charactersGrid}>
            {template.characters.map((character) => (
              <Surface key={character} style={styles.characterCard}>
                <View style={styles.characterContent}>
                  <Avatar.Text
                    size={40}
                    label={character.charAt(0).toUpperCase()}
                    style={styles.characterAvatar}
                  />
                  <Text style={styles.characterName}>{character}</Text>
                  <Text style={styles.characterRole}>
                    {character === 'hero' ? 'Protagonist' : 
                     character === 'villain' ? 'Antagonist' : 'Supporting'}
                  </Text>
                </View>
              </Surface>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Template Features */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Template Features</Title>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Pre-defined panel structure</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Character suggestions</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Story progression guide</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Genre-appropriate elements</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Difficulty Guide */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Difficulty Guide</Title>
          <View style={styles.difficultySection}>
            <Text style={styles.difficultyTitle}>
              {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)} Level
            </Text>
            <Text style={styles.difficultyDescription}>
              {template.difficulty === 'beginner' && 
                'Perfect for newcomers to comic creation. Simple structure with clear guidance.'}
              {template.difficulty === 'intermediate' && 
                'For creators with some experience. More complex storytelling elements.'}
              {template.difficulty === 'advanced' && 
                'Challenging template for experienced creators. Complex narrative structure.'}
            </Text>
            <View style={styles.difficultyTips}>
              <Text style={styles.tipTitle}>Tips for this level:</Text>
              {template.difficulty === 'beginner' && (
                <>
                  <Text style={styles.tipText}>• Focus on basic storytelling</Text>
                  <Text style={styles.tipText}>• Use simple character expressions</Text>
                  <Text style={styles.tipText}>• Keep dialogue straightforward</Text>
                </>
              )}
              {template.difficulty === 'intermediate' && (
                <>
                  <Text style={styles.tipText}>• Experiment with panel layouts</Text>
                  <Text style={styles.tipText}>• Add character development</Text>
                  <Text style={styles.tipText}>• Include background details</Text>
                </>
              )}
              {template.difficulty === 'advanced' && (
                <>
                  <Text style={styles.tipText}>• Complex character interactions</Text>
                  <Text style={styles.tipText}>• Advanced visual storytelling</Text>
                  <Text style={styles.tipText}>• Sophisticated dialogue</Text>
                </>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Get Started</Title>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="plus"
              style={styles.actionButton}
              onPress={() => setUseTemplateDialogVisible(true)}
            >
              Use This Template
            </Button>
            <Button
              mode="outlined"
              icon="eye"
              style={styles.actionButton}
              onPress={() => {/* Preview template */}}
            >
              Preview
            </Button>
            <Button
              mode="outlined"
              icon="share"
              style={styles.actionButton}
              onPress={() => {/* Share template */}}
            >
              Share
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Dialogs */}
      <Portal>
        {/* Use Template Dialog */}
        <Dialog visible={useTemplateDialogVisible} onDismiss={() => setUseTemplateDialogVisible(false)}>
          <Dialog.Title>Create Comic from Template</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Comic Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              style={styles.input}
            />
            <TextInput
              label="Description (Optional)"
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
            <View style={styles.templateInfo}>
              <Text style={styles.templateInfoTitle}>Template Details:</Text>
              <Text style={styles.templateInfoText}>• {template.panels.length} panels</Text>
              <Text style={styles.templateInfoText}>• {template.characters.length} characters</Text>
              <Text style={styles.templateInfoText}>• {template.difficulty} difficulty</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setUseTemplateDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUseTemplate}>Create Comic</Button>
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
  templateIcon: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  templateTitle: {
    marginBottom: 4,
  },
  templateDescription: {
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
  panelItem: {
    paddingVertical: 4,
  },
  panelIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelTypeIcon: {
    fontSize: 20,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  characterCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  characterContent: {
    alignItems: 'center',
  },
  characterAvatar: {
    marginBottom: 8,
  },
  characterName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  characterRole: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  featuresList: {
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
  },
  difficultySection: {
    marginTop: 16,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  difficultyTips: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
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
  templateInfo: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
  },
  templateInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  templateInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
});

export default TemplateDetailScreen; 