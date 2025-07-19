
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import levelsData from '../data/levels.json';

const PuzzleScreen = ({ route, navigation }) => {
  const { levelId } = route.params;
  const level = levelsData.levels.find((l) => l.id === levelId);

  const [elements, setElements] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (level) {
      setElements(level.puzzle.elements.map(el => ({ ...el, currentValue: el.value !== undefined ? el.value : null })));
      setConnections(level.puzzle.connections);
    }
  }, [level]);

  const toggleInputValue = (id) => {
    setElements(prevElements =>
      prevElements.map(el =>
        el.id === id && el.type === 'input' ? { ...el, currentValue: !el.currentValue } : el
      )
    );
  };

  const calculateOutput = () => {
    let currentElements = JSON.parse(JSON.stringify(elements)); // Deep copy to avoid direct state mutation

    // Simple simulation of circuit logic
    // This is a very basic example and would need to be expanded for complex circuits
    const evaluateGate = (gateType, inputValues) => {
      switch (gateType) {
        case 'and':
          return inputValues.every(val => val === true);
        case 'or':
          return inputValues.some(val => val === true);
        case 'nand':
          return !inputValues.every(val => val === true);
        default:
          return false;
      }
    };

    // Propagate values through connections
    let changed = true;
    while (changed) {
      changed = false;
      for (const conn of connections) {
        const fromElement = currentElements.find(el => el.id === conn.from);
        const toElement = currentElements.find(el => el.id === conn.to);

        if (fromElement && toElement) {
          let outputValue = fromElement.currentValue;

          if (fromElement.type === 'and' || fromElement.type === 'or' || fromElement.type === 'nand') {
            const inputConnections = connections.filter(c => c.to === fromElement.id);
            const inputValues = inputConnections.map(c => currentElements.find(el => el.id === c.from).currentValue);
            outputValue = evaluateGate(fromElement.type, inputValues);
          }

          if (toElement.type === 'output') {
            if (toElement.currentValue !== outputValue) {
              toElement.currentValue = outputValue;
              changed = true;
            }
          } else if (toElement.type === 'and' || toElement.type === 'or' || toElement.type === 'nand') {
            // For gates, update their input values
            const existingInput = toElement.inputs ? toElement.inputs[conn.inputIdx] : null;
            if (existingInput !== outputValue) {
              if (!toElement.inputs) toElement.inputs = [];
              toElement.inputs[conn.inputIdx] = outputValue;
              changed = true;
            }
          }
        }
      }
    }

    // Check if output matches expected
    const outputElement = currentElements.find(el => el.type === 'output');
    if (outputElement && outputElement.currentValue === outputElement.expected) {
      Alert.alert('Success!', 'Puzzle Solved!');
      navigation.goBack(); // Or navigate to next level
    } else {
      Alert.alert('Try Again', 'The circuit output does not match the expected value.');
    }
  };

  if (!level) {
    return (
      <View style={styles.container}>
        <Text>Level not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.levelTitle}>{level.name}</Text>
      <View style={styles.puzzleGrid}>
        {elements.map((element) => (
          <TouchableOpacity
            key={element.id}
            style={[
              styles.element,
              { top: element.y * 80, left: element.x * 80 }, // Simple positioning
              element.type === 'input' && styles.inputElement,
              element.type === 'output' && styles.outputElement,
              (element.type === 'and' || element.type === 'or' || element.type === 'nand') && styles.gateElement,
            ]}
            onPress={() => element.type === 'input' && toggleInputValue(element.id)}
          >
            <Text style={styles.elementText}>
              {element.type.toUpperCase()}
              {element.type === 'input' && `: ${element.currentValue ? 'ON' : 'OFF'}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.solveButton} onPress={calculateOutput}>
        <Text style={styles.solveButtonText}>Solve Puzzle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  puzzleGrid: {
    width: 240, // 3 * 80
    height: 240, // 3 * 80
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    marginBottom: 30,
  },
  element: {
    position: 'absolute',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#666',
  },
  inputElement: {
    backgroundColor: '#add8e6',
  },
  outputElement: {
    backgroundColor: '#ffb6c1',
  },
  gateElement: {
    backgroundColor: '#90ee90',
  },
  elementText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  solveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  solveButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PuzzleScreen;
