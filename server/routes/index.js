const express = require('express');
const router = express.Router();

// Import versioned and utility route modules
const v1Routes = require('./v1');
const healthRoutes = require('./health_routes');

// Health check endpoint (no versioning needed)
router.use('/health', healthRoutes);

// Default to latest version (v1)
router.use('/v1', v1Routes);

// For backward compatibility (no version specified in path)
router.use('/', v1Routes);

module.exports = router;
