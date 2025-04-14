-- Create the analytics table for tracking video performance metrics
CREATE TABLE public.analytics (
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

-- Create policy to allow users to read their own analytics
CREATE POLICY "Users can view their own analytics"
  ON public.analytics
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow system to insert analytics
CREATE POLICY "System can insert analytics"
  ON public.analytics
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow system to update analytics
CREATE POLICY "System can update analytics"
  ON public.analytics
  FOR UPDATE
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_analytics_video_id ON public.analytics(video_id);
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_analytics_date ON public.analytics(date);

-- Add a comment to the table
COMMENT ON TABLE public.analytics IS 'Stores analytics data for videos across different platforms';
