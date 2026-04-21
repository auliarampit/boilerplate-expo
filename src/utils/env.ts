// Simple Environment Variables
// Direct access to environment variables without complex validation

// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.yourapp.com'

// Google OAuth
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
export const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID

// Facebook OAuth
export const FACEBOOK_CLIENT_ID = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_ID
export const FACEBOOK_GRAPH_URL = process.env.EXPO_PUBLIC_FACEBOOK_GRAPH_URL || 'https://graph.facebook.com'
export const FACEBOOK_API_VERSION = process.env.EXPO_PUBLIC_FACEBOOK_API_VERSION || 'v18.0'
export const FACEBOOK_OAUTH_URL = process.env.EXPO_PUBLIC_FACEBOOK_OAUTH_URL || 'https://www.facebook.com'

// Expo Project ID
export const EXPO_PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID