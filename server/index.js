const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const swaggerDocs = require('./swagger');
require('dotenv').config();
require('./config/database');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://via.placeholder.com"]
    }
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));

// Import rate limiters
const { globalLimiter } = require('./middleware/rateLimiter');

// Apply global rate limiting as a fallback
app.use(globalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Standard response format middleware
const { responseMiddleware } = require('./utils/response');
app.use(responseMiddleware);

// Request logging middleware
const requestLogger = require('./middleware/requestLogger');
app.use(requestLogger);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static files
app.use('/', express.static('public'));

// API routes
app.use('/api', routes);

// Home route
app.get('/', (_, res) => {
    res.send('Welcome to the Journal Submission API');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize Swagger docs
swaggerDocs(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});