import React from 'react';

type Tab = 'dashboard' | 'profile';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navigation" aria-label="Navegação principal">
      <button
        className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onTabChange('dashboard')}
        aria-current={activeTab === 'dashboard' ? 'page' : undefined}
      >
        📊 Dashboard
      </button>
      <button
        className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
        aria-current={activeTab === 'profile' ? 'page' : undefined}
      >
        ⚙️ Configurações
      </button>
    </nav>
  );
};

export default Navigation;
