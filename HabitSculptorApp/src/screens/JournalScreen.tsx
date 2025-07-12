import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';

const JournalScreen = () => {
  const { journal, addJournalEntry } = useAppContext();
  const [text, setText] = useState('');

  const handleAdd = async () => {
    if (!text.trim()) return;
    await addJournalEntry(text.trim());
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Journal</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write something..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAdd} style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={journal}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
  button: { marginLeft: 8, backgroundColor: '#4ECDC4', padding: 10, borderRadius: 4 },
  buttonText: { color: '#fff' },
  entry: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  entryDate: { fontWeight: '600', marginBottom: 4 },
});

export default JournalScreen;
