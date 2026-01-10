export function getApiUrl(path) {
  const backend = import.meta.env.VITE_BACKEND_URL;

  if (!backend) {
    throw new Error("VITE_BACKEND_URL is not defined at build time");
  }

  return `${backend}/api${path}`;
}
