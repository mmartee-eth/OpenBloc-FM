import React, { useState } from 'react';
import { User } from '../types';

interface ProfilePageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateUser }) => {
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage("Les contrasenyes no coincideixen.");
      return;
    }
    
    const updates: Partial<User> = {};
    if (username !== currentUser.username) {
      updates.username = username;
    }
    // Password update logic would go here in a real app
    
    onUpdateUser(updates);
    setMessage("Perfil actualitzat correctament!");
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-extrabold text-center mb-8">El Teu Perfil</h1>
      <div className="bg-brand-surface p-8 rounded-lg shadow-lg border border-brand-border">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full px-3 py-2 bg-brand-surface-secondary border border-brand-border rounded-md cursor-not-allowed opacity-70"
            />
          </div>
          <div className="mb-4">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="username">
              Nom d'usuari
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-brand-text bg-brand-surface-secondary border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <hr className="my-6 border-brand-border" />
          <h2 className="text-xl font-bold mb-4">Canviar Contrasenya</h2>
          <div className="mb-4">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Nova Contrasenya
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-brand-text bg-brand-surface-secondary border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div className="mb-6">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirmar Nova Contrasenya
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-brand-text bg-brand-surface-secondary border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          {message && <p className="text-green-600 text-center mb-4">{message}</p>}
          <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded transition-colors">
            Guardar Canvis
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;