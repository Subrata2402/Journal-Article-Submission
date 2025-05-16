const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const os = require('os');

/**
 * @route GET /api/health
 * @desc Health check endpoint for API status monitoring
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        // Collect stats about the API
        const stats = {
            status: 'online',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()) + ' seconds',
            hostname: os.hostname(),
            system: {
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
                memoryUsage: {
                    rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + ' MB',
                    heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + ' MB',
                    heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
                },
                cpu: {
                    cores: os.cpus().length,
                    loadAvg: os.loadavg(),
                },
                freeMemory: (os.freemem() / 1024 / 1024).toFixed(2) + ' MB',
                totalMemory: (os.totalmem() / 1024 / 1024).toFixed(2) + ' MB'
            },
            database: {
                status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
                name: mongoose.connection.name
            }
        };

        // Special treatment for live health checks that shouldn't be cached
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('X-Content-Type-Options', 'nosniff');
        
        return res.status(200).json(stats);
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

/**
 * @route GET /api/health/db
 * @desc Database health check endpoint
 * @access Public
 */
router.get('/db', async (req, res) => {
    try {
        // Try to ping the database
        const dbStatus = await mongoose.connection.db.admin().ping();
        
        return res.status(200).json({
            status: 'online',
            database: 'connected',
            ping: dbStatus.ok === 1 ? 'successful' : 'failed',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return res.status(503).json({
            status: 'error',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
