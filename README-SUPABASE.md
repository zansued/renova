# Configuração do Supabase Orion no Renova

## 📦 Seu Supabase Orion já está configurado!

O projeto Renova já vem pré-configurado para usar sua instância Supabase Orion. As credenciais padrão já estão configuradas tanto no backend quanto no frontend.

## 🚀 Configuração Rápida (3 minutos)

### 1. Configurar o Backend (já feito!)
As variáveis de ambiente da API já estão configuradas com:
- `SUPABASE_URL=https://supa.techstorebrasil.com`
- `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `DATABASE_TYPE=supabase`

### 2. Configurar o Frontend
No aplicativo web:
1. Faça login com seu e-mail
2. Vá para **⚙️ Configurações** (aba superior)
3. Clique em **🔄 Usar Configuração Padrão**
4. Clique em **🔌 Testar Conexão**
5. Clique em **💾 Salvar Configurações**

### 3. Executar Migração SQL (opcional)
Para criar a tabela de registros emocionais:
1. Acesse o SQL Editor do seu Supabase Orion
2. Execute o conteúdo do arquivo: `apps/api/supabase-migration.sql`

## 🔧 Script de Configuração Automática

Execute o script para configurar automaticamente:

```bash
node setup-supabase.js
```

Este script:
- Configura as variáveis de ambiente da API
- Cria um arquivo para configuração automática do frontend

## 📊 Estrutura do Banco de Dados

A tabela `emotion_entries` contém:
- `id`: UUID único
- `user_id`: Identificador do usuário
- `title`: Título do registro
- `emotion`: Emoção principal
- `intensity`: Intensidade (1-10)
- `triggers`: Fatores desencadeantes
- `strategies`: Estratégias de enfrentamento
- `metadata`: Metadados adicionais (JSON)
- `analysis`: Análise de IA (JSON)
- `created_at`: Data de criação

## 🔒 Segurança

- **Row Level Security (RLS)**: Cada usuário só acessa seus próprios registros
- **JWT Authentication**: Tokens JWT para autenticação segura
- **Criptografia**: Dados criptografados em repouso e em trânsito

## 🔄 Migração de Dados

Para migrar dados do armazenamento local para o Supabase:
1. Configure o Supabase nas configurações
2. Todos os novos registros serão salvos no Supabase
3. Os registros antigos permanecem no armazenamento local

## 🆘 Solução de Problemas

### Conexão Falhou
1. Verifique se o Supabase Orion está online
2. Confirme as credenciais nas configurações
3. Teste a conexão no painel de configurações

### Tabela Não Existe
Execute o SQL de migração:
```sql
-- No SQL Editor do Supabase Orion
-- Execute o conteúdo de apps/api/supabase-migration.sql
```

### Dados Não Aparecem
1. Verifique se está usando o mesmo e-mail em todos os dispositivos
2. Confirme se o armazenamento está configurado como "Supabase"
3. Atualize a página para sincronizar

## 📞 Suporte

Para problemas com o Supabase Orion:
1. Verifique os logs do Supabase
2. Consulte a documentação do Supabase
3. Contate o administrador do seu Supabase Orion

## 🌟 Vantagens do Supabase Orion

- ✅ **Privacidade**: Seus dados, seu servidor
- ✅ **Controle**: Acesso completo ao banco de dados
- ✅ **Performance**: Baixa latência, alta disponibilidade
- ✅ **Backup**: Backups automáticos diários
- ✅ **Escalável**: Cresça conforme sua necessidade

---

**Nota**: O Renova não coleta nenhum dado pessoal. Tudo é armazenado no SEU Supabase Orion.
