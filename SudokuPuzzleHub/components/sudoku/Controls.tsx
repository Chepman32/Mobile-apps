import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSudoku } from '@/context/SudokuContext';

const Controls: React.FC = () => {
  const { setCellValue, eraseCell, undo, hint } = useSudoku();

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      {/* Number Pad */}
      <View style={styles.numberPad}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.numberButton}
            onPress={() => setCellValue(num)}
          >
            <Text style={styles.numberText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={undo}>
          <Ionicons name="arrow-undo-outline" size={24} color="#333" />
          <Text style={styles.actionText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={eraseCell}>
          <Ionicons name="backspace-outline" size={24} color="#333" />
          <Text style={styles.actionText}>Erase</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={hint}>
          <Ionicons name="bulb-outline" size={24} color="#333" />
          <Text style={styles.actionText}>Hint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  numberButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
});

export default Controls; 