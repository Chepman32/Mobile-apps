

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import CodeEditor from 'react-native-code-editor';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'codeMentor.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CodeEditorScreen = () => {
  const [code, setCode] = useState('console.log("Hello, World!");');
  const [output, setOutput] = useState('');

  const runCode = () => {
    try {
      // This is a very basic and unsafe way to run code. 
      // In a real app, you'd use a secure sandboxed environment or a dedicated interpreter.
      const consoleOutput = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        consoleOutput.push(args.join(' '));
      };

      eval(code); // DANGER: Do NOT use eval with untrusted code in a real app!

      console.log = originalConsoleLog;
      setOutput(consoleOutput.join('\n'));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const saveCode = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS code_snippets (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO code_snippets (code, timestamp) VALUES (?, ?)',
            [code, new Date().toLocaleString()],
            () => Alert.alert('Success', 'Code saved!'),
            (tx, error) => console.error('Error saving code', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced languages, code review features, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Code Editor</Text>
      <CodeEditor
        style={styles.editor}
        initialValue={code}
        onChangeText={setCode}
        language="javascript" // Conceptual: syntax highlighting for JS
        showLineNumbers={true}
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={runCode}>
          <Text style={styles.buttonText}>Run Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={saveCode}>
          <Text style={styles.buttonText}>Save Code</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.outputTitle}>Output:</Text>
      <ScrollView style={styles.outputContainer}>
        <Text style={styles.outputText}>{output}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  editor: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  outputContainer: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  outputText: {
    fontSize: 14,
    color: '#333',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default CodeEditorScreen;
