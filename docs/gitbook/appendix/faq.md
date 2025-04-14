# Frequently Asked Questions

## General Questions

### What is ClipFlowAI?

ClipFlowAI is an automated AI system designed to generate and publish short-form videos (Reels, TikTok, Shorts) across multiple platforms. It uses AI to create videos, voiceovers, and captions from simple prompts.

### Is ClipFlowAI really free to use?

Yes, ClipFlowAI is designed with a $0 budget approach. It uses:
- Supabase Free Tier for backend services
- GitHub Pages for hosting
- Client-side processing to avoid server costs
- Free APIs and libraries for core functionality

### What platforms does ClipFlowAI support?

ClipFlowAI currently supports sharing to:
- Instagram Reels
- TikTok
- YouTube Shorts
- Facebook Reels
- Twitter/X

### Do I need technical skills to use ClipFlowAI?

While ClipFlowAI is designed to be user-friendly, basic technical skills are helpful for the initial setup. Once deployed, the platform is designed to be used by anyone, regardless of technical background.

## Technical Questions

### How does ClipFlowAI generate videos?

ClipFlowAI uses a combination of technologies:
1. AI models to generate content based on your prompt
2. FFmpeg.js for video processing in the browser
3. Web Speech API for text-to-speech conversion
4. Client-side rendering for adding captions and effects

### Why does video generation happen in the browser?

By processing videos in the browser:
1. We eliminate the need for expensive server infrastructure
2. Your content remains private and doesn't need to be uploaded to external servers
3. We can offer the service for free without usage limits

### Can I use ClipFlowAI offline?

No, ClipFlowAI requires an internet connection to:
- Authenticate with Supabase
- Store and retrieve videos
- Share content to social media platforms

### What browsers are supported?

ClipFlowAI works best with modern browsers that support WebAssembly and modern JavaScript features:
- Google Chrome (recommended)
- Firefox
- Safari
- Microsoft Edge

### Is my data secure?

Yes, ClipFlowAI takes data security seriously:
- User authentication is handled by Supabase
- Row Level Security (RLS) ensures users can only access their own data
- Videos are processed in your browser, not on external servers
- Supabase provides enterprise-grade security for stored data

## Content Questions

### What types of videos can I create?

You can create a wide variety of short-form videos:
- Educational content
- Entertainment
- Marketing and promotional videos
- Product demonstrations
- Storytelling
- And more!

### How long can my videos be?

ClipFlowAI is optimized for short-form content:
- 15-60 seconds is the recommended length
- Maximum length is 3 minutes
- Different platforms have different length requirements

### Can I customize the style of my videos?

Yes, you can customize your videos by:
- Providing detailed prompts that specify style and tone
- Uploading custom background images
- Selecting different voice options for voiceovers

### Who owns the content I create?

You retain full ownership of all content created with ClipFlowAI. However, you are responsible for ensuring that your content complies with the terms of service of the platforms where you share it.

## Troubleshooting

### My video is taking a long time to generate

Video generation happens in your browser and depends on your device's processing power. To improve performance:
- Close other applications and browser tabs
- Use a computer with a more powerful processor
- Try generating shorter videos
- Use simpler prompts

### I'm having trouble connecting to Supabase

If you're experiencing connection issues:
- Check that your Supabase URL and anon key are correct
- Verify that your Supabase project is active
- Ensure your database tables and storage buckets are set up correctly
- Check your internet connection

### The video quality is not what I expected

To improve video quality:
- Use high-resolution background images
- Provide more detailed prompts
- Check your browser's performance
- Ensure you have sufficient internet bandwidth

### I can't share my videos to social media

If you're having trouble sharing:
- Make sure you're logged in to the respective social media platforms
- Check that you've granted the necessary permissions
- Verify that your video meets the platform's requirements
- Try downloading the video and uploading it manually
