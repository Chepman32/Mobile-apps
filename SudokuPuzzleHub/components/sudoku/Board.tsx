import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSudoku } from '@/context/SudokuContext';

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 40) / 9);

const Board: React.FC = () => {
  const { grid, selectedCell, selectCell } = useSudoku();

  return (
    <View style={styles.board}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
            const isThickRight = (colIndex + 1) % 3 === 0 && colIndex < 8;
            const isThickBottom = (rowIndex + 1) % 3 === 0 && rowIndex < 8;

            return (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  isSelected && styles.selectedCell,
                  isThickRight && styles.thickRight,
                  isThickBottom && styles.thickBottom,
                  cell.isGiven && styles.givenCell,
                ]}
                onPress={() => selectCell(rowIndex, colIndex)}
              >
                <Text style={[styles.cellText, cell.isGiven && styles.givenText]}>
                  {cell.value !== 0 ? cell.value : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  selectedCell: {
    backgroundColor: '#E3F2FD',
  },
  thickRight: {
    borderRightWidth: 2,
    borderRightColor: '#333',
  },
  thickBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  givenCell: {
    backgroundColor: '#F5F5F5',
  },
  givenText: {
    color: '#333',
  },
});

export default Board; 