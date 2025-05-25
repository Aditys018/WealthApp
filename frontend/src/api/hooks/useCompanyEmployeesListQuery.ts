import { companyService } from '@/services'
import { useQuery } from '@tanstack/react-query'

export const useCompanyEmployeesListQuery = (companyId: string) => {
  return useQuery({
    queryKey: ['companyEmployeesList', companyId],
    queryFn: () => companyService.getCompanyEmployeesList(companyId),
    enabled: !!companyId,
  })
}
