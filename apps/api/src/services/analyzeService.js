export async function analyzeThought({ texto, emocao }) {
  if (!texto || !emocao) {
    const error = new Error('Campos obrigatórios ausentes: texto e emocao.');
    error.status = 400;
    throw error;
  }

  return {
    resumo: `Resumo do pensamento: ${texto.substring(0, 140)}`,
    emocaoIdentificada: emocao,
    sugestao: 'Pratique uma técnica de respiração e reavalie o pensamento com evidências positivas.',
    insights: [
      'Identifique gatilhos para esta emoção.',
      'Liste evidências que apoiem e contradigam o pensamento.',
    ],
  };
}
