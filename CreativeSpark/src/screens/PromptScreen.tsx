import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface PromptScreenParams {
  category?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    prompts: string[];
  };
  prompt?: string;
}

const PromptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ Prompt: PromptScreenParams }, 'Prompt'>>();
  const { category, prompt: initialPrompt } = route.params || {};

  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Animation values
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    if (initialPrompt) {
      setCurrentPrompt(initialPrompt);
    } else if (category) {
      setCurrentPrompt(category.prompts[0]);
    }
  }, [initialPrompt, category]);

  const nextPrompt = () => {
    if (!category) return;

    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const nextIndex = (promptIndex + 1) % category.prompts.length;
      setPromptIndex(nextIndex);
      setCurrentPrompt(category.prompts[nextIndex]);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const previousPrompt = () => {
    if (!category) return;

    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const prevIndex = promptIndex === 0 ? category.prompts.length - 1 : promptIndex - 1;
      setPromptIndex(prevIndex);
      setCurrentPrompt(category.prompts[prevIndex]);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const toggleFavorite = () => {
    if (favorites.includes(currentPrompt)) {
      setFavorites(favorites.filter(p => p !== currentPrompt));
    } else {
      setFavorites([...favorites, currentPrompt]);
    }
  };

  const isFavorite = favorites.includes(currentPrompt);

  const sharePrompt = () => {
    // In a real app, this would use the Share API
    console.log('Sharing prompt:', currentPrompt);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        {category && (
          <View style={styles.categoryInfo}>
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon as any} size={20} color="white" />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
        )}
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#e74c3c" : "#666"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={sharePrompt}
          >
            <Ionicons name="share-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.promptContainer}>
          <Animated.View
            style={[
              styles.promptCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.promptHeader}>
              <Ionicons name="bulb-outline" size={24} color="#6c5ce7" />
              <Text style={styles.promptLabel}>Creative Prompt</Text>
            </View>
            
            <Text style={styles.promptText}>{currentPrompt}</Text>
            
            {category && (
              <View style={styles.promptMeta}>
                <Text style={styles.promptCounter}>
                  {promptIndex + 1} of {category.prompts.length}
                </Text>
              </View>
            )}
          </Animated.View>

          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>How to use this prompt:</Text>
            <View style={styles.suggestionItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.suggestionText}>Set a timer for 10-15 minutes</Text>
            </View>
            <View style={styles.suggestionItem}>
              <Ionicons name="create-outline" size={16} color="#666" />
              <Text style={styles.suggestionText}>Don't overthink - just start creating</Text>
            </View>
            <View style={styles.suggestionItem}>
              <Ionicons name="happy-outline" size={16} color="#666" />
              <Text style={styles.suggestionText}>Have fun and experiment freely</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {category && (
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={previousPrompt}
            disabled={isAnimating}
          >
            <Ionicons name="chevron-back" size={24} color="#666" />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={nextPrompt}
            disabled={isAnimating}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  promptContainer: {
    flex: 1,
  },
  promptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginLeft: 8,
  },
  promptText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  promptMeta: {
    alignItems: 'flex-end',
  },
  promptCounter: {
    fontSize: 12,
    color: '#666',
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  prevButton: {
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default PromptScreen;
