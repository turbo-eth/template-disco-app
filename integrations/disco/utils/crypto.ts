import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'
import { SignTypedDataVersion, recoverTypedSignature } from '@metamask/eth-sig-util'

import { ceramicClient as ceramicClient } from './ceramic'

export async function verify712Vc(vc: string) {
  try {
    const TypedData = JSON.parse(vc)
    if (!TypedData.proof || !TypedData.proof.proofValue) throw new Error('Missing 712 proof')
    if (!TypedData.proof.eip712Domain || !TypedData.proof.eip712Domain.messageSchema || !TypedData.proof.eip712Domain.domain)
      throw new Error('Missing 712 domain')

    const { proof, ...signingInput } = TypedData
    const { proofValue, eip712Domain, ...verifyInputProof } = proof
    const verificationMessage = {
      ...signingInput,
      proof: verifyInputProof,
    }

    const objectToVerify = {
      message: verificationMessage,
      domain: eip712Domain.domain,
      types: eip712Domain.messageSchema,
      primaryType: eip712Domain.primaryType,
    }

    const recovered = recoverTypedSignature({
      data: objectToVerify,
      signature: proofValue,
      version: SignTypedDataVersion.V4,
    })

    // Get did from address using CAIP 10
    const { did } = await Caip10Link.fromAccount(ceramicClient, recovered + (process.env.ACCOUNT_ID_SUFFIX ?? ''))

    if (did === signingInput.issuer.id) {
      return TypedData
    }
    // @ts-ignore
    throw new SignatureMismatchException(did, signingInput.issuer.id)
  } catch (e: any) {
    console.log(e)
    throw e
  }
}
