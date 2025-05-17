const Article = require('../models/article_model');
const { checkAndSendReviewReminders } = require('../controllers/reminder_controller');
const { sendMail } = require('../controllers/mail_controller');
const mongoose = require('mongoose');
require('dotenv').config();

// Mock the sendMail function to avoid sending real emails during testing
jest.mock('../controllers/mail_controller', () => ({
  sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
}));

// Connect to the test database before running tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/journal_test');
});

// Disconnect from the database after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Review Reminder System', () => {
  beforeEach(() => {
    // Clear mocks before each test
    sendMail.mockClear();
  });

  test('should send reminders for reviewers who haven\'t reviewed after 7 days', async () => {
    // Create test data - an article with a reviewer assigned 8 days ago who hasn't reviewed
    const now = new Date();
    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    
    // Mock Article.find to return test data
    Article.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          {
            _id: 'article123',
            title: 'Test Article',
            journalId: {
              title: 'Test Journal'
            },
            reviewers: [
              {
                reviewerId: {
                  _id: 'reviewer123',
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com'
                },
                reviewed: false,
                status: 'pending',
                createdAt: eightDaysAgo,
              }
            ]
          }
        ])
      })
    });

    // Run the reminder check
    const remindersSent = await checkAndSendReviewReminders();

    // Expect one reminder to be sent
    expect(remindersSent).toBe(1);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(
      expect.stringContaining('Test Journal'),
      'john.doe@example.com',
      expect.stringContaining('Reminder'),
      expect.stringContaining('John Doe')
    );
  });

  test('should not send reminders for reviewers who reviewed', async () => {
    // Create test data - an article with a reviewer who has already reviewed
    const now = new Date();
    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    
    // Mock Article.find to return test data
    Article.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          {
            _id: 'article123',
            title: 'Test Article',
            journalId: {
              title: 'Test Journal'
            },
            reviewers: [
              {
                reviewerId: {
                  _id: 'reviewer123',
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com'
                },
                reviewed: true, // Already reviewed
                status: 'completed',
                createdAt: eightDaysAgo,
              }
            ]
          }
        ])
      })
    });

    // Run the reminder check
    const remindersSent = await checkAndSendReviewReminders();

    // Expect no reminders to be sent
    expect(remindersSent).toBe(0);
    expect(sendMail).not.toHaveBeenCalled();
  });

  test('should not send reminders for reviewers assigned less than 7 days ago', async () => {
    // Create test data - an article with a reviewer assigned 5 days ago
    const now = new Date();
    const fiveDaysAgo = new Date(now);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    // Mock Article.find to return test data
    Article.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          {
            _id: 'article123',
            title: 'Test Article',
            journalId: {
              title: 'Test Journal'
            },
            reviewers: [
              {
                reviewerId: {
                  _id: 'reviewer123',
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com'
                },
                reviewed: false,
                status: 'pending',
                createdAt: fiveDaysAgo, // Only 5 days ago
              }
            ]
          }
        ])
      })
    });

    // Run the reminder check
    const remindersSent = await checkAndSendReviewReminders();

    // Expect no reminders to be sent
    expect(remindersSent).toBe(0);
    expect(sendMail).not.toHaveBeenCalled();
  });
});
