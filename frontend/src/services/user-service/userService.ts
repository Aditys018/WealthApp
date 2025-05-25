import {
  axiosClient,
  imageUploadUrl,
  loginUrl,
  resetPasswordUrl,
  verifyOtpUrl,
} from '@/api'
import {
  ILoginPayload,
  ILoginResponse,
  ILogoUploadPayload,
  ILogoUploadResponse,
  IResetPasswordPayload,
  IResetPasswordResponse,
  IVerifyLoginOtpPayload,
  IVerifyLoginOtpResponse,
} from './types'

export const userService = {
  uploadLogo: async (
    payload: ILogoUploadPayload,
  ): Promise<ILogoUploadResponse> => {
    try {
      const formData = new FormData()
      formData.append('image', payload.file)

      const response = await axiosClient.post<ILogoUploadResponse>(
        imageUploadUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          isPublic: true,
        },
      )

      return response.data
    } catch (error) {
      console.error('Error while uploading photo', error)

      throw error
    }
  },
  loginUser: async (payload: ILoginPayload): Promise<ILoginResponse> => {
    try {
      const response = await axiosClient.post<ILoginResponse>(loginUrl, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
  verifyLoginOtp: async (
    payload: IVerifyLoginOtpPayload,
  ): Promise<IVerifyLoginOtpResponse> => {
    try {
      const response = await axiosClient.post<IVerifyLoginOtpResponse>(
        verifyOtpUrl,
        payload,
        {
          isPublic: true,
        },
      )

      return response.data
    } catch (error) {
      console.error('Error verifying login OTP:', error)
      throw error
    }
  },
  resetPassword: async (
    payload: IResetPasswordPayload,
  ): Promise<IResetPasswordResponse> => {
    try {
      const res = await axiosClient.post<IResetPasswordResponse>(
        resetPasswordUrl,
        payload,
      )

      return res.data
    } catch (error) {
      throw error
    }
  },
}
