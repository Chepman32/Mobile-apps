
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg';

const DungeonScreen = ({ route, navigation }) => {
  const { meditationDuration, breaths } = route.params;
  const [characterLevel, setCharacterLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [dungeonProgress, setDungeonProgress] = useState(0); // 0-100

  useEffect(() => {
    // Simulate XP gain and dungeon progress based on meditation
    const gainedXp = Math.floor(meditationDuration / 10) + Math.floor(breaths / 5);
    setXp((prevXp) => prevXp + gainedXp);
    setDungeonProgress((prevProgress) => Math.min(100, prevProgress + Math.floor(gainedXp / 2)));

    if (xp >= 100) { // Simple level up
      setCharacterLevel((prevLevel) => prevLevel + 1);
      setXp(xp - 100);
      Alert.alert('Level Up!', `You reached Level ${characterLevel + 1}!`);
    }
  }, [meditationDuration, breaths]);

  const exploreDungeon = () => {
    Alert.alert(
      'Exploring Dungeon',
      'You delve deeper into the dungeon. Your character gains experience from your meditation.'
    );
    // In a real game, this would trigger visual updates, encounters, etc.
  };

  const data = [
    { x: 'Progress', y: dungeonProgress },
    { x: 'Remaining', y: 100 - dungeonProgress },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dungeon Crawl</Text>
      <Text style={styles.statsText}>Level: {characterLevel}</Text>
      <Text style={styles.statsText}>XP: {xp}</Text>

      <View style={styles.chartContainer}>
        <Svg width={200} height={200}>
          <VictoryPie
            standalone={false}
            width={200}
            height={200}
            data={data}
            innerRadius={60}
            colorScale={['#007bff', '#e0e0e0']}
            labels={() => null} // Hide default labels
          />
          <Text style={styles.chartCenterText}>Dungeon Progress: {dungeonProgress}%</Text>
        </Svg>
      </View>

      <TouchableOpacity style={styles.button} onPress={exploreDungeon}>
        <Text style={styles.buttonText}>Explore Dungeon</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  statsText: {
    fontSize: 20,
    marginBottom: 10,
  },
  chartContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  chartCenterText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DungeonScreen;
