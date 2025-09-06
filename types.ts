export enum UserRole {
  PARTICIPANT = 'PARTICIPANT',
  ADMIN = 'ADMIN',
  REFEREE = 'REFEREE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
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
  age: number;
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
  id: string;
  name: string; // e.g. "Bloc 1"
  difficulty: BoulderDifficulty;
  points: number;
  color: string; // e.g. 'bg-green-600'
};

export type Page = 'login' | 'home' | 'leaderboard' | 'profile' | 'referee';