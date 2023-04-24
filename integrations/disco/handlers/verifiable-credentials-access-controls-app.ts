import { IronSession, unsealData } from 'iron-session'
import type { ReadonlyRequestCookies } from 'next/dist/server/app-render'
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

import { discoClient } from '@/integrations/disco/disco-client'
import { Credential } from '@/integrations/disco/types'
import { verifyEIP712VerifiableCredentialV2 } from '@/integrations/disco/utils/crypto'
import { cookieName, password } from '@/lib/session'

/**
 * Can be called in page/layout server component to get Disco credentials
 */
export async function appGetCredentialsFromCookie(cookies: ReadonlyRequestCookies | RequestCookies): Promise<Credential[] | null> {
  const found = cookies.get(cookieName)

  if (!found) return null

  const session: IronSession = await unsealData(found.value, {
    password,
  })

  const credentials: Credential[] = []

  if (session?.siwe?.address) {
    await discoClient
      .get(`/profile/address/${session.siwe.address}`)
      .then(async (response) => {
        if (response.status === 200 && response.data?.creds) {
          // verify each vc and add it to the array
          await Promise.all(
            response.data?.creds.map(async (cred: Credential) => {
              const credential = await verifyEIP712VerifiableCredentialV2(cred)
              if (credential) {
                credentials.push(credential)
              }
            })
          )
        }
      })
      .catch((e) => {
        // 404 means no credentials found for user
        if (e.response?.status !== 404) {
          console.error(e)
        }
      })
  }

  return credentials
}
