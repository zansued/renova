# Frontend Renova

Interface simples para testar a API de análise emocional em ambiente local.

## Como usar

1. Garanta que as dependências da API estejam instaladas e que o servidor esteja rodando:
   ```bash
   cd ../api
   npm install
   npm run dev
   ```
2. Abra o arquivo `index.html` deste diretório diretamente no navegador (duplo clique ou `Ctrl+O` > selecionar arquivo).
3. Digite o texto desejado e clique em **Analisar texto** para enviar a requisição para `http://localhost:3000/analyze`.

Caso prefira servir o arquivo via HTTP, qualquer servidor estático (como `npx serve .`) também funciona.
