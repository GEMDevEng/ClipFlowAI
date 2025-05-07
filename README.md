# ClipFlowAI

ClipFlowAI is an automated AI system to generate and publish short-form videos across multiple platforms.

## Features

- **Video Generation**: Create short-form videos from text prompts
- **Multi-Platform Publishing**: Publish videos to TikTok, Instagram, YouTube, and more
- **Analytics**: Track performance across all platforms
- **Customization**: Customize videos with different styles, music, and voiceovers
- **Scheduling**: Schedule videos to be published at optimal times

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Video Processing**: FFmpeg
- **Deployment**: GitHub Pages (Frontend), Any Node.js hosting (Backend)

## Project Structure

```plaintext
/ClipFlowAI
├── docs/                          # Documentation files
│   ├── api/                       # API documentation
│   ├── frontend/                  # Frontend documentation
│   ├── backend/                   # Backend documentation
│   └── deployment/                # Deployment guides
│
├── src/                           # Source code
│   ├── frontend/                  # Frontend application
│   │   ├── public/                # Public assets
│   │   ├── src/                   # Frontend source code
│   │   │   ├── assets/            # Static assets
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── context/           # React context providers
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── pages/             # Page components
│   │   │   ├── services/          # Service modules
│   │   │   ├── utils/             # Utility functions
│   │   │   ├── config/            # Configuration files
│   │   │   ├── App.js             # Main App component
│   │   │   └── index.js           # Entry point
│   │   ├── tests/                 # Frontend tests
│   │   └── package.json           # Frontend dependencies
│   │
│   ├── backend/                   # Backend application
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Express middleware
│   │   ├── models/                # Data models
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic services
│   │   ├── utils/                 # Utility functions
│   │   ├── server.js              # Server entry point
│   │   └── tests/                 # Backend tests
│   │
│   └── shared/                    # Shared code between frontend and backend
│       ├── constants/             # Shared constants
│       ├── types/                 # Shared type definitions
│       └── utils/                 # Shared utility functions
│
├── tests/                         # Integration and E2E tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
│
├── scripts/                       # Utility scripts
│   ├── deploy.sh                  # Deployment script
│   └── setup.sh                   # Setup script
│
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # Project dependencies
└── README.md                      # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GEMDevEng/ClipFlowAI.git
   cd ClipFlowAI
   ```

2. Install dependencies:
   ```bash
   npm install
   cd src/frontend
   npm install
   cd ../backend
   npm install
   cd ../..
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials and other configuration.

### Development

1. Start the frontend development server:
   ```bash
   cd src/frontend
   npm start
   ```

2. Start the backend development server:
   ```bash
   cd src/backend
   npm run dev
   ```

### Testing

1. Run frontend tests:
   ```bash
   cd src/frontend
   npm test
   ```

2. Run backend tests:
   ```bash
   cd src/backend
   npm test
   ```

3. Run all tests:
   ```bash
   npm run test:all
   ```

### Deployment

#### Frontend (GitHub Pages)

1. Build the frontend:
   ```bash
   cd src/frontend
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

#### Backend (Any Node.js Hosting)

1. Build the backend:
   ```bash
   cd src/backend
   npm run build
   ```

2. Deploy to your preferred hosting provider.

## Documentation

For more detailed documentation, see the `docs` directory:

- [API Documentation](docs/api/README.md)
- [Frontend Documentation](docs/frontend/README.md)
- [Backend Documentation](docs/backend/README.md)
- [Deployment Guide](docs/deployment/README.md)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the UNLICENSED License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.io/) for providing the backend infrastructure
- [FFmpeg](https://ffmpeg.org/) for video processing capabilities
- [React](https://reactjs.org/) for the frontend framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Express](https://expressjs.com/) for the backend framework
