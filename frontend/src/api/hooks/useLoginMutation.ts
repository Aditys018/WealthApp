import { useMutation } from '@tanstack/react-query'
import { ILoginPayload, ILoginResponse, userService } from '../../services'
import { AxiosError } from 'axios'

export const useLoginMutation = () => {
  return useMutation<ILoginResponse, AxiosError | Error, ILoginPayload>({
    mutationFn: userService.loginUser,
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
