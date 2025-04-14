# Project Rules

This document outlines the rules and guidelines for contributing to the ClipFlowAI project. Following these rules ensures consistency, maintainability, and a smooth collaboration experience for all contributors.

## Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](https://github.com/GEMDevEng/ClipFlowAI/blob/main/CODE_OF_CONDUCT.md). This includes:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Git Workflow

### Branching Strategy

We follow a simplified Git Flow branching strategy:

- `main`: The production branch. This branch should always be deployable.
- `develop`: The development branch where features are integrated.
- `feature/*`: Feature branches for new features or enhancements.
- `bugfix/*`: Bugfix branches for fixing issues.
- `hotfix/*`: Hotfix branches for critical production fixes.

### Branch Naming Convention

Branch names should follow this pattern:

- `feature/short-description`: For new features
- `bugfix/issue-number-short-description`: For bug fixes
- `hotfix/issue-number-short-description`: For critical fixes
- `docs/short-description`: For documentation changes

Examples:
- `feature/video-generation`
- `bugfix/123-fix-auth-redirect`
- `hotfix/456-critical-security-fix`
- `docs/update-installation-guide`

### Commit Messages

Commit messages should be clear and descriptive, following these guidelines:

- Use the imperative mood ("Add feature" not "Added feature")
- Start with a capital letter
- Keep the first line under 50 characters
- Provide more detailed explanation in subsequent lines if necessary
- Reference issue numbers when applicable

Example:
```
Add video generation functionality

- Implement FFmpeg.js integration
- Add progress tracking
- Create video preview component

Fixes #123
```

### Pull Requests

Pull requests should:

1. Be submitted against the `develop` branch (unless it's a hotfix)
2. Include a clear description of the changes
3. Reference any related issues
4. Pass all automated checks (linting, tests, etc.)
5. Be reviewed by at least one maintainer before merging
6. Be squashed when merging to keep the commit history clean

## Coding Standards

### General

- Use consistent indentation (2 spaces)
- Keep lines under 100 characters
- Remove trailing whitespace
- End files with a newline
- Use UTF-8 encoding

### JavaScript/TypeScript

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ES6+ features when appropriate
- Use TypeScript for type safety
- Document functions and complex logic with JSDoc comments
- Avoid using `any` type in TypeScript

### React

- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Use prop-types or TypeScript interfaces for component props
- Follow the [React Hooks rules](https://reactjs.org/docs/hooks-rules.html)
- Use meaningful component and file names

### CSS/Styling

- Use Chakra UI for consistent styling
- Follow the BEM (Block Element Modifier) methodology for custom CSS
- Use CSS variables for theming
- Ensure responsive design for all components

## Testing

### Requirements

- All new features must include tests
- All bug fixes must include tests that verify the fix
- Maintain or improve code coverage with each PR

### Types of Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete user flows

### Running Tests

Tests should be run locally before submitting a PR:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific tests
npm test -- -t "component name"
```

## Documentation

### Code Documentation

- Document all public functions, classes, and components
- Use JSDoc for JavaScript/TypeScript documentation
- Include examples where appropriate
- Document complex algorithms and business logic

### Project Documentation

- Keep the README.md up to date
- Document installation and setup procedures
- Provide usage examples
- Update documentation when making changes to APIs or features

## Issue Tracking

### Creating Issues

When creating issues:

1. Use clear and descriptive titles
2. Provide detailed steps to reproduce bugs
3. Include expected vs. actual behavior
4. Add screenshots or videos if applicable
5. Use appropriate labels

### Issue Labels

- `bug`: Something isn't working as expected
- `feature`: New feature or enhancement
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `wontfix`: This will not be worked on

## Code Review

### Review Process

1. Automated checks must pass before human review
2. At least one maintainer must approve changes
3. Address all review comments before merging
4. Reviewers should provide constructive feedback

### Review Checklist

- Does the code follow our style guidelines?
- Are there appropriate tests?
- Is the documentation updated?
- Does the code solve the problem effectively?
- Are there any security concerns?
- Is the code maintainable?

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward-compatible manner
- PATCH version for backward-compatible bug fixes

### Release Checklist

Before releasing:

1. Ensure all tests pass
2. Update the CHANGELOG.md
3. Update the version number
4. Create a release tag
5. Deploy to production
6. Monitor for any issues

## Security

### Guidelines

- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for configuration
- Follow security best practices for web applications
- Report security vulnerabilities privately to maintainers

### Dependency Management

- Regularly update dependencies to address security vulnerabilities
- Use tools like Dependabot to automate updates
- Review changes in dependencies before updating

## Performance

### Guidelines

- Optimize bundle size
- Minimize network requests
- Use lazy loading for components and routes
- Implement proper caching strategies
- Test performance on various devices and network conditions

## Accessibility

### Requirements

- Follow WCAG 2.1 AA standards
- Ensure keyboard navigation works
- Use semantic HTML elements
- Provide alternative text for images
- Maintain sufficient color contrast

## Continuous Integration

We use GitHub Actions for CI/CD:

- Automated tests run on every PR
- Code linting and formatting checks
- Build verification
- Deployment to staging environments

## Communication

### Channels

- GitHub Issues: For bug reports and feature requests
- Pull Requests: For code review discussions
- Discord: For real-time communication
- Email: For private communications

### Meetings

- Weekly sync meetings for active contributors
- Monthly planning meetings for roadmap discussions
- Quarterly retrospectives

## License

All contributions to ClipFlowAI are subject to the [MIT License](https://github.com/GEMDevEng/ClipFlowAI/blob/main/LICENSE).

## Amendments

These project rules may be amended by maintainers as needed. Contributors will be notified of significant changes.
