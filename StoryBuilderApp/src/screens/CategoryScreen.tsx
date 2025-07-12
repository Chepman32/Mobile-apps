import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import * as Speech from 'expo-speech';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import PhraseService from '../services/PhraseService';

type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;
type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;

type Props = {
  route: CategoryScreenRouteProp;
  navigation: CategoryScreenNavigationProp;
};

type Phrase = {
  id: string;
  original: string;
  translation: string;
  pronunciation: string;
  isFavorite: boolean;
};

// Mock data - in a real app, this would come from a database or API
const mockPhrases: Record<string, Phrase[]> = {
  '1': [
    { id: '1-1', original: 'Hello', translation: 'Hola', pronunciation: 'oh-la', isFavorite: false },
    { id: '1-2', original: 'Good morning', translation: 'Buenos días', pronunciation: 'bweh-nos dee-as', isFavorite: true },
    { id: '1-3', original: 'Good night', translation: 'Buenas noches', pronunciation: 'bweh-nas noh-ches', isFavorite: false },
  ],
  '2': [
    { id: '2-1', original: 'Where is the airport?', translation: '¿Dónde está el aeropuerto?', pronunciation: 'don-deh es-ta el a-eh-ro-pwer-to', isFavorite: false },
    { id: '2-2', original: 'How much is a ticket?', translation: '¿Cuánto cuesta un boleto?', pronunciation: 'kwan-to kwes-ta un bo-le-to', isFavorite: false },
  ],
  // Add more categories as needed
};

const CategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const { toggleFavorite } = useAppContext();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const loadPhrases = async () => {
    try {
      const data = await PhraseService.getPhrasesByCategory(categoryId);
      setPhrases(data);
    } catch (error) {
      console.error('Failed to load phrases:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPhrases();
  }, [categoryId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPhrases();
  };

  const speak = (text: string, id: string) => {
    setSpeaking(id);
    Speech.speak(text, {
      language: 'es-ES', // Default to Spanish
      onDone: () => setSpeaking(null),
      onError: () => setSpeaking(null),
    });
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
      // Update local state to reflect the change
      setPhrases(phrases.map(phrase => 
        phrase.id === id 
          ? { ...phrase, isFavorite: !phrase.isFavorite } 
          : phrase
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const renderPhrase = ({ item }: { item: Phrase }) => (
    <View style={styles.phraseCard}>
      <View style={styles.phraseHeader}>
        <Text style={styles.originalText}>{item.original}</Text>
        <TouchableOpacity 
          onPress={() => handleToggleFavorite(item.id)}
          style={styles.favoriteButton}
        >
          <Text style={styles.favoriteIcon}>{item.isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.translationText}>{item.translation}</Text>
      
      <View style={styles.pronunciationRow}>
        <Text style={styles.pronunciationText}>{item.pronunciation}</Text>
        <TouchableOpacity 
          onPress={() => speak(item.translation, item.id)}
          style={styles.speakButton}
          disabled={!!speaking}
        >
          <Text style={styles.speakIcon}>
            {speaking === item.id ? '🔊' : '🔈'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {phrases.length > 0 ? (
        <FlatList
          data={phrases}
          renderItem={renderPhrase}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No phrases found in this category</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Text style={styles.retryButtonText}>
              {refreshing ? 'Loading...' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.primaryContrast,
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  phraseCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  translationText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: '500',
  },
  pronunciationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  pronunciationText: {
    fontSize: 14,
    color: colors.subtext,
    fontStyle: 'italic',
  },
  speakButton: {
    padding: 8,
  },
  speakIcon: {
    fontSize: 20,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
});

export default CategoryScreen;
