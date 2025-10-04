import React, { useState } from 'react';
import { Boulder, UserRole, User } from '../types';
import { CheckCircleIcon, EditIcon } from './icons';
import EditBoulderModal from './EditBoulderModal';

interface BoulderCardProps {
  boulder: Boulder;
  isCompleted: boolean;
  onToggleComplete: (boulderId: string, isCompleted: boolean) => void;
  currentUser: User;
  onUpdateBoulder: (updatedBoulder: Boulder) => void;
}

const BoulderCard: React.FC<BoulderCardProps> = ({ boulder, isCompleted, onToggleComplete, currentUser, onUpdateBoulder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const isPuntuables = boulder.is_variable;
  const isDisabled = isPuntuables && currentUser.role !== UserRole.ADMIN;

  const handleClick = () => {
    if (!isDisabled) {
      onToggleComplete(String(boulder.id), !isCompleted);
    }
  };
  
  const cardColorClass = boulder.color;

  const lightBgClasses = ['bg-yellow-400', 'bg-gray-200'];
  const isLight = lightBgClasses.includes(boulder.color);
  const textColorClass = isLight ? 'text-gray-900' : 'text-white';
  const adminLabelColorClass = isLight ? 'bg-black/40 text-white' : 'bg-black/30';


  return (
    <>
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className={`w-full text-left p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:brightness-110 ${cardColorClass} ${isCompleted ? 'ring-2 ring-offset-2 ring-offset-brand-bg ring-brand-accent' : ''} ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          aria-label={`Marcar ${boulder.name} como ${isCompleted ? 'no completado' : 'completado'}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className={`font-bold text-lg ${textColorClass}`}>{boulder.name}</span>
              <div className={`text-sm opacity-80 ${textColorClass}`}>{boulder.difficulty}</div>
            </div>
            {isCompleted && <CheckCircleIcon className={`w-6 h-6 ${textColorClass}`} aria-hidden="true" />}
          </div>
          {isPuntuables && <div className={`text-xs mt-2 p-1 rounded ${adminLabelColorClass} ${textColorClass}`}>Admin Only</div>}
        </button>
        {currentUser.role === UserRole.ADMIN && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="absolute top-1 right-1 bg-black/30 p-1 rounded-full text-white hover:bg-black/50 transition-colors"
            aria-label={`Editar ${boulder.name}`}
          >
            <EditIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {isEditing && (
        <EditBoulderModal
          boulder={boulder}
          onClose={() => setIsEditing(false)}
          onSave={onUpdateBoulder}
        />
      )}
    </>
  );
};

export default BoulderCard;
