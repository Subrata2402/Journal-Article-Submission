const express = require('express');
const router = express.Router();
const { triggerReviewReminders } = require('../controllers/reminder_controller');
const { authenticate, verifyAdmin } = require('../middleware/authentication');

// Route to manually trigger review reminders (protected, admin only)
router.post('/review-reminders', authenticate, verifyAdmin, triggerReviewReminders);

module.exports = router;
