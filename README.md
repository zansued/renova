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

## 📁 Estrutura do monorepo

```
.
├── apps/
│   ├── api/        # API em Node.js/Express
│   └── mobile/     # Aplicativo Expo/React Native
├── packages/       # Futuro espaço para módulos compartilhados
├── .editorconfig   # Padrões de formatação em múltiplos editores
├── .eslintrc.json  # Regras básicas de linting
├── .nvmrc          # Versão do Node recomendada
├── .prettierrc     # Configuração do Prettier
├── package.json    # Scripts e configuração do PNPM workspaces
└── pnpm-workspace.yaml
```

Cada aplicativo possui o seu próprio `package.json` e `README.md` com instruções específicas.

---

## 🚀 Como começar

1. Garanta que você está utilizando a versão recomendada do Node (`nvm use` irá ler o arquivo `.nvmrc`).
2. Instale o PNPM (caso ainda não possua): `npm install -g pnpm`.
3. Instale as dependências do monorepo: `pnpm install`.
4. Execute os scripts conforme necessário:
   - `pnpm dev` – Executa os modos de desenvolvimento dos apps registrados.
   - `pnpm lint` – Roda o linting em cada app.
   - `pnpm test` – Executa os testes de cada app.

Para rodar um app específico, use filtros do PNPM, por exemplo:

- `pnpm dev --filter @renova/mobile`
- `pnpm dev --filter @renova/api`

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
