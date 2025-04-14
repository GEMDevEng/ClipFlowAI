# Setting Up Development Environment

This guide will help you set up your development environment for contributing to ClipFlowAI.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **Git**
- **Code Editor** (VS Code, Sublime Text, WebStorm, etc.)
- **Modern Web Browser** (Chrome, Firefox, Safari, or Edge)

## Step 1: Fork and Clone the Repository

1. Fork the ClipFlowAI repository on GitHub by clicking the "Fork" button at the top right of the [repository page](https://github.com/GEMDevEng/ClipFlowAI).

2. Clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/ClipFlowAI.git
cd ClipFlowAI
```

3. Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/GEMDevEng/ClipFlowAI.git
```

## Step 2: Install Dependencies

Install the project dependencies:

```bash
# Install root project dependencies
npm install

# Install frontend dependencies
cd src/frontend
npm install
cd ../..
```

## Step 3: Set Up Supabase for Development

1. Create a Supabase account at [supabase.com](https://supabase.com/) if you don't have one already
2. Create a new Supabase project for development
3. Set up the database tables, storage buckets, and authentication as described in the [Supabase Setup Guide](../deployment/supabase-setup.md)
4. Get your Supabase URL and anon key from the Settings > API section

## Step 4: Configure Environment Variables

Create a `.env` file in the `src/frontend` directory:

```bash
cd src/frontend
touch .env
```

Add the following environment variables to the `.env` file:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project details.

## Step 5: Run the Development Server

Start the development server:

```bash
npm start
```

This will start the React development server and open the application in your default browser at `http://localhost:3000`.

## Step 6: Set Up VS Code (Recommended)

If you're using Visual Studio Code, we recommend installing the following extensions for a better development experience:

- **ESLint**: For JavaScript linting
- **Prettier**: For code formatting
- **React Developer Tools**: For debugging React components
- **GitLens**: For enhanced Git capabilities
- **Supabase**: For Supabase integration

You can also use our recommended VS Code settings by creating a `.vscode/settings.json` file in the root of the project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

## Step 7: Understanding the Development Workflow

1. **Create a new branch** for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** and commit them with clear, descriptive commit messages:

```bash
git add .
git commit -m "Add feature: your feature description"
```

3. **Push your changes** to your forked repository:

```bash
git push origin feature/your-feature-name
```

4. **Create a Pull Request** from your forked repository to the original repository.

5. **Wait for code review** and address any feedback.

## Troubleshooting

### Node.js Version Issues

If you encounter issues with Node.js versions, consider using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage multiple Node.js versions.

### Dependency Installation Errors

If you encounter errors during dependency installation:

```bash
# Clear npm cache
npm cache clean --force

# Try installing dependencies again
npm install
```

### Supabase Connection Issues

If you're having trouble connecting to Supabase:

1. Double-check your Supabase URL and anon key in the `.env` file
2. Make sure your Supabase project is set up correctly
3. Check that your database tables and storage buckets are configured as described in the Supabase Setup Guide

## Next Steps

Now that you have your development environment set up, you can:

1. Familiarize yourself with the [Project Rules](project-rules.md)
2. Review the [Frontend Guidelines](frontend-guidelines.md)
3. Check the [Implementation Plan](implementation-plan.md) and [Task List](task-list.md) to find tasks to work on
