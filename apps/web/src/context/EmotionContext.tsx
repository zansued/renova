import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EmotionEntry } from '../types';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

interface EmotionContextValue {
  entries: EmotionEntry[];
  addEntry: (entry: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<Omit<EmotionEntry, 'id' | 'createdAt'>>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setAnalysis: (id: string, analysis: EmotionEntry['analysis']) => Promise<void>;
  loading: boolean;
  error: string | null;
  syncWithSupabase: () => Promise<void>;
}

const EmotionContext = createContext<EmotionContextValue | undefined>(undefined);

// Fallback para localStorage quando a API falha
const LOCAL_STORAGE_KEY = 'renova:entries:fallback';

const getLocalEntries = (userId: string): EmotionEntry[] => {
  try {
    const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}:${userId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalEntries = (userId: string, entries: EmotionEntry[]) => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}:${userId}`, JSON.stringify(entries));
  } catch (error) {
    console.error('Erro ao salvar localmente:', error);
  }
};

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadEntries = async () => {
      if (!user) {
        setEntries([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Primeiro tenta a API
        const response = await fetch(`${API_URL}/entries`, {
          headers: {
            'x-user-id': user
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setEntries(data);
          setUseFallback(false);
          // Sincroniza com localStorage como backup
          saveLocalEntries(user, data);
        }
      } catch (error) {
        console.error('Erro ao carregar da API, usando fallback:', error);
        if (!cancelled) {
          const localEntries = getLocalEntries(user);
          setEntries(localEntries);
          setUseFallback(true);
          setError('Usando armazenamento local (API indisponível)');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEntries();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addEntry = useCallback(
    async (entry: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => {
      if (!user) throw new Error('Usuário não autenticado');

      const newEntry: EmotionEntry = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        analysis: undefined,
      };

      // Otimista: adiciona localmente primeiro
      setEntries(prev => [newEntry, ...prev]);
      saveLocalEntries(user, [newEntry, ...entries]);

      try {
        const response = await fetch(`${API_URL}/entries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user
          },
          body: JSON.stringify(entry)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const created = await response.json();
        
        // Atualiza com a versão do servidor
        setEntries(prev => prev.map(e => e.id === newEntry.id ? created : e));
        saveLocalEntries(user, [created, ...entries.filter(e => e.id !== newEntry.id)]);
        
        setUseFallback(false);
      } catch (error) {
        console.error('Erro ao salvar na API, mantendo local:', error);
        setUseFallback(true);
        setError('Registro salvo localmente (API indisponível)');
        // Mantém a entrada local já adicionada
        setTimeout(() => setError(null), 3000);
        throw new Error('Falha ao sincronizar com a nuvem, mas salvo localmente');
      }
    },
    [user, entries]
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<Omit<EmotionEntry, 'id' | 'createdAt'>>) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Otimista: atualiza localmente
      setEntries(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      saveLocalEntries(user, entries.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));

      try {
        const response = await fetch(`${API_URL}/entries/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user
          },
          body: JSON.stringify(updates)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const updated = await response.json();
        
        // Atualiza com a versão do servidor
        setEntries(prev => prev.map(item => 
          item.id === id ? updated : item
        ));
        saveLocalEntries(user, entries.map(item => 
          item.id === id ? updated : item
        ));
        
        setUseFallback(false);
      } catch (error) {
        console.error('Erro ao atualizar na API, mantendo local:', error);
        setUseFallback(true);
        setError('Atualização salva localmente (API indisponível)');
        setTimeout(() => setError(null), 3000);
        throw new Error('Falha ao sincronizar com a nuvem, mas salvo localmente');
      }
    },
    [user, entries]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Otimista: remove localmente
      const newEntries = entries.filter(item => item.id !== id);
      setEntries(newEntries);
      saveLocalEntries(user, newEntries);

      try {
        const response = await fetch(`${API_URL}/entries/${id}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': user
          }
        });

        if (!response.ok && response.status !== 204) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        setUseFallback(false);
      } catch (error) {
        console.error('Erro ao deletar na API, mantendo local:', error);
        setUseFallback(true);
        setError('Exclusão salva localmente (API indisponível)');
        setTimeout(() => setError(null), 3000);
        throw new Error('Falha ao sincronizar com a nuvem, mas excluído localmente');
      }
    },
    [user, entries]
  );

  const setAnalysis = useCallback(
    async (id: string, analysis: EmotionEntry['analysis']) => {
      await updateEntry(id, { analysis });
    },
    [updateEntry]
  );

  const syncWithSupabase = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const localEntries = getLocalEntries(user);
      
      // Tenta enviar cada entrada local para a API
      for (const entry of localEntries) {
        try {
          await fetch(`${API_URL}/entries`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user
            },
            body: JSON.stringify({
              title: entry.title,
              emotion: entry.emotion,
              intensity: entry.intensity,
              triggers: entry.triggers,
              strategies: entry.strategies,
              metadata: entry.metadata,
              analysis: entry.analysis
            })
          });
        } catch (error) {
          console.error(`Erro ao sincronizar entrada ${entry.id}:`, error);
        }
      }

      // Recarrega da API
      const response = await fetch(`${API_URL}/entries`, {
        headers: { 'x-user-id': user }
      });
      const data = await response.json();
      
      setEntries(data);
      saveLocalEntries(user, data);
      setUseFallback(false);
      setError(null);
    } catch (error) {
      setError('Falha na sincronização');
      console.error('Erro na sincronização:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = useMemo(
    () => ({ 
      entries, 
      addEntry, 
      updateEntry, 
      deleteEntry, 
      setAnalysis,
      loading,
      error,
      syncWithSupabase
    }),
    [entries, addEntry, updateEntry, deleteEntry, setAnalysis, loading, error, syncWithSupabase]
  );

  return <EmotionContext.Provider value={value}>{children}</EmotionContext.Provider>;
};

export const useEmotions = (): EmotionContextValue => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotions deve ser usado dentro de EmotionProvider');
  }
  return context;
};
