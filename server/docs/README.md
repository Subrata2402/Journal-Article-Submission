# Academic Journal Submission System - API Documentation

This documentation provides a comprehensive guide to the Academic Journal Submission System API, designed to streamline the management of academic journals, article submissions, peer reviews, and editorial workflows.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [API Reference](#api-reference)
7. [Authentication](#authentication)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Security Measures](#security-measures)
11. [Logging](#logging)
12. [Contributing](#contributing)
13. [License](#license)

## Project Overview

The Academic Journal Submission System is a comprehensive platform for academic publishing that connects authors, reviewers, and editors in a streamlined digital workflow. The system supports the entire lifecycle of academic publishing from journal creation to article submission, peer review, and publication.

## Features

### User Management
- Role-based access control (Admin, Editor, Author, Reviewer)
- User authentication and authorization
- Profile management for all stakeholders

### Journal Management
- Create and manage academic journals
- Categorize journals with relevant tags
- Assign editors to journals
- Track journal metrics (impact factor, review times, etc.)

### Article Submission
- Submit articles with title, abstract, and full manuscript
- Upload supporting documents (cover letters, supplementary files)
- Track submission status

### Peer Review Process
- Assign reviewers to articles
- Manage the review workflow
- Track review metrics and timeline

### Email Notifications
- Automated email notifications for key events
- Editor assignment notifications
- Review request and submission confirmations

## Technology Stack

- **Backend Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer
- **Email**: Nodemailer
- **Input Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, Express Rate Limit, CORS
- **File Compression**: JSZip
- **API Documentation**: Swagger

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud-based)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/journal_project.git
cd journal_project/server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/journal_db
JWT_PRIVATE_KEY_PATH=./keys/private.key
JWT_PUBLIC_KEY_PATH=./keys/public.key
JWT_EXPIRY=30d
NODE_ENV=development
EMAIL_SERVICE=smtp.yourservice.com
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
CLIENT_URL=http://localhost:3000
```

4. Generate RSA key pair for JWT (if not already done)
```bash
mkdir -p keys
openssl genrsa -out keys/private.key 2048
openssl rsa -in keys/private.key -pubout -out keys/public.key
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run prod
```

## Project Structure

```
server/
├── config/           # Configuration files
│   ├── app_config.js # Application configuration
│   └── database.js   # Database connection settings
├── controllers/      # Request controllers
│   ├── article_controller.js     # Article-related operations
│   ├── auth_controller.js       # Authentication operations
│   ├── journal_controller.js    # Journal-related operations
│   ├── mail_controller.js       # Email sending functions
│   ├── others_controller.js     # Miscellaneous controllers
│   └── reviewer_controller.js   # Reviewer-related operations
├── keys/             # JWT keys
│   ├── private.key   # Private key for JWT signing
│   └── public.key    # Public key for JWT verification
├── middleware/       # Express middleware
│   ├── authentication.js  # JWT authentication
│   ├── cache.js           # Response caching
│   ├── errorHandler.js    # Centralized error handling
│   ├── multer.js          # File upload handling
│   ├── queryHelper.js     # Advanced query processing
│   ├── rateLimiter.js     # API rate limiting
│   ├── requestLogger.js   # Request logging
│   └── validator.js       # Input validation
├── models/           # Mongoose models
│   ├── article_model.js    # Article schema
│   ├── journal_model.js    # Journal schema
│   ├── reviewer_model.js   # Reviewer schema
│   └── user_model.js       # User schema
├── public/           # Static files
│   ├── articles/            # Article files
│   └── profile-pictures/    # User profile pictures
├── routes/           # API routes
│   ├── article_routes.js    # Article endpoints
│   ├── auth_routes.js       # Authentication endpoints
│   ├── health_routes.js     # Health check endpoints
│   ├── index.js             # Main router
│   ├── journal_routes.js    # Journal endpoints
│   ├── reviewer_routes.js   # Reviewer endpoints
│   └── v1/                  # API version 1
│       └── index.js         # Version 1 router
├── utils/            # Utility functions
│   ├── helper.js      # Helper functions
│   ├── logger.js      # Logging configuration
│   └── response.js    # Standard response formatter
├── validators/       # Input validation
│   ├── articleValidator.js   # Article validation schemas
│   ├── authValidator.js      # Authentication validation schemas
│   ├── journalValidator.js   # Journal validation schemas
│   └── reviewerValidator.js  # Reviewer validation schemas
├── docs/             # Documentation
├── index.js          # Application entry point
├── swagger.js        # API documentation configuration
└── package.json      # Project manifest
```

## API Reference

### Base URL

All API endpoints are prefixed with `/api/v1`. For backward compatibility, the same endpoints are also available without the version prefix.

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh-token` | Refresh JWT token |

### Journal Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journal` | Get list of journals |
| GET | `/api/journal/:journalId` | Get journal details |
| POST | `/api/journal` | Create a new journal |
| PUT | `/api/journal/:journalId` | Update journal details |
| DELETE | `/api/journal/:journalId` | Delete a journal |
| GET | `/api/journal/categories` | Get list of journal categories |
| GET | `/api/journal/tags` | Get list of journal tags |
| POST | `/api/journal/editor` | Add an editor to a journal |
| DELETE | `/api/journal/:journalId/editor` | Remove editor from a journal |

### Article Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/article` | Submit a new article |
| GET | `/api/article` | Get list of articles |
| GET | `/api/article/:articleId` | Get article details |
| PUT | `/api/article/:articleId` | Update article details |
| DELETE | `/api/article/:articleId` | Delete an article |
| GET | `/api/article/user` | Get list of user's articles |
| GET | `/api/article/review` | Get list of review articles |
| POST | `/api/article/add-review` | Add a review to an article |
| POST | `/api/article/add-final-review` | Add final review to an article |
| PATCH | `/api/article/assign-reviewer` | Assign reviewer to an article |
| PATCH | `/api/article/remove-reviewer` | Remove reviewer from an article |
| POST | `/api/article/create-zip` | Create a zip with article files |
| GET | `/api/article/download-zip/:filename` | Download a zip file |

### Reviewer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviewer` | Add a new reviewer |
| GET | `/api/reviewer` | Get list of reviewers |
| GET | `/api/reviewer/:reviewerId` | Get reviewer details |
| PUT | `/api/reviewer/:reviewerId` | Update reviewer details |
| DELETE | `/api/reviewer/:reviewerId` | Delete a reviewer |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health status |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with RSA signing:

1. **Token Generation**: When a user logs in, the server creates a JWT signed with a private key
2. **Token Format**: The token contains user ID, role, and expiration information
3. **Token Verification**: Requests to protected routes include the token in the Authorization header
4. **Role-Based Access**: Different endpoints are accessible based on user roles:
   - `admin`: Full system access
   - `editor`: Journal and article management
   - `user`: Article submission and viewing
   - `reviewer`: Article reviewing

## Middleware

### Authentication Middleware

The `authentication.js` middleware validates JWTs and can enforce role-based access:

```javascript
// Authenticate any logged in user
router.get('/profile', authenticate, userController.getProfile);

// Limit access to admin users only
router.post('/add-journal', authenticate, verifyAdmin, journalController.addJournal);

// Limit access to editors
router.patch('/assign-reviewer', authenticate, verifyEditor, articleController.assignReviewer);

// Limit access to reviewers
router.post('/add-review', authenticate, verifyReviewer, articleController.addReview);
```

### Validation Middleware

The `validator.js` middleware uses Zod schemas to validate request data:

```javascript
/**
 * Middleware function to validate request data against a schema.
 *
 * @param {object} schema - The schema to validate the request data against.
 * @param {string} source - The source of data to validate ('body', 'query', 'params', 'headers', 'all')
 * @returns {function} - The middleware function that performs the validation.
 */
const validate = (schema, source = 'body') => async (req, res, next) => {
    try {
        // Validation logic
        switch(source) {
            case 'body':
                validatedData = await schema.parseAsync(req.body);
                req.body = validatedData; // Replace with validated data
                break;
            // Other cases...
        }
        next();
    } catch (error) {
        // Format and log validation errors
        const formattedErrors = error.errors?.map(err => ({
            field: err.path.join('.'),
            message: err.message
        })) || [{ field: 'unknown', message: error.message }];
        
        next(new ApiError('Validation failed', 400, formattedErrors));
    }
};
```

Sample usage:
```javascript
router.post('/register', validate(authSchema.register), authController.register);
```

### Rate Limiting

Prevents abuse by limiting request frequency:

```javascript
// Example usage
router.post('/login', rateLimiter({ windowMs: 60 * 1000, max: 5 }), authController.login);
```

### Caching

Improves performance by caching responses:

```javascript
router.get('/journal-list',
    cacheMiddleware({ 
        ttl: 300,
        keyGenerator: req => `${req.originalUrl}-${JSON.stringify(req.advancedQuery)}`
    }),
    journalController.journalList
);
```

## Error Handling

The API uses a centralized error handling mechanism with custom `ApiError` class:

```javascript
class ApiError extends Error {
  constructor(message, statusCode, errors = null, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

The `errorHandler` middleware catches and processes all errors:

```javascript
const errorHandler = (err, req, res, next) => {
  // Error handling logic
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal Server Error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## Security Measures

- **Helmet**: Sets various HTTP security headers
- **Rate limiting**: Prevents brute force attacks
- **JWT authentication**: Secure token-based authentication
- **Secure password storage**: Using bcrypt for password hashing
- **Input validation**: Using Zod for schema validation
- **CORS configuration**: Controls cross-origin requests
- **Environment-specific error responses**: Less detailed errors in production

## Logging

The API uses Winston for structured logging with different levels based on the environment:

```javascript
// Log examples
logger.info(`Journal added successfully: ${responseData._id} by admin: ${req.user._id}`);
logger.warn({ message: 'Validation error', errors: error.errors, path: req.path });
logger.error({ message: error.message, stack: error.stack, method: req.method });
```

Logs include relevant context such as user IDs, request paths, and timestamps.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License

---

Developed as a comprehensive solution for academic publishing workflows.
