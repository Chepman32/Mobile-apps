import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { EXERCISES } from '../data/exercises';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';

const TimerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Timer'>>();
  const { addSession } = useAppContext();
  const exercise = useMemo(() => EXERCISES.find(e => e.id === route.params.exerciseId), [route.params.exerciseId]);

  // Early return if exercise is not found
  if (!exercise) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Exercise not found!</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const phases = useMemo(() => {
    const p = [{ name: 'Inhale', duration: exercise.pattern.inhale }];
    if (exercise.pattern.hold > 0) p.push({ name: 'Hold', duration: exercise.pattern.hold });
    p.push({ name: 'Exhale', duration: exercise.pattern.exhale });
    if ((exercise.pattern.holdAfterExhale ?? 0) > 0) {
      p.push({ name: 'Hold', duration: exercise.pattern.holdAfterExhale! });
    }
    return p;
  }, [exercise]);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(phases[0].duration);
  const [isRunning, setIsRunning] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());

  const scale = useSharedValue(0.5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState.match(/inactive|background/)) {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isRunning) {
      if (phases[phaseIndex].name === 'Inhale') {
        scale.value = withTiming(1, { duration: phases[phaseIndex].duration * 1000, easing: Easing.out(Easing.ease) });
      } else if (phases[phaseIndex].name === 'Exhale') {
        scale.value = withTiming(0.5, { duration: phases[phaseIndex].duration * 1000, easing: Easing.in(Easing.ease) });
      }

      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            const nextPhaseIndex = (phaseIndex + 1) % phases.length;
            setPhaseIndex(nextPhaseIndex);
            return phases[nextPhaseIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      scale.value = withTiming(scale.value, { duration: 200 });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phaseIndex]);

  const handleStop = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    if (duration > 5) {
      addSession({ id: Date.now().toString(), exerciseId: exercise.id, duration, completedAt: new Date().toISOString() });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleStop} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="#fff" />
      </TouchableOpacity>

      <View style={styles.timerContainer}>
        <Animated.View style={[styles.circle, animatedStyle]}>
          <View style={styles.innerCircle} />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.phaseText}>{phases[phaseIndex].name}</Text>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setIsRunning(!isRunning)} style={styles.controlButton}>
          <Ionicons name={isRunning ? 'pause' : 'play'} size={48} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c2733',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
    backgroundColor: 'rgba(78, 115, 150, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: '80%',
    height: '80%',
    borderRadius: 120,
    backgroundColor: 'rgba(78, 115, 150, 0.5)',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 36,
    fontWeight: '300',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  countdownText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  controls: {
    position: 'absolute',
    bottom: 80,
  },
  controlButton: {
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4e7396',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TimerScreen;


