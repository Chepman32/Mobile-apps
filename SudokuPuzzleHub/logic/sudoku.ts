function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function isValid(board: number[][], row: number, col: number, k: number): boolean {
  for (let i = 0; i < 9; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const n = 3 * Math.floor(col / 3) + i % 3;
    if (board[row][i] === k || board[i][col] === k || board[m][n] === k) {
      return false;
    }
  }
  return true;
}

function solve(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let k = 1; k <= 9; k++) {
          if (isValid(board, row, col, k)) {
            board[row][col] = k;
            if (solve(board)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): { puzzle: number[][]; solvedPuzzle: number[][] } {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill the diagonal boxes
  for (let i = 0; i < 9; i = i + 3) {
    fillBox(board, i, i);
  }

  // Fill the rest of the board
  solve(board);
  const solvedPuzzle = JSON.parse(JSON.stringify(board));

  let attempts: number;
  switch (difficulty) {
    case 'easy':
      attempts = 35;
      break;
    case 'medium':
      attempts = 45;
      break;
    case 'hard':
      attempts = 55;
      break;
    case 'expert':
      attempts = 65;
      break;
  }
  
  let puzzle = JSON.parse(JSON.stringify(solvedPuzzle));
  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    
    while (puzzle[row][col] === 0) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }
    
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    
    let tempPuzzle = JSON.parse(JSON.stringify(puzzle));
    let solutions = 0;
    countSolutions(tempPuzzle, solutions);

    if (solutions !== 1) {
      puzzle[row][col] = backup;
    }

    attempts--;
  }

  return { puzzle, solvedPuzzle };
}

function fillBox(board: number[][], row: number, col: number) {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9 + 1);
      } while (!isNotInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
}

function isNotInBox(board: number[][], rowStart: number, colStart: number, num: number) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[rowStart + i][colStart + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: number[][], count: number) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let k = 1; k <= 9; k++) {
                    if (isValid(board, row, col, k)) {
                        board[row][col] = k;
                        count = countSolutions(board, count);
                    }
                }
                board[row][col] = 0; // backtrack
                return count;
            }
        }
    }
    return count + 1;
}

export const solveSudoku = (board: number[][]): number[][] | null => {
  const newBoard = JSON.parse(JSON.stringify(board));
  if (solve(newBoard)) {
    return newBoard;
  }
  return null;
}; 