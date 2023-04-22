import { IronSessionOptions } from 'iron-session'
import { SiweMessage } from 'siwe'

import { siteConfig } from '@/config/site'

declare module 'iron-session' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface IronSessionData {
    nonce: string
    siwe: SiweMessage
    isAdmin: boolean
  }
}

// This is the secret used to encrypt the session cookie
// It should be at least 32 characters long
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

export const cookieName = siteConfig.name
export const password = NEXTAUTH_SECRET ?? 'UPDATE_TO_complex_password_at_least_32_characters_long'

// The httpOnly cookie option is not working so we are using
// a hack to remove the cookie from the browser
// See: /api/siwe/logout
export const SERVER_SESSION_SETTINGS: IronSessionOptions = {
  cookieName,
  password,
  cookieOptions: {
    secure: process.env.NODE_ENV == 'production',
  },
}
