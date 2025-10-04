import { BoulderDifficulty } from './types';

export const PUNTUABLES_SCORING: { [key: number]: number } = {
  1: 100,
  2: 50,
  3: 25,
};
export const FOURTH_OR_MORE_POINTS = 10;

export const DIFFICULTY_ORDER: BoulderDifficulty[] = [
  BoulderDifficulty.MOLT_FACIL,
  BoulderDifficulty.FACIL,
  BoulderDifficulty.MITJA,
  BoulderDifficulty.DIFICIL,
  BoulderDifficulty.PUNTUABLES,
];

export const INITIAL_DIFFICULTY_COLORS: Record<BoulderDifficulty, string> = {
  [BoulderDifficulty.MOLT_FACIL]: 'bg-green-500',
  [BoulderDifficulty.FACIL]: 'bg-blue-500',
  [BoulderDifficulty.MITJA]: 'bg-yellow-400',
  [BoulderDifficulty.DIFICIL]: 'bg-red-600',
  [BoulderDifficulty.PUNTUABLES]: 'bg-purple-600',
};

export const DIFFICULTY_BG_COLORS: Record<BoulderDifficulty, string> = {
  [BoulderDifficulty.MOLT_FACIL]: 'bg-green-800/20',
  [BoulderDifficulty.FACIL]: 'bg-blue-800/20',
  [BoulderDifficulty.MITJA]: 'bg-yellow-800/20',
  [BoulderDifficulty.DIFICIL]: 'bg-red-800/20',
  [BoulderDifficulty.PUNTUABLES]: 'bg-purple-800/20',
};

export const DB_COLOR_TO_TAILWIND: Record<string, string> = {
    'verd': 'bg-green-500',
    'blau': 'bg-blue-500',
    'vermell': 'bg-red-600',
    'groc': 'bg-yellow-400',
    'taronja': 'bg-orange-500',
    'lila': 'bg-purple-600',
};

export const COLOR_OPTIONS = [
    { name: 'Rosa', class: 'bg-pink-500' },
    { name: 'Lila', class: 'bg-purple-600' },
    { name: 'Groc', class: 'bg-yellow-400' },
    { name: 'Blau', class: 'bg-blue-500' },
    { name: 'Verd', class: 'bg-green-500' },
    { name: 'Vermell', class: 'bg-red-600' },
    { name: 'Taronja', class: 'bg-orange-500' },
    { name: 'Transparent', class: 'bg-white/10 border-2 border-white/50' },
    { name: 'Negre', class: 'bg-gray-800' },
    { name: 'Blanc', class: 'bg-gray-200' },
];
