import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

const MOCK_SESSIONS = [
  { id: '1', title: 'Deep Sleep Journey', duration: '15 min', category: 'sleep' },
  { id: '2', title: 'Calm Mind', duration: '10 min', category: 'focus' },
  { id: '3', title: 'Anxiety Relief', duration: '20 min', category: 'anxiety' },
  { id: '4', title: 'Mindful Breathing', duration: '5 min', category: 'mindfulness' },
  { id: '5', title: 'Stress Relief', duration: '12 min', category: 'stress' },
  { id: '6', title: 'Quick Break', duration: '3 min', category: 'quick' },
];

type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;
type CategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Category'>;

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { categoryName } = route.params;
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Filter sessions by category (in a real app, this would be an API call)
  const sessions = MOCK_SESSIONS.filter(session => 
    session.category === categoryName.toLowerCase().split(' ')[0]
  );

  const handleSessionPress = (sessionId: string, sessionTitle: string) => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      navigation.navigate('Player', { 
        sessionId,
        sessionName: sessionTitle 
      });
      setIsLoading(false);
    }, 300);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: 20,
      zIndex: 10,
    },
    backText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '500',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: 10,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sessionItem: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    sessionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(106, 143, 199, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    sessionInfo: {
      flex: 1,
    },
    sessionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    sessionDuration: {
      fontSize: 14,
      color: colors.subtext,
    },
    playButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingContainer: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 100,
    },
  });

  const renderSessionItem = ({ item }: { item: typeof MOCK_SESSIONS[0] }) => (
    <TouchableOpacity 
      style={styles.sessionItem}
      onPress={() => handleSessionPress(item.id, item.title)}
    >
      <View style={styles.sessionIcon}>
        <Text style={{ fontSize: 20 }}>🎧</Text>
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.sessionDuration}>{item.duration}</Text>
      </View>
      <View style={styles.playButton}>
        <Text style={{ color: '#FFFFFF' }}>▶</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{categoryName}</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

export default CategoryScreen;
