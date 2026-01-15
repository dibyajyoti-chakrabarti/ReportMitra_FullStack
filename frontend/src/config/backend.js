export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_BASE_URL) {
  throw new Error("VITE_BACKEND_URL not defined");
}
