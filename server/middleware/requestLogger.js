const logger = require('../utils/logger');

/**
 * Middleware to log details about each API request
 */
const requestLogger = (req, res, next) => {
    // Start time tracking
    const start = process.hrtime();
    
    // Get original send function
    const originalSend = res.send;
    
    // Override send
    res.send = function(body) {
        // Calculate response time
        const diff = process.hrtime(start);
        const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2); // in ms
        
        // Get response data for logging
        let responseData;
        if (body && typeof body === 'string' && body.length < 1000) {
            try {
                responseData = JSON.parse(body);
            } catch (e) {
                responseData = { size: body.length };
            }
        } else if (body) {
            responseData = { size: typeof body === 'string' ? body.length : 'non-string response' };
        }

        // Build log object
        const logObject = {
            type: 'request',
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.originalUrl,
            params: Object.keys(req.params).length ? req.params : undefined,
            query: Object.keys(req.query).length ? req.query : undefined,
            status: res.statusCode,
            responseTime: `${responseTime}ms`,
            userAgent: req.headers['user-agent'],
            userId: req.user?._id || 'unauthenticated',
        };

        // Add request body for non-file uploads (excluding sensitive data)
        if (req.body && !req.is('multipart/form-data')) {
            const safeBody = { ...req.body };
            
            // Remove sensitive information
            if (safeBody.password) safeBody.password = '[REDACTED]';
            if (safeBody.token) safeBody.token = '[REDACTED]';
            if (safeBody.accessToken) safeBody.accessToken = '[REDACTED]';
            
            logObject.body = safeBody;
        }

        // Log successful responses at info level, errors at warn/error level
        if (res.statusCode >= 500) {
            logger.error(logObject);
        } else if (res.statusCode >= 400) {
            logger.warn(logObject);
        } else {
            logger.info(logObject);
        }

        // Call original send
        return originalSend.call(this, body);
    };
    
    next();
};

module.exports = requestLogger;
