import { getIronSession } from 'iron-session'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { discoClient } from '@/integrations/disco/disco-client'
import { verify712Vc } from '@/integrations/disco/utils/crypto'
import { withSessionRoute } from '@/lib/server'
import { SERVER_SESSION_SETTINGS } from '@/lib/session'

export function withVerifiableCredentialsAccessControlsRoute(handler: NextApiHandler) {
  return withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)

    if (session?.siwe?.address) {
      const response = await discoClient.get(`/profile/address/${session.siwe.address}`)

      if (response.status === 200 && response.data?.creds) {
        try {
          response.data?.creds.forEach((cred: any) => {
            verify712Vc(cred)
          })
          Object.defineProperty(req, 'credentials', { enumerable: true, value: response.data?.creds })
        } catch (e) {
          console.log(e)
        }
      }
    }

    return handler(req, res)
  })
}
