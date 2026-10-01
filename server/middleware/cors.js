/**
 * JAN_SAHAYAK — PRODUCTION CORS MIDDLEWARE
 * Restricts cross-origin requests to configured domains.
 * Configurable via ALLOWED_ORIGINS environment variable.
 */

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3737',
  'http://127.0.0.1:3737',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

export function configureCors() {
  const envOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const allowedOrigins = new Set([...DEFAULT_DEV_ORIGINS, ...envOrigins]);

  return (req, res, next) => {
    const origin = req.headers.origin;

    // Allow requests with no origin (like mobile apps, curl, same-origin, or server-to-server)
    if (!origin) {
      return next();
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const isAllowed = allowedOrigins.has(origin) || (isDev && (origin.includes('localhost') || origin.includes('127.0.0.1')));

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

      if (req.method === 'OPTIONS') {
        return res.status(204).end();
      }
      return next();
    }

    if (isDev) {
      // In development, log a warning but permit the request to avoid blocking pair programming
      console.warn(`[CORS Warning] Origin "${origin}" not explicitly in ALLOWED_ORIGINS. Allowing in development mode.`);
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      if (req.method === 'OPTIONS') {
        return res.status(204).end();
      }
      return next();
    }

    // In strict production, reject unauthorized origin
    return res.status(403).json({
      success: false,
      error: {
        code: 'CORS_FORBIDDEN',
        message: `Origin ${origin} is not permitted by CORS policy.`
      }
    });
  };
}
