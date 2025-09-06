import { Boulder, BoulderDifficulty } from './types';

export const PUNTUABLES_SCORING: { [key: number]: number } = {
  1: 60,
  2: 50,
  3: 40,
  4: 30,
  5: 20,
};
export const MIN_PUNTUABLES_SCORE = 10;

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

export const generateInitialBoulders = (): Boulder[] => {
  const boulders: Boulder[] = [];
  let blocNumber = 1;

  const createBouldersForDifficulty = (difficulty: BoulderDifficulty, count: number, points: number) => {
    for (let i = 0; i < count; i++) {
      boulders.push({
        id: `bloc-${blocNumber}`,
        name: `Bloc ${blocNumber}`,
        difficulty,
        points,
        color: INITIAL_DIFFICULTY_COLORS[difficulty],
      });
      blocNumber++;
    }
  };

  createBouldersForDifficulty(BoulderDifficulty.MOLT_FACIL, 4, 1);
  createBouldersForDifficulty(BoulderDifficulty.FACIL, 13, 2);
  createBouldersForDifficulty(BoulderDifficulty.MITJA, 18, 5);
  createBouldersForDifficulty(BoulderDifficulty.DIFICIL, 9, 10);
  createBouldersForDifficulty(BoulderDifficulty.PUNTUABLES, 6, 0); // Points are calculated separately

  return boulders;
};