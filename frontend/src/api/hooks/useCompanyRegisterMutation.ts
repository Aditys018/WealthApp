// src/hooks/useRegisterCompany.ts

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
      //   alert('Company Registered Successfully! ID: ' + data.companyId)

      // Invalidate any queries that might depend on company data
      queryClient.invalidateQueries({ queryKey: ['companies'] }) // Example
    },
    onError: (error) => {
      console.error('Failed to register company:', error)
      const errorMessage = error?.message || 'Company registration failed.'
      alert(`Registration failed: ${errorMessage}`)
    },
  })
}
