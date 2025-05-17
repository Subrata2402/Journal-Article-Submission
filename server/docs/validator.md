# Validation Middleware Documentation

This document provides a detailed explanation of the validation middleware used in the Academic Journal Submission System.

## Overview

The validation middleware is a crucial component that ensures data integrity by validating incoming requests against predefined schemas. It uses Zod, a TypeScript-first schema validation library, to define and enforce data schemas across the application.

## Implementation

The validator middleware is defined in `middleware/validator.js` and follows a higher-order function pattern to create reusable validation middleware for different routes.

### Core Function

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
        let data;
        let validatedData;
        
        // Determine which part of the request to validate
        switch(source) {
            case 'body':
                validatedData = await schema.parseAsync(req.body);
                req.body = validatedData;
                break;
            case 'query':
                validatedData = await schema.parseAsync(req.query);
                req.query = validatedData;
                break;
            case 'params':
                validatedData = await schema.parseAsync(req.params);
                req.params = validatedData;
                break;
            case 'headers':
                // Often need to pick specific headers, not validate all
                data = {...req.headers};
                validatedData = await schema.parseAsync(data);
                // Do not replace req.headers
                break;
            case 'all':
                // Validate multiple parts of request
                if (schema.body) req.body = await schema.body.parseAsync(req.body);
                if (schema.query) req.query = await schema.query.parseAsync(req.query);
                if (schema.params) req.params = await schema.params.parseAsync(req.params);
                break;
            default:
                throw new Error(`Invalid validation source: ${source}`);
        }
        next();
    } catch (error) {
        const { ApiError } = require('./errorHandler');
        const logger = require('../utils/logger');
        
        logger.warn({
            message: 'Validation error',
            errors: error.errors || error.message,
            path: req.path,
            source
        });
        
        // Format errors in a consistent way
        const formattedErrors = error.errors?.map(err => ({
            field: err.path.join('.'),
            message: err.message
        })) || [{ field: 'unknown', message: error.message }];
        
        next(new ApiError('Validation failed', 400, formattedErrors));
    }
};
```

## Usage

The validation middleware can be used in route definitions to validate incoming request data:

```javascript
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validator');
const journalSchema = require('../validators/journalValidator');
const journalController = require('../controllers/journal_controller');

// Validate request body
router.post('/add-journal',
    validate(journalSchema.addJournal),
    journalController.addJournal
);

// Validate URL parameters
router.get('/journal/:journalId',
    validate(journalSchema.getJournal, 'params'),
    journalController.journalDetails
);

// Validate query parameters
router.get('/journals',
    validate(journalSchema.listJournals, 'query'),
    journalController.journalList
);

// Validate multiple parts of the request
router.post('/advanced-search',
    validate({
        body: searchSchema.searchFilters,
        query: searchSchema.pagination
    }, 'all'),
    searchController.search
);
```

## Validation Sources

The middleware supports the following validation sources:

| Source | Description |
|--------|-------------|
| `body` | Validates request body (default) |
| `query` | Validates URL query parameters |
| `params` | Validates URL path parameters |
| `headers` | Validates request headers |
| `all` | Validates multiple parts of the request simultaneously |

## Schema Definitions

Schemas are defined using Zod and organized by feature area. For example:

```javascript
// Example from authValidator.js
const authValidator = {
    register: z.object({
        firstName: z.string({ required_error: "First name is required" }).trim()
            .min(3, 'First name should be at least 3 characters long')
            .max(50, 'First name should be at most 50 characters long'),
        email: z.string({ required_error: "Email is required" }).trim()
            .email("Invalid email address"),
        password: z.string({ required_error: "Password is required" }).trim()
            .min(8, 'Password should be at least 8 characters long')
            .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val), {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            }),
        // Other fields...
    }).refine((data) => data.password === data.confPassword, {
        message: "Passwords don't match",
        path: ["confPassword"]
    })
    // Other schemas...
}
```

## Error Handling

When validation fails:

1. The error is logged with relevant context
2. Errors are formatted into a consistent structure with field names and messages
3. The formatted errors are passed to the error handling middleware via an `ApiError` instance
4. A 400 Bad Request response is sent to the client

Example error response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "firstName",
      "message": "First name should be at least 3 characters long"
    },
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## Benefits

- **Data Integrity**: Ensures data meets required format and constraints
- **Early Error Detection**: Catches issues before they affect business logic
- **Consistent Error Responses**: Standardized error format across all validations
- **Self-Documenting**: Schema definitions serve as documentation for data requirements
- **Type Safety**: When used with TypeScript, provides compile-time type checking

## Best Practices

1. Keep schemas organized by feature area
2. Use meaningful error messages that guide users to fix issues
3. Apply appropriate validation rules based on business requirements
4. Validate at the appropriate level (e.g., route level vs. controller level)
5. Use schema refinements for complex validations that involve multiple fields
