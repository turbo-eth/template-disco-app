import { getIronSession } from 'iron-session'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { discoClient } from '@/integrations/disco/disco-client'
import { verify712Vc } from '@/integrations/disco/utils/crypto'
import { withSessionRoute } from '@/lib/server'
import { SERVER_SESSION_SETTINGS } from '@/lib/session'

import { Credential } from '../types'

export function withVerifiableCredentialsAccessControlsRoute(handler: NextApiHandler) {
  return withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)

    if (session?.siwe?.address) {
      await discoClient
        .get(`/profile/address/${session.siwe.address}`)
        .then(async (response) => {
          if (response.status === 200 && response.data?.creds) {
            // define the empty vc array
            Object.defineProperty(req, 'credentials', { enumerable: true, value: [] })

            // verify each vc and add it to the array
            await Promise.all(
              response.data?.creds.map(async (cred: Credential) => {
                const credential = await verify712Vc(cred)
                if (credential) {
                  req.credentials.push(credential)
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

    return handler(req, res)
  })
}
