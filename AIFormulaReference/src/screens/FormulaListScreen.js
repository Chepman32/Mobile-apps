
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'formulaReference.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const FormulaListScreen = ({ navigation }) => {
  const [formulas, setFormulas] = useState([]);

  const loadFormulas = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS formulas (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, formula TEXT, category TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM formulas',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyFormulas = [
                  { name: 'Pythagorean Theorem', formula: 'a^2 + b^2 = c^2', category: 'Geometry', isPremium: 0 },
                  { name: 'Quadratic Formula', formula: 'x = (-b ± sqrt(b^2 - 4ac)) / 2a', category: 'Algebra', isPremium: 0 },
                  { name: 'Einstein's Mass-Energy Equivalence', formula: 'E = mc^2', category: 'Physics', isPremium: 1 },
                ];
                dummyFormulas.forEach(f => {
                  tx.executeSql(
                    'INSERT INTO formulas (name, formula, category, isPremium) VALUES (?, ?, ?, ?)',
                    [f.name, f.formula, f.category, f.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting formula', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM formulas',
                [],
                (_, { rows: allRows }) => {
                  const loadedFormulas = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedFormulas.push(allRows.item(i));
                  }
                  setFormulas(loadedFormulas);
                },
                (tx, error) => console.error('Error fetching formulas', error)
              );
            },
            (tx, error) => console.error('Error checking formulas', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadFormulas();
    const unsubscribe = navigation.addListener('focus', () => {
      loadFormulas();
    });
    return unsubscribe;
  }, [navigation, loadFormulas]);

  const handleFormulaPress = (formula) => {
    if (formula.isPremium) {
      Alert.alert(
        'Premium Formula',
        'This formula is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('FormulaDetail', { formulaId: formula.id, formulaTitle: formula.name });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced formulas, detailed solutions, etc.'
    );
  };

  const renderFormulaItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.formulaItem, item.isPremium ? styles.premiumFormulaItem : null]}
      onPress={() => handleFormulaPress(item)}
    >
      <Text style={styles.formulaName}>{item.name}</Text>
      <Text style={styles.formulaCategory}>{item.category}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={formulas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFormulaItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No formulas found.</Text>}
      />
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
  formulaItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumFormulaItem: {
    backgroundColor: '#ffe0b2',
  },
  formulaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formulaCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default FormulaListScreen;
