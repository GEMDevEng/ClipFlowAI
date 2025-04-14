# Frontend Structure

This document provides an overview of the frontend structure of ClipFlowAI, including the organization of components, state management, and routing.

## Directory Structure

The frontend code is organized in the `src/frontend` directory with the following structure:

```
src/frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # Reusable React components
│   │   ├── common/      # Common UI components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── video/       # Video-related components
│   │   ├── auth/        # Authentication components
│   │   └── layout/      # Layout components
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

## Component Organization

Components in ClipFlowAI are organized following a modular approach:

### Common Components

These are reusable UI components that can be used across the application:

- `Button`: Custom button component with various styles
- `Card`: Container component for displaying content
- `Input`: Form input components
- `Modal`: Dialog component for displaying content in a modal
- `Spinner`: Loading indicator
- `Toast`: Notification component

### Feature-Specific Components

Components are grouped by feature to maintain a clear separation of concerns:

#### Authentication Components

- `LoginForm`: Form for user login
- `RegisterForm`: Form for user registration
- `PasswordResetForm`: Form for resetting password
- `SocialLogin`: Component for social media login options

#### Dashboard Components

- `VideoCard`: Card displaying video information
- `VideoGrid`: Grid layout for displaying multiple videos
- `FilterBar`: Component for filtering videos
- `SearchBar`: Component for searching videos

#### Video Components

- `VideoPlayer`: Component for playing videos
- `VideoForm`: Form for creating/editing videos
- `ProgressBar`: Component showing video generation progress
- `CaptionEditor`: Component for editing video captions
- `ThumbnailGenerator`: Component for generating video thumbnails

#### Layout Components

- `Header`: Application header with navigation
- `Sidebar`: Sidebar navigation
- `Footer`: Application footer
- `PageContainer`: Container for page content

## State Management

ClipFlowAI uses a combination of React's built-in state management and context API for managing application state:

### Local Component State

For component-specific state that doesn't need to be shared, we use React's `useState` and `useReducer` hooks:

```jsx
const VideoCard = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Card>
      <CardHeader onClick={toggleExpand}>
        <Heading>{video.title}</Heading>
      </CardHeader>
      {isExpanded && (
        <CardBody>
          <Text>{video.description}</Text>
        </CardBody>
      )}
    </Card>
  );
};
```

### Application State

For state that needs to be shared across components, we use React Context:

#### Auth Context

Manages authentication state and provides authentication-related functions:

```jsx
// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for active session
    const session = supabase.auth.session();
    setUser(session?.user || null);
    setLoading(false);
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  
  const value = {
    user,
    loading,
    signIn: (email, password) => supabase.auth.signIn({ email, password }),
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

#### Video Context

Manages video-related state and operations:

```jsx
// src/contexts/VideoContext.js
import { createContext, useContext, useState, useReducer } from 'react';
import { supabase } from '../services/supabase';

const VideoContext = createContext();

const initialState = {
  videos: [],
  loading: false,
  error: null,
};

function videoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_VIDEOS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_VIDEOS_SUCCESS':
      return { ...state, loading: false, videos: action.payload };
    case 'FETCH_VIDEOS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_VIDEO':
      return { ...state, videos: [...state.videos, action.payload] };
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video => 
          video.id === action.payload.id ? action.payload : video
        ),
      };
    case 'DELETE_VIDEO':
      return {
        ...state,
        videos: state.videos.filter(video => video.id !== action.payload),
      };
    default:
      return state;
  }
}

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);
  
  const fetchVideos = async () => {
    dispatch({ type: 'FETCH_VIDEOS_REQUEST' });
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      dispatch({ type: 'FETCH_VIDEOS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_VIDEOS_FAILURE', payload: error.message });
    }
  };
  
  const addVideo = async (videoData) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert(videoData)
        .single();
        
      if (error) throw error;
      
      dispatch({ type: 'ADD_VIDEO', payload: data });
      return data;
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  };
  
  const updateVideo = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .match({ id })
        .single();
        
      if (error) throw error;
      
      dispatch({ type: 'UPDATE_VIDEO', payload: data });
      return data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  };
  
  const deleteVideo = async (id) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .match({ id });
        
      if (error) throw error;
      
      dispatch({ type: 'DELETE_VIDEO', payload: id });
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  };
  
  const value = {
    videos: state.videos,
    loading: state.loading,
    error: state.error,
    fetchVideos,
    addVideo,
    updateVideo,
    deleteVideo,
  };
  
  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  return useContext(VideoContext);
};
```

## Routing

ClipFlowAI uses React Router for navigation and routing:

```jsx
// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateVideo from './pages/CreateVideo';
import VideoDetails from './pages/VideoDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import theme from './styles/theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <VideoProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="create" element={
                  <PrivateRoute>
                    <CreateVideo />
                  </PrivateRoute>
                } />
                <Route path="videos/:id" element={
                  <PrivateRoute>
                    <VideoDetails />
                  </PrivateRoute>
                } />
                <Route path="profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </VideoProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
```

## Custom Hooks

ClipFlowAI uses custom hooks to encapsulate and reuse logic:

### `useLocalStorage`

A hook for persisting state in localStorage:

```jsx
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
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
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

### `useFFmpeg`

A hook for using FFmpeg.js:

```jsx
// src/hooks/useFFmpeg.js
import { useState, useEffect, useCallback } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export function useFFmpeg() {
  const [ffmpeg, setFFmpeg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const ffmpegInstance = createFFmpeg({ log: true });
        await ffmpegInstance.load();
        setFFmpeg(ffmpegInstance);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadFFmpeg();
  }, []);
  
  const processVideo = useCallback(async (inputFile, options) => {
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    
    try {
      // Write the input file to memory
      ffmpeg.FS('writeFile', 'input', await fetchFile(inputFile));
      
      // Run FFmpeg command
      await ffmpeg.run(
        '-i', 'input',
        ...options.outputArgs,
        'output.mp4'
      );
      
      // Read the output file
      const data = ffmpeg.FS('readFile', 'output.mp4');
      
      // Create a URL
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      );
      
      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [ffmpeg]);
  
  return { ffmpeg, loading, error, processVideo };
}
```

## Styling

ClipFlowAI uses Chakra UI for styling, with a custom theme:

```jsx
// src/styles/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff', // Primary color
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
  fonts: {
    heading: 'Poppins, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
  },
});

export default theme;
```

## Services

ClipFlowAI uses service modules to interact with external APIs:

### Supabase Service

```jsx
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    
  if (error) throw error;
  
  return data;
};

export const getFileUrl = (bucket, path) => {
  const { publicURL, error } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  if (error) throw error;
  
  return publicURL;
};
```

### Video Service

```jsx
// src/services/videoService.js
import { supabase, uploadFile, getFileUrl } from './supabase';

export const createVideo = async (videoData, videoFile) => {
  try {
    // Upload video file
    const userId = supabase.auth.user().id;
    const filePath = `${userId}/${Date.now()}-${videoFile.name}`;
    await uploadFile('videos', filePath, videoFile);
    
    // Get public URL
    const videoUrl = getFileUrl('videos', filePath);
    
    // Create video record
    const { data, error } = await supabase
      .from('videos')
      .insert({
        ...videoData,
        user_id: userId,
        video_url: videoUrl,
        status: 'published',
      })
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

export const getVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

export const updateVideo = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .match({ id })
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const deleteVideo = async (id) => {
  try {
    // Get video to find file path
    const video = await getVideoById(id);
    
    // Delete from storage if there's a video_url
    if (video.video_url) {
      const path = video.video_url.split('/').slice(-2).join('/');
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([path]);
        
      if (storageError) throw storageError;
    }
    
    // Delete from database
    const { error } = await supabase
      .from('videos')
      .delete()
      .match({ id });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};
```

## Conclusion

The frontend structure of ClipFlowAI is designed to be modular, maintainable, and scalable. By organizing code into components, contexts, hooks, and services, we create a clear separation of concerns that makes the codebase easier to understand and extend.

Key aspects of the frontend architecture include:

1. **Component-Based Design**: UI elements are broken down into reusable components
2. **Context-Based State Management**: Application state is managed using React Context
3. **Custom Hooks**: Logic is encapsulated in custom hooks for reusability
4. **Service Modules**: External API interactions are abstracted into service modules
5. **Consistent Styling**: Chakra UI provides a consistent design system

This architecture allows for efficient development, easier testing, and a better developer experience.
