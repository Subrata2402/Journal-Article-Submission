# Academic Journal Submission System - API

This is the backend API for an Academic Journal Submission System designed to streamline the management of academic journals, article submissions, peer reviews, and editorial workflows.

## Project Overview

The Academic Journal Submission System is a comprehensive platform for academic publishing that connects authors, reviewers, and editors in a streamlined digital workflow. The system supports the entire lifecycle of academic publishing from journal creation to article submission, peer review, and publication.

## Features

- **User Management**
  - Role-based access control (Admin, Editor, Author, Reviewer)
  - User authentication and authorization
  - Profile management for all stakeholders

- **Journal Management**
  - Create and manage academic journals
  - Categorize journals with relevant tags
  - Assign editors to journals
  - Track journal metrics (impact factor, review times, etc.)

- **Article Submission**
  - Submit articles with title, abstract, and full manuscript
  - Upload supporting documents (cover letters, supplementary files)
  - Track submission status

- **Peer Review Process**
  - Assign reviewers to articles
  - Manage the review workflow
  - Track review metrics and timeline
  - Automated reviewer reminders for pending reviews

- **Email Notifications**
  - Automated email notifications for key events
  - Editor assignment notifications
  - Review request and submission confirmations

## Technology Stack

- **Backend Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer
- **Email**: Nodemailer
- **Input Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, Express Rate Limit, CORS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud-based)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/journal_project.git
cd journal_project/server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/journal_db
JWT_PRIVATE_KEY_PATH=./keys/private.key
JWT_PUBLIC_KEY_PATH=./keys/public.key
JWT_EXPIRY=30d
NODE_ENV=development
EMAIL_SERVICE=smtp.yourservice.com
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
CLIENT_URL=http://localhost:3000
```

4. Generate RSA key pair for JWT (if not already done)
```bash
mkdir -p keys
openssl genrsa -out keys/private.key 2048
openssl rsa -in keys/private.key -pubout -out keys/public.key
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run prod
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Journals
- `GET /api/journal` - Get list of journals
- `GET /api/journal/:journalId` - Get journal details
- `POST /api/journal` - Create a new journal
- `PUT /api/journal/:journalId` - Update journal details
- `DELETE /api/journal/:journalId` - Delete a journal
- `GET /api/journal/categories` - Get list of journal categories
- `GET /api/journal/tags` - Get list of journal tags
- `POST /api/journal/editor` - Add an editor to a journal
- `DELETE /api/journal/:journalId/editor` - Remove editor from a journal

### Articles
- `POST /api/article` - Submit a new article
- `GET /api/article` - Get list of articles
- `GET /api/article/:articleId` - Get article details
- `PUT /api/article/:articleId` - Update article details
- `DELETE /api/article/:articleId` - Delete an article

### Reviewers
- `POST /api/reviewer` - Add a new reviewer
- `GET /api/reviewer` - Get list of reviewers
- `GET /api/reviewer/:reviewerId` - Get reviewer details
- `PUT /api/reviewer/:reviewerId` - Update reviewer details
- `DELETE /api/reviewer/:reviewerId` - Delete a reviewer

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Request controllers
├── keys/             # JWT keys
├── middleware/       # Express middleware
├── models/           # Mongoose models
├── public/           # Static files
├── routes/           # API routes
├── utils/            # Utility functions
├── validators/       # Input validation
├── index.js          # Application entry point
└── package.json      # Project manifest
```

## Error Handling

The API uses a centralized error handling mechanism with custom ApiError class and middleware. This ensures consistent error responses across the application with appropriate HTTP status codes.

## Security Measures

- Helmet for setting various HTTP headers
- Rate limiting to prevent brute force attacks
- JWT-based authentication
- Secure password storage with bcrypt
- Input validation with Zod
- CORS configuration

## Logging

Winston logger is used for comprehensive application logging. Logs are configured to output based on the environment (development/production).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License

---

Developed as a comprehensive solution for academic publishing workflows.
