import { getResolver } from '@ceramicnetwork/3id-did-resolver'
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'
import { SignTypedDataVersion, recoverTypedSignature } from '@metamask/eth-sig-util'
import { decodeJWT, verifyJWS } from 'did-jwt'
import { Resolver } from 'did-resolver'

import { ceramicClient } from './ceramic'
import { Credential } from '../types'

const ACCOUNT_ID_SUFFIX = '@eip155:1'
const JWT_REGEX = /^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)$/

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

export async function retrieveDidDocument(did: string) {
  const threeidresolver = getResolver(ceramicClient)
  const resolver = new Resolver(threeidresolver)
  const doc = await resolver.resolve(did)

  return doc
}

export async function verifyJwtVc(jwt: string) {
  const decoded = decodeJWT(jwt).payload
  if (!decoded || !decoded?.issuer) throw new Error('Decoding JWT')
  const issuer = typeof decoded.issuer === 'string' ? decoded.issuer : decoded.issuer.id
  const doc = await retrieveDidDocument(issuer)
  if (!doc.didDocument || !doc.didDocument.verificationMethod) throw new Error('Could not fetch did doc')

  const verified = verifyJWS(jwt, doc.didDocument?.verificationMethod!)
  return !!verified
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

export async function verifyEIP712VerifiableCredentialV2(vc: Credential) {
  return vc?.proof?.jwt?.match(JWT_REGEX) ? verifyJwtVc(vc.proof.jwt) : verify712Vc(vc)
}
