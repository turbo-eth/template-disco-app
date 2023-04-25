import { IronSession, unsealData } from 'iron-session'
import type { ReadonlyRequestCookies } from 'next/dist/server/app-render'
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

import { discoClient } from '@/integrations/disco/disco-client'
import { Credential } from '@/integrations/disco/types'
import { verifyEIP712VerifiableCredentialV2 } from '@/integrations/disco/utils/crypto'
import { cookieName, password } from '@/lib/session'

/**
 * Can be called in page/layout server component to get Disco credentials
 * @param cookies - Next.js request cookies
 * @param credentialName - Optional credential name to search for (must be exact)
 */
export async function withVerifiableCredentialsAccessControlsApp(
  cookies: ReadonlyRequestCookies | RequestCookies,
  credentialName?: string
): Promise<Credential[] | null> {
  const found = cookies.get(cookieName)
  if (!found) return null

  const session: IronSession = await unsealData(found.value, { password })

  if (!session?.siwe?.address) return []

  try {
    const response = await discoClient.get(`/profile/address/${session.siwe.address}`)

    if (response.status !== 200 || !response.data?.creds) return []

    const creds = response.data.creds
    const verifiedCredentials = await Promise.all(creds.map(verifyEIP712VerifiableCredentialV2))

    return credentialName ? verifiedCredentials.filter((cred) => cred?.credentialSubject?.id === credentialName) : verifiedCredentials.filter(Boolean)
  } catch (e: any) {
    if (e.response?.status !== 404) {
      console.error(e)
    }
    return []
  }
}
