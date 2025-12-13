import React, { useEffect, useState } from 'react';
import { EmotionEntry, EMOTION_SUGGESTIONS, THOUGHT_PATTERNS, VERSES } from '../types';

type EmotionFormProps = {
  initial?: EmotionEntry;
  onSubmit: (data: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => Promise<void>;
  onCancel: () => void;
};

const MOOD_SCALE_EMOJIS = ['😭', '😢', '😔', '😕', '😐', '🙂', '😊', '😁', '😄', '🤩'];

const EmotionForm: React.FC<EmotionFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [triggers, setTriggers] = useState('');
  const [strategies, setStrategies] = useState('');
  const [tags, setTags] = useState('');
  const [physicalTriggers, setPhysicalTriggers] = useState('');
  const [thoughtPattern, setThoughtPattern] = useState('');
  const [verse, setVerse] = useState('');
  const [moodScale, setMoodScale] = useState(5);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setEmotion(initial.emotion);
      setIntensity(initial.intensity);
      setTriggers(initial.triggers);
      setStrategies(initial.strategies);
      
      if (initial.metadata) {
        setTags(initial.metadata.tags?.join(', ') || '');
        setPhysicalTriggers(initial.metadata.physicalTriggers || '');
        setThoughtPattern(initial.metadata.thoughtPattern || '');
        setVerse(initial.metadata.verse || '');
        setMoodScale(initial.metadata.moodScale || 5);
        setDate(initial.metadata.date || new Date().toISOString().split('T')[0]);
        setTime(initial.metadata.time || new Date().toTimeString().slice(0, 5));
      }
    }
  }, [initial]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    
    const metadata = {
      date,
      time,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      physicalTriggers,
      thoughtPattern,
      verse,
      moodScale
    };

    const entryData = {
      title,
      emotion,
      intensity,
      triggers,
      strategies,
      metadata
    };

    try {
      await onSubmit(entryData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="emotion-form form-animate"
      onSubmit={handleSubmit}
      aria-label="formulário de registro emocional"
    >
      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="date">Data</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="time">Hora</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="title">Título do registro</label>
          <input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Manhã de gratidão após oração"
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="emotion">Emoção principal</label>
          <input
            id="emotion"
            list="emotion-suggestions"
            value={emotion}
            onChange={e => setEmotion(e.target.value)}
            placeholder="Selecione ou digite..."
            required
          />
          <datalist id="emotion-suggestions">
            {EMOTION_SUGGESTIONS.map(emo => (
              <option key={emo} value={emo} />
            ))}
          </datalist>
        </div>

        <div className="form-row">
          <label>Escala do humor</label>
          <div className="mood-scale">
            {MOOD_SCALE_EMOJIS.map((emoji, index) => (
              <button
                key={index}
                type="button"
                className={`mood-option ${moodScale === index + 1 ? 'selected' : ''}`}
                onClick={() => setMoodScale(index + 1)}
                aria-label={`Humor ${index + 1}: ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mood-labels">
            <span>Muito baixo</span>
            <span>Neutro</span>
            <span>Muito alto</span>
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="intensity">Intensidade emocional (1 a 10)</label>
          <div className="intensity-slider">
            <input
              id="intensity"
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
            />
            <div className="slider-ticks">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tick => (
                <span key={tick} className={intensity >= tick ? 'active' : ''}>{tick}</span>
              ))}
            </div>
          </div>
          <span className="intensity-value" aria-live="polite">
            Intensidade: <strong>{intensity}/10</strong>
          </span>
        </div>

        <div className="form-row">
          <label htmlFor="tags">Tags (separadas por vírgula)</label>
          <input
            id="tags"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="trabalho, família, fé, saúde, lazer..."
          />
          <div className="tag-hints">
            <small>Ex: trabalho, família, fé, saúde, lazer</small>
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="thoughtPattern">Padrão de pensamento identificado</label>
          <select
            id="thoughtPattern"
            value={thoughtPattern}
            onChange={e => setThoughtPattern(e.target.value)}
          >
            <option value="">Selecione um padrão (opcional)</option>
            {THOUGHT_PATTERNS.map(pattern => (
              <option key={pattern} value={pattern}>{pattern}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="triggers">O que aconteceu? (Contexto e gatilhos)</label>
          <textarea
            id="triggers"
            value={triggers}
            onChange={e => setTriggers(e.target.value)}
            rows={3}
            placeholder="Descreva a situação que desencadeou essa emoção..."
          />
        </div>

        <div className="form-row">
          <label htmlFor="physicalTriggers">Sensações físicas (opcional)</label>
          <textarea
            id="physicalTriggers"
            value={physicalTriggers}
            onChange={e => setPhysicalTriggers(e.target.value)}
            rows={2}
            placeholder="Ex: coração acelerado, tensão nos ombros, respiração ofegante..."
          />
        </div>

        <div className="form-row">
          <label htmlFor="strategies">Como você respondeu ou poderia responder?</label>
          <textarea
            id="strategies"
            value={strategies}
            onChange={e => setStrategies(e.target.value)}
            rows={3}
            placeholder="Estratégias de enfrentamento, oração, respiração, conversa..."
          />
        </div>

        <div className="form-row">
          <label htmlFor="verse">Versículo bíblico que trouxe conforto (opcional)</label>
          <select
            id="verse"
            value={verse}
            onChange={e => setVerse(e.target.value)}
          >
            <option value="">Selecione um versículo (opcional)</option>
            {VERSES.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Salvando...' : (initial ? '✏️ Atualizar registro' : '💾 Salvar registro')}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EmotionForm;
