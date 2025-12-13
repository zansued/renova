-- Criação da tabela de registros emocionais no Supabase
CREATE TABLE IF NOT EXISTS emotion_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  emotion TEXT NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
  triggers TEXT,
  strategies TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cria índice para melhor performance nas buscas por usuário
CREATE INDEX IF NOT EXISTS idx_emotion_entries_user_id ON emotion_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_entries_created_at ON emotion_entries(created_at DESC);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_emotion_entries_updated_at ON emotion_entries;
CREATE TRIGGER update_emotion_entries_updated_at
  BEFORE UPDATE ON emotion_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Política de segurança (Row Level Security)
ALTER TABLE emotion_entries ENABLE ROW LEVEL SECURITY;

-- Política para usuários acessarem apenas seus próprios registros
CREATE POLICY "Usuários podem acessar apenas seus próprios registros" 
  ON emotion_entries 
  FOR ALL 
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Política para service role (permite todas as operações)
CREATE POLICY "Service role tem acesso total" 
  ON emotion_entries 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
