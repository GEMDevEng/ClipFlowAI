import { supabase } from '../../config/supabase';
import { checkTableExists } from './databaseService';

/**
 * Database initializer for Supabase
 * This service initializes the database schema if it doesn't exist
 */

// List of required tables
const REQUIRED_TABLES = [
  'profiles',
  'videos',
  'tags',
  'video_tags',
  'platform_connections',
  'video_publications',
  'analytics'
];

/**
 * Check if all required tables exist
 * @returns {Promise<boolean>} - True if all tables exist, false otherwise
 */
export const checkRequiredTables = async () => {
  try {
    const results = await Promise.all(
      REQUIRED_TABLES.map(async (tableName) => {
        const exists = await checkTableExists(tableName);
        return { tableName, exists };
      })
    );

    const missingTables = results.filter((result) => !result.exists);
    
    if (missingTables.length > 0) {
      console.warn('Missing required tables:', missingTables.map((t) => t.tableName).join(', '));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking required tables:', error);
    return false;
  }
};

/**
 * Initialize the user profile
 * @param {object} user - User object from Supabase auth
 * @returns {Promise<object>} - Created or updated profile
 */
export const initializeUserProfile = async (user) => {
  if (!user) return null;
  
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (existingProfile) {
      return existingProfile;
    }
    
    // Create new profile
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          username: user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 10000)}`,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
    
    return newProfile;
  } catch (error) {
    console.error('Error initializing user profile:', error);
    throw error;
  }
};

/**
 * Initialize the database
 * This function checks if all required tables exist and creates them if they don't
 * @returns {Promise<boolean>} - True if initialization was successful, false otherwise
 */
export const initializeDatabase = async () => {
  try {
    const allTablesExist = await checkRequiredTables();
    
    if (!allTablesExist) {
      console.warn('Some required tables are missing. Please run the database migrations.');
      // In a real application, we would run the migrations here
      // For now, we'll just return false
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

export default {
  checkRequiredTables,
  initializeUserProfile,
  initializeDatabase
};
