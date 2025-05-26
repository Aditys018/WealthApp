import { useMutation } from '@tanstack/react-query'
import {
  userService,
  IResetPasswordResponse,
  IResetPasswordPayload,
} from '../../services'
import { AxiosError } from 'axios'

export const useResetPasswordMutation = () => {
  return useMutation<
    IResetPasswordResponse,
    AxiosError | Error,
    IResetPasswordPayload
  >({
    mutationFn: userService.resetPassword,
    onSuccess: (data) => {
      console.log('Password reset Success', data)
    },
    onError: (error) => {
      console.error('Failed to register company:', error)
      const errorMessage = error?.message || 'Company registration failed.'
      throw new Error(errorMessage)
    },
  })
}
