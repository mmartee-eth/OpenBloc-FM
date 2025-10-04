import React, { useState, useMemo } from 'react';
import { User, UserRole, Boulder } from '../types';
import ManagePuntuablesModal from './ManagePuntuablesModal';

interface ManagementPageProps {
  allUsers: User[];
  onUpdateUser: (updatedUser: User) => void;
  boulders: Boulder[];
}

const ManagementPage: React.FC<ManagementPageProps> = ({ allUsers, onUpdateUser, boulders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const participants = useMemo(() => {
    return allUsers
      .filter(user => user.role === UserRole.PARTICIPANT)
      .filter(user => {
        if (!searchTerm) return true;
        const lowerCaseSearch = searchTerm.toLowerCase();
        const nameMatch = user.username.toLowerCase().includes(lowerCaseSearch);
        const dorsalMatch = user.dorsal?.toString().includes(lowerCaseSearch);
        return nameMatch || dorsalMatch;
      });
  }, [allUsers, searchTerm]);

  const handleUpdateUserPuntuables = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setSelectedUser(updatedUser);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-2">Gestió de Participants</h1>
      <p className="text-center text-brand-text-secondary mb-8">Busca un participant per nom o dorsal per gestionar la seva puntuació.</p>

      <div className="mb-8 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Busca per nom o dorsal..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 text-lg text-brand-text bg-brand-surface border-2 border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
          aria-label="Search for a participant by name or dorsal"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {participants.map(user => (
          <div key={user.id} className="bg-brand-surface rounded-lg p-5 shadow-lg flex flex-col justify-between border border-brand-border">
            <div>
              <h3 className="text-xl font-bold text-brand-text flex justify-between items-center">
                <span>{user.username}</span>
                {user.dorsal && <span className="text-sm font-mono bg-brand-surface-secondary px-2 py-1 rounded">#{user.dorsal}</span>}
              </h3>
              <p className="text-brand-text-secondary mt-1">Categoria: {capitalize(user.category)} | Gènere: {user.gender === 'M' ? 'Masculí' : 'Femení'}</p>
            </div>
            <button
              onClick={() => setSelectedUser(user)}
              className="mt-4 w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Gestionar Puntuables
            </button>
          </div>
        ))}
        {participants.length === 0 && (
            <p className="text-center text-brand-text-secondary md:col-span-2 lg:col-span-3">No s'han trobat participants.</p>
        )}
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

export default ManagementPage;