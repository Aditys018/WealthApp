import { useMutation } from '@tanstack/react-query'
import {
  IVerifyLoginOtpPayload,
  IVerifyLoginOtpResponse,
  userService,
} from '../../services'
import { AxiosError } from 'axios'

export const useVerifyOtpMutation = () => {
  return useMutation<
    IVerifyLoginOtpResponse,
    AxiosError | Error,
    IVerifyLoginOtpPayload
  >({
    mutationFn: userService.verifyLoginOtp,
    onSuccess: (data) => {
      console.log('OTP sent successfully', data)
    },
    onError: (error) => {
      console.error('Failed to send otp', error)
      const errorMessage = error?.message || 'Company registration failed.'
      throw new Error(errorMessage)
    },
  })
}
