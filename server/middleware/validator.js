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

module.exports = validate;