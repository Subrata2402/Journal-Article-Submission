# API Reference Documentation

This document provides detailed information about the endpoints available in the Academic Journal Submission System API.

## Base URL

All API endpoints are prefixed with `/api/v1`. For backward compatibility, the same endpoints are also available without the version prefix as `/api`.

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Common Parameters

### Pagination Parameters

Many list endpoints support pagination with these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

Example: `GET /api/journal?page=2&limit=20`

### Advanced Query Parameters

Some endpoints support advanced filtering, sorting, and selection:

- `sort`: Sort by field(s), prefix with `-` for descending order (e.g., `sort=title,-createdAt`)
- `select`: Include only specific fields (e.g., `select=title,description,tags`)
- `filters`: Filter by field values (e.g., `filters[category]=science&filters[openAccess]=true`)

## Authentication Endpoints

### Register a New User

```
POST /api/auth/register
```

Creates a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "middleName": "",
  "lastName": "Doe",
  "userName": "johndoe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "password": "SecureP@ss123",
  "confPassword": "SecureP@ss123",
  "institution": "University of Science"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "userName": "johndoe",
      "email": {
        "id": "john.doe@example.com",
        "verified": false
      },
      "role": "user"
    },
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Login

```
POST /api/auth/login
```

Authenticates a user and issues a JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecureP@ss123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": {
        "id": "john.doe@example.com",
        "verified": true
      },
      "role": "user"
    },
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Logout

```
POST /api/auth/logout
```

Invalidates the current JWT token.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Refresh Token

```
POST /api/auth/refresh-token
```

Issues a new JWT token based on the refresh token.

**Headers:**
- `Authorization: Bearer <refresh_token>`

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Journal Endpoints

### Get Journal List

```
GET /api/journal
```

Retrieves a paginated list of journals.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `sort`: Sort field(s) (default: `-createdAt`)
- `category`: Filter by category
- `tags`: Filter by tag(s)

**Response:**
```json
{
  "success": true,
  "message": "Journal data retrieved successfully",
  "data": {
    "journals": [
      {
        "_id": "681467c579a576e18609301f",
        "title": "Nature: International Journal of Science",
        "description": "A weekly international journal publishing the finest peer-reviewed research.",
        "category": "science",
        "tags": ["Science", "Biology", "Technology", "Physics"],
        "publishedDate": "2025-05-02T06:35:49.207Z"
      },
      // More journal objects...
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

### Get Journal Details

```
GET /api/journal/:journalId
```

Retrieves detailed information about a specific journal.

**URL Parameters:**
- `journalId`: The ID of the journal to retrieve

**Response:**
```json
{
  "success": true,
  "message": "Journal data retrieved successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "title": "Nature: International Journal of Science",
    "description": "A weekly international journal publishing the finest peer-reviewed research.",
    "category": "science",
    "tags": ["Science", "Biology", "Technology", "Physics"],
    "publishedDate": "2025-05-02T06:35:49.207Z",
    "publicationFrequency": "Weekly",
    "openAccess": true,
    "peerReviewProcess": "Double-blind peer review",
    "impactFactor": {
      "value": 8.24,
      "year": 2024
    },
    "metrics": {
      "averageReviewTime": "14 days",
      "acceptanceRate": "65%",
      "timeToPublication": "30 days",
      "articlesPerYear": 500
    },
    "submissionGuidelines": [
      "Manuscripts must be original and not published elsewhere",
      "Research must follow ethical standards appropriate to the field",
      "Formatting should follow journal-specific requirements",
      "Citations should use appropriate referencing style",
      "All data should be accessible and transparent"
    ]
  }
}
```

### Add Journal

```
POST /api/journal/add-journal
```

Creates a new journal (admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Modern Physics Review",
  "description": "A quarterly journal focused on advances in theoretical and applied physics.",
  "category": "physics",
  "tags": ["Physics", "Quantum Mechanics", "Relativity"],
  "publicationFrequency": "Quarterly",
  "openAccess": true,
  "peerReviewProcess": "Double-blind peer review",
  "impactFactor": {
    "value": 4.2,
    "year": 2024
  },
  "metrics": {
    "averageReviewTime": "21 days",
    "acceptanceRate": "40%",
    "timeToPublication": "45 days",
    "articlesPerYear": 120
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal added successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "title": "Modern Physics Review",
    "description": "A quarterly journal focused on advances in theoretical and applied physics.",
    "category": "physics",
    "tags": ["Physics", "Quantum Mechanics", "Relativity"],
    "publicationFrequency": "Quarterly",
    "openAccess": true,
    "peerReviewProcess": "Double-blind peer review",
    "publishedDate": "2025-05-17T12:34:56.789Z"
    // Additional properties...
  }
}
```

### Update Journal

```
PUT /api/journal/update-journal/:journalId
```

Updates an existing journal (admin only).

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `journalId`: The ID of the journal to update

**Request Body:**
```json
{
  "title": "Updated Journal Title",
  "description": "Updated journal description",
  "category": "updated-category",
  "tags": ["Updated", "Tags"]
  // Other fields to update...
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal updated successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "title": "Updated Journal Title",
    "description": "Updated journal description",
    "category": "updated-category",
    "tags": ["Updated", "Tags"]
    // Other updated fields...
  }
}
```

### Delete Journal

```
DELETE /api/journal/delete-journal/:journalId
```

Deletes a journal (admin only).

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `journalId`: The ID of the journal to delete

**Response:**
```json
{
  "success": true,
  "message": "Journal deleted successfully"
}
```

### Get Journal Categories

```
GET /api/journal/categories
```

Retrieves all distinct journal categories.

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    "science",
    "medicine",
    "engineering",
    "technology",
    "humanities"
  ]
}
```

### Get Journal Tags

```
GET /api/journal/tags
```

Retrieves all distinct journal tags.

**Response:**
```json
{
  "success": true,
  "message": "Tags retrieved successfully",
  "data": [
    "Science",
    "Biology",
    "Technology",
    "Physics",
    "Medicine"
  ]
}
```

### Add Editor to Journal

```
POST /api/journal/add-editor
```

Assigns an editor to a journal (admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "middleName": "",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phoneNumber": "9876543210",
  "institution": "University of Research",
  "journalId": "681467c579a576e18609301f"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Editor added successfully",
  "data": {
    "editor": {
      "_id": "60d21b4667d0d8992e610c85",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": {
        "id": "jane.smith@example.com"
      },
      "role": "editor"
    },
    "journal": {
      "_id": "681467c579a576e18609301f",
      "title": "Nature: International Journal of Science",
      "editorId": "60d21b4667d0d8992e610c85"
    }
  }
}
```

### Remove Editor from Journal

```
DELETE /api/journal/remove-editor/:journalId
```

Removes an editor from a journal (admin only).

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `journalId`: The ID of the journal

**Response:**
```json
{
  "success": true,
  "message": "Editor removed successfully"
}
```

## Article Endpoints

### Add New Article

```
POST /api/article
```

Submits a new article.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `title`: Article title
- `abstract`: Article abstract
- `keywords`: JSON array of keywords as string
- `journalId`: Journal ID
- `authors`: JSON array of authors as string
- `menuScript`: Main manuscript file (PDF)
- `coverLetter`: Cover letter file (PDF)
- `supplementaryFile`: Supplementary materials file (PDF)

**Response:**
```json
{
  "success": true,
  "message": "Article submitted successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "title": "Quantum Computing: A New Frontier",
    "abstract": "This paper explores recent advances in quantum computing...",
    "keywords": ["Quantum", "Computing", "Algorithms"],
    "authors": [
      {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "affiliation": "University of Science",
        "correspondingAuthor": true,
        "firstAuthor": true,
        "otherAuthor": false
      }
    ],
    "status": "submitted",
    "createdAt": "2025-05-17T12:34:56.789Z"
  }
}
```

### Get User's Article List

```
GET /api/article/user
```

Retrieves articles submitted by or associated with the current user.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Journal Articles data retrieved successfully",
  "data": {
    "articles": [
      {
        "_id": "681467c579a576e18609301f",
        "title": "Quantum Computing: A New Frontier",
        "abstract": "This paper explores recent advances in quantum computing...",
        "status": "submitted",
        "createdAt": "2025-05-17T12:34:56.789Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Get Article List (Editor)

```
GET /api/article
```

Retrieves articles for journals the user edits (editor role required).

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by article status

**Response:**
```json
{
  "success": true,
  "message": "Journal Articles data retrieved successfully",
  "data": {
    "articles": [
      {
        "_id": "681467c579a576e18609301f",
        "title": "Quantum Computing: A New Frontier",
        "abstract": "This paper explores recent advances in quantum computing...",
        "status": "submitted",
        "createdAt": "2025-05-17T12:34:56.789Z",
        "journal": {
          "_id": "60d21b4667d0d8992e610c85",
          "title": "Nature: International Journal of Science"
        }
      }
      // More articles...
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

### Get Article Details

```
GET /api/article/:articleId
```

Retrieves detailed information about a specific article.

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `articleId`: The ID of the article

**Response:**
```json
{
  "success": true,
  "message": "Journal Article details retrieved successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "title": "Quantum Computing: A New Frontier",
    "abstract": "This paper explores recent advances in quantum computing...",
    "keywords": ["Quantum", "Computing", "Algorithms"],
    "menuScript": "1746119172130.pdf",
    "coverLetter": "1746119172132.pdf",
    "supplementaryFile": "1746119172134.pdf",
    "authors": [
      {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "affiliation": "University of Science",
        "correspondingAuthor": true,
        "firstAuthor": true,
        "otherAuthor": false
      }
    ],
    "status": "submitted",
    "comment": "",
    "journalId": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Nature: International Journal of Science",
      "description": "A weekly international journal publishing the finest peer-reviewed research."
    },
    "userId": {
      "_id": "60d21b4667d0d8992e610c85",
      "firstName": "John",
      "lastName": "Doe",
      "email": {
        "id": "john.doe@example.com"
      },
      "profilePicture": "default_profile_picture.png"
    },
    "createdAt": "2025-05-17T12:34:56.789Z",
    "updatedAt": "2025-05-17T12:34:56.789Z"
  }
}
```

### Update Article

```
PUT /api/article/update-article/:articleId
```

Updates an existing article.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**URL Parameters:**
- `articleId`: The ID of the article to update

**Form Data:**
- `title`: Article title
- `abstract`: Article abstract
- `keywords`: JSON array of keywords as string
- `journalId`: Journal ID
- `authors`: JSON array of authors as string
- `menuScript`: Main manuscript file (PDF, optional)
- `coverLetter`: Cover letter file (PDF, optional)
- `supplementaryFile`: Supplementary materials file (PDF, optional)

**Response:**
```json
{
  "success": true,
  "message": "Journal article updated successfully"
}
```

### Delete Article

```
DELETE /api/article/delete-article/:articleId
```

Deletes an article.

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `articleId`: The ID of the article to delete

**Response:**
```json
{
  "success": true,
  "message": "Journal Article deleted successfully"
}
```

### Assign Reviewer to Article

```
PATCH /api/article/assign-reviewer
```

Assigns a reviewer to an article (editor only).

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `articleId`: Article ID
- `reviewerId`: Reviewer ID

**Response:**
```json
{
  "success": true,
  "message": "Reviewer assigned successfully"
}
```

### Remove Reviewer from Article

```
PATCH /api/article/remove-reviewer
```

Removes a reviewer from an article (editor only).

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `articleId`: Article ID
- `reviewerId`: Reviewer ID

**Response:**
```json
{
  "success": true,
  "message": "Reviewer removed successfully"
}
```

### Get Review Articles List

```
GET /api/article/review
```

Retrieves articles assigned to the user for review (reviewer only).

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Review Articles retrieved successfully",
  "data": {
    "articles": [
      {
        "_id": "681467c579a576e18609301f",
        "title": "Quantum Computing: A New Frontier",
        "abstract": "This paper explores recent advances in quantum computing...",
        "createdAt": "2025-05-17T12:34:56.789Z",
        "menuScript": "1746119172130.pdf",
        "status": "submitted",
        "reviewers": [
          {
            "reviewerId": "60d21b4667d0d8992e610c85",
            "status": "pending",
            "comment": "",
            "reviewed": false
          }
        ],
        "journalId": {
          "_id": "60d21b4667d0d8992e610c85",
          "title": "Nature: International Journal of Science"
        }
      }
      // More articles...
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Add Review

```
POST /api/article/add-review
```

Submits a review for an article (reviewer only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "articleId": "681467c579a576e18609301f",
  "status": "accepted",
  "comment": "This is an excellent article with sound methodology and significant results."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully"
}
```

### Add Final Review

```
POST /api/article/add-final-review
```

Submits a final review for an article (editor only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "articleId": "681467c579a576e18609301f",
  "status": "accepted",
  "comment": "All reviewers have approved this article. It is ready for publication."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Final review updated successfully"
}
```

## Reviewer Endpoints

### Add Reviewer

```
POST /api/reviewer
```

Creates a new reviewer account.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Alice",
  "middleName": "",
  "lastName": "Johnson",
  "email": "alice.johnson@example.com",
  "phoneNumber": "5551234567",
  "specialization": "Quantum Physics",
  "institution": "MIT",
  "keywords": ["quantum", "physics", "computing"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reviewer added successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "specialization": "Quantum Physics",
    "institution": "MIT"
  }
}
```

### Get Reviewers List

```
GET /api/reviewer
```

Retrieves a list of reviewers (admin/editor only).

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `keywords`: Filter by keywords

**Response:**
```json
{
  "success": true,
  "message": "Reviewers retrieved successfully",
  "data": {
    "reviewers": [
      {
        "_id": "681467c579a576e18609301f",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice.johnson@example.com",
        "specialization": "Quantum Physics",
        "institution": "MIT",
        "keywords": ["quantum", "physics", "computing"]
      }
      // More reviewers...
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

### Get Reviewer Details

```
GET /api/reviewer/:reviewerId
```

Retrieves detailed information about a specific reviewer.

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `reviewerId`: The ID of the reviewer

**Response:**
```json
{
  "success": true,
  "message": "Reviewer data retrieved successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "firstName": "Alice",
    "middleName": "",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "phoneNumber": "5551234567",
    "specialization": "Quantum Physics",
    "institution": "MIT",
    "keywords": ["quantum", "physics", "computing"],
    "articlesReviewed": 12,
    "activeReviews": 3,
    "createdAt": "2025-05-01T12:34:56.789Z",
    "updatedAt": "2025-05-17T12:34:56.789Z"
  }
}
```

### Update Reviewer

```
PUT /api/reviewer/:reviewerId
```

Updates an existing reviewer.

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `reviewerId`: The ID of the reviewer to update

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Johnson-Smith",
  "specialization": "Quantum Physics and Computing",
  "institution": "Stanford University",
  "keywords": ["quantum", "physics", "computing", "algorithms"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reviewer updated successfully",
  "data": {
    "_id": "681467c579a576e18609301f",
    "firstName": "Alice",
    "lastName": "Johnson-Smith",
    "specialization": "Quantum Physics and Computing",
    "institution": "Stanford University",
    "keywords": ["quantum", "physics", "computing", "algorithms"]
  }
}
```

### Delete Reviewer

```
DELETE /api/reviewer/:reviewerId
```

Deletes a reviewer.

**Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `reviewerId`: The ID of the reviewer to delete

**Response:**
```json
{
  "success": true,
  "message": "Reviewer deleted successfully"
}
```

## Health Check Endpoint

```
GET /api/health
```

Checks the health status of the API and its dependencies.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2025-05-17T12:34:56.789Z",
    "version": "1.0.0",
    "environment": "production",
    "database": "connected"
  }
}
```

## Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title should be at least 5 characters long"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Unauthorized - Invalid token"
}
```

### Authorization Error

```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions"
}
```

### Resource Not Found Error

```json
{
  "success": false,
  "message": "Journal not found"
}
```

### Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```
