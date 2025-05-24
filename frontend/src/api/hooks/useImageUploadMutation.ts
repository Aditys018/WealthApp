import { useMutation } from '@tanstack/react-query'
import {
  userService,
  ILogoUploadPayload,
  ILogoUploadResponse,
} from '../../services'
import { AxiosError } from 'axios'

export const useImageUploadMutation = () => {
  return useMutation<
    ILogoUploadResponse,
    AxiosError | Error,
    ILogoUploadPayload
  >({
    mutationFn: userService.uploadLogo,
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
