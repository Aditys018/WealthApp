import { useMutation } from '@tanstack/react-query'
import {
  identityService,
  ISendOtpPayload,
  ISendOtpResponse,
} from '../../services'
import { AxiosError } from 'axios'

export const useSendOTPMutation = () => {
  return useMutation<ISendOtpResponse, AxiosError | Error, ISendOtpPayload>({
    mutationFn: identityService.sendOtp,
    onSuccess: (data) => {
      console.log('Company registered successfully:', data)
    },
    onError: (error) => {
      console.error('Failed to register company:', error)
      const errorMessage = error?.message || 'Company registration failed.'
      throw new Error(errorMessage)
    },
  })
}
