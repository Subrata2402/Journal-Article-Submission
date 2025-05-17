# API Response Format & Error Handling Documentation

This document provides a detailed explanation of the API response format and error handling mechanism used in the Academic Journal Submission System.

## API Response Format

The system uses a standardized response format for all API endpoints to maintain consistency across the application.

### Success Response Structure

Successful responses follow this pattern:

```json
{
  "success": true,
  "message": "Operation was successful",
  "data": {
    // Response data goes here
  }
}
```

Example of a successful journal creation response:
```json
{
  "success": true,
  "message": "Journal added successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "title": "Nature: International Journal of Science",
    "description": "A weekly international journal publishing the finest peer-reviewed research.",
    "category": "science",
    "tags": ["Science", "Biology", "Technology", "Physics"],
    "publishedDate": "2025-05-02T06:35:49.207Z"
    // Additional journal properties...
  }
}
```

Example of a successful paginated response:
```json
{
  "success": true,
  "message": "Journal data retrieved successfully",
  "data": {
    "journals": [
      // Array of journal objects...
    ],
    "pagination": {
      "total": 42,
      "page": 2,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

### Error Response Structure

Error responses follow this pattern:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": [
    // Optional array of specific errors
    { "field": "fieldName", "message": "Error message for this field" }
  ],
  "stack": "Error stack trace (only in development mode)"
}
```

Example of a validation error response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title should be at least 5 characters long" },
    { "field": "description", "message": "Description is required" }
  ]
}
```

Example of an authentication error:
```json
{
  "success": false,
  "message": "Unauthorized - Invalid token"
}
```

## Error Handling Mechanism

The system implements a comprehensive error handling mechanism using a custom `ApiError` class and middleware.

### Custom ApiError Class

The `ApiError` class extends JavaScript's native `Error` class to add additional properties needed for API error handling:

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

### Error Handler Middleware

The `errorHandler` middleware catches all errors and formats them into consistent responses:

```javascript
const errorHandler = (err, req, res, next) => {
  // Special handling for JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Log JSON parsing error with simplified body to avoid circular references
    logger.error({
      message: 'JSON parsing error',
      error: err.message,
      method: req.method,
      path: req.path
    });

    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    user: req.user ? req.user._id : 'unauthenticated'
  });

  // Determine if this is a trusted error
  const statusCode = err.statusCode || 500;

  // Sanitize error message in production
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal Server Error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### 404 Not Found Handler

A dedicated middleware handles 404 errors:

```javascript
const notFound = (req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
```

## Usage in Controllers

Controllers use the `ApiError` class to handle operational errors:

```javascript
const addJournal = async (req, res, next) => {
  try {
    // Validate input data
    if (!req.body.title || !req.body.description) {
      throw new ApiError('Journal title and description are required', 400);
    }

    // Business logic...
    
    res.status(201).json({
      success: true,
      message: "Journal added successfully",
      data: responseData
    });
  } catch (error) {
    // Pass operational errors as-is, wrap unexpected errors
    next(error.isOperational ? error : new ApiError(`Journal addition failed: ${error.message}`, 400));
  }
};
```

## Error Types and HTTP Status Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input data or validation failure |
| 401 | Unauthorized | Authentication failure or missing authentication |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate entry) |
| 422 | Unprocessable Entity | Request understood but cannot be processed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

## Best Practices

1. **Use Descriptive Error Messages**: Error messages should clearly explain what went wrong.
   
2. **Consistent Error Format**: All errors should follow the same response structure.
   
3. **Appropriate Status Codes**: Use HTTP status codes that accurately reflect the error type.
   
4. **Validation Errors**: For validation failures, include specific field-level errors.
   
5. **Security Considerations**: Hide implementation details in production.
   
6. **Logging**: Log all errors with appropriate context for debugging.
   
7. **Error Hierarchy**: Distinguish between operational and programming errors.
   
8. **Graceful Degradation**: Handle unexpected errors gracefully without crashing the application.

## Error Handling Flow

1. Error occurs (thrown explicitly or caught by Express)
2. Error is caught in controller's try/catch or by Express
3. Error is passed to the error handling middleware using `next(error)`
4. Error handler formats and logs the error
5. Error response is sent to the client
