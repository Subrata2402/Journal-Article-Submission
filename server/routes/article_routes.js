const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article_controller');
const { authenticate, verifyEditor, verifyReviewer } = require('../middleware/authentication');
const { upload } = require('../middleware/multer');
const validate = require('../middleware/validator');
const articleSchema = require('../validators/articleValidator');

const articleUploadFields = [
    { name: "menuScript", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
    { name: "supplementaryFile", maxCount: 1 }
];

// Article routes
router.post('/add-article',
    authenticate,
    upload.fields(articleUploadFields),
    validate(articleSchema.addArticle),
    articleController.addArticle
);
router.get('/article-details/:articleId', authenticate, articleController.articleDetails);
router.get('/user-article-list', authenticate, articleController.userArticleList);
router.get('/article-list/:journalId', authenticate, verifyEditor, articleController.articleList);
router.post('/update-article', authenticate, validate(articleSchema.updateArticle), articleController.updateArticle);
router.get('/review-article-list', authenticate, verifyReviewer, articleController.reviewArticleList);
router.post('/assign-reviewer', authenticate, verifyEditor, articleController.assignReviewer);
router.post('/add-review', authenticate, verifyReviewer, validate(articleSchema.addReview), articleController.addReview);
router.post('/add-final-review', authenticate, verifyEditor, validate(articleSchema.addReview), articleController.addFinalReview);
router.post('/create-zip', authenticate, verifyEditor, articleController.createZip);
router.get('/download-zip/:filename', articleController.downloadZip);

module.exports = router;