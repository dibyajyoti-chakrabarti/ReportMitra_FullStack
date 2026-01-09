export function getApiUrl(path) {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  return `${backend}/api${path}`;
}
