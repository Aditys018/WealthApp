import { companyService } from '@/services'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useRevokeAccessMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    AxiosError | Error,
    { companyId: string; employeeId: string }
  >({
    mutationFn: ({ companyId, employeeId }) =>
      companyService.revokeEmployeeAccess(companyId, employeeId),
    onSuccess: () => {
      // Invalidate employee list query to refresh UI
      queryClient.invalidateQueries({ queryKey: ['companyEmployeesList'] })
    },
    onError: (error) => {
      console.error('Failed to revoke access:', error)
    },
  })
}
