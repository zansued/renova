import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "redispass_Q6z9Bf82MpLmX4vw",
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => console.log("Redis conectado com sucesso"));
redis.on("error", (err) => console.error("Erro no Redis:", err));

export default redis;
