/**
 * Share a video to social media platforms
 * Note: Due to API restrictions, most social media platforms don't allow direct posting
 * without user authentication. These functions will generate sharing links instead.
 */

/**
 * Generate a TikTok sharing link
 * @param {string} videoUrl - URL of the video
 * @param {string} caption - Caption for the video
 * @returns {string} - TikTok sharing URL
 */
export const shareTikTok = (videoUrl, caption) => {
  // TikTok doesn't have a direct sharing URL structure for videos
  // This will open TikTok's upload page
  return 'https://www.tiktok.com/upload';
};

/**
 * Generate an Instagram sharing link
 * @param {string} videoUrl - URL of the video
 * @param {string} caption - Caption for the video
 * @returns {string} - Instagram sharing URL
 */
export const shareInstagram = (videoUrl, caption) => {
  // Instagram doesn't have a direct sharing URL structure for videos
  // This will open Instagram's website
  return 'https://www.instagram.com';
};

/**
 * Generate a YouTube sharing link
 * @param {string} videoUrl - URL of the video
 * @param {string} title - Title for the video
 * @param {string} description - Description for the video
 * @returns {string} - YouTube sharing URL
 */
export const shareYouTube = (videoUrl, title, description) => {
  // YouTube doesn't have a direct sharing URL structure for videos
  // This will open YouTube's upload page
  return 'https://www.youtube.com/upload';
};

/**
 * Generate a Twitter/X sharing link
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 * @returns {string} - Twitter sharing URL
 */
export const shareTwitter = (text, url) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
};

/**
 * Generate a Facebook sharing link
 * @param {string} url - URL to share
 * @returns {string} - Facebook sharing URL
 */
export const shareFacebook = (url) => {
  const encodedUrl = encodeURIComponent(url);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};

/**
 * Generate a LinkedIn sharing link
 * @param {string} url - URL to share
 * @param {string} title - Title for the post
 * @param {string} summary - Summary for the post
 * @returns {string} - LinkedIn sharing URL
 */
export const shareLinkedIn = (url, title, summary) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
};

/**
 * Generate a WhatsApp sharing link
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 * @returns {string} - WhatsApp sharing URL
 */
export const shareWhatsApp = (text, url) => {
  const encodedText = encodeURIComponent(`${text} ${url}`);
  return `https://wa.me/?text=${encodedText}`;
};

/**
 * Generate a Telegram sharing link
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 * @returns {string} - Telegram sharing URL
 */
export const shareTelegram = (text, url) => {
  const encodedText = encodeURIComponent(`${text} ${url}`);
  return `https://t.me/share/url?url=${encodedText}`;
};
