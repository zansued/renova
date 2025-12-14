import React, { useMemo, useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmotionProvider, useEmotions } from './context/EmotionContext';
import LoginPanel from './components/LoginPanel';
import AppHeader from './components/AppHeader';
import EmotionForm from './components/EmotionForm';
import EmotionList from './components/EmotionList';
import ProfilePanel from './components/ProfilePanel';
import Navigation from './components/Navigation';
import { EmotionEntry } from './types';
import { API_URL, checkApiHealth } from './config';

const Dashboard: React.FC = () => {
  const { entries, addEntry, updateEntry, deleteEntry, setAnalysis, loading, error, syncWithSupabase } = useEmotions();
  const [selected, setSelected] = useState<EmotionEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<
    Record<string, { status: 'idle' | 'loading' | 'success' | 'error'; message?: string }>
  >({});
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkApi = async () => {
      const isHealthy = await checkApiHealth();
      setApiStatus(isHealthy ? 'online' : 'offline');
    };
    
    checkApi();
    const interval = setInterval(checkApi, 30000); // Verifica a cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [entries]
  );

  const closeForm = () => {
    setSelected(null);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelected(null);
    setIsCreating(true);
  };

  const handleSubmit = async (data: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => {
    try {
      if (selected) {
        await updateEntry(selected.id, data);
        setStatusMessage('✅ Registro atualizado com sucesso.');
      } else {
        await addEntry(data);
        setStatusMessage('✨ Registro criado com carinho.');
      }
      closeForm();
    } catch (error: any) {
      console.error(error);
      setStatusMessage(error.message || 'Não foi possível salvar seu registro.');
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      setStatusMessage('🗑️ Registro removido com sucesso.');
    } catch (error: any) {
      console.error(error);
      setStatusMessage(error.message || 'Não foi possível remover o registro.');
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleAnalyze = async (entry: EmotionEntry) => {
    if (apiStatus === 'offline') {
      setStatusMessage('⚠️ API offline. Análise de IA indisponível.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setAnalysisState(prev => ({
      ...prev,
      [entry.id]: { status: 'loading', message: 'Consultando insights da IA...' }
    }));
    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ texto: `${entry.title}. ${entry.triggers} ${entry.strategies}`.trim() })
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com a API');
      }

      const result = await response.json();
      await setAnalysis(entry.id, {
        emotion: result.emocao,
        intensidade: result.intensidade,
        cached: result.cached
      });
      setAnalysisState(prev => ({
        ...prev,
        [entry.id]: { status: 'success', message: '✅ Análise atualizada com sucesso.' }
      }));
    } catch (error) {
      console.error(error);
      setAnalysisState(prev => ({
        ...prev,
        [entry.id]: { status: 'error', message: '❌ Não foi possível obter a análise.' }
      }));
    } finally {
      setTimeout(() => {
        setAnalysisState(prev => {
          const current = prev[entry.id];
          if (current && current.status !== 'loading') {
            const next = { ...prev };
            delete next[entry.id];
            return next;
          }
          return prev;
        });
      }, 4000);
    }
  };

  return (
    <div className="dashboard">
      <AppHeader onCreate={handleCreate} />
      
      <div className="status-bar">
        {apiStatus === 'checking' && (
          <div className="status-checking">🔍 Verificando conexão com API...</div>
        )}
        {apiStatus === 'offline' && (
          <div className="status-offline">
            ⚠️ API offline. Trabalhando no modo local. 
            <button onClick={syncWithSupabase} className="sync-button">
              🔄 Tentar sincronizar
            </button>
          </div>
        )}
        {apiStatus === 'online' && (
          <div className="status-online">✅ Conectado à API</div>
        )}
        {error && (
          <div className="status-error">⚠️ {error}</div>
        )}
        {loading && (
          <div className="status-loading">⏳ Carregando...</div>
        )}
      </div>
      
      {statusMessage && (
        <div role="status" className="status-banner" aria-live="assertive">
          {statusMessage}
        </div>
      )}
      
      <section className="content-area">
        {(isCreating || selected) && (
          <EmotionForm
            initial={selected ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}
        <EmotionList
          entries={sortedEntries}
          onEdit={entry => {
            setSelected(entry);
            setIsCreating(false);
          }}
          onDelete={handleDelete}
          onAnalyze={handleAnalyze}
          analysisState={analysisState}
        />
      </section>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');

  if (!user) {
    return <LoginPanel />;
  }

  return (
    <EmotionProvider>
      <div className="authenticated-app">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'dashboard' ? <Dashboard /> : <ProfilePanel />}
      </div>
    </EmotionProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <main className="app-shell">
        <AuthenticatedApp />
      </main>
    </AuthProvider>
  );
};

export default App;
