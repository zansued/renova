import express from "express";
import { randomUUID } from "crypto";
import redis from "../config/redis.js";

const router = express.Router();

const DEFAULT_INTENSITY_RANGE = { min: 1, max: 10 };

const validateString = (value, label, { required = true, maxLength } = {}) => {
  if (required && (typeof value !== "string" || !value.trim())) {
    return `${label} é obrigatório`;
  }

  if (!required && (value === undefined || value === null)) return null;

  if (typeof value !== "string") return `${label} deve ser um texto`;

  const trimmed = value.trim();
  if (trimmed.length === 0 && required) return `${label} é obrigatório`;
  if (maxLength && trimmed.length > maxLength) return `${label} excede o limite de ${maxLength} caracteres`;
  return null;
};

const validateIntensity = intensity => {
  if (typeof intensity !== "number" || Number.isNaN(intensity)) {
    return "Intensidade deve ser um número";
  }

  if (!Number.isInteger(intensity)) {
    return "Intensidade deve ser um número inteiro";
  }

  if (intensity < DEFAULT_INTENSITY_RANGE.min || intensity > DEFAULT_INTENSITY_RANGE.max) {
    return `Intensidade deve estar entre ${DEFAULT_INTENSITY_RANGE.min} e ${DEFAULT_INTENSITY_RANGE.max}`;
  }

  return null;
};

const validateAnalysis = analysis => {
  if (analysis === undefined) return null;

  if (
    typeof analysis !== "object" ||
    analysis === null ||
    typeof analysis.emotion !== "string" ||
    typeof analysis.intensidade !== "number" ||
    typeof analysis.cached !== "boolean"
  ) {
    return "Análise possui um formato inválido";
  }

  if (!analysis.emotion.trim()) return "Análise deve conter a emoção";
  if (!Number.isInteger(analysis.intensidade) || analysis.intensidade < 0 || analysis.intensidade > 100) {
    return "Intensidade da análise deve ser um inteiro entre 0 e 100";
  }

  return null;
};

const validateMetadata = metadata => {
  if (metadata === undefined) return null;
  
  if (typeof metadata !== "object" || metadata === null) {
    return "Metadados devem ser um objeto válido";
  }

  const errors = [];
  
  if (metadata.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)) {
    errors.push("Data deve estar no formato YYYY-MM-DD");
  }
  
  if (metadata.time !== undefined && !/^\d{2}:\d{2}$/.test(metadata.time)) {
    errors.push("Hora deve estar no formato HH:MM");
  }
  
  if (metadata.tags !== undefined && !Array.isArray(metadata.tags)) {
    errors.push("Tags devem ser um array de strings");
  } else if (Array.isArray(metadata.tags)) {
    metadata.tags.forEach((tag, index) => {
      if (typeof tag !== "string") {
        errors.push(`Tag na posição ${index} deve ser uma string`);
      }
    });
  }
  
  if (metadata.moodScale !== undefined) {
    if (typeof metadata.moodScale !== "number" || !Number.isInteger(metadata.moodScale)) {
      errors.push("Escala de humor deve ser um número inteiro");
    } else if (metadata.moodScale < 1 || metadata.moodScale > 10) {
      errors.push("Escala de humor deve estar entre 1 e 10");
    }
  }
  
  if (metadata.physicalTriggers !== undefined && typeof metadata.physicalTriggers !== "string") {
    errors.push("Gatilhos físicos devem ser uma string");
  }
  
  if (metadata.thoughtPattern !== undefined && typeof metadata.thoughtPattern !== "string") {
    errors.push("Padrão de pensamento deve ser uma string");
  }
  
  if (metadata.verse !== undefined && typeof metadata.verse !== "string") {
    errors.push("Versículo deve ser uma string");
  }

  return errors.length > 0 ? errors.join("; ") : null;
};

const ensureUser = (req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  req.userId = userId;
  next();
};

const entriesKey = userId => `entries:${userId}`;

const readEntries = async userId => {
  const stored = await redis.get(entriesKey(userId));
  return stored ? JSON.parse(stored) : [];
};

const writeEntries = async (userId, entries) => {
  await redis.set(entriesKey(userId), JSON.stringify(entries));
};

const validateEntryPayload = (payload, { partial = false } = {}) => {
  const errors = [];

  const titleError = validateString(payload.title, "Título", { required: !partial, maxLength: 120 });
  if (titleError) errors.push(titleError);

  const emotionError = validateString(payload.emotion, "Emoção", { required: !partial, maxLength: 60 });
  if (emotionError) errors.push(emotionError);

  if (!partial || payload.intensity !== undefined) {
    const intensityError = validateIntensity(payload.intensity);
    if (intensityError) errors.push(intensityError);
  }

  const triggersError = validateString(payload.triggers, "Fatores", { required: false, maxLength: 500 });
  if (triggersError) errors.push(triggersError);

  const strategiesError = validateString(payload.strategies, "Estratégias", { required: false, maxLength: 500 });
  if (strategiesError) errors.push(strategiesError);

  const analysisError = validateAnalysis(payload.analysis);
  if (analysisError) errors.push(analysisError);

  const metadataError = validateMetadata(payload.metadata);
  if (metadataError) errors.push(metadataError);

  return errors;
};

const normalizeNewEntry = payload => ({
  title: payload.title.trim(),
  emotion: payload.emotion.trim(),
  intensity: payload.intensity,
  triggers: (payload.triggers ?? "").trim(),
  strategies: (payload.strategies ?? "").trim(),
  analysis: payload.analysis,
  metadata: payload.metadata || {},
});

const normalizeUpdates = payload => {
  const normalized = {};

  if (payload.title !== undefined) normalized.title = payload.title.trim();
  if (payload.emotion !== undefined) normalized.emotion = payload.emotion.trim();
  if (payload.intensity !== undefined) normalized.intensity = payload.intensity;
  if (payload.triggers !== undefined) normalized.triggers = payload.triggers.trim();
  if (payload.strategies !== undefined) normalized.strategies = payload.strategies.trim();
  if (payload.analysis !== undefined) normalized.analysis = payload.analysis;
  if (payload.metadata !== undefined) normalized.metadata = payload.metadata;

  return normalized;
};

router.use(ensureUser);

router.get("/", async (req, res) => {
  const entries = await readEntries(req.userId);
  res.json(entries);
});

router.post("/", async (req, res) => {
  const errors = validateEntryPayload(req.body ?? {});
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  const entries = await readEntries(req.userId);
  const newEntry = {
    ...normalizeNewEntry(req.body),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  entries.unshift(newEntry);
  await writeEntries(req.userId, entries);

  res.status(201).json(newEntry);
});

router.put("/:id", async (req, res) => {
  const updates = req.body ?? {};
  const errors = validateEntryPayload(updates, { partial: true });

  if (Object.keys(updates).length === 0) {
    errors.push("Nenhum campo para atualizar foi enviado");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  const entries = await readEntries(req.userId);
  const index = entries.findIndex(entry => entry.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Registro não encontrado" });
  }

  entries[index] = { ...entries[index], ...normalizeUpdates(updates) };
  await writeEntries(req.userId, entries);

  res.json(entries[index]);
});

router.delete("/:id", async (req, res) => {
  const entries = await readEntries(req.userId);
  const remaining = entries.filter(entry => entry.id !== req.params.id);

  if (remaining.length === entries.length) {
    return res.status(404).json({ error: "Registro não encontrado" });
  }

  await writeEntries(req.userId, remaining);
  res.status(204).end();
});

export default router;
