export interface EmotionEntry {
  id: string;
  title: string;
  emotion: string;
  intensity: number;
  triggers: string;
  strategies: string;
  createdAt: string;
  analysis?: EmotionAnalysis;
}

export interface EmotionAnalysis {
  emotion: string;
  intensidade: number;
  cached: boolean;
}
