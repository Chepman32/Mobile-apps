
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { Accelerometer } from 'react-native-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Box = ({ body, size, color }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;

  return (
    <View style={{
      left: x,
      top: y,
      width: size[0],
      height: size[1],
      backgroundColor: color,
      position: 'absolute',
    }} />
  );
};

const Physics = (entities, { time }) => {
  // Simple physics: move obstacles towards player
  Object.keys(entities).forEach(key => {
    if (key.startsWith('obstacle')) {
      entities[key].body.position.x -= 5; // Move left
      if (entities[key].body.position.x < -entities[key].size[0]) {
        // Reposition obstacle when it goes off screen
        entities[key].body.position.x = width + Math.random() * width / 2;
        entities[key].body.position.y = Math.random() * (height - 100) + 50;
      }
    }
  });
  return entities;
};

const Player = ({ body, size, color }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;

  return (
    <View style={{
      left: x,
      top: y,
      width: size[0],
      height: size[1],
      backgroundColor: color,
      position: 'absolute',
    }} />
  );
};

const GameScreen = ({ navigation }) => {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const gameEngineRef = useRef(null);
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    setRunning(true);
    // Simulate player movement with accelerometer (conceptual)
    accelerometerSubscription.current = new Accelerometer({ updateInterval: 100 }).subscribe(({ x, y, z }) => {
      // Simple tilt control: move player up/down based on device tilt
      if (gameEngineRef.current && gameEngineRef.current.state && gameEngineRef.current.state.entities.player) {
        const player = gameEngineRef.current.state.entities.player;
        player.body.position.y += y * 5; // Adjust sensitivity
        // Keep player within bounds
        player.body.position.y = Math.max(0, Math.min(height - player.size[1], player.body.position.y));
      }
    });

    return () => {
      setRunning(false);
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.unsubscribe();
      }
    };
  }, []);

  const onEvent = (e) => {
    if (e.type === 'game-over') {
      setRunning(false);
      Alert.alert('Game Over', `Your score: ${score}`, [
        { text: 'Play Again', onPress: resetGame },
        { text: 'Go Home', onPress: () => navigation.goBack() },
      ]);
      saveHighScore(score);
    } else if (e.type === 'score') {
      setScore(score + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setRunning(true);
    // Reset entities (conceptual)
    gameEngineRef.current.swap({
      player: { body: { position: { x: 50, y: height / 2 } }, size: [50, 50], color: 'blue', renderer: Player },
      obstacle1: { body: { position: { x: width, y: height / 4 } }, size: [30, 30], color: 'red', renderer: Box },
      obstacle2: { body: { position: { x: width * 1.5, y: height * 0.75 } }, size: [30, 30], color: 'red', renderer: Box },
    });
  };

  const saveHighScore = async (newScore) => {
    try {
      const currentHighScore = await AsyncStorage.getItem('highScore');
      if (!currentHighScore || newScore > parseInt(currentHighScore)) {
        await AsyncStorage.setItem('highScore', newScore.toString());
      }
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[Physics]}
        entities={{
          player: { body: { position: { x: 50, y: height / 2 } }, size: [50, 50], color: 'blue', renderer: Player },
          obstacle1: { body: { position: { x: width, y: height / 4 } }, size: [30, 30], color: 'red', renderer: Box },
          obstacle2: { body: { position: { x: width * 1.5, y: height * 0.75 } }, size: [30, 30], color: 'red', renderer: Box },
        }}
        running={running}
        onEvent={onEvent}
      >
        <Text style={styles.scoreText}>Score: {score}</Text>
      </GameEngine>
      {!running && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  gameContainer: {
    flex: 1,
  },
  scoreText: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  restartButton: {
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

export default GameScreen;
