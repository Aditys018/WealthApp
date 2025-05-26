import {
  axiosClient,
  getCompanyEmployeesListUrl,
  inviteEmployeeUrl,
  registerCompanyUrl,
} from '@/api'
import type {
  IRegisterCompanyResponse,
  IRegisterCompanyPayload,
  IEmployeeInvitePayload,
  IEmployeeInviteResponse,
} from './types'

export const companyService = {
  registerCompany: async (
    payload: IRegisterCompanyPayload,
  ): Promise<IRegisterCompanyResponse> => {
    try {
      const response = await axiosClient.post<IRegisterCompanyResponse>(
        registerCompanyUrl,
        payload,
        { isPublic: true },
      )

      return response.data
    } catch (error) {
      console.error('Error registering company:', error)

      throw error
    }
  },
  getCompanyEmployeesList: async (companyId: string): Promise<any> => {
    try {
      const res = await axiosClient.get(getCompanyEmployeesListUrl(companyId))

      return res.data
    } catch (error) {
      console.error('Error fetching company employees list:', error)

      throw error
    }
  },
  inviteEmployee: async (
    payload: IEmployeeInvitePayload,
  ): Promise<IEmployeeInviteResponse> => {
    try {
      const { companyId, ...inviteData } = payload
      const res = await axiosClient.post<IEmployeeInviteResponse>(
        inviteEmployeeUrl(companyId),
        inviteData,
      )

      return res.data
    } catch (error) {
      console.error('erorr inviting employee::', error)

      throw error
    }
  },
}
