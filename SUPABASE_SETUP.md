# Supabase Setup Guide for ClipFlowAI

This guide will walk you through setting up Supabase for the ClipFlowAI project.

## Prerequisites

- A GitHub account (for signing up to Supabase)
- Basic knowledge of SQL and web development

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in with your GitHub account
2. Click "New Project"
3. Choose an organization or create a new one
4. Enter "ClipFlowAI" as the project name
5. Set a secure database password (save this somewhere safe)
6. Choose a region closest to your target audience
7. Click "Create new project"
8. Wait for your project to be set up (this may take a few minutes)

## Step 2: Set Up Database Tables

Once your project is ready, you'll need to create the necessary database tables:

### Videos Table

1. Go to the "Table Editor" in the Supabase dashboard
2. Click "New Table"
3. Enter the following details:
   - Name: `videos`
   - Enable Row Level Security (RLS): Yes
   - Columns:
     - `id` (type: uuid, Primary Key, Default: `uuid_generate_v4()`)
     - `title` (type: text, Nullable: No)
     - `prompt` (type: text, Nullable: No)
     - `status` (type: text, Default: 'pending')
     - `video_url` (type: text, Nullable: Yes)
     - `thumbnail_url` (type: text, Nullable: Yes)
     - `duration` (type: integer, Nullable: Yes)
     - `created_at` (type: timestamp with time zone, Default: `now()`)
     - `updated_at` (type: timestamp with time zone, Nullable: Yes)
     - `published_at` (type: timestamp with time zone, Nullable: Yes)
     - `user_id` (type: uuid, Nullable: No)
     - `user_display_name` (type: text, Nullable: Yes)
4. Click "Save"

### Platforms Table

1. Click "New Table"
2. Enter the following details:
   - Name: `platforms`
   - Enable Row Level Security (RLS): Yes
   - Columns:
     - `id` (type: uuid, Primary Key, Default: `uuid_generate_v4()`)
     - `video_id` (type: uuid, Nullable: No)
     - `name` (type: text, Nullable: No)
     - `status` (type: text, Default: 'pending')
     - `published_url` (type: text, Nullable: Yes)
     - `published_at` (type: timestamp with time zone, Nullable: Yes)
     - `created_at` (type: timestamp with time zone, Default: `now()`)
     - `updated_at` (type: timestamp with time zone, Nullable: Yes)
3. Click "Save"

## Step 3: Set Up Foreign Key Relationships

1. Go to the "platforms" table
2. Click on the "video_id" column
3. Click "Edit column"
4. Under "Foreign Key Constraint", select:
   - Referenced Table: `videos`
   - Referenced Column: `id`
5. Click "Save"

## Step 4: Set Up Row Level Security (RLS) Policies

### Videos Table Policies

1. Go to the "Authentication" section in the sidebar
2. Click on "Policies"
3. Select the "videos" table
4. Add the following policies:

#### Select Policy (Read)
- Name: "Users can view their own videos"
- Policy Type: Select using custom check
- Policy Definition: `auth.uid() = user_id`
- Click "Save"

#### Insert Policy (Create)
- Name: "Users can insert their own videos"
- Policy Type: Insert with check
- Policy Definition: `auth.uid() = user_id`
- Click "Save"

#### Update Policy (Update)
- Name: "Users can update their own videos"
- Policy Type: Update using custom check
- Policy Definition: `auth.uid() = user_id`
- Click "Save"

#### Delete Policy (Delete)
- Name: "Users can delete their own videos"
- Policy Type: Delete using custom check
- Policy Definition: `auth.uid() = user_id`
- Click "Save"

### Platforms Table Policies

1. Select the "platforms" table
2. Add the following policies:

#### Select Policy (Read)
- Name: "Users can view platforms for their videos"
- Policy Type: Select using custom check
- Policy Definition: `auth.uid() IN (SELECT user_id FROM videos WHERE id = video_id)`
- Click "Save"

#### Insert Policy (Create)
- Name: "Users can insert platforms for their videos"
- Policy Type: Insert with check
- Policy Definition: `auth.uid() IN (SELECT user_id FROM videos WHERE id = video_id)`
- Click "Save"

#### Update Policy (Update)
- Name: "Users can update platforms for their videos"
- Policy Type: Update using custom check
- Policy Definition: `auth.uid() IN (SELECT user_id FROM videos WHERE id = video_id)`
- Click "Save"

#### Delete Policy (Delete)
- Name: "Users can delete platforms for their videos"
- Policy Type: Delete using custom check
- Policy Definition: `auth.uid() IN (SELECT user_id FROM videos WHERE id = video_id)`
- Click "Save"

## Step 5: Set Up Storage Buckets

1. Go to the "Storage" section in the sidebar
2. Click "Create a new bucket"
3. Enter "videos" as the bucket name
4. Make sure "Public" is selected
5. Click "Create bucket"
6. Repeat the process to create a "thumbnails" bucket

### Set Up Storage Policies

1. Click on the "videos" bucket
2. Go to the "Policies" tab
3. Add the following policies:

#### Select Policy (Read)
- Name: "Anyone can view videos"
- Policy Type: Select using custom check
- Policy Definition: `true`
- Click "Save"

#### Insert Policy (Create)
- Name: "Authenticated users can upload videos"
- Policy Type: Insert with check
- Policy Definition: `auth.role() = 'authenticated'`
- Click "Save"

#### Update Policy (Update)
- Name: "Users can update their own videos"
- Policy Type: Update using custom check
- Policy Definition: `auth.uid() = (storage.foldername)[0]::uuid`
- Click "Save"

#### Delete Policy (Delete)
- Name: "Users can delete their own videos"
- Policy Type: Delete using custom check
- Policy Definition: `auth.uid() = (storage.foldername)[0]::uuid`
- Click "Save"

4. Repeat the same policies for the "thumbnails" bucket

## Step 6: Set Up Authentication

1. Go to the "Authentication" section in the sidebar
2. Click on "Providers"
3. Make sure "Email" is enabled
4. Enable "Google" provider:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Set up OAuth consent screen
   - Create OAuth credentials
   - Add the Supabase redirect URL
   - Copy the Client ID and Client Secret to Supabase

## Step 7: Get Your Supabase Configuration

1. Go to the "Settings" section in the sidebar
2. Click on "API"
3. Copy the following values:
   - URL: Your Supabase project URL
   - anon/public key: Your public API key

## Step 8: Add Supabase Configuration to Your Project

1. Create a `.env` file in the `src/frontend` directory
2. Add the following environment variables:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

- **CORS Issues**: If you encounter CORS issues, make sure your domain is added to the allowed domains in the Supabase dashboard under Settings > API > CORS.
- **Authentication Errors**: Check that your Supabase URL and anon key are correct.
- **Database Errors**: Verify that your table schemas match the expected structure.
- **Storage Access Denied**: Check your storage bucket policies to ensure they allow the operations you're trying to perform.
