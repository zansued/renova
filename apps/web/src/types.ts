export interface EmotionEntry {
  id: string;
  title: string;
  emotion: string;
  intensity: number;
  triggers: string;
  strategies: string;
  createdAt: string;
  analysis?: EmotionAnalysis;
  metadata?: {
    date?: string;
    time?: string;
    tags?: string[];
    physicalTriggers?: string;
    thoughtPattern?: string;
    verse?: string;
    moodScale?: number;
  };
}

export interface EmotionAnalysis {
  emotion: string;
  intensidade: number;
  cached: boolean;
}

export const EMOTION_SUGGESTIONS = [
  'Gratidão', 'Esperança', 'Paz', 'Alegria', 'Amor',
  'Tristeza', 'Ansiedade', 'Raiva', 'Medo', 'Frustração',
  'Culpa', 'Vergonha', 'Orgulho', 'Entusiasmo', 'Cansaço',
  'Inspiração', 'Calma', 'Decepção', 'Saudade', 'Confusão'
];

export const THOUGHT_PATTERNS = [
  'Pensamento catastrófico',
  'Generalização exagerada',
  'Pensamento tudo-ou-nada',
  'Personalização excessiva',
  'Leitura mental',
  'Filtro mental negativo',
  'Desqualificação do positivo',
  'Raciocínio emocional',
  'Rotulagem',
  'Culpabilização'
];

export const VERSES = [
  'Filipenses 4:6-7 - "Não andem ansiosos... a paz de Deus guardará vosso coração"',
  'Salmo 23:4 - "Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum"',
  '2 Timóteo 1:7 - "Deus não nos deu espírito de covardia, mas de poder, amor e equilíbrio"',
  'Isaías 41:10 - "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus"',
  'Romanos 8:28 - "Todas as coisas cooperam para o bem daqueles que amam a Deus"',
  'Mateus 11:28 - "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei"',
  '1 Pedro 5:7 - "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós"',
  'Josué 1:9 - "Sê forte e corajoso; não temas, nem te espantes, porque o SENHOR teu Deus é contigo"'
];
