/**
 * JAN_SAHAYAK — IN-MEMORY SLIDING WINDOW RATE LIMITER
 * Protects endpoints from abuse and prevents cost runaway on AI models.
 */

class SlidingWindowLimiter {
  constructor() {
    this.hits = new Map(); // key -> Array of timestamps
    // Periodic cleanup of expired records every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  isRateLimited(key, limit, windowMs) {
    const now = Date.now();
    const timestamps = this.hits.get(key) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

    if (validTimestamps.length >= limit) {
      this.hits.set(key, validTimestamps);
      return { limited: true, retryAfterSeconds: Math.ceil((validTimestamps[0] + windowMs - now) / 1000) };
    }

    validTimestamps.push(now);
    this.hits.set(key, validTimestamps);
    return { limited: false, remaining: limit - validTimestamps.length };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.hits.entries()) {
      const valid = timestamps.filter(ts => now - ts < 15 * 60 * 1000);
      if (valid.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, valid);
      }
    }
  }
}

const limiter = new SlidingWindowLimiter();

export function createRateLimiter({
  windowMs = 60 * 1000,
  max = 60,
  message = 'Too many requests, please try again later.',
  keyPrefix = 'global'
}) {
  return (req, res, next) => {
    // In test environment or internal calls, skip rate limiting
    if (process.env.NODE_ENV === 'test' || req.headers['x-internal-test'] === 'true') {
      return next();
    }

    const clientIp = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';
    const key = `${keyPrefix}:${clientIp}:${req.user?.id || 'anon'}`;

    const { limited, retryAfterSeconds, remaining } = limiter.isRateLimited(key, max, windowMs);

    res.setHeader('X-RateLimit-Limit', max);
    if (remaining !== undefined) res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining));

    if (limited) {
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfterSeconds
        }
      });
    }

    next();
  };
}

// Pre-configured rate limiters
export const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts. Please try again after 1 minute.',
  keyPrefix: 'auth'
});

export const aiEndpointLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'AI inference rate limit reached. Please wait a moment before sending another analysis request.',
  keyPrefix: 'ai'
});

export const complaintSubmitLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 25,
  message: 'Grievance submission limit reached. Please wait before filing additional reports.',
  keyPrefix: 'complaint'
});

export const fileUploadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Evidence upload rate limit reached. Please try again in 1 minute.',
  keyPrefix: 'upload'
});
