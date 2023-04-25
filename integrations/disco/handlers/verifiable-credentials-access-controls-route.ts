import { getIronSession } from 'iron-session'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { discoClient } from '@/integrations/disco/disco-client'
import { verifyEIP712VerifiableCredentialV2 } from '@/integrations/disco/utils/crypto'
import { withSessionRoute } from '@/lib/server'
import { SERVER_SESSION_SETTINGS } from '@/lib/session'

/**
 * Can be called in page/layout server component to get Disco credentials
 * @param handler - Next.js request handler
 * @param credentialName - Optional credential name to search for (must be exact)
 */
export function withVerifiableCredentialsAccessControlsRoute(handler: NextApiHandler, credentialName?: string): NextApiHandler {
  return withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)

    if (!session?.siwe?.address) return handler(req, res)

    try {
      const response = await discoClient.get(`/profile/address/${session.siwe.address}`)

      if (response.status !== 200 || !response.data?.creds) return handler(req, res)

      const creds = response.data.creds
      const verifiedCredentials = await Promise.all(creds.map(verifyEIP712VerifiableCredentialV2))

      req.credentials = credentialName
        ? verifiedCredentials.filter((cred) => cred?.credentialSubject?.id === credentialName)
        : verifiedCredentials.filter(Boolean)
    } catch (e: any) {
      if (e.response?.status !== 404) {
        console.error(e)
      }
    }

    return handler(req, res)
  })
}
