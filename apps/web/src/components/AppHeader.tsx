import React from 'react';
import { useAuth } from '../context/AuthContext';

interface AppHeaderProps {
  onCreate: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onCreate }) => {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <div>
        <h1>Renova</h1>
        <p className="header-subtitle">Transformai-vos pela renovação da mente - Romanos 12:2</p>
      </div>
      <div className="header-actions">
        <div className="user-pill" aria-label={`Usuário autenticado ${user}`}>
          <span className="user-avatar" aria-hidden="true">
            {user?.[0]?.toUpperCase() ?? '?'}
          </span>
          <span>{user}</span>
        </div>
        <button className="primary-button" onClick={onCreate}>
          ✨ Novo registro
        </button>
        <button className="secondary-button" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
