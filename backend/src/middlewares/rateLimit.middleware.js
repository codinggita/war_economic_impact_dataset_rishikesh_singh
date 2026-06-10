import { HTTP_STATUS } from '../constants/index.js';

/**
 * High-performance, memory-backed custom rate limiting middleware.
 * Track requests by client IP address and block clients who exceed thresholds.
 * 
 * @param {object} options - Config options for the rate limiter
 * @param {number} [options.windowMs=60000] - Duration window of rate limit tracking in milliseconds
 * @param {number} [options.maxLimit=100] - Maximum requests allowed per window
 * @param {string} [options.message='Too many requests.'] - JSON message returned on rate limit block
 * @returns {Function} Express middleware function
 */
export const rateLimiter = (options = {}) => {
  const {
    windowMs = 60000, // Default: 1 minute
    maxLimit = 100,
    message = 'Too many requests, please try again later.'
  } = options;

  // In-memory store for client IP logs
  const ipStore = {};

  return (req, res, next) => {
    // Extract IP from request headers or socket details
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    if (!ipStore[ip]) {
      ipStore[ip] = {
        count: 1,
        windowStart: now,
      };
      return next();
    }

    const client = ipStore[ip];

    // If tracking window has expired, reset counts
    if (now - client.windowStart > windowMs) {
      client.count = 1;
      client.windowStart = now;
      return next();
    }

    client.count += 1;

    // Check if limit is exceeded
    if (client.count > maxLimit) {
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message,
        retryAfterMs: windowMs - (now - client.windowStart),
      });
    }

    return next();
  };
};

// ==========================================
// Limiter Profiles Configuration
// ==========================================

export const generalLimiter = rateLimiter({
  windowMs: 60000, // 1 minute
  maxLimit: 100,
  message: 'General request rate limit exceeded. Please wait a minute.',
});

export const authLimiter = rateLimiter({
  windowMs: 60000, // 1 minute
  maxLimit: 15,
  message: 'Too many authentication attempts. Please wait 1 minute before trying again to prevent brute-force attacks.',
});

export const searchLimiter = rateLimiter({
  windowMs: 60000, // 1 minute
  maxLimit: 30,
  message: 'Excessive search attempts detected. Rate limit exceeded, please wait.',
});

export const adminLimiter = rateLimiter({
  windowMs: 60000, // 1 minute
  maxLimit: 30,
  message: 'Strict admin route rate limit exceeded. Please try again later.',
});
