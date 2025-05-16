const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article_controller');
const { authenticate, verifyEditor, verifyReviewer } = require('../middleware/authentication');
const { upload } = require('../middleware/multer');
const validate = require('../middleware/validator');
const articleSchema = require('../validators/articleValidator');
const { cacheMiddleware, invalidateCacheByPattern } = require('../middleware/cache');
const { fileUploadLimiter } = require('../middleware/rateLimiter');
const { queryMiddleware } = require('../middleware/queryHelper');

const articleUploadFields = [
    { name: "menuScript", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
    { name: "supplementaryFile", maxCount: 1 }
];

// ------------------- Article routes ------------------- //
// This route handles the addition of articles, including file uploads for menu script, cover letter, and supplementary files.

// Post routes
router.post('/add-article',
    authenticate,
    fileUploadLimiter,
    upload.fields(articleUploadFields),
    validate(articleSchema.addArticle),
    (req, res, next) => {
        // Invalidate article list caches when a new article is added
        invalidateCacheByPattern(/\/article-list/); // Invalidate article list cache
        invalidateCacheByPattern(/\/review-article-list/); // Invalidate review article list cache
        invalidateCacheByPattern(/\/user-article-list/); // Invalidate user article list cache
        next();
    },
    articleController.addArticle
);
router.post('/add-review', authenticate, verifyReviewer, validate(articleSchema.addReview), articleController.addReview);
router.post('/add-final-review', authenticate, verifyEditor, validate(articleSchema.addReview), articleController.addFinalReview);
router.post('/create-zip', authenticate, verifyEditor, articleController.createZip);

// Put routes
router.put('/update-article/:articleId', 
    authenticate, 
    upload.fields(articleUploadFields), 
    validate(articleSchema.updateArticle), 
    articleController.updateArticle
);

// Delete routes
router.delete('/delete-article/:articleId', authenticate, articleController.deleteArticle);

// Get routes with caching for read-only endpoints
router.get('/article-details/:articleId', 
    authenticate, 
    cacheMiddleware({ ttl: 300 }),
    articleController.articleDetails
);

// Routes with advanced query capabilities
router.get('/user-article-list', 
    authenticate, 
    queryMiddleware({ defaultLimit: 10, maxLimit: 50 }),
    cacheMiddleware({ 
        ttl: 300,
        keyGenerator: req => `${req.originalUrl}-${JSON.stringify(req.advancedQuery)}-${req.user._id}`
    }),
    articleController.userArticleList
);

router.get('/article-list', 
    authenticate, 
    queryMiddleware({ defaultLimit: 15, maxLimit: 100, defaultSort: 'updatedAt:desc' }),
    cacheMiddleware({ 
        ttl: 300,
        keyGenerator: req => `${req.originalUrl}-${JSON.stringify(req.advancedQuery)}`
    }),
    articleController.articleList
);

router.get('/review-article-list', 
    authenticate, 
    verifyReviewer,
    queryMiddleware({ defaultLimit: 10, maxLimit: 50 }),
    cacheMiddleware({ 
        ttl: 300,
        keyGenerator: req => `${req.originalUrl}-${JSON.stringify(req.advancedQuery)}-${req.user._id}`
    }),
    articleController.reviewArticleList
);
router.get('/download-zip/:filename', articleController.downloadZip);

// Patch routes
router.patch('/assign-reviewer', authenticate, verifyEditor, articleController.assignReviewer);
router.patch('/remove-reviewer', authenticate, verifyEditor, articleController.removeReviewer);

module.exports = router;