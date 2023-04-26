import { cookies } from 'next/headers'

import { withVerifiableCredentialsAccessControlsApp } from '@/integrations/disco/handlers/verifiable-credentials-access-controls-app'

export default async function Disconaut() {
  const credentials = await withVerifiableCredentialsAccessControlsApp(cookies(), 'OfficialDisconautCredential')

  if (!credentials.length) {
    return (
      <div className="flex-center flex flex-col">
        <h3 className="text-5xl font-normal blur-md">🕺 🪩 💃</h3>
        <h1 className="my-3 text-4xl font-normal">Want to join the dance party?</h1>
        <p className="">
          Visit the{' '}
          <a className="link" href="https://disco.xyz">
            Disco App
          </a>{' '}
          to get your Disconaut credential!
        </p>
      </div>
    )
  }

  return (
    <div className="flex-center flex flex-col text-center">
      <h3 className="text-5xl font-normal">🕺 🪩 💃</h3>
      <h1 className="mb-2 text-6xl font-bold">Disconaut</h1>
      <h3 className="my-3 text-2xl font-normal">Welcome to the dance floor!</h3>
      <p>
        Only Disconauts can view this page. <br /> And you&apos;re one of those <span className="font-bold">special people</span>!
      </p>
    </div>
  )
}
