# Backend Structure

This document provides an overview of the backend structure of ClipFlowAI, which is built on Supabase. Since ClipFlowAI follows a $0 budget approach, we leverage Supabase's free tier for all backend functionality.

## Supabase Overview

[Supabase](https://supabase.com/) is an open-source Firebase alternative that provides a suite of tools for building applications:

- **PostgreSQL Database**: A powerful, open-source relational database
- **Authentication**: User management and authentication
- **Storage**: File storage for videos, images, and other assets
- **Realtime**: Realtime subscriptions for database changes
- **Edge Functions**: Serverless functions (similar to Firebase Cloud Functions)
- **Row Level Security (RLS)**: Fine-grained access control at the row level

## Database Schema

The ClipFlowAI database is structured with the following tables:

### Users Table

This table extends Supabase's built-in `auth.users` table with additional user information.

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view any profile" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
```

### Videos Table

This table stores metadata about videos created by users.

```sql
CREATE TABLE public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  prompt TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  status TEXT DEFAULT 'draft',
  is_public BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view public videos" 
  ON public.videos FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own videos" 
  ON public.videos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
  ON public.videos FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" 
  ON public.videos FOR DELETE 
  USING (auth.uid() = user_id);
```

### Tags Table

This table stores tags that can be associated with videos.

```sql
CREATE TABLE public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tags are viewable by everyone" 
  ON public.tags FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can create tags" 
  ON public.tags FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
```

### Video Tags Table

This junction table associates videos with tags (many-to-many relationship).

```sql
CREATE TABLE public.video_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(video_id, tag_id)
);

-- Set up Row Level Security
ALTER TABLE public.video_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Video tags are viewable by everyone" 
  ON public.video_tags FOR SELECT 
  USING (true);

CREATE POLICY "Users can add tags to their own videos" 
  ON public.video_tags FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.videos WHERE id = video_id
    )
  );

CREATE POLICY "Users can remove tags from their own videos" 
  ON public.video_tags FOR DELETE 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.videos WHERE id = video_id
    )
  );
```

### Platform Connections Table

This table stores connections to social media platforms.

```sql
CREATE TABLE public.platform_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  platform_name TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  platform_user_id TEXT,
  platform_username TEXT,
  is_connected BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform_name)
);

-- Set up Row Level Security
ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own platform connections" 
  ON public.platform_connections FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform connections" 
  ON public.platform_connections FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform connections" 
  ON public.platform_connections FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform connections" 
  ON public.platform_connections FOR DELETE 
  USING (auth.uid() = user_id);
```

### Video Publications Table

This table tracks where videos have been published.

```sql
CREATE TABLE public.video_publications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  platform_name TEXT NOT NULL,
  platform_post_id TEXT,
  status TEXT DEFAULT 'pending',
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.video_publications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own publications" 
  ON public.video_publications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own publications" 
  ON public.video_publications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own publications" 
  ON public.video_publications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publications" 
  ON public.video_publications FOR DELETE 
  USING (auth.uid() = user_id);
```

## Storage Structure

Supabase Storage is used to store video files, thumbnails, and user avatars. The storage is organized into the following buckets:

### Videos Bucket

Stores video files created by users.

```sql
-- Create the videos bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Set up access policies
CREATE POLICY "Videos are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'videos');

CREATE POLICY "Users can upload videos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'videos' AND 
    auth.role() = 'authenticated' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own videos" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'videos' AND 
    auth.role() = 'authenticated' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own videos" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'videos' AND 
    auth.role() = 'authenticated' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Thumbnails Bucket

Stores thumbnail images for videos.

```sql
-- Create the thumbnails bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Set up access policies
CREATE POLICY "Thumbnails are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload thumbnails" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'thumbnails' AND 
    auth.role() = 'authenticated' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own thumbnails" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'thumbnails' AND 
    auth.role() = 'authenticated' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own thumbnails" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'thumbnails' AND 
    auth.role() = 'authenticated' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Avatars Bucket

Stores user profile avatars.

```sql
-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Set up access policies
CREATE POLICY "Avatars are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated' AND 
    name = auth.uid()::text || '.jpg'
  );

CREATE POLICY "Users can update their own avatar" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated' AND 
    name = auth.uid()::text || '.jpg'
  );

CREATE POLICY "Users can delete their own avatar" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated' AND 
    name = auth.uid()::text || '.jpg'
  );
```

## Authentication

ClipFlowAI uses Supabase Authentication for user management. The following authentication methods are enabled:

1. **Email/Password**: Traditional email and password authentication
2. **Magic Link**: Passwordless authentication via email links
3. **OAuth Providers**: Social login with Google, GitHub, etc.

### Authentication Configuration

```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign up with email and password
export const signUp = async (email, password) => {
  const { user, session, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  return { user, session };
};

// Sign in with email and password
export const signIn = async (email, password) => {
  const { user, session, error } = await supabase.auth.signIn({
    email,
    password,
  });
  
  if (error) throw error;
  
  return { user, session };
};

// Sign in with magic link
export const signInWithMagicLink = async (email) => {
  const { user, session, error } = await supabase.auth.signIn({
    email,
  });
  
  if (error) throw error;
  
  return { user, session };
};

// Sign in with OAuth provider
export const signInWithProvider = async (provider) => {
  const { user, session, error } = await supabase.auth.signIn({
    provider,
  });
  
  if (error) throw error;
  
  return { user, session };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
};

// Get current user
export const getCurrentUser = () => {
  return supabase.auth.user();
};

// Get current session
export const getCurrentSession = () => {
  return supabase.auth.session();
};
```

## Row Level Security (RLS)

Supabase uses PostgreSQL's Row Level Security to control access to data. RLS policies are defined for each table to ensure that users can only access and modify their own data.

### RLS Policy Examples

#### Profiles Table

```sql
-- Users can view any profile
CREATE POLICY "Users can view any profile" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
```

#### Videos Table

```sql
-- Users can view public videos or their own videos
CREATE POLICY "Users can view public videos" 
  ON public.videos FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

-- Users can insert their own videos
CREATE POLICY "Users can insert their own videos" 
  ON public.videos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own videos
CREATE POLICY "Users can update their own videos" 
  ON public.videos FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete their own videos" 
  ON public.videos FOR DELETE 
  USING (auth.uid() = user_id);
```

## Database Functions

Custom PostgreSQL functions are used to implement complex business logic directly in the database.

### Update Video Statistics

```sql
CREATE OR REPLACE FUNCTION update_video_statistics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.videos
  SET 
    views = (
      SELECT COALESCE(SUM(views), 0)
      FROM public.video_publications
      WHERE video_id = NEW.video_id
    ),
    likes = (
      SELECT COALESCE(SUM(likes), 0)
      FROM public.video_publications
      WHERE video_id = NEW.video_id
    ),
    shares = (
      SELECT COALESCE(SUM(shares), 0)
      FROM public.video_publications
      WHERE video_id = NEW.video_id
    )
  WHERE id = NEW.video_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_stats_trigger
AFTER INSERT OR UPDATE ON public.video_publications
FOR EACH ROW
EXECUTE FUNCTION update_video_statistics();
```

### Auto-Create Profile

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Realtime Subscriptions

Supabase provides realtime functionality that allows clients to subscribe to changes in the database. This is used in ClipFlowAI to update the UI when data changes.

```javascript
// Subscribe to changes in the videos table
const videosSubscription = supabase
  .from('videos')
  .on('*', (payload) => {
    console.log('Change received!', payload);
    // Update UI based on the change
    if (payload.eventType === 'INSERT') {
      // Add new video to the list
    } else if (payload.eventType === 'UPDATE') {
      // Update existing video in the list
    } else if (payload.eventType === 'DELETE') {
      // Remove video from the list
    }
  })
  .subscribe();

// Unsubscribe when component unmounts
return () => {
  supabase.removeSubscription(videosSubscription);
};
```

## API Integration

ClipFlowAI integrates with various social media APIs for sharing videos. These integrations are handled through the frontend, with authentication tokens stored securely in the `platform_connections` table.

### API Service Example

```javascript
// src/services/platformService.js
import { supabase } from './supabase';

// Get user's platform connections
export const getPlatformConnections = async () => {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', supabase.auth.user().id);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching platform connections:', error);
    throw error;
  }
};

// Connect to a platform
export const connectPlatform = async (platformName, authData) => {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: supabase.auth.user().id,
        platform_name: platformName,
        access_token: authData.accessToken,
        refresh_token: authData.refreshToken,
        token_expires_at: new Date(Date.now() + authData.expiresIn * 1000).toISOString(),
        platform_user_id: authData.userId,
        platform_username: authData.username,
        is_connected: true,
      })
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error connecting platform:', error);
    throw error;
  }
};

// Disconnect from a platform
export const disconnectPlatform = async (platformName) => {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .update({
        is_connected: false,
      })
      .match({
        user_id: supabase.auth.user().id,
        platform_name: platformName,
      })
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    throw error;
  }
};

// Publish video to a platform
export const publishVideo = async (videoId, platformName, caption) => {
  try {
    // First, get the platform connection
    const { data: connection, error: connectionError } = await supabase
      .from('platform_connections')
      .select('*')
      .match({
        user_id: supabase.auth.user().id,
        platform_name: platformName,
        is_connected: true,
      })
      .single();
      
    if (connectionError) throw connectionError;
    
    // Then, get the video
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
      
    if (videoError) throw videoError;
    
    // Create a publication record
    const { data: publication, error: publicationError } = await supabase
      .from('video_publications')
      .insert({
        video_id: videoId,
        user_id: supabase.auth.user().id,
        platform_name: platformName,
        status: 'pending',
      })
      .single();
      
    if (publicationError) throw publicationError;
    
    // Publish to the platform (this would be platform-specific)
    // For example, using the Instagram API
    const response = await publishToInstagram(
      connection.access_token,
      video.video_url,
      caption
    );
    
    // Update the publication record
    const { data: updatedPublication, error: updateError } = await supabase
      .from('video_publications')
      .update({
        platform_post_id: response.id,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .match({ id: publication.id })
      .single();
      
    if (updateError) throw updateError;
    
    return updatedPublication;
  } catch (error) {
    console.error('Error publishing video:', error);
    throw error;
  }
};

// Platform-specific publishing function (example for Instagram)
const publishToInstagram = async (accessToken, videoUrl, caption) => {
  // This would use the Instagram Graph API
  // For demonstration purposes, we're returning a mock response
  return {
    id: 'instagram_post_123',
    media_url: videoUrl,
    permalink: 'https://instagram.com/p/123456',
  };
};
```

## Conclusion

The backend structure of ClipFlowAI leverages Supabase's powerful features to provide a robust foundation for the application. By using Supabase's PostgreSQL database, authentication, storage, and realtime capabilities, we can build a full-featured application without the need for a traditional backend server.

Key aspects of the backend architecture include:

1. **Relational Database**: PostgreSQL provides a powerful and flexible database system
2. **Row Level Security**: Fine-grained access control ensures data security
3. **Authentication**: Built-in authentication simplifies user management
4. **Storage**: Integrated file storage for videos and images
5. **Realtime**: Subscriptions keep the UI in sync with the database

This serverless approach allows ClipFlowAI to operate within the free tier limits of Supabase, achieving the $0 budget goal while still providing a robust and scalable backend.
