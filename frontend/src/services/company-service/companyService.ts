import { axiosClient, registerCompanyUrl } from '@/api'
import type { IRegisterCompanyResponse, IRegisterCompanyPayload } from './types'

export const companyService = {
  registerCompany: async (
    payload: IRegisterCompanyPayload,
  ): Promise<IRegisterCompanyResponse> => {
    try {
      const response = await axiosClient.post<IRegisterCompanyResponse>(
        registerCompanyUrl,
        payload,
      )

      return response.data
    } catch (error) {
      console.error('Error registering company:', error)

      throw error
    }
  },
}
