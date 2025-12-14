import express from "express";
import dotenv from "dotenv";
import analyzeRouter from "./routes/analyze.js";
import entriesRouter from "./routes/entries.js";

dotenv.config();

const app = express();
app.use(express.json());

// Adicionar CORS para desenvolvimento
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-user-id');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/analyze", analyzeRouter);
app.use("/entries", entriesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Modo de banco: ${process.env.DATABASE_TYPE || 'redis'}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL ? 'Configurada' : 'Não configurada'}`);
});
