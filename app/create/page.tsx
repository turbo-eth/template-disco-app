'use client'

import { motion } from 'framer-motion'

import { ButtonPlaceFactoryDeploy } from '@/components/places-factory-deploy'
import PlaceFactoryEventPlaceCreated from '@/components/places-factory-event-place-created'
import { PlacesFactoriyWriteCreatePlace } from '@/components/places-factory-write-create-place'
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'
import { placeFactoryContracts } from '@/data/place-factory-contracts'

export default function PageCreate1() {
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
            <div className="container mx-auto mt-6 flex max-w-screen-lg flex-col gap-10">
              <div className="">
                <h3 className="text-lg font-normal">Create Place</h3>
                <p className="text-xs">Create a new Place ERC721 smart contract.</p>
              </div>
              <div className="card">
                <PlacesFactoriyWriteCreatePlace />
              </div>
              <div className="card">
                <span className="">Deployment Status:</span>
                <PlaceFactoryEventPlaceCreated />
              </div>
            </div>
            <div className="container mx-auto mt-12 flex max-w-screen-lg items-center justify-between gap-10">
              <div className="">
                <h3 className="text-lg font-normal">Create Place Factory</h3>
                <p className="text-xs">Deploy a new PlaceFactory.sol contract to a new blockchain</p>
              </div>
              <span className="flex items-center gap-3">
                <ButtonPlaceFactoryDeploy />
              </span>
            </div>
            <div className="container mx-auto my-5 max-w-screen-lg gap-10">
              {Object.values(placeFactoryContracts).map((placeFactoryContract, index) => {
                const chains = Object.keys(placeFactoryContracts)
                return (
                  <div className="my-2 flex items-center justify-between" key={index}>
                    <p>ChainId: {chains[index]}</p>
                    <p>{placeFactoryContract}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
