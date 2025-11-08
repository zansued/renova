import { getSupabaseClient } from '../config/supabase.js';
import { getRedisClient } from '../config/redis.js';

const TABLE_NAME = 'thoughts';

export async function createThought({ texto, emocao, usuario_id }) {
  if (!texto || !emocao || !usuario_id) {
    const error = new Error('Campos obrigatórios ausentes: texto, emocao, usuario_id.');
    error.status = 400;
    throw error;
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([{ texto, emocao, usuario_id }])
    .select()
    .single();

  if (error) {
    error.status = 500;
    throw error;
  }

  const redis = getRedisClient();
  await redis.set(cacheKey(data.id), JSON.stringify(data), 'EX', 60 * 5);

  return data;
}

export async function getThoughtById(id) {
  if (!id) {
    const error = new Error('ID do pensamento é obrigatório.');
    error.status = 400;
    throw error;
  }

  const redis = getRedisClient();
  const cached = await redis.get(cacheKey(id));
  if (cached) {
    return JSON.parse(cached);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      const notFound = new Error('Pensamento não encontrado.');
      notFound.status = 404;
      throw notFound;
    }

    error.status = 500;
    throw error;
  }

  await redis.set(cacheKey(id), JSON.stringify(data), 'EX', 60 * 5);

  return data;
}

function cacheKey(id) {
  return `thought:${id}`;
}
