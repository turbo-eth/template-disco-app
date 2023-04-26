import { getIronSession } from 'iron-session'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { getVerifiedCredentials } from '@/integrations/disco/handlers/verifiable-credentials-helper'
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
    req.credentials = await getVerifiedCredentials(session, credentialName)
    return handler(req, res)
  })
}
