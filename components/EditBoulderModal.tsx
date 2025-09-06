import React, { useState } from 'react';
import { Boulder, BoulderDifficulty } from '../types';
import { DIFFICULTY_ORDER, COLOR_OPTIONS } from '../constants';

interface EditBoulderModalProps {
  boulder: Boulder;
  onClose: () => void;
  onSave: (updatedBoulder: Boulder) => void;
}

const EditBoulderModal: React.FC<EditBoulderModalProps> = ({ boulder, onClose, onSave }) => {
    const [name, setName] = useState(boulder.name);
    const [difficulty, setDifficulty] = useState(boulder.difficulty);
    const [color, setColor] = useState(boulder.color);

    const handleSave = () => {
        onSave({
            ...boulder,
            name,
            difficulty,
            color
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="edit-boulder-title">
            <div className="bg-brand-surface rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-brand-border" onClick={e => e.stopPropagation()}>
                <h2 id="edit-boulder-title" className="text-2xl font-bold mb-4">Editar {boulder.name}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="boulderName" className="block text-brand-text-secondary text-sm font-bold mb-2">Nom / Número del Bloc</label>
                        <input id="boulderName" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 text-brand-text bg-brand-surface-secondary border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                    </div>
                    <div>
                        <label htmlFor="boulderDifficulty" className="block text-brand-text-secondary text-sm font-bold mb-2">Dificultat</label>
                        <select id="boulderDifficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as BoulderDifficulty)} className="w-full px-3 py-2 text-brand-text bg-brand-surface-secondary border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent">
                            {DIFFICULTY_ORDER.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-brand-text-secondary text-sm font-bold mb-2">Color</label>
                        <div className="grid grid-cols-5 gap-2">
                            {COLOR_OPTIONS.map(c => (
                                <button key={c.class} onClick={() => setColor(c.class)} className={`h-10 rounded ${c.class} ${color === c.class ? 'ring-2 ring-offset-2 ring-offset-brand-surface ring-brand-accent' : ''}`} aria-label={`Select color ${c.name}`}>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors">Cancel·lar</button>
                    <button onClick={handleSave} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded transition-colors">Guardar Canvis</button>
                </div>
            </div>
        </div>
    );
};

export default EditBoulderModal;