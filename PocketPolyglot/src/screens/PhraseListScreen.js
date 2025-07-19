
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import phrases from '../data/phrases.json';
import Tts from 'react-native-tts';

const PhraseListScreen = ({ route }) => {
  const { categoryId } = route.params;
  const category = phrases.categories.find((c) => c.id === categoryId);

  const speak = (text) => {
    Tts.speak(text);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={category.phrases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.phraseItem}>
            <Text style={styles.englishText}>{item.english}</Text>
            <Text style={styles.translationText}>{item.translation}</Text>
            <TouchableOpacity onPress={() => speak(item.translation)}>
              <Text style={styles.speakButton}>Speak</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  phraseItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  englishText: {
    fontSize: 16,
  },
  translationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  speakButton: {
    color: 'blue',
    marginTop: 10,
  },
});

export default PhraseListScreen;
