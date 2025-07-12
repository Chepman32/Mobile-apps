import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';

const CreateCapsuleScreen = () => {
  const { capsules, addCapsule } = useAppContext();
  const [text, setText] = useState('');

  const handleSave = async () => {
    if (!text.trim()) return;
    await addCapsule({ id: Date.now().toString(), text, unlockDate: new Date().toISOString() });
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Capsule</Text>
      <TextInput
        style={styles.input}
        placeholder="Message"
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <FlatList
        data={capsules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}><Text>{item.text}</Text></View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 10 },
  button: { backgroundColor: '#4ECDC4', padding: 10, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff' },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

export default CreateCapsuleScreen;
