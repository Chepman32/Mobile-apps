import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface Page { id: string; text: string; }

const CreateStoryScreen = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [text, setText] = useState('');

  const addPage = () => {
    if (!text.trim()) return;
    setPages([{ id: Date.now().toString(), text }, ...pages]);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Story</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Page text"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity onPress={addPage} style={styles.addButton}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={pages}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.pageItem}>
            <Text style={styles.pageTitle}>Page {pages.length - index}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  inputRow: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
  addButton: { marginLeft: 8, backgroundColor: '#4ECDC4', padding: 10, borderRadius: 4 },
  addText: { color: '#fff' },
  pageItem: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  pageTitle: { fontWeight: '600', marginBottom: 4 },
});

export default CreateStoryScreen;
