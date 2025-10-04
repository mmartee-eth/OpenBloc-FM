import React from 'react';
import { Page, User, UserRole } from '../types';
import { ClimbIcon, ChartIcon, UserIcon, LogoutIcon } from './icons';
import Logo from './Logo';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  currentUser: User;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-accent text-white'
        : 'text-brand-text-secondary hover:bg-brand-surface-secondary hover:text-brand-text'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onLogout, currentUser }) => {
  return (
    <nav className="bg-brand-surface shadow-md sticky top-0 z-40 border-b border-brand-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {currentUser.role !== UserRole.ARBITRE && (
              <>
                <NavItem
                  icon={<ClimbIcon className="h-5 w-5" />}
                  label="Blocs"
                  isActive={currentPage === 'home'}
                  onClick={() => onNavigate('home')}
                />
                <NavItem
                  icon={<ChartIcon className="h-5 w-5" />}
                  label="Classificació"
                  isActive={currentPage === 'leaderboard'}
                  onClick={() => onNavigate('leaderboard')}
                />
                <NavItem
                  icon={<UserIcon className="h-5 w-5" />}
                  label="Perfil"
                  isActive={currentPage === 'profile'}
                  onClick={() => onNavigate('profile')}
                />
              </>
            )}
            <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-brand-text-secondary hover:bg-brand-surface-secondary hover:text-brand-text transition-colors">
              <LogoutIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Tancar Sessió</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
