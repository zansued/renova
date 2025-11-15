import React, { useEffect, useState } from 'react';
import { EmotionEntry } from '../types';

type EmotionFormProps = {
  initial?: EmotionEntry;
  onSubmit: (data: Omit<EmotionEntry, 'id' | 'createdAt' | 'analysis'>) => void;
  onCancel: () => void;
};

const EmotionForm: React.FC<EmotionFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [triggers, setTriggers] = useState('');
  const [strategies, setStrategies] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setEmotion(initial.emotion);
      setIntensity(initial.intensity);
      setTriggers(initial.triggers);
      setStrategies(initial.strategies);
    }
  }, [initial]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ title, emotion, intensity, triggers, strategies });
  };

  return (
    <form className="emotion-form" onSubmit={handleSubmit} aria-label="formulário de registro emocional">
      <div className="form-grid">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Resumo do momento"
          required
        />

        <label htmlFor="emotion">Emoção principal</label>
        <input
          id="emotion"
          name="emotion"
          value={emotion}
          onChange={event => setEmotion(event.target.value)}
          placeholder="Gratidão, esperança, ansiedade..."
          required
        />

        <label htmlFor="intensity">Intensidade (1 a 10)</label>
        <input
          id="intensity"
          name="intensity"
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={event => setIntensity(Number(event.target.value))}
        />
        <span aria-live="polite" className="range-value">
          {intensity}
        </span>

        <label htmlFor="triggers">O que influenciou esse momento?</label>
        <textarea
          id="triggers"
          name="triggers"
          value={triggers}
          onChange={event => setTriggers(event.target.value)}
          rows={3}
        />

        <label htmlFor="strategies">Como você respondeu ou poderia responder?</label>
        <textarea
          id="strategies"
          name="strategies"
          value={strategies}
          onChange={event => setStrategies(event.target.value)}
          rows={3}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="primary-button">
          {initial ? 'Atualizar registro' : 'Salvar registro'}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EmotionForm;
