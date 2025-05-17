# Review Reminder System

This document outlines the automatic reminder system for reviewers who haven't completed their reviews 7 days after assignment.

## Overview

The system automatically checks for reviewers who were assigned to articles but haven't submitted their reviews within 7 days of assignment. It sends reminder emails to these reviewers, encouraging them to complete their reviews.

## How It Works

1. **Scheduled Checks**: The system runs daily at 1:00 AM to check for delayed reviews.
2. **Identification**: It identifies reviewers who:
   - Were assigned to review an article more than 7 days ago
   - Have not submitted their review (status is still "pending" and reviewed flag is false)
3. **Email Generation**: For each identified reviewer, the system generates a personalized reminder email.
4. **Duplicate Prevention**: The system tracks when reminders were sent to avoid sending too many reminders to the same reviewer for the same article.
   - Reminders are sent at most once every 3 days for a specific reviewer-article pair.

## Implementation Details

- **File Location**: `controllers/reminder_controller.js`
- **Scheduler**: Uses node-cron to schedule daily checks (configured in `index.js`)
- **Manual Trigger**: Administrators can manually trigger the reminder process via the API endpoint:
  ```
  POST /api/reminders/review-reminders
  ```

## Reminder Email Content

The reminder emails include:
- Personalized greeting with the reviewer's name
- Article title and journal name
- Date when the article was assigned
- Number of days that have passed since assignment
- Encouragement to submit the review
- Contact information for assistance

## Security and Access Control

- Only users with administrative privileges can manually trigger the reminder system.
- The system uses secure email transmission methods defined in `mail_controller.js`.

## Logging and Monitoring

- All reminder activities are logged through the application's logger system.
- Logs include:
  - When checks are performed
  - How many reminders were sent
  - Any errors encountered during the process
  - Information about skipped reminders (to avoid duplicates)

## Future Enhancements

Potential future enhancements could include:
- Configurable reminder frequencies and thresholds
- Escalation to editors after multiple reminders
- Dashboard for monitoring outstanding reviews and reminder history
- Custom reminder templates based on journal or article type
