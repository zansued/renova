import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EmotionEntry } from '../types';
import { useAuth } from './AuthContext';

interface EmotionContextValue {
  entries: EmotionEntry[];
  addEntry: (entry: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => void;
  updateEntry: (id: string, updates: Partial<Omit<EmotionEntry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  setAnalysis: (id: string, analysis: EmotionEntry['analysis']) => void;
}

const EmotionContext = createContext<EmotionContextValue | undefined>(undefined);

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<EmotionEntry[]>([]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }
    const stored = localStorage.getItem(`renova:entries:${user}`);
    if (stored) {
      setEntries(JSON.parse(stored));
    } else {
      setEntries([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`renova:entries:${user}`, JSON.stringify(entries));
    }
  }, [entries, user]);

  const addEntry = useCallback(
    (entry: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => {
      const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setEntries(prev => [
        {
          ...entry,
          id,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    },
    []
  );

  const updateEntry = useCallback((id: string, updates: Partial<Omit<EmotionEntry, 'id' | 'createdAt'>>) => {
    setEntries(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              ...updates,
              analysis: updates.analysis !== undefined ? updates.analysis : item.analysis
            }
          : item
      )
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(item => item.id !== id));
  }, []);

  const setAnalysis = useCallback((id: string, analysis: EmotionEntry['analysis']) => {
    setEntries(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              analysis
            }
          : item
      )
    );
  }, []);

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
