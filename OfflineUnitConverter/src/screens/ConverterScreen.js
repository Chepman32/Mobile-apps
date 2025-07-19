
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from 'react-native-search-bar';
import Share from 'react-native-share';

const units = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
  },
  temperature: {
    celsius: { toKelvin: (val) => val + 273.15, fromKelvin: (val) => val - 273.15 },
    fahrenheit: { toKelvin: (val) => (val - 32) * 5/9 + 273.15, fromKelvin: (val) => (val - 273.15) * 9/5 + 32 },
    kelvin: { toKelvin: (val) => val, fromKelvin: (val) => val },
  },
  // Add more categories and units as needed
};

const ConverterScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('conversionHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const saveHistory = async (entry) => {
    const updatedHistory = [entry, ...history.slice(0, 9)]; // Keep last 10 entries
    setHistory(updatedHistory);
    await AsyncStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
  };

  const convertUnit = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      Alert.alert('Error', 'Please enter a valid number.');
      setResult('');
      return;
    }

    let category = null;
    for (const cat in units) {
      if (units[cat][fromUnit] && units[cat][toUnit]) {
        category = cat;
        break;
      }
    }

    if (!category) {
      Alert.alert('Error', 'Incompatible units selected.');
      setResult('');
      return;
    }

    let convertedValue;
    if (category === 'temperature') {
      const toKelvinFrom = units[category][fromUnit].toKelvin(value);
      convertedValue = units[category][toUnit].fromKelvin(toKelvinFrom);
    } else {
      const valueInBase = value * units[category][fromUnit];
      convertedValue = valueInBase / units[category][toUnit];
    }

    const newResult = `${value} ${fromUnit} = ${convertedValue.toFixed(4)} ${toUnit}`;
    setResult(newResult);
    saveHistory(newResult);
  };

  const shareCalculation = async () => {
    if (!result) {
      Alert.alert('Error', 'Perform a calculation first to share.');
      return;
    }
    try {
      await Share.open({
        message: result,
        title: 'Unit Conversion Result',
      });
    } catch (error) {
      console.error('Error sharing calculation:', error);
      Alert.alert('Share Failed', 'Could not share calculation.');
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium conversion categories and advanced features.'
    );
  };

  const allUnits = Object.keys(units).flatMap(category => Object.keys(units[category]));
  const filteredUnits = allUnits.filter(unit => unit.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Unit Converter</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter value"
        keyboardType="numeric"
        value={inputValue}
        onChangeText={setInputValue}
      />

      <Text style={styles.label}>From Unit:</Text>
      <SearchBar
        placeholder="Search From Unit"
        onChangeText={setSearchText}
        value={searchText}
        onSearchButtonPress={() => {}}
        onCancelButtonPress={() => setSearchText('')}
      />
      <View style={styles.unitPicker}>
        {filteredUnits.map(unit => (
          <TouchableOpacity
            key={unit}
            style={[styles.unitButton, fromUnit === unit && styles.selectedUnit]}
            onPress={() => setFromUnit(unit)}
          >
            <Text style={styles.unitButtonText}>{unit}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>To Unit:</Text>
      <View style={styles.unitPicker}>
        {filteredUnits.map(unit => (
          <TouchableOpacity
            key={unit}
            style={[styles.unitButton, toUnit === unit && styles.selectedUnit]}
            onPress={() => setToUnit(unit)}
          >
            <Text style={styles.unitButtonText}>{unit}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.convertButton} onPress={convertUnit}>
        <Text style={styles.buttonText}>Convert</Text>
      </TouchableOpacity>

      {result ? <Text style={styles.resultText}>{result}</Text> : null}

      <TouchableOpacity style={styles.shareButton} onPress={shareCalculation}>
        <Text style={styles.buttonText}>Share Result</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Conversions:</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.historyItem}>• {item}</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No recent conversions.</Text>}
      />

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
    fontSize: 28,
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  unitPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    margin: 5,
  },
  selectedUnit: {
    backgroundColor: '#007bff',
  },
  unitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  convertButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
  },
  shareButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  premiumButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ConverterScreen;
