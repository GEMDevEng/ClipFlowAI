const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Generate a video from a text prompt
 * @param {string} prompt - The text prompt for video generation
 * @param {string} title - The title of the video
 * @returns {Promise<Object>} - The generated video data
 */
const generateVideo = async (prompt, title, options = {}) => {
  try {
    console.log(`Generating video with prompt: ${prompt}`);

    // Get RunwayML API key from environment variables
    const apiKey = process.env.RUNWAY_API_KEY;
    if (!apiKey) {
      throw new Error('RUNWAY_API_KEY is not set in environment variables');
    }

    // Extract options
    const {
      music = 'default',
      voiceProfile = 'default',
      language = 'en-US',
      script = prompt,
      subtitles = ''
    } = options;

    console.log(`Video options: music=${music}, voiceProfile=${voiceProfile}, language=${language}`);

    // Make API call to RunwayML for video generation
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

    if (response.status !== 200) {
      throw new Error(`RunwayML API error: ${response.status} - ${response.statusText}`);
    }

    // Extract video URL from response
    const { output_url } = response.data;
    console.log('Video generated successfully:', output_url);

    // Download the video to a temporary location or process it further if needed
    // For now, we'll just return the URL and other metadata

    const videoData = {
      title,
      prompt,
      status: 'completed',
      duration: 10, // Estimate based on num_frames (120 frames at 24fps = ~5 seconds)
      videoUrl: output_url,
      thumbnailUrl: output_url.replace('.mp4', '_thumbnail.jpg'), // Assuming thumbnail is available
      createdAt: new Date().toISOString(),
      publishedAt: null, // Not published yet
      options: {
        music,
        voiceProfile,
        language,
        script,
        subtitles
      }
    };

    return videoData;
  } catch (error) {
    console.error('Error generating video:', error.message);
    throw new Error(`Video generation failed: ${error.message}`);
  }
};

/**
 * Generate a voiceover from text
 * @param {string} text - The text for voiceover
 * @param {string} voiceProfile - Voice profile to use (default, male1, male2, female1, female2)
 * @param {string} language - Language code (e.g., 'en-US', 'es-ES', 'fr-FR')
 * @returns {Promise<string>} - URL to the generated audio file
 */
const generateVoiceover = async (text, voiceProfile = 'default', language = 'en-US') => {
  try {
    console.log(`Generating voiceover for text: ${text.substring(0, 50)}...`);

    // Get Google Cloud TTS API key from environment variables
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_TTS_API_KEY is not set in environment variables');
    }

    // Map voice profiles to Google Cloud TTS voices
    const voiceProfiles = {
      'default': { name: 'en-US-Neural2-C', ssmlGender: 'NEUTRAL' },
      'male1': { name: 'en-US-Neural2-D', ssmlGender: 'MALE' },
      'male2': { name: 'en-US-Neural2-J', ssmlGender: 'MALE' },
      'female1': { name: 'en-US-Neural2-E', ssmlGender: 'FEMALE' },
      'female2': { name: 'en-US-Neural2-F', ssmlGender: 'FEMALE' }
    };

    // Get language code from the language parameter
    const languageCode = language.split('-')[0] + '-' + language.split('-')[1];

    // Select voice based on profile and language
    let voice = voiceProfiles[voiceProfile] || voiceProfiles['default'];

    // If language is not English, try to find a voice for that language
    if (language !== 'en-US') {
      // This is a simplified approach - in a real implementation,
      // you would have a more comprehensive mapping of languages to voices
      voice = {
        name: `${languageCode}-Standard-A`,
        ssmlGender: voice.ssmlGender
      };
    }

    // Make API call to Google Cloud TTS
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

    if (!response.data || !response.data.audioContent) {
      throw new Error('Invalid response from Google Cloud TTS API');
    }

    // The response contains base64-encoded audio content
    const audioContent = response.data.audioContent;

    // In a real implementation, you would save this to a file or storage service
    // For now, we'll simulate that by returning a URL

    // Create a unique filename
    const filename = `voiceover_${Date.now()}.mp3`;
    const filePath = `/tmp/${filename}`; // Temporary location

    // Write the base64-decoded audio content to a file
    const audioBuffer = Buffer.from(audioContent, 'base64');
    require('fs').writeFileSync(filePath, audioBuffer);

    // In a real implementation, you would upload this file to a storage service
    // and return the URL. For now, we'll return a mock URL.
    return `https://storage.example.com/voiceovers/${filename}`;
  } catch (error) {
    console.error('Error generating voiceover:', error.message);
    throw new Error(`Voiceover generation failed: ${error.message}`);
  }
};

/**
 * Generate captions for a video
 * @param {string} audioUrl - URL to the audio file
 * @param {string} text - Original text used for the voiceover (for fallback)
 * @param {string} language - Language code (e.g., 'en-US', 'es-ES', 'fr-FR')
 * @returns {Promise<Array>} - Array of caption objects with text and timestamps
 */
const generateCaptions = async (audioUrl, text = '', language = 'en-US') => {
  try {
    console.log(`Generating captions for audio: ${audioUrl}`);

    // Get Google Cloud Speech-to-Text API key from environment variables
    const apiKey = process.env.GOOGLE_STT_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_STT_API_KEY is not set in environment variables, using text-based caption generation');
      return generateCaptionsFromText(text);
    }

    try {
      // Download the audio file
      const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      const audioContent = Buffer.from(audioResponse.data).toString('base64');

      // Make API call to Google Cloud Speech-to-Text
      const response = await axios.post(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          config: {
            encoding: 'MP3',
            sampleRateHertz: 16000,
            languageCode: language,
            enableWordTimeOffsets: true, // Get timestamps for each word
            enableAutomaticPunctuation: true
          },
          audio: {
            content: audioContent
          }
        }
      );

      if (!response.data || !response.data.results) {
        throw new Error('Invalid response from Google Cloud Speech-to-Text API');
      }

      // Process the response to create captions
      const captions = [];
      let currentCaption = { text: '', startTime: 0, endTime: 0 };
      let wordCount = 0;

      // Process each word with its timestamp
      response.data.results.forEach(result => {
        result.alternatives[0].words.forEach(wordInfo => {
          const word = wordInfo.word;
          const startTime = parseFloat(wordInfo.startTime.replace('s', ''));
          const endTime = parseFloat(wordInfo.endTime.replace('s', ''));

          // Start a new caption every 10 words or if there's a long pause
          if (wordCount === 0) {
            currentCaption.startTime = startTime;
            currentCaption.text = word;
          } else if (wordCount >= 10 || (startTime - currentCaption.endTime > 1.0)) {
            // Finalize current caption
            currentCaption.endTime = endTime;
            captions.push({ ...currentCaption });

            // Start a new caption
            currentCaption = {
              text: word,
              startTime: startTime,
              endTime: endTime
            };
            wordCount = 0;
          } else {
            // Add word to current caption
            currentCaption.text += ' ' + word;
            currentCaption.endTime = endTime;
          }

          wordCount++;
        });
      });

      // Add the last caption if it's not empty
      if (currentCaption.text) {
        captions.push(currentCaption);
      }

      return captions;
    } catch (error) {
      console.error('Error using Speech-to-Text API:', error.message);
      console.log('Falling back to text-based caption generation');
      return generateCaptionsFromText(text);
    }
  } catch (error) {
    console.error('Error generating captions:', error.message);
    throw new Error(`Caption generation failed: ${error.message}`);
  }
};

/**
 * Generate captions from text (fallback method)
 * @param {string} text - Text to generate captions from
 * @returns {Array} - Array of caption objects with text and timestamps
 */
const generateCaptionsFromText = (text) => {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  // Estimate duration based on word count (average speaking rate is about 150 words per minute)
  const words = text.split(/\s+/).length;
  const estimatedDuration = (words / 150) * 60; // in seconds

  // Calculate time per sentence
  const timePerSentence = estimatedDuration / sentences.length;

  // Generate captions with timestamps
  return sentences.map((sentence, index) => {
    const startTime = index * timePerSentence;
    const endTime = (index + 1) * timePerSentence;

    return {
      text: sentence.trim(),
      startTime,
      endTime
    };
  });
};

module.exports = {
  generateVideo,
  generateVoiceover,
  generateCaptions,
  generateCaptionsFromText
};
