# New Features in ClipFlowAI

This document provides detailed information about the new features added to ClipFlowAI.

## Video Customization

The video customization feature allows users to have more control over their generated videos.

### Script Editing

Users can now edit the script that is generated from their prompt. This allows for more precise control over the content of the video.

- The script is initially populated with the prompt text
- Users can edit the script before generating the video
- The edited script is used for the voiceover

### Music Selection

Users can now select background music for their videos from a variety of options.

- Available music options: Default, Upbeat, Relaxed, Dramatic, or No Music
- The selected music is mixed with the voiceover at an appropriate volume level
- Music is added during the video generation process

### Voice Profile Selection

Users can now select different voice profiles for the voiceover.

- Available voice profiles: Default, Male Voice 1, Male Voice 2, Female Voice 1, Female Voice 2
- Each profile has different pitch and rate settings
- The system attempts to find appropriate voices based on the selected profile

### Subtitle Editing

Users can now edit the subtitles that appear in the video.

- Subtitles are initially generated from the script
- Users can edit the subtitles before generating the video
- The edited subtitles are used in the final video

## Video Scheduling & Publishing

The video scheduling and publishing feature allows users to schedule their videos to be published at specific times.

### Scheduling Options

Users can now schedule their videos to be published at a future date and time.

- Date picker allows selecting any future date
- Time picker allows selecting the specific time for publishing
- Scheduled videos are stored in the database with their scheduled publish time

### Publishing Process

The system automatically publishes scheduled videos when their scheduled time arrives.

- A scheduler runs periodically to check for videos that need to be published
- When a video's scheduled time arrives, it is automatically published to the selected platforms
- The status of the video is updated in the database

### Multi-Platform Support

Videos can be published to multiple social media platforms.

- Supported platforms: TikTok, Instagram, YouTube
- Users can select which platforms to publish to
- Each platform has its own publishing process and status tracking

## Multi-Language Support

The multi-language support feature allows users to create videos in multiple languages.

### Supported Languages

The system supports the following languages:

- English (US)
- English (UK)
- Spanish
- French
- German
- Italian
- Japanese
- Korean
- Chinese (Simplified)
- Portuguese (Brazil)
- Russian

### Language Selection

Users can select the language for their video from a dropdown menu.

- The selected language is used for the voiceover
- The system attempts to find voices that match the selected language
- If no matching voice is found, it falls back to available voices

### Voice Selection by Language

The system selects appropriate voices based on the chosen language.

- It first tries to find voices that match the selected language
- If no matching voices are found, it falls back to available voices
- Voice profiles (male, female) are still respected within the language constraint

## Testing

Comprehensive tests have been added to ensure the reliability of the application.

### Frontend Tests

Tests for frontend components and services:

- videoProcessor.test.js: Tests for video generation, caption generation, and transcription
- speechService.test.js: Tests for text-to-speech functionality with different voice profiles and languages
- CreateVideo.test.js: Tests for the CreateVideo component, including form validation and submission

### Backend Tests

Tests for backend services:

- videoGenerator.test.js: Tests for video generation, voiceover generation, and caption generation
- socialMediaPublisher.test.js: Tests for publishing to different platforms and scheduled publishing

## How to Use the New Features

### Video Customization

1. Enter a prompt in the "Video Prompt" field
2. Edit the script in the "Script" field if desired
3. Edit the subtitles in the "Subtitles" field if desired
4. Select a voice profile from the "Voice Profile" dropdown
5. Select background music from the "Background Music" dropdown
6. Continue with the video creation process

### Scheduling a Video

1. Complete the video creation form
2. Check the "Schedule Publishing" checkbox
3. Select the date and time for publishing
4. Continue with the video creation process
5. The video will be automatically published at the scheduled time

### Creating a Video in a Different Language

1. Select the desired language from the "Language" dropdown
2. Enter a prompt in the selected language
3. Edit the script and subtitles if needed
4. Continue with the video creation process
5. The voiceover will be generated in the selected language
