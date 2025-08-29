// Social Authentication Configuration
import { SocialAuthConfig } from '../types/navigation'
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, FACEBOOK_CLIENT_ID } from '../utils/env'

export const SOCIAL_AUTH_CONFIG: SocialAuthConfig = {
  ...(GOOGLE_WEB_CLIENT_ID && {
    google: {
      webClientId: GOOGLE_WEB_CLIENT_ID,
      ...(GOOGLE_IOS_CLIENT_ID && { iosClientId: GOOGLE_IOS_CLIENT_ID }),
    },
  }),
  ...(FACEBOOK_CLIENT_ID && {
    facebook: {
      clientId: FACEBOOK_CLIENT_ID,
    },
  }),
}