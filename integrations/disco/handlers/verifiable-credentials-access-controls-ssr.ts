import { withIronSessionSsr } from 'iron-session/next'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { discoClient } from '@/integrations/disco/disco-client'
import { verify712Vc } from '@/integrations/disco/utils/crypto'
import { SERVER_SESSION_SETTINGS } from '@/lib/session'

export function withVerifiableCredentialsAccessControlsSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(async (context: GetServerSidePropsContext) => {
    const session = context.req.session

    if (session?.siwe?.address) {
      const response = await discoClient.get(`/profile/address/${session.siwe.address}`)

      if (response.status === 200 && response.data?.creds) {
        // define the empty vc array
        Object.defineProperty(context.req, 'credentials', { enumerable: true, value: [] })

        // verify each vc and add it to the array
        await Promise.all(
          response.data?.creds.map(async (cred: any) => {
            const credential = await verify712Vc(cred)
            if (credential) {
              context.req.credentials.push(credential)
            }
          })
        )
      }
    }

    return handler(context)
  }, SERVER_SESSION_SETTINGS)
}
