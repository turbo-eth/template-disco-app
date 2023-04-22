export type CredentialType = string

interface CredentialProof {
  type?: string
  created?: string
  proofValue?: string
  eip712Domain?: Record<string, unknown>
  proofPurpose?: string
  verificationMethod?: string
}

interface CredentialIssuer {
  id?: string
}

interface CredentialSchema {
  id?: string
  type?: string
}

interface CredentialSubject {
  id?: string
}

export interface Credential {
  id?: string
  type?: CredentialType[]
  genId?: string
  proof?: CredentialProof
  issuer?: CredentialIssuer
  '@context'?: string[]
  isPublic?: boolean
  recipient?: string
  updatedAt?: string
  issuanceDate?: string
  credentialSchema?: CredentialSchema
  credentialSubject?: CredentialSubject
}
