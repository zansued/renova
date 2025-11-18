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

1. Instale as dependências com `npm install`.
2. Configure as variáveis de ambiente copiando `.env.example` para `.env` e ajustando, se necessário.
3. Garanta acesso a uma instância Redis (ex.: serviço VoiceNet) usando as variáveis `REDIS_HOST`, `REDIS_PORT` e `REDIS_PASSWORD`.
4. Execute `npm run dev` para iniciar o servidor. Ao conectar, o console exibirá **"Redis conectado com sucesso"**.

As variáveis relevantes no `.env.example` são:

```
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redispass_Q6z9Bf82MpLmX4vw
```

## 🌸 Frontend web (apps/web)

O projeto agora conta com um front-end web acessível, desenvolvido em React + Vite, com uma interface em tons pastéis para registro emocional completo.

### Como rodar

1. Entre em `apps/web`.
2. Instale as dependências com `npm install`.
3. Crie um arquivo `.env` (opcional) para configurar a variável `VITE_API_URL` apontando para o backend (`http://localhost:3000` por padrão).
4. Execute `npm run dev` para abrir o app em `http://localhost:5173`.

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
