const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal_controller');
const { authenticate, verifyAdmin } = require('../middleware/authentication');
const validate = require('../middleware/validator');
const journalSchema = require('../validators/journalValidator');

// Journal routes
router.post('/add-journal', 
    authenticate, 
    verifyAdmin, 
    validate(journalSchema.addJournal),
    journalController.addJournal
);
router.post('/add-editor', authenticate, verifyAdmin, validate(journalSchema.addEditor), journalController.addEditor);
router.get('/journal-list', journalController.journalList);
router.get('/categories', journalController.categories);
router.get('/tags', journalController.tags);
router.get('/journal-editor-list', authenticate, verifyAdmin, journalController.journalEditorList);
router.delete('/delete-journal/:journalId', authenticate, verifyAdmin, journalController.deleteJournal);
router.delete('/remove-editor/:journalId', authenticate, verifyAdmin, journalController.removeEditor);

module.exports = router;
