
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'healthRiskAssessor.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const RiskAssessmentScreen = ({ navigation }) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [lifestyle, setLifestyle] = useState('sedentary'); // sedentary, active, very_active
  const [riskScore, setRiskScore] = useState(null);

  const calculateRisk = () => {
    const parsedAge = parseInt(age);
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);

    if (isNaN(parsedAge) || isNaN(parsedWeight) || isNaN(parsedHeight) || parsedAge <= 0 || parsedWeight <= 0 || parsedHeight <= 0) {
      Alert.alert('Error', 'Please enter valid positive numbers for all fields.');
      return;
    }

    // Simulate AI-powered risk assessment
    let score = 0;
    if (parsedAge > 40) score += 20;
    if (parsedWeight / (parsedHeight / 100) / (parsedHeight / 100) > 25) score += 30; // BMI > 25
    if (lifestyle === 'sedentary') score += 25;

    setRiskScore(score);
    saveAssessment(score);
  };

  const saveAssessment = (score) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS risk_assessments (id INTEGER PRIMARY KEY AUTOINCREMENT, age INTEGER, weight REAL, height REAL, lifestyle TEXT, riskScore INTEGER, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO risk_assessments (age, weight, height, lifestyle, riskScore, timestamp, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [parseInt(age), parseFloat(weight), parseFloat(height), lifestyle, score, new Date().toLocaleString(), 0],
            () => console.log('Risk assessment saved!'),
            (tx, error) => console.error('Error saving assessment', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced risk analysis, health insights, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health Risk Assessor</Text>
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 30"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 70"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Height (cm):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 175"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.label}>Lifestyle:</Text>
      <View style={styles.lifestyleSelection}>
        <TouchableOpacity
          style={[styles.lifestyleButton, lifestyle === 'sedentary' && styles.selectedLifestyle]}
          onPress={() => setLifestyle('sedentary')}
        >
          <Text style={styles.lifestyleButtonText}>Sedentary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.lifestyleButton, lifestyle === 'active' && styles.selectedLifestyle]}
          onPress={() => setLifestyle('active')}
        >
          <Text style={styles.lifestyleButtonText}>Active</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateRisk}>
        <Text style={styles.buttonText}>Calculate Risk</Text>
      </TouchableOpacity>

      {riskScore !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your Health Risk Score: {riskScore}</Text>
          <Text style={styles.recommendationText}>({riskScore < 50 ? 'Low Risk' : riskScore < 80 ? 'Moderate Risk' : 'High Risk'})</Text>
        </View>
      )}

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Insights</Text>
      </TouchableOpacity>
    </ScrollView>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  lifestyleSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  lifestyleButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedLifestyle: {
    backgroundColor: '#007bff',
  },
  lifestyleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  resultContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  recommendationText: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default RiskAssessmentScreen;
