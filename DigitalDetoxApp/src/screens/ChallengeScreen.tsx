import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Challenge } from '../types';
import { CHALLENGES } from '../data/challenges';
import { useAppContext } from '../context/AppContext';

const ChallengeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Challenge'>>();
  const { addSession } = useAppContext();
  const challenge = CHALLENGES.find(c => c.id === route.params.challengeId);

  const [secondsLeft, setSecondsLeft] = useState(() =>
    challenge ? challenge.durationMinutes * 60 : 0
  );

  useEffect(() => {
    if (!challenge) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          addSession({
            id: Date.now().toString(),
            challengeId: challenge.id,
            startedAt: new Date().toISOString(),
            completed: true,
          });
          navigation.goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [challenge]);

  if (!challenge) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Challenge not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{challenge.name}</Text>
      <Text style={styles.time}>{Math.ceil(secondsLeft / 60)}:{('0' + secondsLeft % 60).slice(-2)}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4e7396',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#333',
  },
});

export default ChallengeScreen;
