/**
 * Rate limiter configuration module
 */
const rateLimit = require('express-rate-limit');
const config = require('../config/app_config');

// Create different rate limiters for various endpoints
const createRateLimiter = (maxRequests, windowMinutes = 15, message = null) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: message || `Too many requests, please try again after ${windowMinutes} minutes`
    });
};

// Global rate limiter
const globalLimiter = createRateLimiter(
    config.rateLimit.standard.max, 
    config.rateLimit.standard.windowMs / 60000
);

// Authentication endpoints rate limiter
const authLimiter = createRateLimiter(
    config.rateLimit.auth.max,
    config.rateLimit.auth.windowMs / 60000,
    'Too many authentication attempts. Please try again later.'
);

// File upload endpoints rate limiter
const fileUploadLimiter = createRateLimiter(
    config.rateLimit.fileUpload.max,
    config.rateLimit.fileUpload.windowMs / 60000,
    'Too many file uploads. Please try again later.'
);

// API endpoints rate limiter
const apiLimiter = createRateLimiter(300, 15);

module.exports = {
    globalLimiter,
    authLimiter,
    fileUploadLimiter,
    apiLimiter
};
