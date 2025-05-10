# Journal Article Submission System

A comprehensive web application for academic journal management, article submissions, and peer review processes.

<!-- ![Journal Project Logo](./public/logo.png) -->

## Overview

The Journal Article Submission System is a full-featured academic publishing platform designed to streamline the submission, review, and publication processes for scholarly journals. This application facilitates interaction between authors, editors, and reviewers in a user-friendly environment.

## Features

- **Journal Management**
  - Create and edit academic journals with detailed metadata
  - Categorize journals by field (Science, Medicine, Psychology, etc.)
  - Set journal metrics, impact factors, and publication frequencies
  - Define submission guidelines for authors

- **Article Submission**
  - User-friendly interface for authors to submit manuscripts
  - Support for manuscript, cover letter, and supplementary file uploads
  - Collaborative authorship management with corresponding author designation
  - Keyword tagging system for improved discoverability

- **Search & Discovery**
  - Advanced filtering and search capabilities for journals
  - Tag-based journal categorization
  - Journal pinning/bookmarking for quick access
  - Responsive journal cards with visual category indicators

- **User Roles & Permissions**
  - Role-based access control for authors, editors, and administrators
  - Specialized interfaces for each user role
  - Secure authentication and authorization

- **Review Process**
  - Structured peer review workflow
  - Article status tracking (pending, approved, rejected)
  - Editor feedback and communication tools

- **Theme Support**
  - Light and dark mode themes
  - Responsive design for mobile and desktop views

## Tech Stack

### Frontend
- **React** (v19) - UI library
- **React Router** (v7) - Navigation and routing
- **SCSS** - Advanced styling with variables and mixins
- **React Icons** - Comprehensive icon library
- **Axios** - HTTP client for API requests
- **React Toastify** - User notifications
- **CryptoJS** - Secure data handling

### Development Tools
- **Vite** - Fast development server and build tool
- **ESLint** - Code quality and style enforcement
- **TypeScript** (partial) - Type definitions for improved developer experience

## Project Structure

```
client/
├── public/              # Static assets and HTML templates
├── src/                 # Source code
│   ├── assets/          # Images, styles, and other static resources
│   │   ├── icons/       # Icon assets
│   │   ├── images/      # Image assets
│   │   └── styles/      # SCSS stylesheets
│   │       ├── article/ # Article-related styles
│   │       ├── common/  # Shared component styles
│   │       ├── journal/ # Journal-related styles
│   │       ├── layout/  # Layout component styles
│   │       └── pages/   # Page-specific styles
│   ├── components/      # Reusable UI components
│   │   ├── article/     # Article-related components
│   │   ├── common/      # Shared UI components
│   │   ├── forms/       # Form components and controls
│   │   ├── journal/     # Journal-related components
│   │   └── layout/      # Layout components (navbar, footer)
│   ├── config/          # Configuration files and constants
│   ├── contexts/        # React context providers
│   ├── features/        # Feature-specific code
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services and data fetching
│   ├── store/           # State management
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── index.html           # Main HTML entry point
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/journal_project.git
   cd journal_project/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- React team for the excellent UI library
- Vite team for the fast development experience
- All open-source libraries used in this project
