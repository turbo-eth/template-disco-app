import { CeramicClient } from '@ceramicnetwork/http-client'

export const ceramicClient = new CeramicClient(process.env.CERAMIC_API_URL)
