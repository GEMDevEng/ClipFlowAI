# Social Media Integration Guide

This guide explains how to use the social media integration features in ClipFlowAI to publish videos to multiple platforms.

## Overview

ClipFlowAI allows you to publish your generated videos to multiple social media platforms, including:

- YouTube Shorts
- TikTok
- Instagram Reels

You can publish videos immediately or schedule them for later publication. The system also provides analytics and status tracking for your published videos.

## Setting Up Platform Connections

Before you can publish videos to social media platforms, you need to connect your accounts.

### Connecting Platforms

1. Navigate to the **Social Media** page in the application
2. Click on the **Connect Platforms** tab
3. Click the **Connect** button next to the platform you want to connect
4. Follow the OAuth flow to authorize ClipFlowAI to publish on your behalf
5. Once connected, you'll see your account information and a "Connected" status

### Managing Platform Connections

- **Refresh**: If your connection expires, you can refresh it by clicking the "Refresh" button
- **Disconnect**: To remove a connection, click the "Disconnect" button

## Publishing Videos

### Immediate Publishing

To publish a video immediately:

1. Navigate to the **Video Details** page for the video you want to publish
2. Click the **Publish** button
3. Select the platforms you want to publish to
4. Add any platform-specific details (title, description, tags, etc.)
5. Click **Publish Now**

### Scheduled Publishing

To schedule a video for later publication:

1. Navigate to the **Video Details** page for the video you want to publish
2. Click the **Schedule** button
3. Select the platforms you want to publish to
4. Add any platform-specific details (title, description, tags, etc.)
5. Set the date and time for publication
6. Click **Schedule**

### Managing Scheduled Publications

To manage your scheduled publications:

1. Navigate to the **Social Media** page
2. Click on the **Scheduled Publishing** tab
3. View all your scheduled publications
4. You can:
   - Publish a video immediately by clicking "Publish Now"
   - Edit the scheduled publication by clicking "Edit"
   - Cancel the scheduled publication by clicking "Cancel"

## Viewing Publishing History

To view your publishing history:

1. Navigate to the **Social Media** page
2. Click on the **Publishing History** tab
3. View all your published videos across all platforms
4. Filter by platform, date range, or status

## Platform-Specific Details

### YouTube Shorts

- **Video Requirements**:
  - Aspect ratio: 9:16 (vertical)
  - Resolution: 1080x1920 recommended
  - Length: Up to 60 seconds
  - File size: Up to 2GB
  - Format: MP4

- **Publishing Options**:
  - Title (required)
  - Description
  - Tags
  - Privacy setting (Public, Unlisted, Private)
  - Category

### TikTok

- **Video Requirements**:
  - Aspect ratio: 9:16 (vertical)
  - Resolution: 1080x1920 recommended
  - Length: Up to 60 seconds
  - File size: Up to 500MB
  - Format: MP4

- **Publishing Options**:
  - Caption
  - Cover image
  - Allow comments (yes/no)
  - Allow duets (yes/no)
  - Allow stitches (yes/no)

### Instagram Reels

- **Video Requirements**:
  - Aspect ratio: 9:16 (vertical)
  - Resolution: 1080x1920 recommended
  - Length: Up to 60 seconds
  - File size: Up to 500MB
  - Format: MP4

- **Publishing Options**:
  - Caption
  - Cover image
  - Location tag
  - People tags

## Troubleshooting

### Connection Issues

If you're having trouble connecting to a platform:

1. Check that you're using the correct account credentials
2. Ensure you've granted all the required permissions
3. Try disconnecting and reconnecting the platform
4. Check if the platform's API status is operational

### Publishing Issues

If your video fails to publish:

1. Check the error message in the publishing history
2. Verify that your video meets the platform's requirements
3. Ensure your platform connection is still valid
4. Try publishing to a different platform to isolate the issue

### Scheduled Publishing Issues

If your scheduled publication doesn't occur:

1. Check the server logs for any errors
2. Verify that the scheduled time has passed
3. Ensure your platform connection was valid at the scheduled time
4. Check if the video was deleted or modified after scheduling

## API Reference

### Frontend Services

- `socialMediaService.js`: Handles all social media operations
  - `getConnectedPlatforms(userId)`: Get all connected platforms
  - `connectPlatform(userId, platform, authCode)`: Connect a platform
  - `disconnectPlatform(userId, platformId)`: Disconnect a platform
  - `publishVideo(userId, videoId, platforms, options)`: Publish a video
  - `scheduleVideo(userId, videoId, platforms, scheduledTime, options)`: Schedule a video
  - `getScheduledVideos(userId)`: Get all scheduled videos
  - `getVideoStatus(userId, videoId)`: Get video status on all platforms
  - `getVideoAnalytics(userId, videoId)`: Get video analytics from all platforms

### Backend Services

- `socialMediaIntegration.js`: Handles OAuth and platform connections
- `socialMediaPublisher.js`: Handles video publishing to platforms
- `schedulerService.js`: Handles scheduled publishing

### Database Schema

- `social_platforms`: Stores platform connections
  - `id`: Platform connection ID
  - `user_id`: User ID
  - `platform`: Platform name (youtube, tiktok, instagram)
  - `access_token`: OAuth access token
  - `refresh_token`: OAuth refresh token
  - `expires_at`: Token expiration time
  - `username`: Platform username
  - `profile_url`: Platform profile URL

- `publishing_history`: Stores publishing history
  - `id`: Publishing history ID
  - `user_id`: User ID
  - `video_id`: Video ID
  - `platform`: Platform name
  - `platform_video_id`: Video ID on the platform
  - `published_url`: URL to the published video
  - `published_at`: Publication time
  - `status`: Publication status

- `videos`: Updated with publishing fields
  - `published`: Whether the video has been published
  - `published_at`: When the video was published
  - `published_platforms`: Platforms the video was published to
  - `scheduled_publish`: Whether the video is scheduled for publishing
  - `scheduled_publish_time`: When the video is scheduled to be published
  - `scheduled_platforms`: Platforms the video is scheduled to be published to
  - `scheduled_options`: Options for scheduled publishing
