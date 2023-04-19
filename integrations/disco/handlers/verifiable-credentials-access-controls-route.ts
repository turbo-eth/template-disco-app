import { getIronSession } from 'iron-session'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { discoClient } from '@/integrations/disco/disco-client'
import { withSessionRoute } from '@/lib/server'
import { SERVER_SESSION_SETTINGS } from '@/lib/session'

export function withVerifiableCredentialsAccessControlsRoute(handler: NextApiHandler) {
  return withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)

    if (session?.siwe?.address) {
      const response = await discoClient.get(`/profile/address/${session.siwe.address}`)

      if (response.status === 200 && response.data?.creds) {
        Object.defineProperty(req, 'credentials', { enumerable: true, value: response.data?.creds })
      }
    }

    return handler(req, res)
  })
}
