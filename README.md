# Academic Journal Submission System

A comprehensive platform for academic publishing that connects authors, reviewers, and editors in a streamlined digital workflow. This system supports the entire lifecycle of academic publishing from journal creation to article submission, peer review, and publication.

![Project Logo](./client/public/logo.png)

## Project Overview

The Academic Journal Submission System consists of two main components:

1. **Client Application**: A React-based web interface for users to interact with the system
2. **Server API**: A Node.js/Express backend that handles data processing and business logic

This full-stack application is designed to modernize and streamline academic publishing workflows.

## Features

### User Management
- Role-based access control (Admin, Editor, Author, Reviewer)
- User authentication and authorization
- Profile management for all stakeholders

### Journal Management
- Create and manage academic journals with detailed metadata
- Categorize journals by field and relevant tags
- Assign editors to journals
- Track journal metrics (impact factor, review times, etc.)
- Define submission guidelines for authors

### Article Submission
- Submit articles with title, abstract, and full manuscript
- Upload supporting documents (cover letters, supplementary files)
- Track submission status
- Collaborative authorship management

### Peer Review Process
- Assign reviewers to articles
- Structured peer review workflow
- Manage the review process
- Track review metrics and timeline

### Search & Discovery
- Advanced filtering and search capabilities for journals
- Tag-based journal categorization
- Journal pinning/bookmarking for quick access

### Email Notifications
- Automated email notifications for key events
- Editor assignment notifications
- Review request and submission confirmations

### Theme Support
- Light and dark mode themes
- Responsive design for mobile and desktop views

## Technology Stack

### Frontend
- **React** (v19) with Vite
- **React Router** (v7)
- **SCSS** for styling
- **React Icons**
- **Axios** for API requests
- **React Toastify** for notifications
- **CryptoJS** for secure data handling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file handling
- **Nodemailer** for email functionality
- **Zod** for input validation
- **Winston** for logging
- **Helmet**, **Express Rate Limit**, and **CORS** for security

## Project Structure

```
journal_project/
├── client/            # Frontend React application
│   ├── public/        # Static assets
│   └── src/           # Source code
│       ├── assets/    # Images, styles, and other static resources
│       ├── components/# Reusable UI components
│       ├── config/    # Configuration files
│       ├── contexts/  # React context providers
│       ├── hooks/     # Custom React hooks
│       ├── pages/     # Page components
│       ├── services/  # API services
│       └── utils/     # Utility functions
│
├── server/            # Backend Node.js/Express API
│   ├── config/        # Configuration files
│   ├── controllers/   # Request controllers
│   ├── keys/          # JWT keys
│   ├── middleware/    # Express middleware
│   ├── models/        # Mongoose models
│   ├── public/        # Static files (uploads)
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── validators/    # Input validation
│
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud-based)
- npm or yarn

### Installation and Setup

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/journal_project.git
cd journal_project
```

#### 2. Set up the Backend

```bash
cd server
npm install

# Create .env file with your configuration
# Generate JWT keys
mkdir -p keys
openssl genrsa -out keys/private.key 2048
openssl rsa -in keys/private.key -pubout -out keys/public.key

# Start the server
npm run dev
```

Example `.env` file for server:
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

#### 3. Set up the Frontend

```bash
cd ../client
npm install
npm run dev
```

The client application will be available at http://localhost:5173

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

## Error Handling

The API uses a centralized error handling mechanism with custom ApiError class and middleware. This ensures consistent error responses across the application with appropriate HTTP status codes.

## Security Measures

- Helmet for setting various HTTP headers
- Rate limiting to prevent brute force attacks
- JWT-based authentication
- Secure password storage with bcrypt
- Input validation with Zod
- CORS configuration

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
