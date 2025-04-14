const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Initialize the Telegram bot
 */
const initBot = async () => {
  try {
    // Get bot info to verify token is valid
    const response = await axios.get(`${API_URL}/getMe`);
    console.log(`Telegram bot initialized: @${response.data.result.username}`);

    // Start polling for updates
    startPolling();

    return true;
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error.message);
    return false;
  }
};

/**
 * Start polling for new messages
 */
const startPolling = async () => {
  let offset = 0;

  const poll = async () => {
    try {
      // Get updates with long polling
      const response = await axios.get(`${API_URL}/getUpdates`, {
        params: {
          offset,
          timeout: 30
        }
      });

      const updates = response.data.result;

      if (updates.length > 0) {
        // Process each update
        for (const update of updates) {
          await processUpdate(update);
          // Update offset to acknowledge this update
          offset = update.update_id + 1;
        }
      }

      // Continue polling
      setTimeout(poll, 1000);
    } catch (error) {
      console.error('Error in Telegram polling:', error.message);
      // Retry after a delay
      setTimeout(poll, 5000);
    }
  };

  // Start the polling loop
  poll();
};

/**
 * Process an update from Telegram
 */
const processUpdate = async (update) => {
  // Check if this is a message
  if (update.message && update.message.text) {
    const { message } = update;
    const chatId = message.chat.id;
    const text = message.text;

    console.log(`Received message from ${message.from.username || message.from.id}: ${text}`);

    // Process commands
    if (text.startsWith('/')) {
      await processCommand(chatId, text);
    } else {
      // Treat as a video generation prompt
      await processPrompt(chatId, text);
    }
  }
};

/**
 * Process a command
 */
const processCommand = async (chatId, command) => {
  const cmd = command.split(' ')[0].toLowerCase();

  switch (cmd) {
    case '/start':
      await sendMessage(chatId, 'Welcome to ClipFlowAI! Send me a prompt to generate a video.');
      break;
    case '/help':
      await sendMessage(chatId,
        'ClipFlowAI Bot Commands:\n' +
        '/start - Start the bot\n' +
        '/help - Show this help message\n' +
        '/status - Check the status of your videos\n\n' +
        'To create a new video, simply send a text prompt describing the video you want to create.'
      );
      break;
    case '/status':
      await sendMessage(chatId, 'You have no pending videos. Send a prompt to create one!');
      break;
    default:
      await sendMessage(chatId, 'Unknown command. Type /help for available commands.');
  }
};

/**
 * Process a video generation prompt
 *
 * NOTE: This is a placeholder implementation for future integration.
 * The Telegram bot is not fully integrated with the actual video processing system yet.
 * This feature is planned for a future release and currently uses simulated logic.
 */
const processPrompt = async (chatId, prompt) => {
  try {
    await sendMessage(chatId, `Received prompt: "${prompt}". Starting video generation process...`);

    // TODO: Integrate with actual video generation service (e.g., call videoGenerator.js)
    // const videoDetails = await videoGenerator.createVideoFromPrompt(prompt);

    // TODO: Once video is processed and potentially published, send a completion notification
    // Example: await sendVideoCompletionMessage(chatId, videoDetails);

    // Placeholder message for now
    await sendMessage(chatId, 'Video generation initiated. You will be notified upon completion.');

  } catch (error) {
    console.error('Error processing prompt:', error.message);
    await sendMessage(chatId, 'Sorry, there was an error processing your video request. Please try again later.');
  }
};

/**
 * Send a message to a chat
 */
const sendMessage = async (chatId, text) => {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown'
    });
    return true;
  } catch (error) {
    console.error('Error sending message:', error.message);
    return false;
  }
};

module.exports = {
  initBot
};
