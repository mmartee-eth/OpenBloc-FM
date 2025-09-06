import React from 'react';
import { User, Boulder, BoulderDifficulty, PuntuableAttempt } from '../types';
import { PUNTUABLES_SCORING, MIN_PUNTUABLES_SCORE } from '../constants';

interface ManagePuntuablesModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  boulders: Boulder[];
}

const ManagePuntuablesModal: React.FC<ManagePuntuablesModalProps> = ({ user, onClose, onUpdateUser, boulders }) => {
  const puntuablesBoulders = boulders.filter(b => b.difficulty === BoulderDifficulty.PUNTUABLES);

  const updatePuntuableData = (boulderId: string, newPuntuableData: PuntuableAttempt | undefined) => {
    const newCompleted = { ...user.completedBoulders };
    if (newPuntuableData && (newPuntuableData.attempts > 0 || newPuntuableData.isCompleted)) {
      newCompleted[boulderId] = newPuntuableData;
    } else {
      delete newCompleted[boulderId];
    }
    onUpdateUser({ ...user, completedBoulders: newCompleted });
  };

  const handleAttemptChange = (boulderId: string, change: 1 | -1) => {
    const currentData = (user.completedBoulders[boulderId] || { attempts: 0, isCompleted: false }) as PuntuableAttempt;
    const newAttempts = Math.max(0, currentData.attempts + change);
    
    // If attempts drop to 0, it can't be completed
    const newIsCompleted = newAttempts > 0 ? currentData.isCompleted : false;
    
    updatePuntuableData(boulderId, { attempts: newAttempts, isCompleted: newIsCompleted });
  };
  
  const handleCompletionChange = (boulderId: string, isChecked: boolean) => {
    const currentData = (user.completedBoulders[boulderId] || { attempts: 0, isCompleted: false }) as PuntuableAttempt;
    // If marking as completed with 0 attempts, set attempts to 1
    const newAttempts = isChecked && currentData.attempts === 0 ? 1 : currentData.attempts;

    updatePuntuableData(boulderId, { attempts: newAttempts, isCompleted: isChecked });
  };

  const getScore = (completionData: PuntuableAttempt | number | undefined) => {
      if (typeof completionData !== 'object' || !completionData.isCompleted) return 0;
      return PUNTUABLES_SCORING[completionData.attempts] || MIN_PUNTUABLES_SCORE;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 border border-brand-border" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Gestionar Puntuables per a {user.username}</h2>
        <div className="space-y-4">
          {puntuablesBoulders.map(boulder => {
            const completionData = user.completedBoulders[boulder.id] as PuntuableAttempt | undefined;
            const attempts = completionData?.attempts || 0;
            const isCompleted = completionData?.isCompleted || false;
            
            return (
              <div key={boulder.id} className="flex items-center justify-between p-3 bg-brand-surface-secondary rounded-md border border-brand-border">
                <div className="flex-grow">
                  <p className="font-semibold">{boulder.name}</p>
                   <p className="text-sm text-brand-text-secondary">Puntuació: <span className="font-bold">{getScore(completionData)}</span></p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2">
                    <button onClick={() => handleAttemptChange(boulder.id, -1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full font-bold transition-colors" aria-label={`Decrease attempts for ${boulder.name}`}>-</button>
                    <span className="w-8 text-center font-mono font-bold text-lg" aria-label="Attempts">{attempts}</span>
                    <button onClick={() => handleAttemptChange(boulder.id, 1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full font-bold transition-colors" aria-label={`Increase attempts for ${boulder.name}`}>+</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`completed-${boulder.id}`}
                      checked={isCompleted}
                      onChange={(e) => handleCompletionChange(boulder.id, e.target.checked)}
                      className="w-5 h-5 rounded bg-brand-surface-secondary border-gray-400 text-brand-accent focus:ring-brand-accent"
                    />
                    <label htmlFor={`completed-${boulder.id}`} className="text-sm font-medium">Top</label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded transition-colors">
          Fet
        </button>
      </div>
    </div>
  );
};

export default ManagePuntuablesModal;