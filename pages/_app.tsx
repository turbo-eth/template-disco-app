import type { AppProps } from 'next/app'

import RootProvider from '@/components/providers/root-provider'

export default function Wrapper({ Component, pageProps }: AppProps) {
  return (
    <RootProvider>
      <Component {...pageProps} />
    </RootProvider>
  )
}
