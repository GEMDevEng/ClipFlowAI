import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

// Collection name
const VIDEOS_COLLECTION = 'videos';

/**
 * Get all videos
 * @param {string} userId - User ID to filter by (optional)
 * @returns {Promise<Array>} - Array of video objects
 */
export const getAllVideos = async (userId = null) => {
  try {
    let videosQuery;
    
    if (userId) {
      videosQuery = query(
        collection(db, VIDEOS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      videosQuery = query(
        collection(db, VIDEOS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(videosQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting videos:', error);
    throw new Error('Failed to get videos');
  }
};

/**
 * Get a video by ID
 * @param {string} id - Video ID
 * @returns {Promise<Object>} - Video object
 */
export const getVideoById = async (id) => {
  try {
    const docRef = doc(db, VIDEOS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Video not found');
    }
  } catch (error) {
    console.error('Error getting video:', error);
    throw new Error('Failed to get video');
  }
};

/**
 * Create a new video
 * @param {Object} videoData - Video data
 * @returns {Promise<Object>} - Created video object
 */
export const createVideo = async (videoData) => {
  try {
    // Add timestamp
    const videoWithTimestamp = {
      ...videoData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, VIDEOS_COLLECTION), videoWithTimestamp);
    
    return {
      id: docRef.id,
      ...videoWithTimestamp
    };
  } catch (error) {
    console.error('Error creating video:', error);
    throw new Error('Failed to create video');
  }
};

/**
 * Update a video
 * @param {string} id - Video ID
 * @param {Object} videoData - Updated video data
 * @returns {Promise<Object>} - Updated video object
 */
export const updateVideo = async (id, videoData) => {
  try {
    const docRef = doc(db, VIDEOS_COLLECTION, id);
    
    // Add timestamp
    const videoWithTimestamp = {
      ...videoData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, videoWithTimestamp);
    
    return {
      id,
      ...videoWithTimestamp
    };
  } catch (error) {
    console.error('Error updating video:', error);
    throw new Error('Failed to update video');
  }
};

/**
 * Delete a video
 * @param {string} id - Video ID
 * @returns {Promise<void>}
 */
export const deleteVideo = async (id) => {
  try {
    // Get video data to delete associated files
    const video = await getVideoById(id);
    
    // Delete video file from storage if it exists
    if (video.videoUrl) {
      const videoRef = ref(storage, video.videoUrl);
      await deleteObject(videoRef);
    }
    
    // Delete thumbnail if it exists
    if (video.thumbnailUrl) {
      const thumbnailRef = ref(storage, video.thumbnailUrl);
      await deleteObject(thumbnailRef);
    }
    
    // Delete document from Firestore
    const docRef = doc(db, VIDEOS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error('Failed to delete video');
  }
};

/**
 * Upload a video file to Firebase Storage
 * @param {File} videoFile - Video file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Download URL
 */
export const uploadVideo = async (videoFile, userId) => {
  try {
    const fileName = `videos/${userId}/${Date.now()}_${videoFile.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload file
    await uploadBytes(storageRef, videoFile);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};

/**
 * Upload a thumbnail image to Firebase Storage
 * @param {File} imageFile - Image file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Download URL
 */
export const uploadThumbnail = async (imageFile, userId) => {
  try {
    const fileName = `thumbnails/${userId}/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload file
    await uploadBytes(storageRef, imageFile);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw new Error('Failed to upload thumbnail');
  }
};
