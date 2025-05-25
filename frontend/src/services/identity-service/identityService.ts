import { axiosClient, sendOTPUrl } from '@/api'
import { ISendOtpPayload, ISendOtpResponse } from './types'

export const identityService = {
  sendOtp: async (payload: ISendOtpPayload): Promise<ISendOtpResponse> => {
    try {
      const response = await axiosClient.post<ISendOtpResponse>(
        sendOTPUrl,
        payload,
        { isPublic: true },
      )

      return response.data
    } catch (error) {
      console.error('Error registering company:', error)

      throw error
    }
  },
}
