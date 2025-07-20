import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanGestureHandler, State } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FidgetScreen = () => {
  const navigation = useNavigation();
  const [popped, setPopped] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastPopTime, setLastPopTime] = useState(0);
  
  // Animation values
  const scaleAnim = new Animated.Value(1);
  const rotationAnim = new Animated.Value(0);

  const bubbles = Array.from({ length: 20 }, (_, i) => i);

  const reset = () => {
    setPopped({});
    setScore(0);
    setCombo(0);
  };

  const popBubble = (idx: number) => {
    if (popped[idx]) return;

    const now = Date.now();
    const timeDiff = now - lastPopTime;
    
    // Combo system
    if (timeDiff < 1000) {
      setCombo(combo + 1);
    } else {
      setCombo(1);
    }
    
    setLastPopTime(now);
    setPopped(prev => ({ ...prev, [idx]: true }));
    setScore(score + (10 * combo));

    // Pop animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spinAnimation = () => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const spinInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const allPopped = Object.keys(popped).length === bubbles.length;

  useEffect(() => {
    if (allPopped) {
      // Celebration animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [allPopped]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Bubble Wrap</Text>
        <View style={styles.stats}>
          <Text style={styles.score}>Score: {score}</Text>
          {combo > 1 && <Text style={styles.combo}>Combo: x{combo}</Text>}
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.grid}>
          {bubbles.map(idx =>
            popped[idx] ? (
              <View key={idx} style={styles.poppedBubble}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </View>
            ) : (
              <TouchableOpacity
                key={idx}
                style={styles.bubble}
                onPress={() => popBubble(idx)}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.bubbleInner,
                    {
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                />
              </TouchableOpacity>
            )
          )}
        </View>

        {allPopped && (
          <Animated.View
            style={[
              styles.completionMessage,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.completionText}>All Bubbles Popped! 🎉</Text>
            <Text style={styles.finalScore}>Final Score: {score}</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetButton} onPress={reset}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.spinnerButton} onPress={spinAnimation}>
          <Animated.View
            style={[
              styles.spinnerIcon,
              {
                transform: [{ rotate: spinInterpolate }],
              },
            ]}
          >
            <Ionicons name="refresh" size={24} color="#2196F3" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {!allPopped && (
        <View style={styles.instruction}>
          <Text style={styles.instructionText}>Tap bubbles to pop them!</Text>
          <Text style={styles.instructionSubtext}>Quick taps create combos for bonus points</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  stats: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  combo: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: width - 40,
  },
  bubble: {
    width: 60,
    height: 60,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  poppedBubble: {
    width: 60,
    height: 60,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionMessage: {
    position: 'absolute',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  completionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  finalScore: {
    fontSize: 16,
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  spinnerButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  spinnerIcon: {
    width: 24,
    height: 24,
  },
  instruction: {
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  instructionSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default FidgetScreen;
