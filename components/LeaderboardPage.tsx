import React, { useState, useMemo } from 'react';
import { User, Gender, UserRole, Boulder, PuntuableAttempt } from '../types';
import { PUNTUABLES_SCORING, FOURTH_OR_MORE_POINTS } from '../constants';
import ManagePuntuablesModal from './ManagePuntuablesModal';

interface LeaderboardPageProps {
  users: User[];
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  boulders: Boulder[];
}

const calculateScore = (user: User, boulders: Boulder[]): number => {
    return Object.entries(user.completedBoulders).reduce((total, [boulderId, completionData]) => {
        const boulder = boulders.find(b => b.id === parseInt(boulderId, 10));
        if (!boulder) return total;

        if (boulder.is_variable) {
            const attemptData = completionData as PuntuableAttempt;
            if (typeof attemptData === 'object' && attemptData.isCompleted && attemptData.attempts > 0) {
                return total + (PUNTUABLES_SCORING[attemptData.attempts] || FOURTH_OR_MORE_POINTS);
            }
        } else {
            if (completionData) {
                return total + boulder.base_points;
            }
        }
        return total;
    }, 0);
};

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ users, currentUser, onUpdateUser, boulders }) => {
  const [filterGender, setFilterGender] = useState<Gender | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string | 'ALL'>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const rankedUsers = useMemo(() => {
    return users
      .filter(user => user.role === UserRole.PARTICIPANT)
      .map(user => ({ ...user, score: calculateScore(user, boulders) }))
      .filter(user => {
        if (filterGender !== 'ALL' && user.gender !== filterGender) return false;
        if (filterCategory !== 'ALL' && user.category !== filterCategory) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [users, filterGender, filterCategory, boulders]);

  const handleUpdateUserPuntuables = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setSelectedUser(updatedUser); // Keep modal open with updated data
  }
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8">Classificació</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-brand-surface rounded-lg justify-center items-center border border-brand-border shadow-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="genderFilter" className="font-bold text-sm">Gènere:</label>
          <select id="genderFilter" value={filterGender} onChange={e => setFilterGender(e.target.value as Gender | 'ALL')} className="bg-brand-surface border border-brand-border rounded-md px-2 py-1 focus:ring-2 focus:ring-brand-accent focus:outline-none">
            <option value="ALL">Tots</option>
            <option value={Gender.MALE}>Masculí</option>
            <option value={Gender.FEMALE}>Femení</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
            <label htmlFor="categoryFilter" className="font-bold text-sm">Categoria:</label>
            <select id="categoryFilter" value={filterCategory} onChange={e => setFilterCategory(e.target.value as string)} className="bg-brand-surface border border-brand-border rounded-md px-2 py-1 focus:ring-2 focus:ring-brand-accent focus:outline-none">
                <option value="ALL">Totes</option>
                <option value="sub-18">Sub-18</option>
                <option value="universitaris">Universitaris</option>
                <option value="absoluta">Absoluta</option>
            </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-brand-surface rounded-lg shadow-lg border border-brand-border">
        <table className="w-full text-left">
          <thead className="border-b border-brand-border bg-brand-surface-secondary">
            <tr>
              <th className="p-4 font-bold">Posició</th>
              <th className="p-4 font-bold">Nom d'usuari</th>
              <th className="p-4 font-bold">Categoria</th>
              <th className="p-4 font-bold">Gènere</th>
              <th className="p-4 text-right font-bold">Puntuació</th>
              {currentUser.role === UserRole.ADMIN && <th className="p-4 text-center font-bold">Accions</th>}
            </tr>
          </thead>
          <tbody>
            {rankedUsers.map((user, index) => (
              <tr key={user.id} className={`border-b border-brand-border last:border-b-0 ${user.id === currentUser.id ? 'bg-brand-accent/10' : ''} hover:bg-black/5`}>
                <td className="p-4 font-bold">{index + 1}</td>
                <td className="p-4">{user.username}</td>
                <td className="p-4">{capitalize(user.category)}</td>
                <td className="p-4">{user.gender === Gender.MALE ? 'Masculí' : 'Femení'}</td>
                <td className="p-4 text-right font-mono font-bold">{user.score}</td>
                {currentUser.role === UserRole.ADMIN && (
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedUser(user)} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-1 px-3 rounded text-sm transition-colors">
                      Gestionar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <ManagePuntuablesModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdateUser={handleUpdateUserPuntuables}
          boulders={boulders}
        />
      )}
    </div>
  );
};

export default LeaderboardPage;
