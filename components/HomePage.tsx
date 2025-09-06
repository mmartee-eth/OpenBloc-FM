import React, { useMemo, useState } from 'react';
import { Boulder, User, BoulderDifficulty } from '../types';
import { DIFFICULTY_ORDER, COLOR_OPTIONS } from '../constants';
import DifficultySection from './DifficultySection';

interface HomePageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  boulders: Boulder[];
  onUpdateBoulder: (updatedBoulder: Boulder) => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser, onUpdateUser, boulders, onUpdateBoulder }) => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [colorFilter, setColorFilter] = useState<string>('ALL');

  const filteredBoulders = useMemo(() => {
    return boulders.filter(boulder => {
        const difficultyMatch = difficultyFilter === 'ALL' || boulder.difficulty === difficultyFilter;
        const colorMatch = colorFilter === 'ALL' || boulder.color === colorFilter;
        return difficultyMatch && colorMatch;
    });
  }, [boulders, difficultyFilter, colorFilter]);

  const bouldersByDifficulty = useMemo(() => {
    return filteredBoulders.reduce((acc, boulder) => {
      if (!acc[boulder.difficulty]) {
        acc[boulder.difficulty] = [];
      }
      acc[boulder.difficulty].push(boulder);
      return acc;
    }, {} as Record<BoulderDifficulty, Boulder[]>);
  }, [filteredBoulders]);

  const handleToggleComplete = (boulderId: string, isCompleted: boolean) => {
    const newCompleted = { ...currentUser.completedBoulders };
    if (isCompleted) {
      newCompleted[boulderId] = 1; // Mark as complete with 1 attempt
    } else {
      delete newCompleted[boulderId];
    }
    onUpdateUser({ ...currentUser, completedBoulders: newCompleted });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-4">Els Blocs</h1>
      <p className="text-center text-brand-text-secondary mb-8 text-lg">Benvingut, {currentUser.username}! Marca els blocs que has completat.</p>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-brand-surface rounded-lg justify-center items-center border border-brand-border shadow-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="difficultyFilter" className="font-bold text-sm">Dificultat:</label>
          <select id="difficultyFilter" value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} className="bg-brand-surface border border-brand-border rounded-md px-2 py-1 focus:ring-2 focus:ring-brand-accent focus:outline-none">
            <option value="ALL">Totes</option>
            {DIFFICULTY_ORDER.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
            <label htmlFor="colorFilter" className="font-bold text-sm">Color:</label>
            <select id="colorFilter" value={colorFilter} onChange={e => setColorFilter(e.target.value)} className="bg-brand-surface border border-brand-border rounded-md px-2 py-1 focus:ring-2 focus:ring-brand-accent focus:outline-none">
                <option value="ALL">Tots</option>
                {COLOR_OPTIONS.map(c => <option key={c.class} value={c.class}>{c.name}</option>)}
            </select>
        </div>
      </div>

      {Object.keys(bouldersByDifficulty).length === 0 ? (
        <p className="text-center text-brand-text-secondary mt-8">No s'han trobat blocs que coincideixin amb els filtres seleccionats.</p>
      ) : (
        DIFFICULTY_ORDER.map(difficulty => (
          bouldersByDifficulty[difficulty] && bouldersByDifficulty[difficulty].length > 0 && (
            <DifficultySection
              key={difficulty}
              difficulty={difficulty}
              boulders={bouldersByDifficulty[difficulty]}
              completedBoulders={currentUser.completedBoulders}
              onToggleComplete={handleToggleComplete}
              currentUser={currentUser}
              onUpdateBoulder={onUpdateBoulder}
            />
          )
        ))
      )}
    </div>
  );
};

export default HomePage;