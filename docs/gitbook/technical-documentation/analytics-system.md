# Analytics System

The ClipFlowAI analytics system provides users with insights into the performance of their videos across different social media platforms.

## Overview

The analytics system consists of several components:

1. **Data Collection**: Background processes that gather metrics from social media platforms
2. **Data Storage**: Database tables for storing and aggregating analytics data
3. **Data Visualization**: Frontend components for displaying analytics in an intuitive way
4. **Insights Generation**: Algorithms that analyze data to provide actionable recommendations

## Data Collection

Analytics data is collected through two main methods:

### Frontend Collection

When a user views their video details or analytics dashboard, the frontend makes direct API calls to fetch the latest metrics:

```javascript
// Example from analyticsService.js
export const fetchVideoAnalytics = async (videoId) => {
  // Get the video's platform publications
  const { data: platforms } = await supabase
    .from('platforms')
    .select('name, published_url')
    .eq('video_id', videoId);
  
  // For each platform, fetch analytics
  const analyticsData = await Promise.all(
    platforms.map(async (platform) => {
      return simulatePlatformAnalytics(platform.name, videoId);
    })
  );
  
  // Process and return the data
  // ...
};
```

### Background Collection

A Node.js service periodically collects analytics data for all published videos:

```javascript
// Example from analyticsCollector.js
const collectAnalytics = async () => {
  // Get all published videos with their platforms
  const { data: videos } = await supabase
    .from('videos')
    .select(`
      id,
      user_id,
      platforms (
        id,
        name,
        status,
        published_url
      )
    `)
    .eq('status', 'published');
  
  // Process each video
  for (const video of videos) {
    await processVideo(video);
  }
};
```

## Data Storage

Analytics data is stored in two main locations:

### Videos Table

The `videos` table contains aggregate metrics for each video:

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
```

### Analytics Table

The `analytics` table stores detailed metrics over time for each platform:

```sql
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
  
  CONSTRAINT fk_video
    FOREIGN KEY (video_id)
    REFERENCES videos (id)
    ON DELETE CASCADE
);
```

## Data Visualization

The frontend uses the Recharts library to visualize analytics data:

### Views Over Time

```jsx
<LineChart
  data={timeData}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" tickFormatter={formatDate} />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line
    type="monotone"
    dataKey="views"
    stroke="#8884d8"
    activeDot={{ r: 8 }}
  />
</LineChart>
```

### Performance by Platform

```jsx
<BarChart
  data={platformData}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="platform" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="views" fill="#8884d8" name="Views" />
  <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
  <Bar dataKey="shares" fill="#ffc658" name="Shares" />
</BarChart>
```

## Insights Generation

The system analyzes analytics data to generate insights and recommendations:

1. **Trend Analysis**: Identifying patterns in video performance over time
2. **Platform Comparison**: Determining which platforms perform best for different content types
3. **Content Optimization**: Suggesting improvements based on high-performing videos
4. **Audience Engagement**: Analyzing when and how users engage with content

## Future Enhancements

The analytics system will be enhanced with the following features:

1. **Real-time Analytics**: Live updates of video performance metrics
2. **Advanced Visualizations**: Heat maps, funnel charts, and cohort analysis
3. **Predictive Analytics**: ML-based predictions of video performance
4. **Export Capabilities**: Exporting analytics data in various formats (CSV, PDF)
5. **Custom Dashboards**: User-configurable analytics dashboards
