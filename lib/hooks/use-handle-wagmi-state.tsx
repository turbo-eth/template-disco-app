import { useEffect } from 'react'

import { useToast } from './use-toast'

interface UseHandleWagmiStateProps {
  isSuccess: boolean
  isError: boolean
  error?: any
}

export function useHandleWagmiState({ isSuccess, isError, error }: UseHandleWagmiStateProps): void {
  const { toast } = useToast()

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Success 🥳',
        description: 'You have successfully minted a place',
      })
    }
    if (isError) {
      toast({
        title: 'Transaction Rejected',
        description: error?.message || 'Something went wrong',
        variant: 'destructive',
      })
    }
  }, [isError, error])
}
