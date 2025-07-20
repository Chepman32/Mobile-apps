import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  TextInput, 
  Button, 
  SegmentedButtons,
  Chip,
  IconButton,
  Portal,
  Dialog,
  List,
  useTheme
} from 'react-native-paper';
import { useTodo } from '../context/TodoContext';
import { Task, Category, Project } from '../types';

export default function AddTaskScreen({ navigation }: any) {
  const theme = useTheme();
  const { 
    addTask, 
    getCategoryById, 
    getProjectById,
    categories,
    projects
  } = useTodo();
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [estimatedDuration, setEstimatedDuration] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  
  // Dialog states
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [projectDialogVisible, setProjectDialogVisible] = useState(false);
  const [tagDialogVisible, setTagDialogVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!categoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      setLoading(true);
      
      const newTask: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId,
        priority,
        status: 'pending',
        dueDate: dueDate || undefined,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
        tags: tags.length > 0 ? tags : undefined,
        notes: notes.trim() || undefined,
        projectIds: projectId ? [projectId] : undefined,
      };

      await addTask(newTask);
      
      Alert.alert(
        'Success', 
        'Task created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setPriority('medium');
    setDueDate('');
    setEstimatedDuration('');
    setTags([]);
    setNotes('');
    setProjectId('');
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    if (tags.includes(newTag.trim())) {
      Alert.alert('Error', 'Tag already exists');
      return;
    }
    
    setTags([...tags, newTag.trim()]);
    setNewTag('');
    setTagDialogVisible(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '#FF4444';
      case 'high': return '#FF8800';
      case 'medium': return '#FFAA00';
      case 'low': return '#00AA00';
      default: return '#666666';
    }
  };

  const selectedCategory = getCategoryById(categoryId);
  const selectedProject = projectId ? getProjectById(projectId) : null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            ➕ Add Task
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Create a new task with all the details you need to stay organized.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Basic Information
          </Text>
          
          <TextInput
            label="Task Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            maxLength={100}
            right={<TextInput.Affix text={`${title.length}/100`} />}
          />

          <TextInput
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            maxLength={500}
            right={<TextInput.Affix text={`${description.length}/500`} />}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Classification
          </Text>

          <View style={styles.categorySection}>
            <Text variant="bodyMedium" style={styles.label}>
              Category *
            </Text>
            <Button
              mode="outlined"
              onPress={() => setCategoryDialogVisible(true)}
              style={styles.selectionButton}
              icon={() => selectedCategory ? (
                <Text style={styles.buttonIcon}>{selectedCategory.icon}</Text>
              ) : undefined}
            >
              {selectedCategory ? selectedCategory.name : 'Select Category'}
            </Button>
          </View>

          <View style={styles.projectSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Project (Optional)
            </Text>
            <Button
              mode="outlined"
              onPress={() => setProjectDialogVisible(true)}
              style={styles.selectionButton}
              icon={() => selectedProject ? (
                <Text style={styles.buttonIcon}>{selectedProject.icon}</Text>
              ) : undefined}
            >
              {selectedProject ? selectedProject.name : 'Select Project'}
            </Button>
            {selectedProject && (
              <Button
                mode="text"
                onPress={() => setProjectId('')}
                style={styles.clearButton}
              >
                Clear Project
              </Button>
            )}
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Priority
          </Text>

          <View style={styles.prioritySection}>
            <SegmentedButtons
              value={priority}
              onValueChange={value => setPriority(value as Task['priority'])}
              buttons={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
              style={styles.segmentedButton}
            />
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Scheduling
          </Text>

          <TextInput
            label="Due Date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
            mode="outlined"
            style={styles.input}
            placeholder="2024-12-31"
            keyboardType="numeric"
          />

          <TextInput
            label="Estimated Duration (minutes)"
            value={estimatedDuration}
            onChangeText={setEstimatedDuration}
            mode="outlined"
            style={styles.input}
            placeholder="120"
            keyboardType="numeric"
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Organization
          </Text>

          <View style={styles.tagsSection}>
            <Text variant="bodyMedium" style={styles.label}>
              Tags
            </Text>
            <Button
              mode="outlined"
              onPress={() => setTagDialogVisible(true)}
              style={styles.addTagButton}
              icon="plus"
            >
              Add Tag
            </Button>
            
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    onClose={() => handleRemoveTag(tag)}
                    style={styles.tag}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            maxLength={1000}
            right={<TextInput.Affix text={`${notes.length}/1000`} />}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={!title.trim() || !categoryId || loading}
          style={styles.submitButton}
        >
          Create Task
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleReset}
          disabled={loading}
          style={styles.resetButton}
        >
          Reset Form
        </Button>
      </View>

      {/* Category Selection Dialog */}
      <Portal>
        <Dialog visible={categoryDialogVisible} onDismiss={() => setCategoryDialogVisible(false)}>
          <Dialog.Title>Select Category</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              {categories.map(category => (
                <List.Item
                  key={category.id}
                  title={category.name}
                  description={category.description}
                  onPress={() => {
                    setCategoryId(category.id);
                    setCategoryDialogVisible(false);
                  }}
                  left={props => (
                    <List.Icon 
                      {...props} 
                      icon={() => <Text style={styles.listIcon}>{category.icon}</Text>}
                    />
                  )}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCategoryDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Project Selection Dialog */}
      <Portal>
        <Dialog visible={projectDialogVisible} onDismiss={() => setProjectDialogVisible(false)}>
          <Dialog.Title>Select Project</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <List.Item
                title="No Project"
                description="Don't assign to any project"
                onPress={() => {
                  setProjectId('');
                  setProjectDialogVisible(false);
                }}
                left={props => <List.Icon {...props} icon="folder-outline" />}
              />
              {projects.map(project => (
                <List.Item
                  key={project.id}
                  title={project.name}
                  description={project.description}
                  onPress={() => {
                    setProjectId(project.id);
                    setProjectDialogVisible(false);
                  }}
                  left={props => (
                    <List.Icon 
                      {...props} 
                      icon={() => <Text style={styles.listIcon}>{project.icon}</Text>}
                    />
                  )}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setProjectDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Tag Dialog */}
      <Portal>
        <Dialog visible={tagDialogVisible} onDismiss={() => setTagDialogVisible(false)}>
          <Dialog.Title>Add Tag</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tag Name"
              value={newTag}
              onChangeText={setNewTag}
              mode="outlined"
              autoFocus
              maxLength={20}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTagDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add
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
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  categorySection: {
    marginBottom: 16,
  },
  projectSection: {
    marginBottom: 16,
  },
  selectionButton: {
    marginTop: 8,
  },
  clearButton: {
    marginTop: 8,
  },
  prioritySection: {
    marginBottom: 16,
  },
  segmentedButton: {
    marginTop: 8,
  },
  tagsSection: {
    marginBottom: 16,
  },
  addTagButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  submitButton: {
    marginBottom: 8,
  },
  resetButton: {
    marginBottom: 16,
  },
  buttonIcon: {
    fontSize: 16,
  },
  listIcon: {
    fontSize: 20,
  },
}); 