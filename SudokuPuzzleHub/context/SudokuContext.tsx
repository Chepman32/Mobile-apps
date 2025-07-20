import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateSudoku, solveSudoku } from '@/logic/sudoku';

type Cell = {
  value: number;
  isGiven: boolean;
};

type Grid = Cell[][];

type SelectedCell = {
  row: number;
  col: number;
};

interface SudokuContextType {
  grid: Grid;
  selectedCell: SelectedCell;
  selectCell: (row: number, col: number) => void;
  setCellValue: (value: number) => void;
  eraseCell: () => void;
  undo: () => void;
  hint: () => void;
  newGame: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
}

const SudokuContext = createContext<SudokuContextType | undefined>(undefined);

const createEmptyGrid = (): Grid => {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill({ value: 0, isGiven: false }));
};

export const SudokuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [history, setHistory] = useState<Grid[]>([]);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>({ row: 0, col: 0 });
  const [solution, setSolution] = useState<number[][] | null>(null);

  const newGame = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    const { puzzle, solvedPuzzle } = generateSudoku(difficulty);
    const newGrid = puzzle.map(row =>
      row.map(value => ({
        value,
        isGiven: value !== 0,
      }))
    );
    setGrid(newGrid);
    setSolution(solvedPuzzle);
    setHistory([newGrid]);
  };

  const selectCell = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const setCellValue = (value: number) => {
    if (grid[selectedCell.row][selectedCell.col].isGiven) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[selectedCell.row][selectedCell.col] = {
      ...newGrid[selectedCell.row][selectedCell.col],
      value,
    };
    setHistory([...history, grid]);
    setGrid(newGrid);
  };

  const eraseCell = () => {
    if (grid[selectedCell.row][selectedCell.col].isGiven) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[selectedCell.row][selectedCell.col] = {
      ...newGrid[selectedCell.row][selectedCell.col],
      value: 0,
    };
    setHistory([...history, grid]);
    setGrid(newGrid);
  };

  const undo = () => {
    if (history.length > 1) {
      const lastGrid = history[history.length - 1];
      setGrid(lastGrid);
      setHistory(history.slice(0, -1));
    }
  };

  const hint = () => {
    if (solution) {
      const correctValue = solution[selectedCell.row][selectedCell.col];
      setCellValue(correctValue);
    }
  };
  
  // Initialize with a new game on first render
  useState(() => {
    newGame('medium');
  });

  return (
    <SudokuContext.Provider
      value={{
        grid,
        selectedCell,
        selectCell,
        setCellValue,
        eraseCell,
        undo,
        hint,
        newGame,
      }}
    >
      {children}
    </SudokuContext.Provider>
  );
};

export const useSudoku = () => {
  const context = useContext(SudokuContext);
  if (!context) {
    throw new Error('useSudoku must be used within a SudokuProvider');
  }
  return context;
}; 