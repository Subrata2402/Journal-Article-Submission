/**
 * Application configuration settings
 * Values are loaded from environment variables with sensible defaults
 */

module.exports = {
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    apiUrl: process.env.API_URL || 'http://localhost:3000/api',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3001',
    uploadDir: process.env.UPLOAD_DIR || 'public',
    tempDir: process.env.TEMP_DIR || 'temp'
  },

  // Database settings
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/journal_project',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // JWT and authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-development-secret-key',
    jwtAlgorithm: process.env.JWT_ALGORITHM || 'RS256',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    publicKey: process.env.PUBLIC_KEY || 'keys/public.key',
    privateKey: process.env.PRIVATE_KEY || 'keys/private.key',
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
    passwordResetExpiry: parseInt(process.env.PASSWORD_RESET_EXPIRY || '3600', 10) // seconds
  },

  // Mail service
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    from: process.env.MAIL_FROM || 'noreply@journalproject.com'
  },

  // File upload limits
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'application/pdf,image/png,image/jpeg').split(',')
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    disableConsole: process.env.DISABLE_CONSOLE_LOG === 'true',
    logFilePath: process.env.LOG_FILE_PATH || 'logs/server.log'
  },

  // Rate limiting
  rateLimit: {
    standard: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10) // 1000 requests
    },
    auth: {
      windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10) // 20 requests
    },
    fileUpload: {
      windowMs: parseInt(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || '3600000', 10), // 60 minutes
      max: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX || '30', 10) // 30 requests
    }
  },

  // CORS settings
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Security settings
  security: {
    helmet: {
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
    }
  }
};
