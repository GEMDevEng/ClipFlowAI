# Directory Structure

This document provides an overview of the ClipFlowAI project directory structure, explaining the purpose and organization of each directory and key files.

## Root Directory

The root directory contains configuration files and top-level directories:

```
ClipFlowAI/
├── .github/                # GitHub-related files (workflows, templates)
├── docs/                   # Documentation
├── public/                 # Static assets for the web application
├── src/                    # Source code
├── .env.example            # Example environment variables
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── LICENSE                 # Project license (MIT)
├── package.json            # NPM package configuration
├── README.md               # Project overview and quick start
└── tsconfig.json           # TypeScript configuration
```

## GitHub Directory

The `.github` directory contains GitHub-specific files:

```
.github/
├── ISSUE_TEMPLATE/         # Templates for GitHub issues
│   ├── bug_report.md       # Bug report template
│   └── feature_request.md  # Feature request template
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml              # Continuous integration workflow
│   └── deploy.yml          # Deployment workflow
└── PULL_REQUEST_TEMPLATE.md # Template for pull requests
```

## Documentation Directory

The `docs` directory contains project documentation:

```
docs/
├── assets/                 # Documentation assets (images, diagrams)
├── gitbook/                # GitBook documentation
│   ├── appendix/           # Additional resources
│   ├── deployment/         # Deployment guides
│   ├── development-guide/  # Developer documentation
│   ├── getting-started/    # Getting started guides
│   ├── introduction/       # Project introduction
│   ├── technical-documentation/ # Technical documentation
│   ├── user-guide/         # User guides
│   ├── SUMMARY.md          # GitBook table of contents
│   └── index.md            # Documentation home page
├── GITBOOK_PUBLISHING.md   # Guide for publishing to GitBook
└── publish_to_gitbook.sh   # Script for publishing to GitBook
```

## Public Directory

The `public` directory contains static assets for the web application:

```
public/
├── favicon.ico             # Website favicon
├── index.html              # HTML entry point
├── logo192.png             # Logo (192x192)
├── logo512.png             # Logo (512x512)
├── manifest.json           # Web app manifest
└── robots.txt              # Robots configuration
```

## Source Directory

The `src` directory contains the application source code:

```
src/
├── assets/                 # Application assets
│   ├── fonts/              # Custom fonts
│   └── images/             # Images used in the application
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── common/             # Common UI components
│   ├── dashboard/          # Dashboard components
│   ├── layout/             # Layout components
│   └── video/              # Video-related components
├── contexts/               # React context providers
│   ├── AuthContext.js      # Authentication context
│   ├── ThemeContext.js     # Theme context
│   └── VideoContext.js     # Video management context
├── hooks/                  # Custom React hooks
│   ├── useAuth.js          # Authentication hook
│   ├── useFFmpeg.js        # FFmpeg hook
│   ├── useLocalStorage.js  # Local storage hook
│   └── useVideoGeneration.js # Video generation hook
├── layouts/                # Page layouts
│   ├── AuthLayout.js       # Layout for authentication pages
│   ├── DashboardLayout.js  # Layout for dashboard pages
│   └── MainLayout.js       # Main application layout
├── pages/                  # Page components
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard pages
│   ├── video/              # Video-related pages
│   ├── Home.js             # Home page
│   └── NotFound.js         # 404 page
├── services/               # Service modules
│   ├── api.js              # API service
│   ├── ffmpeg.js           # FFmpeg service
│   ├── platform.js         # Social media platform service
│   ├── storage.js          # Storage service
│   └── supabase.js         # Supabase client
├── styles/                 # Global styles
│   ├── global.css          # Global CSS
│   └── theme.js            # Chakra UI theme
├── utils/                  # Utility functions
│   ├── formatters.js       # Formatting utilities
│   ├── validators.js       # Validation utilities
│   └── videoProcessing.js  # Video processing utilities
├── App.js                  # Main App component
└── index.js                # Application entry point
```

## Components Directory

The `components` directory is organized by feature and contains reusable React components:

```
components/
├── auth/                   # Authentication components
│   ├── LoginForm.js        # Login form
│   ├── RegisterForm.js     # Registration form
│   ├── PasswordResetForm.js # Password reset form
│   └── SocialLogin.js      # Social login buttons
├── common/                 # Common UI components
│   ├── Button.js           # Custom button component
│   ├── Card.js             # Card component
│   ├── Input.js            # Input component
│   ├── Modal.js            # Modal component
│   ├── Spinner.js          # Loading spinner
│   └── Toast.js            # Toast notification
├── dashboard/              # Dashboard components
│   ├── FilterBar.js        # Filter bar for dashboard
│   ├── SearchBar.js        # Search bar
│   ├── VideoCard.js        # Video card component
│   └── VideoGrid.js        # Grid for displaying videos
├── layout/                 # Layout components
│   ├── Footer.js           # Footer component
│   ├── Header.js           # Header component
│   ├── Navbar.js           # Navigation bar
│   └── Sidebar.js          # Sidebar component
└── video/                  # Video-related components
    ├── CaptionEditor.js    # Caption editor
    ├── ProgressBar.js      # Progress bar for video generation
    ├── ThumbnailGenerator.js # Thumbnail generator
    ├── VideoForm.js        # Form for creating/editing videos
    └── VideoPlayer.js      # Video player component
```

## Pages Directory

The `pages` directory contains top-level page components:

```
pages/
├── auth/                   # Authentication pages
│   ├── Login.js            # Login page
│   ├── Register.js         # Registration page
│   └── PasswordReset.js    # Password reset page
├── dashboard/              # Dashboard pages
│   ├── Dashboard.js        # Main dashboard page
│   ├── Analytics.js        # Analytics page
│   └── Settings.js         # Settings page
├── video/                  # Video-related pages
│   ├── CreateVideo.js      # Create video page
│   ├── EditVideo.js        # Edit video page
│   ├── VideoDetails.js     # Video details page
│   └── ShareVideo.js       # Share video page
├── Home.js                 # Home page
└── NotFound.js             # 404 page
```

## Services Directory

The `services` directory contains modules for interacting with external services:

```
services/
├── api.js                  # General API service
├── ffmpeg.js               # FFmpeg service for video processing
├── platform.js             # Social media platform service
├── storage.js              # Storage service for files
└── supabase.js             # Supabase client configuration
```

## Contexts Directory

The `contexts` directory contains React context providers:

```
contexts/
├── AuthContext.js          # Authentication context
├── ThemeContext.js         # Theme context
└── VideoContext.js         # Video management context
```

## Hooks Directory

The `hooks` directory contains custom React hooks:

```
hooks/
├── useAuth.js              # Authentication hook
├── useFFmpeg.js            # FFmpeg hook
├── useLocalStorage.js      # Local storage hook
└── useVideoGeneration.js   # Video generation hook
```

## Utils Directory

The `utils` directory contains utility functions:

```
utils/
├── formatters.js           # Formatting utilities
├── validators.js           # Validation utilities
└── videoProcessing.js      # Video processing utilities
```

## Key Configuration Files

### package.json

The `package.json` file defines the project dependencies and scripts:

```json
{
  "name": "clipflowai",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@chakra-ui/react": "^2.2.1",
    "@emotion/react": "^11.9.3",
    "@emotion/styled": "^11.9.3",
    "@ffmpeg/core": "^0.11.0",
    "@ffmpeg/ffmpeg": "^0.11.0",
    "@supabase/supabase-js": "^1.35.4",
    "framer-motion": "^6.3.16",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.4.0",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src",
    "format": "prettier --write \"src/**/*.{js,jsx}\"",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "eslint": "^8.19.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.30.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "gh-pages": "^4.0.0",
    "prettier": "^2.7.1"
  },
  "homepage": "https://gemdeveng.github.io/ClipFlowAI"
}
```

### .env.example

The `.env.example` file provides a template for environment variables:

```
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Social Media API Keys (Optional)
REACT_APP_INSTAGRAM_CLIENT_ID=your_instagram_client_id
REACT_APP_TIKTOK_CLIENT_KEY=your_tiktok_client_key
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key

# Feature Flags
REACT_APP_ENABLE_SOCIAL_SHARING=true
REACT_APP_ENABLE_ANALYTICS=true
```

### tsconfig.json

The `tsconfig.json` file configures TypeScript:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

### .eslintrc.js

The `.eslintrc.js` file configures ESLint:

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### .prettierrc

The `.prettierrc` file configures Prettier:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 80,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

## Conclusion

The ClipFlowAI project follows a well-organized directory structure that separates concerns and makes the codebase easy to navigate. Key aspects of the directory structure include:

1. **Feature-Based Organization**: Components, pages, and other files are organized by feature
2. **Clear Separation of Concerns**: UI components, business logic, and external services are kept separate
3. **Modular Design**: The codebase is divided into small, reusable modules
4. **Consistent Naming**: Files and directories follow a consistent naming convention

This organization makes it easier for developers to understand the codebase, find specific files, and make changes without affecting unrelated parts of the application.
