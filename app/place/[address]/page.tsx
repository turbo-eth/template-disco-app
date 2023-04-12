'use client'

import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import Image from 'next/image'

import ButtonPlaceMint from '@/components/button-place-mint'
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'
import { collection } from '@/data/collection'
import { usePlaceNextTokenId } from '@/lib/blockchain'
import { useERC721ContractMetadata } from '@/lib/hooks/use-erc721-contract-uri'

export default function PageCreate({ params }: { params: { address: `0x${string}` } }) {
  const [contractDetails, setContractDetails] = useState<any>()
  useEffect(() => {
    if (collection) {
      collection.filter((place) => {
        if (place.address.toLowerCase() === params.address.toLowerCase()) {
          setContractDetails(place)
        }
      })
    }
  }, [collection])

  const metadata = useERC721ContractMetadata({
    address: params.address as `0x${string}`,
  })

  const { data: totalSupply } = usePlaceNextTokenId({
    address: params.address as `0x${string}`,
  })

  return (
    <>
      <section className="mt-10 w-full">
        <motion.div
          initial="hidden"
          whileInView="show"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}>
          <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
            <div className="container mx-auto grid max-w-screen-lg grid-cols-12 gap-10">
              <div className="col-span-12 flex flex-col justify-center lg:col-span-5">
                {metadata?.name && <h3 className="text-4xl font-normal">{metadata?.name}</h3>}
                {metadata?.description && <p className="mt-2 text-gray-700 dark:text-gray-100">{metadata?.description}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-normal font-bold text-gray-500">Price: Ξ {contractDetails?.price}</span>
                  <ButtonPlaceMint address={params.address as `0x${string}`} price={contractDetails?.price}>
                    <span className="btn btn-pill btn-sm btn-emerald">Mint Place</span>
                  </ButtonPlaceMint>
                </div>
                {totalSupply && <p className="mt-4 text-lg text-gray-700 dark:text-gray-100">Total Minted: {Number(totalSupply) - 1}</p>}
              </div>
              <div className="col-span-12 lg:col-span-7 lg:p-10">
                <Image
                  width={800}
                  height={800}
                  className="-2 rounded-xl transition-all duration-300 hover:shadow-xl"
                  src={contractDetails?.image as string}
                  alt="Place"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
