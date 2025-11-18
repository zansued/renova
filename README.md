# 🧠 Renova

Aplicativo open-source de **autocuidado emocional** e **terapia cognitivo-comportamental (TCC)** com princípios cristãos.  
Baseado em **Romanos 12:2** – “Transformai-vos pela renovação da mente”.

---

## ✝️ Propósito

O **Renova** nasceu do desejo de unir **ciência psicológica** e **sabedoria espiritual** para ajudar pessoas a reconhecer, compreender e reprogramar seus pensamentos disfuncionais.  
Inspirado pela *Terapia Cognitivo-Comportamental (TCC)* e pela *teologia da mente renovada*, o projeto busca oferecer ferramentas práticas de autoconhecimento, esperança e transformação.

---

## 📘 Versículo-chave

> “E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento.”  
> — *Romanos 12:2*

---

## ⚙️ Stack técnica (planejada)

- **Front-end:** React Native + Expo  
- **Back-end:** Node.js + Express  
- **Banco de dados:** PostgreSQL ou Supabase  
- **IA opcional:** GPT API (Codex) para análise de padrões de pensamento  
- **Hospedagem:** Docker + Render / Railway / VPS  

---

## 💡 Funcionalidades previstas

- Registro diário de pensamentos e emoções  
- Identificação de distorções cognitivas  
- Sugestões automáticas de reestruturação cognitiva  
- Espaço de reflexão devocional (versículos e orações guiadas)  
- Dashboard com progresso emocional e espiritual  
- Notificações com lembretes de meditação e gratidão  

---

## 🤝 Como contribuir

1. Faça um *fork* do repositório.  
2. Crie uma *branch* com o nome da sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).  
3. Faça *commit* das alterações (`git commit -m "Adiciona nova funcionalidade"`).  
4. Faça *push* para o seu fork (`git push origin feature/nova-funcionalidade`).  
5. Abra um *Pull Request* aqui no repositório principal.

---

## 🧰 Scripts unificados com npm workspaces

Agora é possível instalar todas as dependências e subir API + frontend com poucos comandos a partir da raiz:

1. Execute `npm install` uma única vez para instalar os workspaces `apps/api` e `apps/web`.
2. Rode `npm run dev` para iniciar os dois serviços em paralelo (saídas prefixadas em `[api]` e `[web]`).
3. Prefere apenas um serviço? Use `npm run dev:api` ou `npm run dev:web`.
4. Para gerar builds, execute `npm run build` (o comando percorre todos os workspaces que tiverem script `build`).
5. Depois de gerar o build do frontend, `npm run start` levanta a API em modo `start` e um preview estático do Vite.

> Esses scripts funcionam mesmo fora do Docker e eliminam a necessidade de abrir vários terminais manualmente.

## ⚙️ Setup automático dos arquivos `.env`

Antes de rodar qualquer serviço, execute:

```bash
npm run setup
```

Esse comando copia todos os `.env.example` para `.env` (sem sobrescrever arquivos existentes), além de gerar uma senha aleatória para `REDIS_PASSWORD` e exibir o valor gerado no terminal. Se quiser recriar algum arquivo, apague o `.env` correspondente e rode o comando novamente.

---

## 🌍 Demo hospedada em GitHub Pages

Todo commit na branch `main` dispara o workflow **Deploy demo to GitHub Pages**, que compila `apps/web` e publica o conteúdo em `https://<seu-usuario>.github.io/renova/`. Para que o frontend saiba qual API usar, defina o secret `DEMO_API_URL` no repositório (por exemplo, apontando para uma instância limitada de `/analyze`). Caso o secret não exista, o build usa `https://renova-api-demo.example.com` como valor padrão – você pode atualizar esse domínio a qualquer momento.

> Após o primeiro deploy, basta ativar o GitHub Pages com a fonte “GitHub Actions” nas configurações do repositório para que o link público fique ativo.

---

## 📜 Licença

Distribuído sob a licença **GNU General Public License v3.0**.  
Você é livre para usar, modificar e redistribuir, desde que mantenha a mesma licença e os créditos do projeto.

---

## 🙌 Autor

**Guilherme Zanini de Sá**  
Escritor cristão, teólogo e criador de conteúdo.  
Apaixonado por unir fé, razão e tecnologia para inspirar transformação.  

## 🚀 Backend (apps/api)

Para executar o backend Express localizado em `apps/api`:

1. Instale as dependências com `npm install` (na raiz ou dentro de `apps/api`).
2. Configure as variáveis de ambiente executando `npm run setup` na raiz (ou copie `.env.example` manualmente, se preferir) e ajuste os valores conforme necessário.
2. Configure as variáveis de ambiente copiando `.env.example` para `.env` e ajustando, se necessário.
3. Garanta acesso a uma instância Redis (ex.: serviço VoiceNet) usando as variáveis `REDIS_HOST`, `REDIS_PORT` e `REDIS_PASSWORD`.
4. Execute `npm run dev` para iniciar o servidor (ou `npm run dev:api` na raiz). Ao conectar, o console exibirá **"Redis conectado com sucesso"**.

As variáveis relevantes no `.env.example` são:

```
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redispass_Q6z9Bf82MpLmX4vw
```

## 🌸 Frontend web (apps/web)

O projeto agora conta com um front-end web acessível, desenvolvido em React + Vite, com uma interface em tons pastéis para registro emocional completo.

### Como rodar

1. Entre em `apps/web` (opcional se você já está na raiz).
2. Instale as dependências com `npm install` (ou apenas `npm install` na raiz, que já cobre o workspace).
3. Ajuste o arquivo `.env` criado pelo `npm run setup` (ou crie um novo manualmente) para configurar a variável `VITE_API_URL` apontando para o backend (`http://localhost:3000` por padrão).
3. Crie um arquivo `.env` (opcional) para configurar a variável `VITE_API_URL` apontando para o backend (`http://localhost:3000` por padrão).
4. Execute `npm run dev` para abrir o app em `http://localhost:5173` (ou `npm run dev:web` na raiz para obter o mesmo resultado).

### Recursos disponíveis

- Autenticação simplificada por e-mail com persistência local.
- CRUD completo de registros emocionais com salvamento no `localStorage`.
- Integração com o endpoint `/analyze` do backend para obter análises de IA.
- Layout responsivo com foco em acessibilidade e contraste suave em cores pastéis.

## 🚢 Executando tudo com Docker

Para quem quiser testar o Renova rapidamente, o repositório já inclui Dockerfiles para o backend, frontend e um `docker-compose.yml` que orquestra toda a stack (Redis incluso).

### Pré-requisitos

- Docker
- Docker Compose (ou `docker compose` integrado ao Docker Desktop)

### Passos

1. Na raiz do projeto, execute:

   ```bash
   docker compose up --build
   ```

2. A pilha iniciará com os seguintes serviços/p portas:
   - **Redis** em `localhost:6379` (senha padrão `redispass_Q6z9Bf82MpLmX4vw`).
   - **API** em `http://localhost:3000`.
   - **Frontend** servido pelo Nginx em `http://localhost:8080`.

3. Abra `http://localhost:8080` no navegador para usar o app. O frontend já aponta para a API interna usando a variável `VITE_API_URL` definida no `docker-compose.yml`.

> 💡 Quer apontar para outra API ou senha do Redis? Use `VITE_API_URL` e `REDIS_PASSWORD` como variáveis de ambiente ao rodar `docker compose`, por exemplo `VITE_API_URL=https://sua-api docker compose up`.

---

### 🌐 Deploy em VPS com subdomínio e HTTPS

Para hospedar o Renova em uma VPS com domínio próprio, utilize o arquivo
`docker-compose.vps.yml`, que adiciona um proxy Caddy com TLS automático e
publica o frontend e a API em subdomínios separados (ex.: `app.seudominio.com`
e `api.seudominio.com`). O passo a passo completo, incluindo o template da
`Caddyfile`, está documentado em [`docs/VPS_SETUP.md`](docs/VPS_SETUP.md).

---

## 📦 Imagens Docker publicadas (GHCR)

Sempre que a branch `main` recebe commits (ou quando você dispara manualmente `workflow_dispatch`), o workflow **Publish Docker images** gera e publica imagens prontas no [GitHub Container Registry (GHCR)](https://ghcr.io):

- `ghcr.io/<seu-usuario>/renova-api`
- `ghcr.io/<seu-usuario>/renova-web`

Cada build recebe as tags `latest` e o hash do commit (`:${GITHUB_SHA}`) para facilitar rollbacks. Para testar rapidamente em qualquer servidor com Docker instalado, basta executar:

```bash
docker run -p 3000:3000 ghcr.io/<seu-usuario>/renova-api:latest

docker run -p 8080:80 \
  -e VITE_API_URL=http://host.docker.internal:3000 \
  ghcr.io/<seu-usuario>/renova-web:latest
```

> Essas mesmas imagens podem ser usadas em plataformas como Render, Railway ou Fly.io sem necessidade de clonar o repositório. Basta apontar o deploy para `ghcr.io/<seu-usuario>/renova-*` e configurar as variáveis de ambiente adequadas.
