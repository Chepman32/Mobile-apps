import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  FAB,
  Surface,
  IconButton,
  TextInput,
  DataTable,
  Chip,
  Dialog,
  Portal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList, ExerciseLog, ExerciseSet } from '../types';
import { Ionicons } from '@expo/vector-icons';

type AddWorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AddWorkoutScreen: React.FC = () => {
  const navigation = useNavigation<AddWorkoutScreenNavigationProp>();
  const {
    currentWorkout,
    endWorkout,
    addSetToExercise,
    updateSet,
    deleteSet,
  } = useAppContext();

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (!currentWorkout) {
      navigation.goBack();
    }
  }, [currentWorkout, navigation]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndWorkout = async () => {
    try {
      await endWorkout();
      setShowEndDialog(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to end workout');
    }
  };

  const handleAddExercise = () => {
    navigation.navigate('AddExercise', { workoutId: currentWorkout!.id });
  };

  const handleAddSet = async (exerciseLogId: string) => {
    const exerciseLog = currentWorkout?.exercises.find(e => e.id === exerciseLogId);
    if (!exerciseLog) return;

    const lastSet = exerciseLog.sets[exerciseLog.sets.length - 1];
    const newSetNumber = exerciseLog.sets.length + 1;

    const newSet: Omit<ExerciseSet, 'id' | 'exerciseLogId' | 'createdAt'> = {
      setNumber: newSetNumber,
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0,
      restTime: lastSet?.restTime || 60,
    };

    await addSetToExercise(exerciseLogId, newSet);
  };

  const handleUpdateSet = async (setId: string, field: keyof ExerciseSet, value: number) => {
    await updateSet(setId, { [field]: value });
  };

  const handleDeleteSet = (setId: string) => {
    Alert.alert(
      'Delete Set',
      'Are you sure you want to delete this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSet(setId) },
      ]
    );
  };

  const renderExerciseCard = ({ item }: { item: ExerciseLog }) => (
    <Card style={styles.exerciseCard} mode="outlined">
      <Card.Content>
        <View style={styles.exerciseHeader}>
          <View>
            <Text variant="titleMedium" style={styles.exerciseName}>
              {item.exercise.name}
            </Text>
            <Text variant="bodySmall" style={styles.exerciseCategory}>
              {item.exercise.category.charAt(0).toUpperCase() + item.exercise.category.slice(1)}
            </Text>
          </View>
          <Button
            mode="outlined"
            compact
            onPress={() => handleAddSet(item.id)}
            icon="plus"
          >
            Add Set
          </Button>
        </View>

        {item.sets.length > 0 && (
          <DataTable style={styles.setsTable}>
            <DataTable.Header>
              <DataTable.Title>Set</DataTable.Title>
              <DataTable.Title numeric>Weight</DataTable.Title>
              <DataTable.Title numeric>Reps</DataTable.Title>
              <DataTable.Title numeric>Rest</DataTable.Title>
              <DataTable.Title> </DataTable.Title>
            </DataTable.Header>

            {item.sets.map((set, index) => (
              <DataTable.Row key={set.id}>
                <DataTable.Cell>{set.setNumber}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <SetInput
                    value={set.weight}
                    onChangeValue={(value) => handleUpdateSet(set.id, 'weight', value)}
                    suffix="kg"
                  />
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <SetInput
                    value={set.reps}
                    onChangeValue={(value) => handleUpdateSet(set.id, 'reps', value)}
                  />
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <SetInput
                    value={set.restTime || 60}
                    onChangeValue={(value) => handleUpdateSet(set.id, 'restTime', value)}
                    suffix="s"
                  />
                </DataTable.Cell>
                <DataTable.Cell>
                  <IconButton
                    icon="delete-outline"
                    size={16}
                    onPress={() => handleDeleteSet(set.id)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        )}

        {item.sets.length === 0 && (
          <View style={styles.noSetsContainer}>
            <Text variant="bodyMedium" style={styles.noSetsText}>
              No sets added yet
            </Text>
            <Button
              mode="contained"
              compact
              onPress={() => handleAddSet(item.id)}
              icon="plus"
            >
              Add First Set
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const SetInput: React.FC<{
    value: number;
    onChangeValue: (value: number) => void;
    suffix?: string;
  }> = ({ value, onChangeValue, suffix }) => {
    const [text, setText] = useState(value.toString());

    const handleBlur = () => {
      const numValue = parseFloat(text) || 0;
      onChangeValue(numValue);
      setText(numValue.toString());
    };

    return (
      <TextInput
        value={text}
        onChangeText={setText}
        onBlur={handleBlur}
        keyboardType="numeric"
        dense
        style={styles.setInput}
        contentStyle={styles.setInputContent}
        right={suffix ? <TextInput.Affix text={suffix} /> : undefined}
      />
    );
  };

  if (!currentWorkout) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Timer */}
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text variant="headlineSmall" style={styles.workoutTitle}>
              {currentWorkout.name}
            </Text>
            <Text variant="bodyMedium" style={styles.workoutDate}>
              {new Date(currentWorkout.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.timerContainer}>
            <Chip
              icon={isTimerRunning ? 'pause' : 'play'}
              mode="outlined"
              onPress={() => setIsTimerRunning(!isTimerRunning)}
              style={styles.timerChip}
            >
              {formatTime(timer)}
            </Chip>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Chip icon="fitness-outline" compact>
            {currentWorkout.exercises.length} exercises
          </Chip>
          <Chip icon="repeat-outline" compact>
            {currentWorkout.exercises.reduce((total, ex) => total + ex.sets.length, 0)} sets
          </Chip>
        </View>
      </Surface>

      {/* Exercises List */}
      {currentWorkout.exercises.length > 0 ? (
        <FlatList
          data={currentWorkout.exercises}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={80} color="#ccc" />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No exercises added
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtitle}>
            Add your first exercise to start logging sets
          </Text>
          <Button
            mode="contained"
            onPress={handleAddExercise}
            style={styles.emptyButton}
            icon="add"
          >
            Add Exercise
          </Button>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={handleAddExercise}
          icon="plus"
          style={styles.addExerciseButton}
        >
          Add Exercise
        </Button>
        <Button
          mode="contained"
          onPress={() => setShowEndDialog(true)}
          icon="check"
          style={styles.endWorkoutButton}
        >
          End Workout
        </Button>
      </View>

      {/* End Workout Dialog */}
      <Portal>
        <Dialog visible={showEndDialog} onDismiss={() => setShowEndDialog(false)}>
          <Dialog.Title>End Workout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogText}>
              Are you sure you want to end this workout?
            </Text>
            <Text variant="bodySmall" style={styles.dialogSubtext}>
              Duration: {formatTime(timer)}
            </Text>
            <Text variant="bodySmall" style={styles.dialogSubtext}>
              Exercises: {currentWorkout.exercises.length}
            </Text>
            <Text variant="bodySmall" style={styles.dialogSubtext}>
              Sets: {currentWorkout.exercises.reduce((total, ex) => total + ex.sets.length, 0)}
            </Text>
            
            <TextInput
              label="Workout Notes (Optional)"
              value={workoutNotes}
              onChangeText={setWorkoutNotes}
              multiline
              numberOfLines={3}
              style={styles.notesInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEndDialog(false)}>Cancel</Button>
            <Button onPress={handleEndWorkout} mode="contained">
              End Workout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutTitle: {
    fontWeight: 'bold',
  },
  workoutDate: {
    color: '#666',
    marginTop: 4,
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerChip: {
    backgroundColor: '#e8f5e8',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  exerciseCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseName: {
    fontWeight: 'bold',
  },
  exerciseCategory: {
    color: '#666',
    marginTop: 2,
  },
  setsTable: {
    marginTop: 8,
  },
  setInput: {
    width: 60,
    height: 32,
  },
  setInputContent: {
    fontSize: 12,
    paddingVertical: 4,
  },
  noSetsContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noSetsText: {
    color: '#666',
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addExerciseButton: {
    flex: 1,
  },
  endWorkoutButton: {
    flex: 1,
    backgroundColor: '#50c878',
  },
  dialogText: {
    marginBottom: 8,
  },
  dialogSubtext: {
    color: '#666',
    marginBottom: 4,
  },
  notesInput: {
    marginTop: 16,
  },
});

export default AddWorkoutScreen;