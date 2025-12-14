const normalize = (url: string) => url.replace(/\/$/, '');

export const API_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return normalize(envUrl);

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalize(`${window.location.origin}/api`);
  }

  return 'http://localhost:3000';
})();
