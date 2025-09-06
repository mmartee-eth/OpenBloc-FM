import React, { useState } from 'react';
import Logo from './Logo';

interface LoginPageProps {
  onLogin: (email: string) => void;
  error: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  const [email, setEmail] = useState('martiantentas@gmail.com');
  const [password, setPassword] = useState('admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="max-w-md w-full p-8 bg-brand-surface rounded-xl shadow-lg border border-brand-border">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-6">
             <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-text mt-4">Open Bloc Vic</h1>
          <p className="text-brand-text-secondary mt-1">Inicia sessió per registrar la teva puntuació</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-brand-text bg-brand-surface-secondary border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="user@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Contrasenya
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-brand-text bg-brand-surface-secondary border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors"
            >
              Iniciar Sessió
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;