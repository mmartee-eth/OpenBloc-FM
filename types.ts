export enum UserRole {
  PARTICIPANT = 'participant',
  ADMIN = 'admin',
  ARBITRE = 'arbitre',
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}

export type PuntuableAttempt = {
  attempts: number;
  isCompleted: boolean;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  gender: Gender;
  category: string;
  dorsal?: number;
  completedBoulders: Record<string, number | PuntuableAttempt>;
};

export enum BoulderDifficulty {
  MOLT_FACIL = 'Molt Fàcil',
  FACIL = 'Fàcil',
  MITJA = 'Mitjà',
  DIFICIL = 'Difícil',
  PUNTUABLES = 'Puntuables',
}

export type Boulder = {
  id: number;
  name: string; // e.g. "Bloc 1"
  difficulty: BoulderDifficulty;
  base_points: number;
  color: string; // e.g. 'bg-green-600'
  is_variable: boolean;
};

export type Page = 'login' | 'home' | 'leaderboard' | 'profile' | 'management';