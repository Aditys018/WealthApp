import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  companyService,
  IEmployeeInvitePayload,
  IEmployeeInviteResponse,
} from '../../services'
import { AxiosError } from 'axios'

type InviteData = Omit<IEmployeeInvitePayload, 'companyId'>

export const useEmployeeInviteMutation = (companyId: string) => {
  const queryClient = useQueryClient()

  return useMutation<IEmployeeInviteResponse, AxiosError | Error, InviteData>({
    mutationFn: (payload) =>
      companyService.inviteEmployee({ ...payload, companyId }),
    onSuccess: (data) => {
      console.log('Company registered successfully:', data)

      // Invalidate any queries that might depend on company data
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
    onError: (error) => {
      console.error('Failed to register company:', error)
      const errorMessage = error?.message || 'Company registration failed.'
      throw new Error(errorMessage)
    },
  })
}
