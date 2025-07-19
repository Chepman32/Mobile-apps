
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CalculatorScreen = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonPress = (value) => {
    if (value === '=') {
      try {
        setResult(eval(input).toString()); // DANGER: eval is unsafe for untrusted input
      } catch (e) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else {
      setInput(input + value);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced calculators, problem generators, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <TextInput
          style={styles.inputDisplay}
          value={input}
          editable={false}
          placeholder="0"
        />
        <Text style={styles.resultDisplay}>{result}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('C')}><Text style={styles.buttonText}>C</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('/')}><Text style={styles.buttonText}>/</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('*')}><Text style={styles.buttonText}>*</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('-')}><Text style={styles.buttonText}>-</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('7')}><Text style={styles.buttonText}>7</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('8')}><Text style={styles.buttonText}>8</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('9')}><Text style={styles.buttonText}>9</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('+')}><Text style={styles.buttonText}>+</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('4')}><Text style={styles.buttonText}>4</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('5')}><Text style={styles.buttonText}>5</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('6')}><Text style={styles.buttonText}>6</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('=')}><Text style={styles.buttonText}>=</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('1')}><Text style={styles.buttonText}>1</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('2')}><Text style={styles.buttonText}>2</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('3')}><Text style={styles.buttonText}>3</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('0')}><Text style={styles.buttonText}>0</Text></TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Calculators</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#f0f8ff',
  },
  displayContainer: {
    padding: 20,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputDisplay: {
    fontSize: 36,
    color: '#333',
  },
  resultDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
  },
  buttonsContainer: {
    flex: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default CalculatorScreen;
