import { cookies } from 'next/headers'

import { withVerifiableCredentialsAccessControlsApp } from '@/integrations/disco/handlers/verifiable-credentials-access-controls-app'
import { Credential } from '@/integrations/disco/types'

export default async function Disconaut() {
  const credentials = await withVerifiableCredentialsAccessControlsApp(cookies())
  const isDisconaut = credentials?.some((c: Credential) => c.type?.includes('OfficialDisconautCredential'))

  if (!isDisconaut) {
    return <p>Only Disconauts can view this page 🕺🪩</p>
  }

  return <p>You&apos;re a verified Disconaut! 🕺🪩</p>
}
