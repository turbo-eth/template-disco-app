import { IronSession, unsealData } from 'iron-session'
import type { ReadonlyRequestCookies } from 'next/dist/server/app-render'
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

import { getVerifiedCredentials } from '@/integrations/disco/handlers/verifiable-credentials-helper'
import { Credential } from '@/integrations/disco/types'
import { cookieName, password } from '@/lib/session'

/**
 * Can be called in page/layout server component to get Disco credentials
 * @param cookies - Next.js request cookies
 * @param credentialName - Optional credential name to search for (must be exact)
 */
export async function withVerifiableCredentialsAccessControlsApp(
  cookies: ReadonlyRequestCookies | RequestCookies,
  credentialName?: string
): Promise<Credential[]> {
  const found = cookies.get(cookieName)
  if (!found) return []

  const session: IronSession = await unsealData(found.value, { password })
  return getVerifiedCredentials(session, credentialName)
}
