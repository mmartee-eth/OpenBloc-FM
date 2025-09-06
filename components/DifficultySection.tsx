import React from 'react';
import { Boulder, User, PuntuableAttempt, BoulderDifficulty } from '../types';
import BoulderCard from './BoulderCard';
import { DIFFICULTY_BG_COLORS } from '../constants';

interface DifficultySectionProps {
  difficulty: string;
  boulders: Boulder[];
  completedBoulders: Record<string, number | PuntuableAttempt>;
  onToggleComplete: (boulderId: string, isCompleted: boolean) => void;
  currentUser: User;
  onUpdateBoulder: (updatedBoulder: Boulder) => void;
}

const DifficultySection: React.FC<DifficultySectionProps> = ({ difficulty, boulders, completedBoulders, onToggleComplete, currentUser, onUpdateBoulder }) => {
  return (
    <div className={`p-4 md:p-6 mb-8 rounded-xl shadow-lg ${DIFFICULTY_BG_COLORS[boulders[0].difficulty]}`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-text border-b-2 border-black/10 pb-2">{difficulty}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {boulders.map((boulder) => {
          const completedEntry = completedBoulders[boulder.id];
          const isBoulderCompleted = boulder.difficulty === BoulderDifficulty.PUNTUABLES
            ? typeof completedEntry === 'object' && (completedEntry as PuntuableAttempt).isCompleted
            : !!completedEntry;
          
          return (
            <BoulderCard
              key={boulder.id}
              boulder={boulder}
              isCompleted={isBoulderCompleted}
              onToggleComplete={onToggleComplete}
              currentUser={currentUser}
              onUpdateBoulder={onUpdateBoulder}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySection;