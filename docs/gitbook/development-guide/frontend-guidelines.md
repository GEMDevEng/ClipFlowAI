# Frontend Guidelines

This document outlines the guidelines and best practices for frontend development in the ClipFlowAI project.

## Technology Stack

ClipFlowAI uses the following frontend technologies:

- **React**: For building the user interface
- **React Router**: For routing and navigation
- **Chakra UI**: For component library and styling
- **FFmpeg.js**: For client-side video processing
- **Web Speech API**: For text-to-speech functionality
- **Supabase Client**: For authentication and database operations

## Project Structure

The frontend code is organized in the `src/frontend` directory with the following structure:

```
src/frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # Reusable React components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layout components
│   ├── pages/           # Page components
│   ├── services/        # API and service functions
│   ├── styles/          # Global styles and theme
│   ├── utils/           # Utility functions
│   ├── App.js           # Main App component
│   └── index.js         # Entry point
└── package.json         # Dependencies and scripts
```

## Coding Standards

### General Guidelines

1. **Use TypeScript** for type safety and better developer experience
2. **Follow the React Hooks pattern** for state management
3. **Use functional components** instead of class components
4. **Keep components small and focused** on a single responsibility
5. **Use meaningful variable and function names** that describe their purpose
6. **Comment complex logic** but avoid unnecessary comments

### Component Structure

Components should follow this structure:

```jsx
// Import statements
import React from 'react';
import PropTypes from 'prop-types';

// Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = React.useState(initialState);
  
  // Event handlers and other functions
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default props
ComponentName.defaultProps = {
  prop2: 0,
};

// Export
export default ComponentName;
```

### Styling Guidelines

1. **Use Chakra UI components** for consistent styling
2. **Follow the design system** for colors, typography, and spacing
3. **Use responsive design** to ensure the application works on all devices
4. **Avoid inline styles** except for dynamic values
5. **Use theme variables** for colors, fonts, and other design tokens

Example:

```jsx
import { Box, Text, Button } from '@chakra-ui/react';

const MyComponent = () => {
  return (
    <Box p={4} bg="gray.100" borderRadius="md">
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        Title
      </Text>
      <Button colorScheme="blue">Click Me</Button>
    </Box>
  );
};
```

### State Management

1. **Use React Context** for global state that needs to be accessed by many components
2. **Use React Hooks** (`useState`, `useReducer`) for component-level state
3. **Keep state as local as possible** to the components that need it
4. **Use custom hooks** to encapsulate and reuse stateful logic

Example of a custom hook:

```jsx
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
```

### Performance Optimization

1. **Use React.memo** for components that render often but with the same props
2. **Use useCallback** for functions passed as props to child components
3. **Use useMemo** for expensive calculations
4. **Avoid unnecessary re-renders** by keeping component state minimal
5. **Lazy load components** that are not needed on initial render

Example:

```jsx
import React, { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
};
```

## Testing

1. **Write unit tests** for utility functions and hooks
2. **Write component tests** for UI components
3. **Use React Testing Library** for testing React components
4. **Mock external dependencies** like API calls
5. **Aim for high test coverage** but prioritize critical paths

Example test:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  
  fireEvent.click(screen.getByText('Click Me'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Accessibility

1. **Use semantic HTML** elements (`<button>`, `<nav>`, `<header>`, etc.)
2. **Add ARIA attributes** when necessary
3. **Ensure keyboard navigation** works for all interactive elements
4. **Maintain sufficient color contrast** for text and UI elements
5. **Test with screen readers** to ensure compatibility

## Browser Compatibility

ClipFlowAI should work on the following browsers:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Code Review Checklist

Before submitting a pull request, ensure your code:

- [ ] Follows the project's coding standards
- [ ] Is well-documented with comments where necessary
- [ ] Has appropriate test coverage
- [ ] Is accessible
- [ ] Is responsive on different screen sizes
- [ ] Has no console errors or warnings
- [ ] Has been tested on different browsers

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
