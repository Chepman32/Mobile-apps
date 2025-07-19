
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'formulaReference.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const FormulaDetailScreen = ({ route }) => {
  const { formulaId } = route.params;
  const [formula, setFormula] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM formulas WHERE id = ?',
        [formulaId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setFormula(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching formula', error)
      );
    });
  }, [formulaId]);

  const solveProblem = () => {
    Alert.alert(
      'Problem Solver',
      'Simulating AI-powered problem solving. (Conceptual)'
    );
    // In a real app, an AI model would solve problems based on the formula.
  };

  if (!formula) {
    return (
      <View style={styles.container}>
        <Text>Loading formula details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.formulaName}>{formula.name}</Text>
      <Text style={styles.formulaCategory}>{formula.category}</Text>
      <Text style={styles.sectionTitle}>Formula:</Text>
      <Text style={styles.sectionContent}>{formula.formula}</Text>

      <TouchableOpacity style={styles.button} onPress={solveProblem}>
        <Text style={styles.buttonText}>Solve Problem with AI</Text>
      </TouchableOpacity>

      {formula.isPremium && (
        <Text style={styles.premiumFeatureText}>Access to detailed solutions and problem generators.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  formulaName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  formulaCategory: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumFeatureText: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
});

export default FormulaDetailScreen;
