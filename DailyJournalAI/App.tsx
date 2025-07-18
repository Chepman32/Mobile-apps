/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, StyleSheet, View} from 'react-native';
import * as Haptics from 'react-native-haptic-feedback';
import {createRealmContext} from '@realm/react';
import Realm from 'realm';

const EntrySchema = {
  name: 'Entry',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    text: 'string',
    date: 'date',
    sentiment: 'int',
  },
};

const {RealmProvider, useRealm, useQuery} = createRealmContext({schema: [EntrySchema]});

function JournalScreen() {
  const realm = useRealm();
  const entries = useQuery('Entry', entries => entries.sorted('date', true));
  const [text, setText] = useState('');

  const analyseSentiment = useCallback((content: string) => {
    // TODO: Replace with real Executorch model. For now use naive score.
    const positiveWords = ['good', 'great', 'happy', 'love', 'excellent'];
    let score = 0;
    positiveWords.forEach(w => {
      if (content.toLowerCase().includes(w)) score += 1;
    });
    return score;
  }, []);

  const onSave = useCallback(() => {
    if (!text.trim()) return;
    realm.write(() => {
      realm.create('Entry', {
        _id: new Realm.BSON.ObjectId(),
        text: text.trim(),
        date: new Date(),
        sentiment: analyseSentiment(text),
      });
    });
    Haptics.trigger('impactLight');
    setText('');
  }, [text, realm, analyseSentiment]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Today I..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </TouchableOpacity>
      <FlatList
        data={entries}
        keyExtractor={item => item._id.toHexString()}
        renderItem={({item}) => (
          <View style={styles.entry}>
            <Text style={styles.entryDate}>{item.date.toLocaleString()}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
            <Text style={styles.entrySentiment}>Sentiment: {item.sentiment}</Text>
          </View>
        )}
      />
    </View>
  );
}

function App() {
  return (
    <RealmProvider>
      <JournalScreen />
    </RealmProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  entry: {marginBottom: 16},
  entryDate: {fontSize: 12, color: '#666'},
  entryText: {fontSize: 16, marginTop: 4},
  entrySentiment: {fontSize: 12, color: '#007aff', marginTop: 4},
});

export default App;
