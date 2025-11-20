import express from "express";
import redis from "../config/redis.js";
import { z } from "../utils/zod-lite.js";

const router = express.Router();

const analyzeSchema = z.object({
  texto: z
    .string()
    .trim()
    .min(1, "Texto é obrigatório")
    .max(500, "Texto excede o limite de 500 caracteres")
    .regex(/^[\p{L}\p{N}\p{P}\p{Zs}\s]+$/u, "Texto contém caracteres inválidos"),
});

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const requestLog = new Map();

const rateLimiter = (req, res, next) => {
  const now = Date.now();
  const ip = req.ip || req.connection?.remoteAddress || "unknown";

  const events = (requestLog.get(ip) || []).filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (events.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Limite de requisições atingido. Tente novamente em instantes." });
  }

  events.push(now);
  requestLog.set(ip, events);
  next();
};

router.post("/", rateLimiter, async (req, res) => {
  const parsed = analyzeSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const message = parsed.error.errors.map(err => err.message).join("; ");
    return res.status(400).json({ error: message });
  }

  const normalizedTexto = parsed.data.texto;

  // Verifica se já existe cache
  const cacheKey = `analyze:${normalizedTexto.toLowerCase()}`;
  const cache = await redis.get(cacheKey);
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
