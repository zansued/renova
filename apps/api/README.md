# Renova API

API REST em Node.js (Express) responsável por registrar pensamentos e executar análises cognitivas iniciais para o projeto Renova.

## Pré-requisitos

- Node.js >= 18
- PNPM, NPM ou Yarn
- Instâncias configuradas do Supabase e Redis

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `apps/api` com as seguintes variáveis (veja `.env.example` para valores de referência):

```
PORT=3000
SUPABASE_URL=https://<sua-instancia>.supabase.co
SUPABASE_KEY=<sua-chave-de-api>
REDIS_URL=redis://<usuario>:<senha>@<host>:<porta>/<db>
```

> A chave utilizada deve ter permissão para inserir registros na tabela `thoughts` do Supabase. Para desenvolvimento local, você pode aproveitar os valores de exemplo fornecidos em `.env.example`.

## Instalação

```
cd apps/api
npm install
```

## Execução

Inicie o servidor em modo desenvolvimento:

```
npm run dev
```

Para executar em produção:

```
npm start
```

## Rotas principais

- `POST /thoughts` — registra um pensamento com `texto`, `emocao` e `usuario_id` no Supabase.
- `GET /thoughts/:id` — consulta um pensamento específico (com cache em Redis).
- `POST /analyze` — retorna uma análise cognitiva mockada para um pensamento informado.

Use o endpoint `GET /health` para verificar se a API está ativa.
