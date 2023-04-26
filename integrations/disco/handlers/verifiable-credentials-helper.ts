import { IronSession } from 'iron-session'

import { discoClient } from '@/integrations/disco/disco-client'
import { Credential } from '@/integrations/disco/types'
import { verifyEIP712VerifiableCredentialV2 } from '@/integrations/disco/utils/crypto'

export async function getVerifiedCredentials(session: IronSession, credentialName?: string): Promise<Credential[]> {
  if (!session?.siwe?.address) return []

  try {
    const response = await discoClient.get(`/profile/address/${session.siwe.address}`)

    if (response.status !== 200 || !response.data?.creds) return []

    const creds = response.data.creds
    const verifiedCredentials = await Promise.all(creds.map(verifyEIP712VerifiableCredentialV2))

    return credentialName ? verifiedCredentials.filter((cred) => cred.type?.includes('OfficialDisconautCredential')) : verifiedCredentials
  } catch (e: any) {
    if (e.response?.status !== 404) {
      console.error(e)
    }
    return []
  }
}
