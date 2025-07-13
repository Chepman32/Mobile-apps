import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import * as Speech from 'expo-speech';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import PhraseService from '../services/PhraseService';
import { Phrase } from '../types';

type PhraseScreenRouteProp = RouteProp<RootStackParamList, 'Phrase'>;
type PhraseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Phrase'>;

type Props = {
  route: PhraseScreenRouteProp;
  navigation: PhraseScreenNavigationProp;
};

const PhraseScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phraseId } = route.params;
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite } = useAppContext();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const loadPhrase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await PhraseService.getPhraseById(phraseId);
      if (data) {
        setPhrase(data);
        navigation.setOptions({ title: data.original });
      } else {
        setError('Phrase not found');
      }
    } catch (err) {
      console.error('Failed to load phrase:', err);
      setError('Failed to load phrase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhrase();
  }, [phraseId]);

  const handleToggleFavorite = async () => {
    if (!phrase) return;
    
    try {
      await toggleFavorite(phrase.id);
      // Update local state to reflect the change
      setPhrase((prev: Phrase | null) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const speak = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'es-ES',
      rate: isSlow ? 0.5 : 1.0,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !phrase) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Phrase not found'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadPhrase}
          disabled={isLoading}
        >
          <Text style={styles.retryButtonText}>
            {isLoading ? 'Loading...' : 'Retry'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleSpeed = () => {
    setIsSlow(prev => !prev);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={loadPhrase}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.card}>
        <View style={styles.phraseHeader}>
          <Text style={styles.originalText}>{phrase.original}</Text>
          <TouchableOpacity 
            onPress={handleToggleFavorite} 
            style={styles.favoriteButton}
            disabled={isLoading}
          >
            <Text style={styles.favoriteIcon}>
              {phrase.isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.translationContainer}>
          <Text style={styles.translationText}>{phrase.translation}</Text>
          <Text style={styles.pronunciationText}>/{phrase.pronunciation}/</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.button, isSpeaking && styles.buttonActive]}
            onPress={() => speak(phrase.translation)}
            disabled={isSpeaking}
          >
            <Text style={styles.buttonText}>
              {isSpeaking ? 'Speaking...' : 'Listen'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton, isSlow && styles.slowActive]}
            onPress={toggleSpeed}
          >
            <Text style={styles.buttonText}>
              {isSlow ? 'Slow' : 'Normal'} Speed
            </Text>
          </TouchableOpacity>
        </View>

        {phrase.examples && phrase.examples.length > 0 && (
          <View style={styles.examplesContainer}>
            <Text style={styles.sectionTitle}>Examples:</Text>
            {phrase.examples.map((example: { original: string; translation: string }, index: number) => (
              <View key={index} style={styles.exampleItem}>
                <Text style={styles.exampleOriginal}>{example.original}</Text>
                <Text style={styles.exampleTranslation}>{example.translation}</Text>
                <TouchableOpacity 
                  style={styles.speakExampleButton}
                  onPress={() => speak(example.translation)}
                  disabled={isSpeaking}
                >
                  <Text style={styles.speakExampleIcon}>
                    {isSpeaking ? '🔊' : '🔈'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: colors.primaryContrast,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  originalText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 28,
  },
  translationContainer: {
    marginBottom: 24,
  },
  translationText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  pronunciationText: {
    fontSize: 16,
    color: colors.subtext,
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: '48%',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primaryDark,
  },
  secondaryButton: {
    backgroundColor: colors.secondaryButton,
  },
  slowActive: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.primaryContrast,
    fontWeight: '600',
    fontSize: 16,
  },
  examplesContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  exampleItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exampleOriginal: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  exampleTranslation: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  speakExampleButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  speakExampleIcon: {
    fontSize: 18,
  },
});

export default PhraseScreen;
