import { Level } from '../types';

// This is a simplified representation. In a real game, this would be more complex.
// Connections: 'top', 'right', 'bottom', 'left'

export const LEVELS: Level[] = [
  {
    id: '1',
    name: 'Tutorial 1',
    gridSize: { rows: 3, cols: 3 },
    grid: [
      [{ id: '00', type: 'source', rotation: 90, connections: ['right'], isPowered: true }, { id: '01', type: 'wire', rotation: 0, connections: ['left', 'right'] }, { id: '02', type: 'node', rotation: 0, connections: ['left'] }],
      [{ id: '10', type: 'empty', rotation: 0, connections: [] }, { id: '11', type: 'empty', rotation: 0, connections: [] }, { id: '12', type: 'empty', rotation: 0, connections: [] }],
      [{ id: '20', type: 'empty', rotation: 0, connections: [] }, { id: '21', type: 'empty', rotation: 0, connections: [] }, { id: '22', type: 'empty', rotation: 0, connections: [] }],
    ],
  },
  {
    id: '2',
    name: 'First Challenge',
    gridSize: { rows: 4, cols: 4 },
    grid: [
      [{ id: '00', type: 'source', rotation: 90, connections: ['right'], isPowered: true }, { id: '01', type: 'wire', rotation: 0, connections: ['left', 'right'] }, { id: '02', type: 'empty', rotation: 0, connections: [] }, { id: '03', type: 'node', rotation: 270, connections: ['top'] }],
      [{ id: '10', type: 'empty', rotation: 0, connections: [] }, { id: '11', type: 'wire', rotation: 90, connections: ['top', 'bottom'] }, { id: '12', type: 'empty', rotation: 0, connections: [] }, { id: '13', type: 'wire', rotation: 90, connections: ['top', 'bottom'] }],
      [{ id: '20', type: 'empty', rotation: 0, connections: [] }, { id: '21', type: 'wire', rotation: 0, connections: ['left', 'right'] }, { id: '22', type: 'wire', rotation: 90, connections: ['top', 'bottom'] }, { id: '23', type: 'wire', rotation: 270, connections: ['top', 'left'] }],
      [{ id: '30', type: 'empty', rotation: 0, connections: [] }, { id: '31', type: 'empty', rotation: 0, connections: [] }, { id: '32', type: 'node', rotation: 0, connections: ['top'] }, { id: '33', type: 'empty', rotation: 0, connections: [] }],
    ],
  },
];
