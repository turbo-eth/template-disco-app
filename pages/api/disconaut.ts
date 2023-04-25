import { NextApiRequest, NextApiResponse } from 'next'

import { withVerifiableCredentialsAccessControlsRoute } from '@/integrations/disco/handlers/verifiable-credentials-access-controls-route'

export type Response = {
  message?: string
  error?: string
}

export default withVerifiableCredentialsAccessControlsRoute(userRoute, 'OfficialDisconautCredential')

async function userRoute(req: NextApiRequest, res: NextApiResponse<Response>) {
  if (req.session.siwe) {
    res.json({
      message: 'Hello Disconaut!',
    })
  } else {
    res.json({
      error: 'You are not a Disconaut!',
    })
  }
}
