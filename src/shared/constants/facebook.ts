import { FACEBOOK_GRAPH_URL, FACEBOOK_API_VERSION, FACEBOOK_OAUTH_URL } from '../utils/env'

export const FACEBOOK_CONFIG = {
  API_VERSION: FACEBOOK_API_VERSION,
  GRAPH_URL: FACEBOOK_GRAPH_URL,
  OAUTH_URL: `${FACEBOOK_OAUTH_URL}/${FACEBOOK_API_VERSION}/dialog/oauth`,
  TOKEN_URL: `${FACEBOOK_GRAPH_URL}/${FACEBOOK_API_VERSION}/oauth/access_token`,
  USER_INFO_URL: `${FACEBOOK_GRAPH_URL}/me`,
} as const

export const FACEBOOK_SCOPES = {
  EMAIL: 'email',
  PUBLIC_PROFILE: 'public_profile',
} as const

export const FACEBOOK_FIELDS = {
  USER_INFO: 'id,name,email,picture',
} as const