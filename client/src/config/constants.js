// Base URLs
export const API_BASE_URL = 'https://article-api.debdevcs.org/api'; // Default to localhost if env var not available
export const ASSETS_BASE_URL = 'https://article-api.debdevcs.org'; // Direct server URL for assets
// export const API_BASE_URL = 'http://localhost:3000/api'; // Default to localhost if env var not available
// export const ASSETS_BASE_URL = 'http://localhost:3000'; // Direct server URL for assets

// Asset paths
export const PROFILE_PICTURES_PATH = `${ASSETS_BASE_URL}/profile-pictures`;
export const ARTICLE_MENUSCRIPT_PATH = `${ASSETS_BASE_URL}/articles/menu-script`;
export const ARTICLE_COVER_LETTER_PATH = `${ASSETS_BASE_URL}/articles/cover-letter`;
export const ARTICLE_SUPPLEMENTARY_FILE_PATH = `${ASSETS_BASE_URL}/articles/supplementary-file`;

// Placeholder images
export const DEFAULT_PROFILE_IMAGE = "profile-logo.png"; // Default profile image name
export const DEFAULT_ARTICLE_IMAGE = 'https://via.placeholder.com/300x200';