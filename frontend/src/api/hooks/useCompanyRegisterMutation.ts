import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  companyService,
  IRegisterCompanyPayload,
  IRegisterCompanyResponse,
} from '../../services'
import { AxiosError } from 'axios'

export const useCompanyRegisterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    IRegisterCompanyResponse,
    AxiosError | Error,
    IRegisterCompanyPayload
  >({
    mutationFn: companyService.registerCompany,
    onSuccess: (data) => {
      console.log('Company registered successfully:', data)

      // Invalidate any queries that might depend on company data
      queryClient.invalidateQueries({ queryKey: ['companies'] }) // Example
    },
    onError: (error) => {
      console.error('Failed to register company:', error)
      const errorMessage = error?.message || 'Company registration failed.'
      throw new Error(errorMessage)
    },
  })
}
