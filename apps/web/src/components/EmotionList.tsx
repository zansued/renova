import React from 'react';
import { EmotionEntry } from '../types';

interface EmotionListProps {
  entries: EmotionEntry[];
  onEdit: (entry: EmotionEntry) => void;
  onDelete: (id: string) => void;
  onAnalyze: (entry: EmotionEntry) => void;
}

const EmotionList: React.FC<EmotionListProps> = ({ entries, onEdit, onDelete, onAnalyze }) => {
  if (entries.length === 0) {
    return (
      <div className="empty-state" role="status">
        <h3>Comece registrando sua primeira emoção</h3>
        <p>Suas reflexões aparecem aqui com recomendações e análises.</p>
      </div>
    );
  }

  return (
    <ul className="emotion-list">
      {entries.map(entry => (
        <li key={entry.id} className="emotion-card">
          <header>
            <div>
              <h3>{entry.title}</h3>
              <p className="emotion-meta">
                <span>{new Date(entry.createdAt).toLocaleString('pt-BR')}</span>
                <span>{entry.emotion}</span>
                <span>Intensidade: {entry.intensity}</span>
              </p>
            </div>
            <div className="card-actions">
              <button onClick={() => onEdit(entry)} className="secondary-button" aria-label={`Editar ${entry.title}`}>
                Editar
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="danger-button"
                aria-label={`Excluir ${entry.title}`}
              >
                Excluir
              </button>
            </div>
          </header>
          <section className="card-body">
            <div>
              <h4>Fatores influenciadores</h4>
              <p>{entry.triggers || 'Sem observações registradas.'}</p>
            </div>
            <div>
              <h4>Respostas e estratégias</h4>
              <p>{entry.strategies || 'Sem estratégias registradas.'}</p>
            </div>
          </section>
          <footer className="card-footer">
            <button onClick={() => onAnalyze(entry)} className="primary-button">
              Obter análise de IA
            </button>
            {entry.analysis && (
              <div className="analysis-chip" aria-live="polite">
                <span className="chip-label">Emoção sugerida:</span>
                <span>{entry.analysis.emotion}</span>
                <span>Intensidade: {entry.analysis.intensidade}</span>
                <span>{entry.analysis.cached ? 'do cache' : 'nova'}</span>
              </div>
            )}
          </footer>
        </li>
      ))}
    </ul>
  );
};

export default EmotionList;
