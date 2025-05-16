/**
 * In-memory cache middleware for API responses
 * For production, consider using Redis or another distributed cache
 */

// Simple in-memory cache
const cache = new Map();

/**
 * Time-based cache expiration handler
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 */
const setExpiration = (key, ttl) => {
  setTimeout(() => {
    cache.delete(key);
  }, ttl * 1000);
};

/**
 * Cache middleware generator
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds (default: 60)
 * @param {Function} options.keyGenerator - Custom function to generate cache key (optional)
 * @returns {Function} Express middleware
 */
const cacheMiddleware = ({ ttl = 60, keyGenerator = null } = {}) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key - default: URL + query params
    const key = keyGenerator 
      ? keyGenerator(req) 
      : `${req.originalUrl || req.url}`;
    
    // Check if response exists in cache
    if (cache.has(key)) {
      const { body, contentType, statusCode } = cache.get(key);
      
      // Set content type and status
      res.setHeader('Content-Type', contentType);
      res.setHeader('X-Cache', 'HIT');
      
      return res.status(statusCode).send(body);
    }
    
    // Override res.send to cache the response
    const originalSend = res.send;
    
    res.send = function(body) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          body,
          contentType: res.get('Content-Type') || 'application/json',
          statusCode: res.statusCode
        });
        
        // Set expiration
        setExpiration(key, ttl);
      }
      
      // Add cache miss header
      res.setHeader('X-Cache', 'MISS');
      
      // Call original send
      return originalSend.call(this, body);
    };
    
    next();
  };
};

/**
 * Clear the entire cache
 */
const clearCache = () => {
  cache.clear();
};

/**
 * Delete a specific key from cache
 * @param {string} key - Cache key to delete
 */
const invalidateCache = (key) => {
  cache.delete(key);
};

/**
 * Delete cache entries by pattern
 * @param {RegExp} pattern - Regular expression to match cache keys
 */
const invalidateCacheByPattern = (pattern) => {
  for (const key of cache.keys()) {
    if (pattern.test(key)) {
      cache.delete(key);
    }
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
  invalidateCache,
  invalidateCacheByPattern
};
