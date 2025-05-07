# ClipFlowAI Codebase

This directory contains the source code for the ClipFlowAI application, an automated AI system to generate and publish short-form videos.

## Project Structure

The project is organized into the following directories:

```
/src
├── frontend/                  # Frontend application
│   ├── public/                # Public assets
│   ├── src/                   # Frontend source code
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Common UI components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── forms/         # Form components
│   │   │   ├── video/         # Video-related components
│   │   │   └── charts/        # Chart components
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # Service modules
│   │   │   ├── api/           # API service modules
│   │   │   ├── auth/          # Authentication services
│   │   │   ├── storage/       # Storage services
│   │   │   ├── analytics/     # Analytics services
│   │   │   └── video/         # Video processing services
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration files
│   │   ├── App.js             # Main App component
│   │   └── index.js           # Entry point
│   └── tests/                 # Frontend tests
│
├── backend/                   # Backend application
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Express middleware
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   ├── services/              # Business logic services
│   ├── utils/                 # Utility functions
│   ├── server.js              # Server entry point
│   └── tests/                 # Backend tests
│
└── shared/                    # Shared code between frontend and backend
    ├── constants/             # Shared constants
    ├── types/                 # Shared type definitions
    └── utils/                 # Shared utility functions
```

## Frontend Architecture

The frontend is built with React and follows a modular architecture:

- **Components**: Reusable UI components organized by functionality
- **Context**: React context providers for state management
- **Hooks**: Custom React hooks for reusable logic
- **Pages**: Page components that represent routes
- **Services**: Service modules for API calls, authentication, etc.
- **Utils**: Utility functions for common tasks
- **Config**: Configuration files for constants, environment variables, etc.

## Backend Architecture

The backend is built with Express and follows a modular architecture:

- **Controllers**: Request handlers for API endpoints
- **Middleware**: Express middleware for authentication, error handling, etc.
- **Models**: Data models for database entities
- **Routes**: API route definitions
- **Services**: Business logic services
- **Utils**: Utility functions for common tasks
- **Config**: Configuration files for database, environment variables, etc.

## Authentication

Authentication is handled using Supabase Auth, which provides:

- Email/password authentication
- OAuth authentication (Google, etc.)
- JWT-based authentication
- Password reset functionality

## Database

The application uses Supabase as the database provider, which is built on PostgreSQL.

## Storage

File storage is handled using Supabase Storage, which provides:
- Secure file uploads
- Public and private buckets
- Access control

## Video Processing

Video processing is handled using FFmpeg, which provides:
- Video trimming
- Adding subtitles
- Merging video and audio
- Generating thumbnails
- Resizing videos for different platforms

## Analytics

Analytics are collected and displayed using:
- Custom analytics service
- Chart.js for visualization

## Deployment

The application is deployed using GitHub Pages for the frontend and can be deployed to any hosting provider for the backend.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Start the frontend: `npm start`
4. Start the backend: `npm run start:backend`

## Testing

- Run frontend tests: `npm test`
- Run backend tests: `npm run test:backend`
- Run all tests: `npm run test:all`

## Contributing

Please read the [CONTRIBUTING.md](../CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the UNLICENSED License - see the [LICENSE](../LICENSE) file for details.
