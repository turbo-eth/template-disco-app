import { cookies } from 'next/headers'

import { withVerifiableCredentialsAccessControlsApp } from '@/integrations/disco/handlers/verifiable-credentials-access-controls-app'

export default async function Disconaut() {
  const credentials = await withVerifiableCredentialsAccessControlsApp(cookies(), 'OfficialDisconautCredential')

  if (!credentials) {
    return <p>Only Disconauts can view this page 🕺🪩</p>
  }

  return <p>You&apos;re a verified Disconaut! 🕺🪩</p>
}
