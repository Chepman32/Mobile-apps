import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  useTheme,
  IconButton,
  ProgressBar,
  Portal,
  Dialog,
  List,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { CookingSession, Recipe } from '../types';

const CookingSessionScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { state, actions } = useRecipeVault();
  const [session, setSession] = useState<CookingSession | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [notes, setNotes] = useState('');

  const { sessionId } = route.params as { sessionId: string };
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const foundSession = state.cookingSessions.find(s => s.id === sessionId);
    setSession(foundSession || null);
  }, [sessionId, state.cookingSessions]);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleNextStep = () => {
    if (session?.recipe?.instructions && currentStep < session.recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;

    const updatedSession: CookingSession = {
      ...session,
      status: 'completed',
      duration: timer,
      notes,
      endTime: new Date().toISOString(),
    };

    await actions.updateCookingSession(updatedSession);
    setShowEndSessionDialog(false);
    navigation.goBack();
  };

  const handleCancelSession = async () => {
    if (!session) return;

    const updatedSession: CookingSession = {
      ...session,
      status: 'cancelled',
      duration: timer,
      notes,
      endTime: new Date().toISOString(),
    };

    await actions.updateCookingSession(updatedSession);
    navigation.goBack();
  };

  if (!session || !session.recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          Session not found
        </Text>
      </View>
    );
  }

  const recipe = session.recipe;
  const totalSteps = recipe.instructions?.length || 0;
  const progress = totalSteps > 0 ? (currentStep + 1) / totalSteps : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, flex: 1 }}>
          Cooking: {recipe.title}
        </Text>
        <IconButton
          icon="stop"
          size={24}
          onPress={() => setShowEndSessionDialog(true)}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Timer */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Cooking Timer
            </Text>
            <View style={styles.timerContainer}>
              <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
                {formatTime(timer)}
              </Text>
              <View style={styles.timerControls}>
                {!isTimerRunning ? (
                  <Button
                    mode="contained"
                    icon="play"
                    onPress={handleStartTimer}
                  >
                    Start
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    icon="pause"
                    onPress={handlePauseTimer}
                  >
                    Pause
                  </Button>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Progress */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Progress
            </Text>
            <ProgressBar
              progress={progress}
              style={styles.progressBar}
            />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Step {currentStep + 1} of {totalSteps}
            </Text>
          </Card.Content>
        </Card>

        {/* Current Step */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
                Current Step
              </Text>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
                    {currentStep + 1}
                  </Text>
                </View>
                <View style={styles.stepContent}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {recipe.instructions[currentStep]}
                  </Text>
                </View>
              </View>
              <View style={styles.stepControls}>
                <Button
                  mode="outlined"
                  icon="chevron-left"
                  onPress={handlePreviousStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  mode="contained"
                  icon="chevron-right"
                  onPress={handleNextStep}
                  disabled={currentStep === totalSteps - 1}
                >
                  Next
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Recipe Info */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Recipe Information
            </Text>
            <View style={styles.recipeInfo}>
              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  Prep Time
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  {recipe.prepTime} min
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  Difficulty
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
                  {recipe.difficulty}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  Servings
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.tertiary }}>
                  {recipe.servings}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Ingredients */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Ingredients
            </Text>
            {recipe.ingredients?.map((ingredient, index) => (
              <List.Item
                key={ingredient.id}
                title={ingredient.name}
                description={`${ingredient.amount} ${ingredient.unit}`}
                left={(props) => (
                  <List.Icon {...props} icon="circle-small" />
                )}
                style={styles.ingredientItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Notes */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Session Notes
            </Text>
            <TextInput
              label="Add notes about your cooking session"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          icon="close"
          onPress={handleCancelSession}
          style={styles.cancelButton}
        >
          Cancel Session
        </Button>
        <Button
          mode="contained"
          icon="check"
          onPress={() => setShowEndSessionDialog(true)}
        >
          Complete Session
        </Button>
      </View>

      {/* End Session Dialog */}
      <Portal>
        <Dialog
          visible={showEndSessionDialog}
          onDismiss={() => setShowEndSessionDialog(false)}
        >
          <Dialog.Title>End Cooking Session</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to end this cooking session? This will mark it as completed.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEndSessionDialog(false)}>Cancel</Button>
            <Button onPress={handleEndSession}>Complete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerControls: {
    marginTop: 16,
  },
  progressBar: {
    marginBottom: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  ingredientItem: {
    paddingVertical: 4,
  },
  notesInput: {
    marginBottom: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
});

export default CookingSessionScreen; 