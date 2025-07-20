import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface PromptCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  prompts: string[];
}

const promptCategories: PromptCategory[] = [
  {
    id: 'writing',
    name: 'Writing',
    description: 'Creative writing prompts for stories, poems, and essays',
    icon: 'create',
    color: '#4CAF50',
    prompts: [
      'Write a story about a character who discovers they can hear colors',
      'Describe a world where emotions are visible as colors in the air',
      'Create a dialogue between two objects that have never met before',
      'Write a poem about the sound of silence',
      'Tell a story that begins with "The last person on Earth sat alone in a room..."',
    ],
  },
  {
    id: 'art',
    name: 'Art',
    description: 'Visual art prompts for drawing, painting, and design',
    icon: 'brush',
    color: '#2196F3',
    prompts: [
      'Draw a tree that grows upside down',
      'Paint a sunset using only geometric shapes',
      'Design a city that floats in the clouds',
      'Create a portrait of a robot with human emotions',
      'Illustrate a day in the life of a shadow',
    ],
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Photo composition and subject prompts',
    icon: 'camera',
    color: '#FF9800',
    prompts: [
      'Capture the reflection of a building in a puddle',
      'Photograph something that represents "hope"',
      'Take a photo from an unusual angle',
      'Find beauty in something ordinary',
      'Document the passage of time in a single image',
    ],
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Musical composition and sound prompts',
    icon: 'musical-notes',
    color: '#9C27B0',
    prompts: [
      'Compose a melody inspired by the sound of rain',
      'Create a rhythm using only household objects',
      'Write lyrics about a conversation you overheard',
      'Design a soundscape for a futuristic city',
      'Make music that represents the feeling of falling',
    ],
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Graphic design and creative problem-solving',
    icon: 'color-palette',
    color: '#F44336',
    prompts: [
      'Design a logo for a company that sells time',
      'Create a poster for an event that doesn\'t exist',
      'Design packaging for a product that solves a problem',
      'Make a map of a place that only exists in dreams',
      'Create a visual identity for a color that doesn\'t exist',
    ],
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Unexpected prompts to spark creativity',
    icon: 'shuffle',
    color: '#607D8B',
    prompts: [
      'Combine two things that don\'t belong together',
      'Create something using only materials you can find in your room',
      'Tell a story without using the letter "e"',
      'Design a machine that does something completely useless',
      'Create art that can only be experienced in complete darkness',
    ],
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (category: PromptCategory) => {
    setSelectedCategory(category.id);
    navigation.navigate('Prompt', { category } as never);
  };

  const getRandomPrompt = () => {
    const allCategories = promptCategories.flatMap(cat => cat.prompts);
    const randomPrompt = allCategories[Math.floor(Math.random() * allCategories.length)];
    const randomCategory = promptCategories[Math.floor(Math.random() * promptCategories.length)];
    navigation.navigate('Prompt', { 
      category: randomCategory,
      prompt: randomPrompt 
    } as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Creative Spark</Text>
        <Text style={styles.subtitle}>Ignite your creativity with inspiring prompts</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.randomButton}
          onPress={getRandomPrompt}
          activeOpacity={0.8}
        >
          <Ionicons name="shuffle" size={24} color="white" />
          <Text style={styles.randomButtonText}>Random Prompt</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Choose a Category</Text>
        
        <View style={styles.categoriesGrid}>
          {promptCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.8}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon as any} size={32} color="white" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap any category to get started</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6c5ce7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  randomButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 48) / 2,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 14,
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default HomeScreen;
