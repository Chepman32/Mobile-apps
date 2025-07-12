import { BreathingExercise } from '../types';

export const EXERCISES: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'A simple technique to calm your nervous system.',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description: 'Known as the “relaxing breath,” it helps with sleep.',
    pattern: { inhale: 4, hold: 7, exhale: 8 },
  },
  {
    id: 'mindful-breathing',
    name: 'Mindful Breathing',
    description: 'A basic exercise to focus on your breath.',
    pattern: { inhale: 5, hold: 0, exhale: 5 },
  },
  {
    id: 'equal-breathing',
    name: 'Equal Breathing',
    description: 'Balance your breath and focus your mind.',
    pattern: { inhale: 4, hold: 0, exhale: 4 },
  },
];
