import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SessionContext } from '../context/SessionContext';

const MeditationScreen = () => {
  const { addSession } = useContext(SessionContext);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (!running) return;
    if (count === 0) {
      addSession();
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [running, count]);

  const start = () => {
    setCount(5);
    setRunning(true);
  };

  return (
    <View style={styles.container}>
      {running ? (
        <Text style={styles.text}>{count === 0 ? 'Done!' : `Breathing... ${count}`}</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={start}>
          <Text style={styles.buttonText}>Start 5s Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
  button: { backgroundColor: '#4a6fa5', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default MeditationScreen;
