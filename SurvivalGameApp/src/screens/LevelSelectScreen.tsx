import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { LEVELS } from '../data/levels';
import { Level, RootStackParamList } from '../types';

const LevelSelectScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { progress } = useAppContext();

  const renderItem = ({ item, index }: { item: Level; index: number }) => {
    const levelNumber = index + 1;
    const isLocked = levelNumber > progress.unlockedLevel;
    const isCompleted = progress.completedLevels.includes(item.id);

    let statusIcon: React.ComponentProps<typeof Ionicons>['name'] = 'lock-closed';
    let statusColor = '#4a4a58';

    if (isCompleted) {
      statusIcon = 'checkmark-circle';
      statusColor = '#34c759';
    } else if (!isLocked) {
      statusIcon = 'ellipse-outline';
      statusColor = '#e0e0e0';
    }

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isLocked && styles.itemLocked]}
        disabled={isLocked}
        onPress={() => navigation.navigate('Game', { levelId: item.id })}
      >
        <Text style={styles.itemNumber}>{levelNumber}</Text>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Ionicons name={statusIcon} size={32} color={statusColor} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#e0e0e0" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Level</Text>
      </View>
      <FlatList
        data={LEVELS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#0f3460',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginLeft: 16,
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162447',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f4068',
  },
  itemLocked: {
    backgroundColor: '#2a2a3e',
    borderColor: '#4a4a58',
  },
  itemNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginRight: 16,
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    color: '#e0e0e0',
  },
});

export default LevelSelectScreen;

