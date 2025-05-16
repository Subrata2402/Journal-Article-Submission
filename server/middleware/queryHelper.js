/**
 * Advanced query middleware for MongoDB
 * Implements pagination, field selection, sorting, and filtering
 */

/**
 * Query helper middleware that processes query parameters
 * and attaches them to the request object
 * 
 * Supports:
 * - Pagination: ?page=2&limit=10
 * - Field selection: ?fields=title,abstract,keywords
 * - Sorting: ?sort=createdAt:desc,title:asc
 * - Filtering: ?title=example&status=published
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.defaultLimit - Default number of results per page
 * @param {number} options.maxLimit - Maximum allowed limit
 * @param {string} options.defaultSort - Default sort field and direction
 * @returns {Function} Express middleware
 */
const queryMiddleware = ({
  defaultLimit = 10,
  maxLimit = 100,
  defaultSort = 'createdAt:desc'
} = {}) => {
  return (req, res, next) => {
    const queryParams = { ...req.query };
    
    // Remove special parameters from the filter
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach(field => delete queryParams[field]);
    
    // 1. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || defaultLimit, maxLimit);
    const skip = (page - 1) * limit;
    
    // 2. Field selection
    let fields = {};
    if (req.query.fields) {
      fields = req.query.fields.split(',').reduce((acc, field) => {
        acc[field.trim()] = 1;
        return acc;
      }, {});
    }
    
    // 3. Sorting
    let sort = {};
    const sortParam = req.query.sort || defaultSort;
    
    sortParam.split(',').forEach(sortOption => {
      const [field, direction] = sortOption.split(':');
      sort[field.trim()] = direction?.toLowerCase() === 'desc' ? -1 : 1;
    });
    
    // 4. Filtering - advance filter handling
    let filter = {};
    
    // Handle exact matches from remaining query params
    Object.keys(queryParams).forEach(key => {
      filter[key] = queryParams[key];
    });
    
    // Attach to request object for use in route handlers
    req.advancedQuery = {
      filter,
      sort,
      fields,
      pagination: {
        page,
        limit,
        skip
      }
    };
    
    next();
  };
};

/**
 * Helper function to apply the advanced query to a Mongoose query
 * @param {Object} query - Mongoose query object
 * @param {Object} advancedQuery - Advanced query parameters
 * @returns {Object} Modified Mongoose query
 */
const applyAdvancedQuery = (query, advancedQuery) => {
  const { filter, sort, fields, pagination } = advancedQuery;
  
  return query
    .find(filter)
    .select(fields)
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit);
};

module.exports = {
  queryMiddleware,
  applyAdvancedQuery
};
