// Image upload configuration
// Backend API endpoints for image handling

export const IMAGE_CONFIG = {
  // Backend API endpoints
  BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000/api',
  UPLOAD_ENDPOINT: '/images/upload',
  VALIDATE_URL_ENDPOINT: '/images/validate-url',
  CONFIG_ENDPOINT: '/images/config',

  // Frontend-only settings (will be overridden by backend config)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],

  // Default fallback services (will be overridden by backend config)
  SUGGESTED_SERVICES: [
    {
      name: 'ImgBB',
      url: 'https://imgbb.com/',
      description: 'Free image hosting with API support',
    },
    {
      name: 'PostImages',
      url: 'https://postimages.org/',
      description: 'Simple drag & drop image hosting',
    },
    {
      name: 'Imgur',
      url: 'https://imgur.com/',
      description: 'Popular image hosting platform',
    },
  ],
}
