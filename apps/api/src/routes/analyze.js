import express from "express";
import redis from "../config/redis.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { texto } = req.body ?? {};
  if (typeof texto !== "string" || !texto.trim()) {
    return res.status(400).json({ error: "Texto é obrigatório e deve ser uma string" });
  }

  const normalizedTexto = texto.trim();
  if (normalizedTexto.length > 500) {
    return res.status(400).json({ error: "Texto excede o limite de 500 caracteres" });
  }

  // Verifica se já existe cache
  const cache = await redis.get(texto);
  if (cache) {
    const cachedResult = JSON.parse(cache);
    return res.json({ cached: true, ...cachedResult });
  }

  // Simula análise emocional
  const resultado = {
    texto: normalizedTexto,
    emocao: "esperança",
    intensidade: Math.floor(Math.random() * 100),
  };

  // Armazena no cache por 10 minutos
  await redis.set(cacheKey, JSON.stringify(resultado), "EX", 600);

  res.json({ cached: false, ...resultado });
});

export default router;
