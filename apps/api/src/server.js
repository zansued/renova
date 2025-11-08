import app from './app.js';
import { env } from './config/env.js';
import { getRedisClient } from './config/redis.js';
import { getSupabaseClient } from './config/supabase.js';

async function bootstrap() {
  try {
    // Inicializa conexões para validar as configurações
    getSupabaseClient();
    getRedisClient();

    app.listen(env.port, () => {
      console.log(`Renova API ouvindo na porta ${env.port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar a API:', error.message);
    process.exit(1);
  }
}

bootstrap();
