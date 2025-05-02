// Base URLs
export const API_BASE_URL = 'http://localhost:3000/api'; // Default to localhost if env var not available
export const ASSETS_BASE_URL = 'http://localhost:3000'; // Direct server URL for assets

// Asset paths
export const PROFILE_PICTURES_PATH = `${ASSETS_BASE_URL}/profile-pictures`;
export const ARTICLE_IMAGES_PATH = `${ASSETS_BASE_URL}/article-images`;
export const JOURNAL_IMAGES_PATH = `${ASSETS_BASE_URL}/journal-images`;

// Placeholder images
export const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150';
export const DEFAULT_ARTICLE_IMAGE = 'https://via.placeholder.com/300x200';