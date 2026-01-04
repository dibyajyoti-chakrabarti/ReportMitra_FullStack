export function getApiUrl(path) {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  
  // Add /api prefix only for production
  // Check if it's production by looking for the production domain or checking mode
  const isProduction = backend.includes('reportmitra.in') || 
                       import.meta.env.MODE === 'production';
  
  const apiPrefix = isProduction ? '/api' : '';
  
  return `${backend}${apiPrefix}${path}`;
}