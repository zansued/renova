# Guia de deploy em VPS com subdomínio

Este guia mostra como executar a API, o front-end e um proxy reverso com HTTPS
em uma VPS usando Docker Compose. O exemplo abaixo assume dois subdomínios:

- `app.seudominio.com` para o front-end (Vite/NGINX)
- `api.seudominio.com` para a API Express

> Use os subdomínios que preferir: basta ajustar as variáveis de ambiente
> indicadas mais adiante.

## Pré-requisitos

1. VPS com Docker e Docker Compose Plugin instalados (Ubuntu 22.04+ funciona bem).
2. DNS apontando `app.seudominio.com` e `api.seudominio.com` para o IP da VPS.
3. Portas 80 e 443 liberadas no firewall para que o proxy consiga emitir
   certificados TLS com Let's Encrypt.

## Passo a passo

1. **Clonar o repositório**

   ```bash
   git clone https://github.com/<sua-org>/renova.git
   cd renova
   ```

2. **Gerar arquivos `.env` internos (opcional)**

   Se quiser personalizar as variáveis utilizadas pelos apps fora do Docker,
   rode `npm run setup`. Para o deploy em Docker basta definir um arquivo de
   ambiente externo.

3. **Criar um arquivo de ambiente para a VPS**

   Crie `renova/.env.vps` com os valores adequados para o seu domínio:

   ```env
   REDIS_PASSWORD=uma_senha_forte
   VITE_API_URL=https://api.seudominio.com
   APP_DOMAIN=app.seudominio.com
   API_DOMAIN=api.seudominio.com
   CADDY_EMAIL=admin@seudominio.com
   ```

   - `REDIS_PASSWORD`: senha usada pelo Redis e pela API.
   - `VITE_API_URL`: URL pública da API que o front-end usará em build.
   - `APP_DOMAIN` e `API_DOMAIN`: subdomínios desejados para web/API.
   - `CADDY_EMAIL`: e-mail que receberá notificações do Let's Encrypt.

4. **Subir os containers com o proxy**

   O arquivo `docker-compose.vps.yml` adiciona um proxy Caddy que termina TLS e
   encaminha o tráfego para os serviços internos. Execute:

   ```bash
   docker compose --env-file .env.vps \
     -f docker-compose.yml -f docker-compose.vps.yml \
     up -d --build
   ```

   O Compose padrão continua buildando os apps, enquanto a sobreposição
   (`docker-compose.vps.yml`) remove as exposições diretas de porta dos serviços
   e publica apenas o proxy na 80/443.

5. **Verificar**

   - Acesse `https://app.seudominio.com` para abrir o front-end.
   - O proxy obtém automaticamente certificados TLS válidos com Let's Encrypt.
   - Os logs do Caddy podem ser vistos via `docker compose logs -f reverse-proxy`.

6. **Atualizações**

   Para atualizar o código, faça `git pull` e repita o comando do passo 4 com o
   flag `--build` para gerar novas imagens. O Compose recriará apenas os
   serviços que mudaram.

## Estrutura gerada

```
renova/
├── docker-compose.yml          # Serviços principais (Redis/API/Web)
├── docker-compose.vps.yml      # Proxy + ajustes para VPS
└── deploy/Caddyfile            # Template usado pelo Caddy
```

Com isso você tem um ambiente pronto para produção em uma VPS com subdomínios
separados para o front-end e para a API, ambos protegidos por HTTPS automático.
