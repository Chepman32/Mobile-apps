import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface FidgetToy {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  screen: string;
}

const fidgetToys: FidgetToy[] = [
  {
    id: 'bubble-wrap',
    name: 'Bubble Wrap',
    description: 'Pop virtual bubbles to relieve stress',
    icon: 'water',
    color: '#4CAF50',
    screen: 'BubbleWrap',
  },
  {
    id: 'spinner',
    name: 'Fidget Spinner',
    description: 'Spin and watch the mesmerizing motion',
    icon: 'refresh',
    color: '#2196F3',
    screen: 'Spinner',
  },
  {
    id: 'slider',
    name: 'Slider Puzzle',
    description: 'Slide tiles to solve the puzzle',
    icon: 'grid',
    color: '#FF9800',
    screen: 'Slider',
  },
  {
    id: 'drawing',
    name: 'Doodle Pad',
    description: 'Draw and sketch freely',
    icon: 'brush',
    color: '#9C27B0',
    screen: 'Drawing',
  },
  {
    id: 'maze',
    name: 'Ball Maze',
    description: 'Navigate the ball through the maze',
    icon: 'navigate',
    color: '#F44336',
    screen: 'Maze',
  },
  {
    id: 'tiles',
    name: 'Tile Flip',
    description: 'Flip tiles to create patterns',
    icon: 'square',
    color: '#607D8B',
    screen: 'Tiles',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleFidgetPress = (fidget: FidgetToy) => {
    navigation.navigate(fidget.screen as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pocket Fidgets</Text>
        <Text style={styles.subtitle}>Relax and destress with interactive toys</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {fidgetToys.map((fidget) => (
            <TouchableOpacity
              key={fidget.id}
              style={[styles.fidgetCard, { backgroundColor: fidget.color }]}
              onPress={() => handleFidgetPress(fidget)}
              activeOpacity={0.8}
            >
              <View style={styles.fidgetIcon}>
                <Ionicons name={fidget.icon as any} size={32} color="white" />
              </View>
              <Text style={styles.fidgetName}>{fidget.name}</Text>
              <Text style={styles.fidgetDescription}>{fidget.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Choose a fidget toy to start relaxing</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fidgetCard: {
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
  fidgetIcon: {
    marginBottom: 12,
  },
  fidgetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  fidgetDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 16,
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
