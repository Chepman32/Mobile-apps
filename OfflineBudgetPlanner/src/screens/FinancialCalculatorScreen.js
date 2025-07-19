
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const FinancialCalculatorScreen = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState(null);

  const calculateSimpleInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      Alert.alert('Error', 'Please enter valid positive numbers for all fields.');
      return;
    }

    const interest = (p * r * t) / 100;
    setResult(`Simple Interest: $${interest.toFixed(2)}`);
  };

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
      Alert.alert('Error', 'Please enter valid positive numbers for all fields.');
      return;
    }

    const amount = p * Math.pow((1 + r / 100), t);
    const interest = amount - p;
    setResult(`Compound Interest: $${interest.toFixed(2)}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Financial Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Principal Amount"
        keyboardType="numeric"
        value={principal}
        onChangeText={setPrincipal}
      />
      <TextInput
        style={styles.input}
        placeholder="Annual Interest Rate (%)"
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (Years)"
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />

      <TouchableOpacity style={styles.button} onPress={calculateSimpleInterest}>
        <Text style={styles.buttonText}>Calculate Simple Interest</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={calculateCompoundInterest}>
        <Text style={styles.buttonText}>Calculate Compound Interest</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

      <Text style={styles.infoText}>Advanced calculators available with Premium.</Text>
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default FinancialCalculatorScreen;
