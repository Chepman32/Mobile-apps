import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const bubbles = Array.from({ length: 12 }, (_, i) => i);

const FidgetScreen = () => {
  const [popped, setPopped] = useState<Record<number, boolean>>({});

  const reset = () => setPopped({});

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {bubbles.map(idx =>
          popped[idx] ? null : (
            <TouchableOpacity
              key={idx}
              style={styles.bubble}
              onPress={() => setPopped(p => ({ ...p, [idx]: true }))}
            />
          )
        )}
      </View>
      {Object.keys(popped).length === bubbles.length ? (
        <TouchableOpacity style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.text}>Tap bubbles to pop!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 220, marginBottom: 20 },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a6fa5',
    margin: 10,
  },
  text: { fontSize: 18 },
  button: { backgroundColor: '#4a6fa5', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default FidgetScreen;
