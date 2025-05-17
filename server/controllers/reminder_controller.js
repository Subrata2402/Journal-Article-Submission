const Article = require('../models/article_model');
const { sendMail } = require('./mail_controller');
const logger = require('../utils/logger');

/**
 * Store for keeping track of sent reminders to avoid duplicate reminders
 * Key: reviewerId_articleId, Value: timestamp of last reminder
 */
const reminderLog = new Map();

/**
 * Check for reviewers who haven't submitted their reviews 7 days after assignment
 * and send reminder emails to them.
 */
const checkAndSendReviewReminders = async () => {
    try {
        const currentDate = new Date();
        
        // Find articles with reviewers who were assigned more than 7 days ago but haven't reviewed
        const articlesWithDelayedReviews = await Article.find({
            'reviewers.reviewed': false,
            'reviewers.status': 'pending'
        }).populate('journalId', 'title')
          .populate({
            path: 'reviewers.reviewerId',
            select: 'firstName lastName email affiliation'
          });

        if (!articlesWithDelayedReviews.length) {
            logger.info('No pending reviews requiring reminders found');
            return;
        }

        logger.info(`Found ${articlesWithDelayedReviews.length} articles with potential delayed reviews`);
        
        // Track the number of reminders sent
        let remindersSent = 0;

        // Process each article
        for (const article of articlesWithDelayedReviews) {
            // Check each reviewer
            for (const reviewer of article.reviewers) {
                // Skip if already reviewed
                if (reviewer.reviewed) continue;
                
                // Calculate days since assignment
                const assignedDate = new Date(reviewer.createdAt);
                const daysSinceAssignment = Math.floor((currentDate - assignedDate) / (1000 * 60 * 60 * 24));
                  // Send reminder if it's been 7 or more days
                if (daysSinceAssignment >= 7) {
                    const reviewerDetails = reviewer.reviewerId;
                    
                    // Ensure we have the reviewer's email
                    if (!reviewerDetails || !reviewerDetails.email) {
                        logger.error(`Missing reviewer details for reviewer ID: ${reviewer.reviewerId}`);
                        continue;
                    }
                    
                    // Create a unique key for this reviewer-article pair
                    const reminderKey = `${reviewerDetails._id}_${article._id}`;
                    const currentTime = Date.now();
                    const lastReminderTime = reminderLog.get(reminderKey) || 0;
                    
                    // Check if we've sent a reminder in the last 3 days
                    // 3 days = 3 * 24 * 60 * 60 * 1000 = 259200000 milliseconds
                    const timeSinceLastReminder = currentTime - lastReminderTime;
                    if (timeSinceLastReminder < 259200000) {
                        logger.info(`Skipping reminder for ${reviewerDetails.email} - last reminder sent ${Math.floor(timeSinceLastReminder / (1000 * 60 * 60 * 24))} days ago`);
                        continue;
                    }
                    
                    // Prepare email content
                    const subject = `Reminder: Review Request for "${article.title}"`;
                    
                    const content = `
                        <p>Dear ${reviewerDetails.firstName} ${reviewerDetails.lastName},</p>
                        
                        <p>We hope this email finds you well. We are writing to kindly remind you that you were assigned to review the manuscript 
                        titled <strong>"${article.title}"</strong> for the journal <strong>${article.journalId.title}</strong> on 
                        ${assignedDate.toDateString()}.</p>
                        
                        <p>It has been ${daysSinceAssignment} days since the manuscript was assigned to you for review. 
                        Your expert evaluation is extremely valuable to our peer-review process, and we would greatly 
                        appreciate your timely submission of the review.</p>
                        
                        <p>If you have any questions or require any assistance with the review process, please do not hesitate to contact us.</p>
                        
                        <p>Thank you for your valuable contribution to our journal.</p>
                        
                        <p>Best regards,<br>
                        The Editorial Team<br>
                        ${article.journalId.title}</p>
                    `;
                    
                    // Send reminder email
                    await sendMail(
                        `${article.journalId.title} Editorial Team`, 
                        reviewerDetails.email, 
                        subject, 
                        content
                    );
                    
                    // Update the reminder log
                    reminderLog.set(reminderKey, currentTime);
                    
                    logger.info(`Review reminder sent to ${reviewerDetails.email} for article ID: ${article._id}`);
                    remindersSent++;
                }
            }
        }
        
        logger.info(`Completed review reminder check. Sent ${remindersSent} reminder emails.`);
        return remindersSent;
    } catch (error) {
        logger.error(`Error in checkAndSendReviewReminders: ${error.message}`);
        throw error;
    }
};

/**
 * Handler for manually triggering the review reminder process via API
 */
const triggerReviewReminders = async (req, res, next) => {
    try {
        const remindersSent = await checkAndSendReviewReminders();
        res.status(200).json({ 
            success: true, 
            message: `Review reminder process completed. Sent ${remindersSent || 0} reminder emails.`
        });
    } catch (error) {
        logger.error(`Failed to trigger review reminders: ${error.message}`);
        next(error);
    }
};

module.exports = {
    checkAndSendReviewReminders,
    triggerReviewReminders
};
