import React, { useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmotionProvider, useEmotions } from './context/EmotionContext';
import LoginPanel from './components/LoginPanel';
import AppHeader from './components/AppHeader';
import EmotionForm from './components/EmotionForm';
import EmotionList from './components/EmotionList';
import { EmotionEntry } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const Dashboard: React.FC = () => {
  const { entries, addEntry, updateEntry, deleteEntry, setAnalysis } = useEmotions();
  const [selected, setSelected] = useState<EmotionEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  const handleSubmit = (data: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => {
    if (selected) {
      updateEntry(selected.id, data);
      setStatusMessage('Registro atualizado com sucesso.');
    } else {
      addEntry(data);
      setStatusMessage('Registro criado com carinho.');
    }
    closeForm();
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleAnalyze = async (entry: EmotionEntry) => {
    setLoadingId(entry.id);
    setStatusMessage('Consultando insights da IA...');
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
      setAnalysis(entry.id, {
        emotion: result.emocao,
        intensidade: result.intensidade,
        cached: result.cached
      });
      setStatusMessage('Análise atualizada com sucesso.');
    } catch (error) {
      console.error(error);
      setStatusMessage('Não foi possível obter a análise. Tente novamente mais tarde.');
    } finally {
      setLoadingId(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="dashboard">
      <AppHeader onCreate={handleCreate} />
      {statusMessage && (
        <div role="status" className="status-banner" aria-live="assertive">
          {loadingId ? 'Analisando...' : statusMessage}
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
          onDelete={deleteEntry}
          onAnalyze={handleAnalyze}
        />
      </section>
      {loadingId && <div className="loading-overlay" aria-hidden="true" />}
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPanel />;
  }

  return (
    <EmotionProvider>
      <Dashboard />
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
