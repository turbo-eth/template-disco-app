import { useQuery } from 'wagmi'

import { discoGetCredentialsFromDID } from '@/integrations/disco/actions/get-credentials-from-did'

export const useDiscoGetCredentialsFromDID = (did?: string, queryKey?: any) => {
  return useQuery(['discoCredentialsFromDID', did, queryKey], () => discoGetCredentialsFromDID(did))
}
