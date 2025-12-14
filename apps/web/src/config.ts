const normalize = (url: string) => url.replace(/\/$/, '');

export const API_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return normalize(envUrl);

  // No ambiente de desenvolvimento, apontar para localhost:3000
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }

  // Em produção, tentar inferir a partir da origem
  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalize(`${window.location.origin}/api`);
  }

  return 'http://localhost:3000';
})();

// Verificar se a API está acessível
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};
