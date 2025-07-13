import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const categories = [
  { id: '1', name: 'Sleep', icon: '🌙', color: '#4A6FA5' },
  { id: '2', name: 'Focus', icon: '🎯', color: '#6A8FC7' },
  { id: '3', name: 'Anxiety Relief', icon: '🧘', color: '#8FB2E3' },
  { id: '4', name: 'Mindfulness', icon: '🌿', color: '#4A8F8C' },
  { id: '5', name: 'Stress Relief', icon: '🌊', color: '#6A8FC7' },
  { id: '6', name: 'Quick Breaks', icon: '⏱️', color: '#8FB2E3' },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      paddingBottom: 30,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      marginTop: 24,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    categoryIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    recentSessions: {
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zen Anywhere</Text>
        <Text style={styles.subtitle}>Find your peace, anytime, anywhere</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() =>
                navigation.navigate('Category', {
                  categoryId: category.id,
                  categoryName: category.name,
                })
              }>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryName, { color: '#FFFFFF' }]}>{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
