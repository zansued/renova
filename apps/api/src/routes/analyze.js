import express from "express";
import redis from "../config/redis.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: "Texto é obrigatório" });

  // Verifica se já existe cache
  const cache = await redis.get(texto);
  if (cache) {
    const cachedResult = JSON.parse(cache);
    return res.json({ cached: true, ...cachedResult });
  }

  // Simula análise emocional
  const resultado = {
    texto,
    emocao: "esperança",
    intensidade: Math.floor(Math.random() * 100),
  };

  // Armazena no cache por 10 minutos
  await redis.set(texto, JSON.stringify(resultado), "EX", 600);

  res.json({ cached: false, ...resultado });
});

export default router;
