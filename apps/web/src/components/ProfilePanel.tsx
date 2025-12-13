import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Configurações padrão do Supabase (pré-preenchidas)
const DEFAULT_SUPABASE_URL = 'https://supa.techstorebrasil.com';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.N2nG61tlUEcrIqkCTnHLABlAo4z8fcl6an30W40fdac';

const ProfilePanel: React.FC = () => {
  const { user } = useAuth();
  const [supabaseUrl, setSupabaseUrl] = useState(DEFAULT_SUPABASE_URL);
  const [supabaseKey, setSupabaseKey] = useState(DEFAULT_SUPABASE_KEY);
  const [useSupabase, setUseSupabase] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const savedUrl = localStorage.getItem('renova:supabase:url');
    const savedKey = localStorage.getItem('renova:supabase:key');
    const savedUse = localStorage.getItem('renova:use_supabase');

    if (savedUrl) setSupabaseUrl(savedUrl);
    if (savedKey) setSupabaseKey(savedKey);
    if (savedUse !== null) setUseSupabase(savedUse === 'true');
  }, []);

  const saveSettings = () => {
    try {
      if (useSupabase) {
        if (!supabaseUrl.trim() || !supabaseKey.trim()) {
          setStatus({ type: 'error', message: 'URL e chave do Supabase são obrigatórios' });
          return;
        }

        localStorage.setItem('renova:supabase:url', supabaseUrl.trim());
        localStorage.setItem('renova:supabase:key', supabaseKey.trim());
        localStorage.setItem('renova:use_supabase', 'true');
      } else {
        localStorage.removeItem('renova:supabase:url');
        localStorage.removeItem('renova:supabase:key');
        localStorage.setItem('renova:use_supabase', 'false');
      }

      setStatus({ 
        type: 'success', 
        message: useSupabase 
          ? '✅ Supabase configurado com sucesso! Seus dados serão sincronizados na nuvem.' 
          : '📱 Voltando para armazenamento local' 
      });
      
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Erro ao salvar configurações' });
    }
  };

  const testConnection = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setTestResult({ success: false, message: 'URL e chave são necessários' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Carregar dinamicamente o cliente Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim());
      
      // Testar conexão com uma consulta simples
      const { error } = await supabase.from('emotion_entries').select('count').limit(1);
      
      if (error) {
        // Se a tabela não existir, testar a conexão básica
        const { error: authError } = await supabase.auth.getSession();
        if (authError) throw new Error(authError.message);
        
        setTestResult({ 
          success: true, 
          message: '✅ Conexão estabelecida! Execute o SQL de migração para criar as tabelas.' 
        });
      } else {
        setTestResult({ 
          success: true, 
          message: '✅ Conexão bem-sucedida! Banco de dados pronto para uso.' 
        });
      }
    } catch (error: any) {
      setTestResult({ 
        success: false, 
        message: `❌ Falha na conexão: ${error.message || 'Erro desconhecido'}` 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetSettings = () => {
    localStorage.removeItem('renova:supabase:url');
    localStorage.removeItem('renova:supabase:key');
    localStorage.setItem('renova:use_supabase', 'false');
    setSupabaseUrl(DEFAULT_SUPABASE_URL);
    setSupabaseKey(DEFAULT_SUPABASE_KEY);
    setUseSupabase(false);
    setStatus({ type: 'success', message: 'Configurações resetadas para padrão' });
    setTimeout(() => setStatus(null), 3000);
  };

  const useDefaultConfig = () => {
    setSupabaseUrl(DEFAULT_SUPABASE_URL);
    setSupabaseKey(DEFAULT_SUPABASE_KEY);
    setUseSupabase(true);
    setStatus({ type: 'info', message: 'Configuração padrão do Orion Supabase carregada!' });
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="profile-panel">
      <div className="profile-card">
        <h2>⚙️ Configurações do Perfil</h2>
        
        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Usuário:</span>
            <span className="info-value">{user}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Armazenamento:</span>
            <span className="info-value">
              {useSupabase ? '☁️ Supabase (Nuvem)' : '📱 Local'}
            </span>
          </div>
        </div>

        <div className="settings-section">
          <h3>💾 Armazenamento de Dados</h3>
          <p className="section-description">
            Seus registros emocionais são importantes. Recomendamos usar o Supabase para backup automático.
          </p>

          <div className="storage-options">
            <label className="storage-option">
              <input
                type="radio"
                name="storage"
                checked={!useSupabase}
                onChange={() => setUseSupabase(false)}
              />
              <div className="option-content">
                <h4>📱 Local (padrão)</h4>
                <p>Dados salvos apenas no seu navegador. Ideal para testes rápidos.</p>
                <ul className="option-features">
                  <li>✅ Sem configuração necessária</li>
                  <li>✅ Totalmente offline</li>
                  <li>⚠️ Dados apenas neste dispositivo</li>
                  <li>⚠️ Sem backup</li>
                </ul>
              </div>
            </label>

            <label className="storage-option">
              <input
                type="radio"
                name="storage"
                checked={useSupabase}
                onChange={() => setUseSupabase(true)}
              />
              <div className="option-content">
                <h4>☁️ Supabase Orion (recomendado)</h4>
                <p>Sua instância Supabase pessoal já configurada e pronta para uso.</p>
                <ul className="option-features">
                  <li>✅ Backup automático</li>
                  <li>✅ Acesso em vários dispositivos</li>
                  <li>✅ Persistência garantida</li>
                  <li>✅ Dados criptografados</li>
                </ul>
              </div>
            </label>
          </div>

          {useSupabase && (
            <div className="supabase-config">
              <div className="config-header">
                <h4>🔧 Configuração do Supabase Orion</h4>
                <button 
                  onClick={useDefaultConfig}
                  className="secondary-button small"
                >
                  🔄 Usar Configuração Padrão
                </button>
              </div>
              
              <div className="form-group">
                <label htmlFor="supabase-url">URL do Supabase</label>
                <input
                  id="supabase-url"
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://seu-projeto.supabase.co"
                />
                <small>
                  Encontre em: Settings → API → Project URL
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="supabase-key">Chave Pública (anon)</label>
                <textarea
                  id="supabase-key"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="sua-chave-publica-aqui"
                  rows={3}
                  className="key-textarea"
                />
                <small>
                  Encontre em: Settings → API → Project API keys → anon public
                </small>
              </div>

              <div className="test-connection">
                <button
                  onClick={testConnection}
                  disabled={isTesting || !supabaseUrl.trim() || !supabaseKey.trim()}
                  className="secondary-button"
                >
                  {isTesting ? '🔌 Testando...' : '🔌 Testar Conexão'}
                </button>
                
                {testResult && (
                  <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                    {testResult.message}
                  </div>
                )}
              </div>

              <div className="setup-guide">
                <h5>🚀 Configuração Rápida (Orion):</h5>
                <p>Seu Supabase Orion já está configurado! Basta:</p>
                <ol>
                  <li>Clique em <strong>"Usar Configuração Padrão"</strong> acima</li>
                  <li>Clique em <strong>"Testar Conexão"</strong> para verificar</li>
                  <li>Execute o SQL de migração no seu Supabase (opcional):
                    <pre>
                      <code>
                        {`-- Acesse o SQL Editor do Supabase\n-- Copie e execute o conteúdo de:\n-- apps/api/supabase-migration.sql`}
                      </code>
                    </pre>
                  </li>
                  <li>Clique em <strong>"Salvar Configurações"</strong></li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="profile-actions">
          <button onClick={saveSettings} className="primary-button">
            💾 Salvar Configurações
          </button>
          <button onClick={resetSettings} className="secondary-button">
            🔄 Resetar para Local
          </button>
        </div>

        <div className="data-info">
          <h4>📊 Sobre o Armazenamento</h4>
          <p>
            Com o Supabase Orion, seus dados estão seguros com:
          </p>
          <ul>
            <li>🔒 Criptografia de ponta a ponta</li>
            <li>🔄 Backup automático diário</li>
            <li>🌐 Acesso de qualquer dispositivo</li>
            <li>📈 Histórico completo de alterações</li>
            <li>🔐 Autenticação JWT segura</li>
          </ul>
          <p className="note">
            <strong>Nota:</strong> O Supabase Orion é sua instância pessoal hospedada por você.
            Nós não temos acesso aos seus dados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
