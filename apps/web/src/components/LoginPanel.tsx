import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EMAIL_PATTERN = /.+@.+\..+/;

const LoginPanel: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError('Informe um e-mail válido para continuar.');
      return;
    }
    login(email.toLowerCase());
  };

  return (
    <section className="auth-panel" aria-labelledby="login-title">
      <div className="auth-card">
        <h1 id="login-title">Bem-vindo ao Renova</h1>
        <p className="auth-subtitle">
          Um espaço acolhedor para registrar emoções, refletir com fé e receber insights de IA.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => {
              setEmail(event.target.value);
              setError('');
            }}
            placeholder="voce@exemplo.com"
            required
          />
          {error && <p role="alert" className="input-error">{error}</p>}
          <button type="submit" className="primary-button">
            🌸 Entrar e começar
          </button>
        </form>
        <p className="auth-footnote">
          Seus dados ficam salvos localmente no seu dispositivo para manter sua privacidade.
        </p>
      </div>
    </section>
  );
};

export default LoginPanel;
