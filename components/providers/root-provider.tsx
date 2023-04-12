'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchJson } from 'ethers/lib/utils.js'
import { ThemeProvider } from 'next-themes'
import { SWRConfig } from 'swr'

import { RainbowKit } from '@/components/providers/rainbow-kit'
import { useIsMounted } from '@/lib/hooks/use-is-mounted'

const queryClient = new QueryClient()
interface RootProviderProps {
  children: React.ReactNode
}

export default function RootProvider({ children }: RootProviderProps) {
  const isMounted = useIsMounted()
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err)
        },
      }}>
      {isMounted && (
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <RainbowKit>{children}</RainbowKit>
          </QueryClientProvider>
        </ThemeProvider>
      )}
    </SWRConfig>
  )
}
