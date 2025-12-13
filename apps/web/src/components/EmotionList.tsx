import React from 'react';
import { EmotionEntry } from '../types';

interface EmotionListProps {
  entries: EmotionEntry[];
  onEdit: (entry: EmotionEntry) => void;
  onDelete: (id: string) => void;
  onAnalyze: (entry: EmotionEntry) => void;
  analysisState: Record<string, { status: 'idle' | 'loading' | 'success' | 'error'; message?: string }>;
}

const getIntensityColor = (intensity: number) => {
  if (intensity <= 3) return '#A7E9AF'; // Mint
  if (intensity <= 6) return '#E0BBE4'; // Violet
  return '#FFCCCB'; // Coral
};

const EmotionList: React.FC<EmotionListProps> = ({ entries, onEdit, onDelete, onAnalyze, analysisState }) => {
  if (entries.length === 0) {
    return (
      <div className="empty-state" role="status">
        <h3>🌱 Comece registrando sua primeira emoção</h3>
        <p>Seus registros emocionais aparecerão aqui com recomendações e análises.</p>
      </div>
    );
  }

  return (
    <ul className="emotion-list">
      {entries.map(entry => {
        const state = analysisState[entry.id];
        const isLoading = state?.status === 'loading';
        const isError = state?.status === 'error';
        const isSuccess = state?.status === 'success';

        return (
          <li key={entry.id} className="emotion-card">
            <header>
              <div>
                <h3>{entry.title}</h3>
                <p className="emotion-meta">
                  <span>📅 {new Date(entry.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span>💭 {entry.emotion}</span>
                  <span>
                    <span 
                      className="intensity-indicator" 
                      style={{ backgroundColor: getIntensityColor(entry.intensity) }}
                      aria-hidden="true"
                    />
                    Intensidade: {entry.intensity}/10
                  </span>
                </p>
              </div>
              <div className="card-actions">
                <button onClick={() => onEdit(entry)} className="secondary-button" aria-label={`Editar ${entry.title}`}>
                  ✏️ Editar
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="danger-button"
                  aria-label={`Excluir ${entry.title}`}
                >
                  🗑️ Excluir
                </button>
              </div>
            </header>
            <section className="card-body">
              <div>
                <h4>✨ Fatores influenciadores</h4>
                <p>{entry.triggers || 'Sem observações registradas.'}</p>
              </div>
              <div>
                <h4>🛡️ Respostas e estratégias</h4>
                <p>{entry.strategies || 'Sem estratégias registradas.'}</p>
              </div>
            </section>
            <footer className="card-footer">
              <div className="footer-actions">
                <button
                  onClick={() => onAnalyze(entry)}
                  className="primary-button"
                  aria-label={`Obter análise de IA para ${entry.title}`}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? '🔮 Analisando...' : '✨ Obter análise de IA'}
                </button>
                <div
                  className={`analysis-status ${isError ? 'status-error' : isSuccess ? 'status-success' : ''}`.trim()}
                  role="status"
                  aria-live={isError ? 'assertive' : 'polite'}
                >
                  {isLoading && <span>Consultando insights... ⏳</span>}
                  {isSuccess && <span>{state?.message ?? 'Análise atualizada com sucesso! ✅'}</span>}
                  {isError && <span>{state?.message ?? 'Não foi possível obter a análise. ❌'}</span>}
                </div>
              </div>
              {entry.analysis && (
                <div className="analysis-chip" aria-live="polite">
                  <span className="chip-label">Emoção sugerida:</span>
                  <span>{entry.analysis.emotion}</span>
                  <span>Intensidade: {entry.analysis.intensidade}%</span>
                  <span>{entry.analysis.cached ? '🔄 do cache' : '🆕 nova'}</span>
                </div>
              )}
            </footer>
          </li>
        );
      })}
    </ul>
  );
};

export default EmotionList;
