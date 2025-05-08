# RunwayML Integration Setup Guide for ClipFlowAI

This guide will walk you through setting up RunwayML integration for the ClipFlowAI project to enable AI-powered video generation.

## Prerequisites

- A RunwayML account (sign up at [RunwayML](https://runwayml.com/))
- A Google Cloud account for Text-to-Speech and Speech-to-Text APIs
- Basic knowledge of API keys and environment variables

## Step 1: Get RunwayML API Key

1. Sign up or log in to [RunwayML](https://runwayml.com/)
2. Navigate to your account settings
3. Go to the API section
4. Generate a new API key
5. Copy the API key to a secure location

## Step 2: Set Up Google Cloud APIs

### Text-to-Speech API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Text-to-Speech API" and enable it
5. Go to "APIs & Services" > "Credentials"
6. Create an API key
7. Copy the API key to a secure location

### Speech-to-Text API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Speech-to-Text API" and enable it
3. If you haven't created an API key yet, go to "APIs & Services" > "Credentials"
4. Create an API key
5. Copy the API key to a secure location

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory of your project (or copy from `.env.example`)
2. Add the following environment variables:

```
# API Keys for Video Generation
RUNWAY_API_KEY=your_runway_api_key_here
GOOGLE_TTS_API_KEY=your_google_tts_api_key_here
GOOGLE_STT_API_KEY=your_google_stt_api_key_here
```

3. Replace the placeholder values with your actual API keys

## Step 4: Test the Integration

1. Start the backend server:
```
npm run start
```

2. Start the frontend development server:
```
cd src/frontend && npm start
```

3. Navigate to the "Create Video" page
4. Fill in the form with a title, prompt, and upload a background image
5. Click "Create Video" to test the video generation process

## Troubleshooting

### API Key Issues

If you encounter errors related to API keys:

1. Verify that your API keys are correctly set in the `.env` file
2. Check that the environment variables are being properly loaded
3. Ensure that your RunwayML and Google Cloud accounts are active and have billing set up if required

### Video Generation Failures

If video generation fails:

1. Check the browser console and server logs for error messages
2. Verify that your prompt is appropriate for video generation
3. Ensure that the background image is in a supported format (JPG, PNG, GIF)
4. Try with a simpler prompt or different background image

## Advanced Configuration

### Customizing RunwayML Parameters

You can customize the RunwayML video generation parameters in `src/backend/services/videoGenerator.js`:

```javascript
const response = await axios.post(
  'https://api.runwayml.com/v1/text-to-video',
  {
    prompt,
    negative_prompt: "poor quality, blurry, distorted, pixelated",
    num_frames: 120, // Adjust based on desired video length
    width: 768,
    height: 1344, // Portrait format for social media
    seed: Math.floor(Math.random() * 1000000), // Random seed for variation
    cfg_scale: 7.5, // Controls how closely the model follows the prompt
    motion_bucket_id: 40, // Controls the amount of motion
  },
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  }
);
```

Adjust these parameters to control the video output:

- `num_frames`: Number of frames to generate (affects video length)
- `width` and `height`: Video dimensions
- `seed`: Random seed for consistent results (use the same seed to get similar videos)
- `cfg_scale`: How closely the model follows the prompt (higher values = more faithful to prompt)
- `motion_bucket_id`: Controls the amount of motion in the video (higher values = more motion)

### Customizing Voice Parameters

You can customize the Google Text-to-Speech parameters in `src/backend/services/videoGenerator.js`:

```javascript
const response = await axios.post(
  `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
  {
    input: { text },
    voice: {
      languageCode,
      name: voice.name,
      ssmlGender: voice.ssmlGender
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: voiceProfile === 'male2' || voiceProfile === 'female2' ? 1.1 : 0.9,
      pitch: voiceProfile === 'female1' || voiceProfile === 'female2' ? 1.2 : 0.8
    }
  }
);
```

Adjust these parameters to control the voice output:

- `speakingRate`: How fast the voice speaks (0.25 to 4.0)
- `pitch`: Voice pitch (-20.0 to 20.0)
- `voice.name`: Specific voice to use (see Google Cloud documentation for available voices)
- `voice.ssmlGender`: Gender of the voice (MALE, FEMALE, NEUTRAL)

## Resources

- [RunwayML API Documentation](https://docs.runwayml.com/docs/text-to-video)
- [Google Cloud Text-to-Speech Documentation](https://cloud.google.com/text-to-speech/docs)
- [Google Cloud Speech-to-Text Documentation](https://cloud.google.com/speech-to-text/docs)
