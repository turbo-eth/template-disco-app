import { useEffect, useState } from 'react'

import { BigNumberish } from 'ethers'

import { usePlaceContractUri } from '../blockchain'

interface ERC721Metadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export function useERC721ContractMetadata({ address }: { address: `0x${string}` }): ERC721Metadata | undefined {
  const [tokenData, setTokenData] = useState<ERC721Metadata | undefined>()
  const txRead = usePlaceContractUri({
    address: address,
  })

  useEffect(() => {
    if (txRead.data) {
      async function fetchData() {
        // TODO: Add support for other IPFS gateways
        // @ts-ignore
        if (txRead?.data?.startsWith('ipfs://')) {
          const url = `https://cloudflare-ipfs.com/ipfs/${
            // @ts-ignore
            txRead?.data?.split('ipfs://')[1]
          }`
          const data = await fetch(url)
          setTokenData(await data.json())
        } else {
          const data = await fetch(txRead?.data as unknown as URL)
          console.log(await data, 'data')
          setTokenData(await data.json())
        }
      }
      fetchData()
    }
  }, [txRead.data])

  return tokenData
}
