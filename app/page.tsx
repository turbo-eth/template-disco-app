'use client'

import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

import { WalletConnect } from '@/components/blockchain/wallet-connect'
import { BranchIsWalletConnected } from '@/components/shared/branch-is-wallet-connected'
import { DiscoProfileBasic } from '@/integrations/disco/components/disco-profile-basic'
import { DiscoProfileCredentials } from '@/integrations/disco/components/disco-profile-credentials'
import { BranchIsAuthenticated } from '@/integrations/siwe/components/branch-is-authenticated'
import { ButtonSIWELogin } from '@/integrations/siwe/components/button-siwe-login'

export default function Home() {
  const { address } = useAccount()

  return (
    <>
      <section className="w-full">
        <div className="container mx-auto grid max-w-screen-xl">
          <BranchIsWalletConnected>
            <BranchIsAuthenticated>
              <div className="w-full">
                <DiscoProfileBasic address={address} className="mb-10" />
                <h3 className="text-4xl font-bold">🎒 Data Backpack</h3>
                <hr className="my-4" />
                <DiscoProfileCredentials address={address} />
              </div>
              <>
                <div className="text-center">
                  <h3 className="mb-4 text-6xl">🪩</h3>
                  <ButtonSIWELogin className="btn btn-emerald" label="Web3 Sign-In" />
                  <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-200">
                    Accessing the Disco API requires <br />
                    authenticating with an Ethereum Account.
                  </p>
                </div>
              </>
            </BranchIsAuthenticated>
            <WalletConnect className="mx-auto inline-block" />
          </BranchIsWalletConnected>
        </div>
      </section>
    </>
  )
}
