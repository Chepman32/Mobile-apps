import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { prompts } from '../data/prompts';
const PromptScreen = () => {
  const [prompt, setPrompt] = useState(prompts[0]);
  const newPrompt = () => {
    const index = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[index]);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{prompt}</Text>
      <TouchableOpacity style={styles.button} onPress={newPrompt}>
        <Text style={styles.buttonText}>New Prompt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  text: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#4a6fa5', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default PromptScreen;
