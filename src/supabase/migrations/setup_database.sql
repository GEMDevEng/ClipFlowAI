-- ClipFlowAI Database Schema Setup
-- This script sets up the complete database schema for the ClipFlowAI application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view any profile'
  ) THEN
    CREATE POLICY "Users can view any profile" 
      ON public.profiles FOR SELECT 
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" 
      ON public.profiles FOR UPDATE 
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" 
      ON public.profiles FOR INSERT 
      WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
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

-- Set up Row Level Security for videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Users can view their own videos'
  ) THEN
    CREATE POLICY "Users can view their own videos" 
      ON public.videos FOR SELECT 
      USING (auth.uid() = user_id OR is_public = true);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Users can insert their own videos'
  ) THEN
    CREATE POLICY "Users can insert their own videos" 
      ON public.videos FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Users can update their own videos'
  ) THEN
    CREATE POLICY "Users can update their own videos" 
      ON public.videos FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Users can delete their own videos'
  ) THEN
    CREATE POLICY "Users can delete their own videos" 
      ON public.videos FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security for tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create policies for tags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'tags' AND policyname = 'Tags are viewable by everyone'
  ) THEN
    CREATE POLICY "Tags are viewable by everyone" 
      ON public.tags FOR SELECT 
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'tags' AND policyname = 'Only authenticated users can create tags'
  ) THEN
    CREATE POLICY "Only authenticated users can create tags" 
      ON public.tags FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;

-- Create video_tags junction table
CREATE TABLE IF NOT EXISTS public.video_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(video_id, tag_id)
);

-- Set up Row Level Security for video_tags
ALTER TABLE public.video_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for video_tags
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'video_tags' AND policyname = 'Users can view video tags'
  ) THEN
    CREATE POLICY "Users can view video tags" 
      ON public.video_tags FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM public.videos
          WHERE videos.id = video_tags.video_id
          AND (videos.user_id = auth.uid() OR videos.is_public = true)
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'video_tags' AND policyname = 'Users can manage tags for their videos'
  ) THEN
    CREATE POLICY "Users can manage tags for their videos" 
      ON public.video_tags FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.videos
          WHERE videos.id = video_tags.video_id
          AND videos.user_id = auth.uid()
        )
      );
  END IF;
END
$$;

-- Create platform_connections table
CREATE TABLE IF NOT EXISTS public.platform_connections (
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

-- Set up Row Level Security for platform_connections
ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for platform_connections
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'platform_connections' AND policyname = 'Users can view their own platform connections'
  ) THEN
    CREATE POLICY "Users can view their own platform connections" 
      ON public.platform_connections FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'platform_connections' AND policyname = 'Users can manage their own platform connections'
  ) THEN
    CREATE POLICY "Users can manage their own platform connections" 
      ON public.platform_connections FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create video_publications table
CREATE TABLE IF NOT EXISTS public.video_publications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  platform_name TEXT NOT NULL,
  platform_post_id TEXT,
  status TEXT DEFAULT 'pending',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security for video_publications
ALTER TABLE public.video_publications ENABLE ROW LEVEL SECURITY;

-- Create policies for video_publications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'video_publications' AND policyname = 'Users can view their own video publications'
  ) THEN
    CREATE POLICY "Users can view their own video publications" 
      ON public.video_publications FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'video_publications' AND policyname = 'Users can manage their own video publications'
  ) THEN
    CREATE POLICY "Users can manage their own video publications" 
      ON public.video_publications FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL,
  user_id UUID NOT NULL,
  platform VARCHAR(50) NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Add foreign key constraint
  CONSTRAINT fk_video
    FOREIGN KEY (video_id)
    REFERENCES videos (id)
    ON DELETE CASCADE
);

-- Enable RLS on the analytics table
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Users can view their own analytics'
  ) THEN
    CREATE POLICY "Users can view their own analytics"
      ON public.analytics
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'System can insert analytics'
  ) THEN
    CREATE POLICY "System can insert analytics"
      ON public.analytics
      FOR INSERT
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'System can update analytics'
  ) THEN
    CREATE POLICY "System can update analytics"
      ON public.analytics
      FOR UPDATE
      USING (true);
  END IF;
END
$$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_video_id ON public.analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(date);

-- Add comments to tables
COMMENT ON TABLE public.profiles IS 'User profile information extending the auth.users table';
COMMENT ON TABLE public.videos IS 'Videos created by users';
COMMENT ON TABLE public.tags IS 'Tags that can be associated with videos';
COMMENT ON TABLE public.video_tags IS 'Junction table for the many-to-many relationship between videos and tags';
COMMENT ON TABLE public.platform_connections IS 'Social media platform connections for users';
COMMENT ON TABLE public.video_publications IS 'Records of where videos have been published';
COMMENT ON TABLE public.analytics IS 'Stores analytics data for videos across different platforms';
