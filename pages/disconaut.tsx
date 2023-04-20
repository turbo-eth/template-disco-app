import '@/styles/app.css'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import useSWR from 'swr'

import { withVerifiableCredentialsAccessControlsSsr } from '@/integrations/disco/handlers/verifiable-credentials-access-controls-ssr'

import { Response } from './api/disconaut'

export const getServerSideProps: GetServerSideProps = withVerifiableCredentialsAccessControlsSsr(async ({ req }) => {
  let verified = false
  if (req.credentials.find((credential: any) => credential.type.includes('OfficialDisconautCredential'))) {
    verified = true
  }

  return {
    props: {
      verified,
    },
  }
})

export default function Disconauts({ verified }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useSWR<Response>('/api/disconaut')

  if (!verified || data?.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-sans text-slate-900 antialiased">
        <p>Only Disconauts can view this page 🕺🪩</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white font-sans text-slate-900 antialiased">
      <p>You&apos;re a verified Disconaut! 🕺🪩</p>
      <p>From the API: &quot;{data?.message}&quot;</p>
    </div>
  )
}
