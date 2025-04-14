# Architecture Overview

## System Architecture

ClipFlowAI follows a frontend-centric architecture with Supabase as the backend-as-a-service (BaaS) provider. This approach allows for rapid development and deployment while maintaining security and scalability.

```mermaid
graph TD
    User[User] --> Frontend[React Frontend]
    Frontend --> Supabase[Supabase]
    Supabase --> Auth[Authentication]
    Supabase --> DB[Database]
    Supabase --> Storage[Storage]
    Supabase --> RLS[Row Level Security]
    
    Frontend --> AuxBackend[Auxiliary Backend]
    AuxBackend --> TelegramBot[Telegram Bot]
    AuxBackend --> AnalyticsCollector[Analytics Collector]
    
    AnalyticsCollector --> Supabase
    TelegramBot --> User
```

## Key Components

### Frontend (React)

The frontend is built with React and handles most of the application logic, including:

- User interface and experience
- Direct communication with Supabase for data operations
- Video creation and management
- Analytics visualization

### Supabase

Supabase provides several core services:

- **Authentication**: User signup, login, and profile management
- **Database**: PostgreSQL database for storing video metadata, platform information, and analytics
- **Storage**: File storage for videos and thumbnails
- **Row Level Security (RLS)**: Fine-grained access control at the row level

### Auxiliary Backend (Node.js)

A lightweight Node.js backend handles auxiliary services that cannot be managed directly from the frontend:

- **Telegram Bot**: Provides an alternative interface for creating and managing videos
- **Analytics Collector**: Periodically collects analytics data from social media platforms

## Data Flow

### Video Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase
    
    User->>Frontend: Creates video
    Frontend->>Supabase: Uploads video file
    Supabase-->>Frontend: Returns storage URL
    Frontend->>Supabase: Creates video record
    Supabase-->>Frontend: Returns video data
    Frontend->>User: Shows success message
```

### Analytics Collection Flow

```mermaid
sequenceDiagram
    participant Backend
    participant Platforms as Social Media Platforms
    participant Supabase
    
    Note over Backend: Runs every 60 minutes
    Backend->>Supabase: Fetches published videos
    Supabase-->>Backend: Returns video data
    
    loop For each video
        Backend->>Platforms: Requests analytics data
        Platforms-->>Backend: Returns metrics
        Backend->>Supabase: Stores analytics data
    end
```

## Security Model

Security is primarily handled through Supabase's Row Level Security (RLS) policies:

- Users can only access their own data
- Authentication is managed through JWT tokens
- API keys are stored securely in environment variables
- The frontend never exposes sensitive credentials

## Deployment Architecture

The application is deployed using GitHub Pages for the frontend and a lightweight server for the auxiliary backend:

```mermaid
graph TD
    GitHubPages[GitHub Pages] --> Frontend[React Frontend]
    Server[Node.js Server] --> AuxBackend[Auxiliary Backend]
    Frontend --> Supabase
    AuxBackend --> Supabase
```

## Future Architectural Considerations

As the application grows, several architectural enhancements are planned:

1. **Serverless Functions**: Move auxiliary services to Supabase Edge Functions
2. **Real-time Updates**: Implement Supabase's real-time subscriptions for live analytics
3. **Caching Layer**: Add Redis caching for frequently accessed data
4. **Microservices**: Split the backend into specialized microservices for video processing, analytics, and notifications
