import { useEffect, useState } from 'react'

import { BigNumber, BigNumberish } from 'ethers'

import { useErc721TokenUri } from '../blockchain'

interface ERC721Metadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export function useERC721Metadata({ address, tokenId }: { address: `0x${string}`; tokenId: BigNumberish }): ERC721Metadata | undefined {
  const [tokenData, setTokenData] = useState<ERC721Metadata | undefined>()
  const txRead = useErc721TokenUri({
    address: address,
    args: [tokenId as BigNumber],
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

export default useERC721Metadata
