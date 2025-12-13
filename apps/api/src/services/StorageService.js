import redis from '../config/redis.js';
import { supabaseAdmin } from '../config/supabase.js';

class StorageService {
  constructor() {
    this.useSupabase = process.env.DATABASE_TYPE === 'supabase' && supabaseAdmin;
  }

  async getEntries(userId) {
    if (this.useSupabase) {
      const { data, error } = await supabaseAdmin
        .from('emotion_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar entradas no Supabase:', error);
        throw new Error('Falha ao carregar registros');
      }

      return data || [];
    } else {
      const stored = await redis.get(`entries:${userId}`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async saveEntries(userId, entries) {
    if (this.useSupabase) {
      // Para cada entrada, upsert no Supabase
      const operations = entries.map(entry => {
        const supabaseEntry = {
          id: entry.id,
          user_id: userId,
          title: entry.title,
          emotion: entry.emotion,
          intensity: entry.intensity,
          triggers: entry.triggers,
          strategies: entry.strategies,
          metadata: entry.metadata || {},
          analysis: entry.analysis || null,
          created_at: entry.createdAt || new Date().toISOString()
        };

        return supabaseAdmin
          .from('emotion_entries')
          .upsert(supabaseEntry, { onConflict: 'id' });
      });

      const results = await Promise.all(operations);
      const hasError = results.some(result => result.error);

      if (hasError) {
        console.error('Erro ao salvar entradas no Supabase:', results);
        throw new Error('Falha ao salvar registros');
      }
    } else {
      await redis.set(`entries:${userId}`, JSON.stringify(entries));
    }
  }

  async addEntry(userId, entry) {
    if (this.useSupabase) {
      const supabaseEntry = {
        id: entry.id,
        user_id: userId,
        title: entry.title,
        emotion: entry.emotion,
        intensity: entry.intensity,
        triggers: entry.triggers,
        strategies: entry.strategies,
        metadata: entry.metadata || {},
        analysis: entry.analysis || null,
        created_at: entry.createdAt || new Date().toISOString()
      };

      const { data, error } = await supabaseAdmin
        .from('emotion_entries')
        .insert([supabaseEntry])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar entrada no Supabase:', error);
        throw new Error('Falha ao criar registro');
      }

      return data;
    } else {
      const entries = await this.getEntries(userId);
      entries.unshift(entry);
      await this.saveEntries(userId, entries);
      return entry;
    }
  }

  async updateEntry(userId, entryId, updates) {
    if (this.useSupabase) {
      const supabaseUpdates = {
        ...updates,
        metadata: updates.metadata || {},
        analysis: updates.analysis || null
      };

      const { data, error } = await supabaseAdmin
        .from('emotion_entries')
        .update(supabaseUpdates)
        .eq('id', entryId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar entrada no Supabase:', error);
        throw new Error('Falha ao atualizar registro');
      }

      return data;
    } else {
      const entries = await this.getEntries(userId);
      const index = entries.findIndex(entry => entry.id === entryId);
      
      if (index === -1) throw new Error('Registro não encontrado');
      
      entries[index] = { ...entries[index], ...updates };
      await this.saveEntries(userId, entries);
      return entries[index];
    }
  }

  async deleteEntry(userId, entryId) {
    if (this.useSupabase) {
      const { error } = await supabaseAdmin
        .from('emotion_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao deletar entrada no Supabase:', error);
        throw new Error('Falha ao excluir registro');
      }
    } else {
      const entries = await this.getEntries(userId);
      const remaining = entries.filter(entry => entry.id !== entryId);
      await this.saveEntries(userId, remaining);
    }
  }
}

export default new StorageService();
