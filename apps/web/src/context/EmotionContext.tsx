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
}

const EmotionContext = createContext<EmotionContextValue | undefined>(undefined);

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<EmotionEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadEntries = async () => {
      if (!user) {
        setEntries([]);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/entries`, {
          headers: {
            'x-user-id': user
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao carregar registros');
        }

        const data = await response.json();
        if (!cancelled) {
          setEntries(data);
        }
      } catch (error) {
        console.error('Erro ao carregar registros', error);
        if (!cancelled) {
          setEntries([]);
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

      const response = await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user
        },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar registro');
      }

      const created = await response.json();
      setEntries(prev => [created, ...prev]);
    },
    [user]
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<Omit<EmotionEntry, 'id' | 'createdAt'>>) => {
      if (!user) throw new Error('Usuário não autenticado');

      const response = await fetch(`${API_URL}/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar registro');
      }

      const updated = await response.json();
      setEntries(prev => prev.map(item => (item.id === id ? updated : item)));
    },
    [user]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      const response = await fetch(`${API_URL}/entries/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir registro');
      }

      setEntries(prev => prev.filter(item => item.id !== id));
    },
    [user]
  );

  const setAnalysis = useCallback(
    async (id: string, analysis: EmotionEntry['analysis']) => {
      await updateEntry(id, { analysis });
    },
    [updateEntry]
  );

  const value = useMemo(
    () => ({ entries, addEntry, updateEntry, deleteEntry, setAnalysis }),
    [entries, addEntry, updateEntry, deleteEntry, setAnalysis]
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
