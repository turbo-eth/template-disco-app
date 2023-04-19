import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'
import { SignTypedDataVersion, recoverTypedSignature } from '@metamask/eth-sig-util'

import { ceramicClient as ceramicClient } from './ceramic'

const ACCOUNT_ID_SUFFIX = '@eip155:1'

export class Missing712ProofException extends Error {
  constructor() {
    super('Missing EIP712 proof')
  }
}

export class Missing712DomainException extends Error {
  constructor() {
    super('Missing EIP712 domain')
  }
}

export async function verify712Vc(vc: Object) {
  try {
    const TypedData: any = vc
    if (!TypedData.proof || !TypedData.proof.proofValue) throw new Missing712ProofException()
    if (!TypedData.proof.eip712Domain || !TypedData.proof.eip712Domain.messageSchema || !TypedData.proof.eip712Domain.domain)
      throw new Missing712DomainException()

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
    const { did } = await Caip10Link.fromAccount(ceramicClient, recovered + ACCOUNT_ID_SUFFIX)

    if (did === signingInput.issuer.id) {
      return TypedData
    }
    // @ts-ignore
    throw new SignatureMismatchException(did, signingInput.issuer.id)
  } catch (e: any) {
    console.error(e)
    throw e
  }
}
